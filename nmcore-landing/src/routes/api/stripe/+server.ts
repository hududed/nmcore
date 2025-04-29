// file: src/routes/api/stripe/+server.ts
import ConfirmationEmail from '$lib/email/confirmation-email';
import ShippingNotificationEmail from '$lib/email/shipping-notification-email';
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
        await db.collection('customers').doc(session.id).set(customerInfo);
        console.log('Customer data stored successfully');
      } catch (error) {
        console.error('Error storing customer data in Firestore:', error);
      }

      // Parse items from metadata and update stock, as before...
      const items = sessionWithCustomer.metadata?.items ? JSON.parse(sessionWithCustomer.metadata.items) : [];
      const batch = db.batch();
      let productDoc: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>;

      for (const item of items) {
        const snapshot = await db.collection('products')
          .where('stripePriceIds', 'array-contains', item.stripePriceId)
          .get();
        if (snapshot.empty) continue;
        productDoc = snapshot.docs[0];
        const data = productDoc.data();
        if (!Array.isArray(data.productSizes)) continue;
        const idx = data.productSizes.findIndex(s => s.stripePriceId === item.stripePriceId);
        if (idx < 0) continue;
        const current = data.productSizes[idx].stock;
        const updated = current - item.quantity;
        data.productSizes[idx].stock = updated;
        data.productSizes[idx].availabilityStatus = updated > 0 ? 'In Stock' : 'Sold Out';
        batch.update(productDoc.ref, { productSizes: data.productSizes });
      }
      try {
        await batch.commit();
        console.log('Updated stock levels');
      } catch (error) {
        console.error('Error updating stock in Firestore:', error);
      }

      // Generate review token and send confirmation email
      const reviewToken = uuidv4();
      const tokenRef: DocumentReference<DocumentData> = db.collection('reviewTokens').doc(reviewToken);
      await tokenRef.set({ productId: productDoc.id, email: customerInfo.email, createdAt: new Date(), used: false });

      try {
        const emailHtml = await render(
          createElement(ConfirmationEmail, { name: customerInfo.name, orderId: customerInfo.orderId, reviewToken })
        );
        await sgMail.send({ to: customerInfo.email, from: 'Hud Wahab <hello@nmcore.com>', subject: 'Order Confirmation', html: emailHtml });
        console.log('Confirmation email sent');
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }

      break;
    }

    case 'invoice.updated': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('→ invoice.updated metadata:', invoice.metadata);
      // Only act when shipment metadata is set to shipped
      if (invoice.metadata.ship_status !== 'shipped') break;

      // Retrieve the Checkout Session via the PaymentIntent on the invoice
      const paymentIntentId = invoice.payment_intent as string;
      const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 });
      if (!sessions.data.length) break;
      const session = sessions.data[0];

      // Expand customer details
      const sessionWithCustomer = await stripe.checkout.sessions.retrieve(session.id, { expand: ['customer'] });

      // Extract shipping metadata
      const shippingData = {
        serviceName:    invoice.metadata.service_name,
        shipDate:       invoice.metadata.ship_date,
        shipmentId:     invoice.metadata.shipment_id,
        trackingUrl:    invoice.metadata.tracking_URL,
        trackingNumber: invoice.metadata.tracking_number,
      };

      // Update Firestore customer record
      try {
        await db.collection('customers').doc(session.id).update(shippingData);
        console.log('Shipping data updated in Firestore');
      } catch (err) {
        console.error('Error updating shipping info in Firestore:', err);
      }

      // Render and send the shipping notification email
      const name     = sessionWithCustomer.customer_details?.name  || 'Customer';
      const email    = sessionWithCustomer.customer_details?.email || '';
      const orderId  = sessionWithCustomer.metadata?.order_id       || '';

      try {
        const html = await render(
          createElement(ShippingNotificationEmail, { name, orderId, ...shippingData })
        );
        await sgMail.send({ to: email, from: 'Hud Wahab <hello@nmcore.com>', subject: 'Your NMCore order has shipped!', html });
        console.log(`Shipping email sent to ${email}`);
      } catch (error) {
        console.error('Error sending shipping notification email:', error);
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
