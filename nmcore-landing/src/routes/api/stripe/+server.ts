// file: src/routes/api/stripe/+server.ts
import ConfirmationEmail from '$lib/email/confirmation-email';
import { adminDb as db } from '$lib/firebase-admin';
import { render } from '@react-email/render';
import sgMail from '@sendgrid/mail';
import type { RequestHandler } from '@sveltejs/kit';
import type { DocumentData, DocumentReference } from 'firebase-admin/firestore';
import { createElement } from 'react';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

// Initialize Stripe with the secret key from environment variables
const stripeSecretKey = process.env.VITE_STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;
const sendgridApiKey = process.env.SENDGRID_FB_API_KEY;

if (!stripeSecretKey || !stripeWebhookSecret || !sendgridApiKey) {
  throw new Error('Missing environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  // @ts-ignore
  apiVersion: '2024-12-18.acacia',
});

sgMail.setApiKey(sendgridApiKey);

export const POST: RequestHandler = async ({ request }) => {
  console.log('POST request received at /api/stripe');
  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return new Response('Missing Stripe signature', { status: 400 });
  }

  let event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
  } catch (err) {
    console.error('Error verifying Stripe webhook signature:', err);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve session with expanded customer details
      const sessionWithCustomer = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['customer'],
      });

      console.log('Checkout session completed:', sessionWithCustomer);

      // Prepare customer info
      const customerInfo = {
        name: sessionWithCustomer.customer_details?.name || 'No Name',
        email: sessionWithCustomer.customer_details?.email || 'No Email',
        shippingAddress: sessionWithCustomer.shipping_details?.address || {
          city: '',
          country: '',
          line1: '',
          line2: '',
          postal_code: '',
          state: ''
        },
        orderId: sessionWithCustomer.metadata?.order_id || '',
        timestamp: sessionWithCustomer.created,
      };

      // Store customer data in Firestore
      try {
        console.log('Storing customer data in Firestore:', customerInfo);
        await db.collection('customers').doc(sessionWithCustomer.id).set(customerInfo);
        console.log('Customer data stored successfully');
      } catch (error) {
        console.error('Error storing customer data in Firestore:', error);
      }

      // Parse items from metadata
      const items = sessionWithCustomer.metadata?.items
        ? JSON.parse(sessionWithCustomer.metadata.items)
        : [];
      console.log('Items:', items);

      // Prepare a Firestore batch
      const batch = db.batch();

      let productDoc; // Define productDoc here

      for (const item of items) {
        console.log(
          `Processing item: ${item.name}, stripePriceId: ${item.stripePriceId}, stripeProductId: ${item.stripeProductId}, quantity: ${item.quantity}`
        );

        // Query for the doc that contains stripePriceId
        const productQuerySnapshot = await db.collection('products')
          .where('stripePriceIds', 'array-contains', item.stripePriceId)
          .get();

        if (productQuerySnapshot.empty) {
          console.error(`No product found with stripePriceId: ${item.stripePriceId}`);
          continue;
        }

        productDoc = productQuerySnapshot.docs[0];
        const productData = productDoc.data();

        // Ensure productSizes is an array
        let productSizes = productData.productSizes;
        if (!Array.isArray(productSizes)) {
          console.error(`productSizes is not an array in doc: ${productDoc.id}`);
          continue;
        }

        // Find the matching index
        const sizeIndex = productSizes.findIndex(
          (size) => size.stripePriceId === item.stripePriceId
        );

        if (sizeIndex === -1) {
          console.error(`No matching size for ${item.stripePriceId} in doc: ${productDoc.id}`);
          continue;
        }

        // Calculate the new stock
        const currentStock = productSizes[sizeIndex].stock;
        const newStock = currentStock - item.quantity;
        console.log(`Updating stock for ${productDoc.id} / sizeIndex ${sizeIndex} from ${currentStock} to ${newStock}`);

        // Mutate the array in memory
        productSizes[sizeIndex].stock = newStock;
        productSizes[sizeIndex].availabilityStatus =
          newStock > 0 ? 'In Stock' : 'Sold Out';

        // Write the entire array back
        batch.update(productDoc.ref, {
          productSizes: productSizes
        });
      }

      // Commit the batch
      try {
        console.log('Committing Firestore batch to update product stocks');
        await batch.commit();
        console.log('Updated stock by rewriting productSizes arrays');
      } catch (error) {
        console.error('Error committing Firestore batch:', error);
      }

      // Generate a unique review token
      const reviewToken = uuidv4();
      const reviewTokenRef: DocumentReference<DocumentData> = db.collection('reviewTokens').doc(reviewToken);
      await reviewTokenRef.set({
        productId: productDoc.id,
        email: customerInfo.email,
        createdAt: new Date(),
        used: false
      });

      // Render the confirmation email template
      try {
        console.log('Rendering confirmation email template');

        const emailHtml = await render(
          createElement(ConfirmationEmail, {
            name: customerInfo.name,
            orderId: customerInfo.orderId,
            reviewToken: reviewToken
          })
        );

        // Send the confirmation email
        const msg = {
          to: customerInfo.email,
          from: "Hud Wahab <hello@nmcore.com>",
          subject: 'Order Confirmation',
          html: emailHtml,
        };

        console.log('Sending confirmation email to:', customerInfo.email);
        const output = await sgMail.send(msg);
        console.log("Email sent successfully:", output);
      } catch (error) {
        console.error("Error rendering or sending confirmation email:", error);
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};