// file: src/routes/api/stripe/+server.ts
import ConfirmationEmail from '$lib/email/confirmation-email';
import ShippingNotificationEmail from '$lib/email/shipping-notification-email';
import { adminDb as db } from '$lib/firebase-admin';
import { CLOUDINARY_CLOUD_NAME as cloudName } from '$lib/secrets';
import type { Order, ProductSize } from '$lib/types';
import { render } from '@react-email/render';
import sgMail from '@sendgrid/mail';
import type { RequestHandler } from '@sveltejs/kit';
import type { DocumentData, DocumentReference } from 'firebase-admin/firestore';
import { createElement } from 'react';
import Stripe from 'stripe';

// Initialize Stripe
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
  if (!sig) return new Response('Missing Stripe signature', { status: 400 });

  let event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionWithCustomer = await stripe.checkout.sessions.retrieve(session.id, { expand: ['customer'] });
      console.log('Checkout session completed:', sessionWithCustomer);

      // Prepare customer info
      const customerInfo = {
        name:      sessionWithCustomer.customer_details?.name  || 'No Name',
        email:     sessionWithCustomer.customer_details?.email || 'No Email',
        orderId:   sessionWithCustomer.metadata?.order_id      || '',
        timestamp: sessionWithCustomer.created,
      };

      // Build Address objects but only set line2 if defined
      const ship = sessionWithCustomer.shipping_details;
      const shippingAddress: any = {
        name:       ship?.name || customerInfo.name,
        line1:      ship?.address.line1       || '',
        city:       ship?.address.city        || '',
        state:      ship?.address.state       || '',
        postalCode: ship?.address.postal_code || '',
        country:    ship?.address.country     || '',
      };
      if (ship?.address.line2) {
        shippingAddress.line2 = ship.address.line2;
      }

      const bill = sessionWithCustomer.customer_details?.address;
      let billingAddress: any = undefined;
      if (bill) {
        billingAddress = {
          name:       customerInfo.name,
          line1:      bill.line1       || '',
          city:       bill.city        || '',
          state:      bill.state       || '',
          postalCode: bill.postal_code || '',
          country:    bill.country     || '',
        };
        if (bill.line2) {
          billingAddress.line2 = bill.line2;
        }
      }

      await db
        .collection('customers')
        .doc(session.id)
        .set({
          ...customerInfo,
          shippingAddress,
          billingAddress,
        });

      // Create order doc with denormalized items
      const orderRef = db.collection('orders').doc(customerInfo.orderId) as DocumentReference<Order>;

      const metaItems = sessionWithCustomer.metadata?.items
        ? JSON.parse(sessionWithCustomer.metadata.items)
        : [];
      const denormItems: Order['items'] = [];
      for (const item of metaItems) {
        const snap = await db
          .collection('products')
          .where('stripePriceIds', 'array-contains', item.stripePriceId)
          .get();
        if (snap.empty) continue;
        const prodData = snap.docs[0].data();
        const sizes = prodData.productSizes as ProductSize[];
        const sizeInfo = sizes.find(s => s.stripePriceId === item.stripePriceId);
        if (!sizeInfo) continue;
        denormItems.push({
          stripePriceId: item.stripePriceId,
          quantity:      item.quantity,
          title:         prodData.title,
          price:         sizeInfo.price,
          mainImage:     sizeInfo.mainImage.cloudinaryId,
          size:          sizeInfo.code,
        });
      }
      const subtotal     = denormItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const shippingCost = 0;
      const taxes        = 0;
      const total        = subtotal + shippingCost + taxes;

      await orderRef.set(
        {
          customerRef:     db.collection('customers').doc(session.id),
          orderId:         customerInfo.orderId,
          timestamp:       new Date(customerInfo.timestamp * 1000),
          shippingAddress,
          items:           denormItems,
        },
        { merge: true }
      );

      // …inventory update and reviewToken logic stays the same…
      const items = sessionWithCustomer.metadata?.items
        ? JSON.parse(sessionWithCustomer.metadata.items)
        : [];
      const batch = db.batch();
      let productDoc: FirebaseFirestore.QueryDocumentSnapshot<DocumentData>;
      for (const item of items) {
        const snapshot = await db
          .collection('products')
          .where('stripePriceIds', 'array-contains', item.stripePriceId)
          .get();
        if (snapshot.empty) continue;
        productDoc = snapshot.docs[0];
        const data = productDoc.data();
        const idx = data.productSizes.findIndex((s: any) => s.stripePriceId === item.stripePriceId);
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

      // Send full confirmation email
      await sgMail.send({
        to:      customerInfo.email,
        from:    'Hud Wahab <hello@nmcore.com>',
        subject: 'Order Confirmation',
        html: await render(
          createElement(ConfirmationEmail, {
            name:            customerInfo.name,
            orderId:         customerInfo.orderId,
            items:           denormItems.map(i => ({
                               imageUrl: `https://res.cloudinary.com/${cloudName}/image/upload/${i.mainImage}`,
                               title:    i.title!,
                               code:     i.size!,
                               price:    i.price!,
                               quantity: i.quantity,
                             })),
            subtotal,
            shippingCost,
            taxes,
            total,
            shippingAddress,
            billingAddress,
            shippingMethod: 'Free shipping',
          })
        ),
      });
      console.log('Confirmation email sent');
      break;
    }

    case 'invoice.updated': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('→ invoice.updated metadata:', invoice.metadata);
      if (invoice.metadata.ship_status !== 'shipped') break;

      const paymentIntentId = invoice.payment_intent as string;
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
        limit: 1,
      });
      if (!sessions.data.length) break;
      const session = sessions.data[0];

      const sessionWithCustomer = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['customer'],
      });

      const shippingData = {
        serviceName:    invoice.metadata.service_name,
        shipDate:       invoice.metadata.ship_date,
        shipmentId:     invoice.metadata.shipment_id,
        trackingUrl:    invoice.metadata.tracking_URL,
        trackingNumber: invoice.metadata.tracking_number,
      };

      try {
        await db.collection('customers').doc(session.id).update(shippingData);
        console.log('Shipping data updated in Firestore');
      } catch (err) {
        console.error('Error updating shipping info in Firestore:', err);
      }

      // **ADDED THESE LINES TO CONSTRUCT emailItems:**
      const orderSnap = await db.collection('orders').doc(session.metadata!.order_id!).get()

      const savedOrder = orderSnap.data() as Order | undefined;
      const emailItems = (savedOrder?.items || []).map(item => ({
        imageUrl: `https://res.cloudinary.com/${cloudName}/image/upload/${item.mainImage}`,
        title:    item.title!,
        size:     item.size!,
      }));
      // end added block

      const name    = sessionWithCustomer.customer_details?.name  || 'Customer';
      const email   = sessionWithCustomer.customer_details?.email || '';
      const orderId = session.metadata?.order_id || '';

      try {
        const html = await render(
          createElement(ShippingNotificationEmail, {
            name,
            orderId,
            trackingUrl:    shippingData.trackingUrl,
            trackingNumber: shippingData.trackingNumber,
            items:          emailItems,
          })
        );
        await sgMail.send({
          to:      email,
          from:    'Hud Wahab <hello@nmcore.com>',
          subject: 'Your NMCore order has shipped!',
          html,
        });
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
