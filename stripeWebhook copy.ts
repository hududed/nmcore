import dotenv from 'dotenv';
import { cert, initializeApp } from 'firebase-admin/app';
import { doc, getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { readFileSync } from 'fs';
import Stripe from 'stripe';
import { sendEmail } from './nmcore-landing/functions/src/sendEmail';
import { EmailData } from './types';

// Load environment variables
dotenv.config();

const stripeSecretKey = process.env.VITE_STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;
const serviceAccountPath = process.env.VITE_FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

if (!stripeSecretKey || !stripeWebhookSecret || !serviceAccountPath) {
  throw new Error('Stripe secret keys or Firebase service account key path are not defined in the environment variables');
}

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

// Initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

// Helper to convert ArrayBuffer to Buffer
function toBuffer(ab: ArrayBuffer): Buffer {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; i++) {
    buf[i] = view[i];
  }
  return buf;
}

// Export as Firebase function
export const stripeWebhook = onRequest({ cors: true }, async (req, res) => {
  const sig = req.headers['stripe-signature'] ?? '';

  // Convert raw body into Buffer
  const _rawBody = await req.rawBody; // Firebase provides rawBody in onRequest handlers
  const payload = toBuffer(_rawBody);

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(payload, sig, stripeWebhookSecret);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve session with customer details
        const sessionWithCustomer = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['customer']
        });

        console.log('Checkout session completed:', sessionWithCustomer);

        // Example logic for processing the session
        // (Replace this with your actual business logic)
        if (sessionWithCustomer.metadata) {
          // Process metadata, such as codes or user ID
          console.log('Metadata:', sessionWithCustomer.metadata);
        }

        const items = sessionWithCustomer.metadata.items ? JSON.parse(sessionWithCustomer.metadata.items) : [];

        // Update stock in Firestore
        const batch = db.batch();
        items.forEach((item: any) => {
          const productRef = doc(db, 'products', item.productId);
          const sizeIndex = item.sizeCode;
          const newStock = item.stock - item.quantity;
          batch.update(productRef, {
            [`productSizes.${sizeIndex}.stock`]: newStock,
            [`productSizes.${sizeIndex}.availabilityStatus`]: newStock > 0 ? 'In Stock' : 'Sold Out'
          });
        });
        await batch.commit();

        // Send confirmation email
        const customerInfo: EmailData = {
          name: sessionWithCustomer.shipping.name,
          email: sessionWithCustomer.customer_email,
          orderId: sessionWithCustomer.id
        };

        await sendEmail('confirmation', customerInfo);

        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    res.status(400).send({ error: `Webhook Error: ${(err as Error).message}` });
  }
});