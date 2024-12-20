import dotenv from 'dotenv';
import { onRequest } from 'firebase-functions/v2/https';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

const stripeSecretKey = process.env.VITE_STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey || !stripeWebhookSecret) {
  throw new Error('Stripe secret keys are not defined in the environment variables');
}

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
