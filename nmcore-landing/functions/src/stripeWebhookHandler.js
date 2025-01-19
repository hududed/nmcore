//filepath: /Users/hfox/Developments/nmcore/nmcore-landing/functions/src/stripeWebhook.js
import { render } from '@react-email/components';
import sgMail from "@sendgrid/mail";
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createElement } from 'react';
import Stripe from 'stripe';
import ConfirmationEmail from "./email/confirmation-email.js";

// Ensure Firebase Admin SDK is initialized only once
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

export async function stripeWebhookHandler(req, res, secrets) {
  const { stripeSecretKey, stripeWebhookSecret, sendgridApiKey } = secrets;

  // Initialize Stripe
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
  });

  // Initialize SendGrid
  sgMail.setApiKey(sendgridApiKey);
  const sig = req.headers['stripe-signature'] ?? '';

  try {
    // Use req.rawBody directly
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object; 

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
        await db.collection('customers').doc(sessionWithCustomer.id).set(customerInfo);

        // Parse items from metadata
        const items = sessionWithCustomer.metadata?.items
          ? JSON.parse(sessionWithCustomer.metadata.items)
          : [];
        console.log('Items:', items);

        // 2. Prepare a Firestore batch
        const batch = db.batch();

        for (const item of items) {
          console.log(
            `Processing item: ${item.name}, stripePriceId: ${item.stripePriceId}, quantity: ${item.quantity}`
          );

          // 1. Query for the doc that contains stripePriceId
          const productQuerySnapshot = await db.collection('products')
            .where('stripePriceIds', 'array-contains', item.stripePriceId)
            .get();

          if (productQuerySnapshot.empty) {
            console.error(`No product found with stripePriceId: ${item.stripePriceId}`);
            continue;
          }

          const productDoc = productQuerySnapshot.docs[0];
          const productData = productDoc.data();

          // 2. Ensure productSizes is an array
          let productSizes = productData.productSizes;
          if (!Array.isArray(productSizes)) {
            console.error(`productSizes is not an array in doc: ${productDoc.id}`);
            continue;
          }

          // 3. Find the matching index
          const sizeIndex = productSizes.findIndex(
            (size) => size.stripePriceId === item.stripePriceId
          );

          if (sizeIndex === -1) {
            console.error(`No matching size for ${item.stripePriceId} in doc: ${productDoc.id}`);
            continue;
          }

          // 4. Calculate the new stock
          const currentStock = productSizes[sizeIndex].stock;
          const newStock = currentStock - item.quantity;
          console.log(`Updating stock for ${productDoc.id} / sizeIndex ${sizeIndex} from ${currentStock} to ${newStock}`);

          // 5. Mutate the array in memory
          productSizes[sizeIndex].stock = newStock;
          productSizes[sizeIndex].availabilityStatus =
            newStock > 0 ? 'In Stock' : 'Sold Out';

          // 6. Write the entire array back (ensuring it’s still an array)
          batch.update(productDoc.ref, {
            productSizes: productSizes
          });
        }

        // 7. Commit
        await batch.commit();
        console.log('Updated stock by rewriting productSizes arrays');

        // Render the confirmation email template
        const emailHtml = await render(
          createElement(ConfirmationEmail, {
            name: customerInfo.name,
            orderId: customerInfo.orderId,
          })
        );

        // Send the confirmation email
        const msg = {
          to: customerInfo.email,
          from: "Hud Wahab <hud@nmcore.com>",
          subject: 'Order Confirmation',
          html: emailHtml,
        };

        try {
          const output = await sgMail.send(msg);
          console.log("Email sent successfully:", output);
        } catch (error) {
          console.error("Error sending email:", error);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send({ success: true });
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).send({ error: `Webhook Error: ${err.message}` });
  }
}