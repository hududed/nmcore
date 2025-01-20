//filepath: /Users/hfox/Developments/nmcore/nmcore-landing/functions/src/stripeWebhookHandler.js
import { render } from '@react-email/components';
import sgMail from "@sendgrid/mail";
import { defineSecret } from 'firebase-functions/params';
import { createElement } from 'react';
import Stripe from 'stripe';
import ConfirmationEmail from "./email/confirmation-email.js";
import { db } from './firestore.js';

// Define secrets
const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');
const SENDGRID_API_KEY = defineSecret('SENDGRID_KEY');

// Initialize variables to cache secrets
let stripeInstance;
let stripeWebhookSecretValue;
let sendgridApiKeyValue;

async function initializeSecrets() {
  if (!stripeInstance) {
    try {
      const stripeSecretKey = await STRIPE_SECRET_KEY.value();
      stripeWebhookSecretValue = await STRIPE_WEBHOOK_SECRET.value();
      sendgridApiKeyValue = await SENDGRID_API_KEY.value();

      stripeInstance = new Stripe(stripeSecretKey, {
        apiVersion: '2024-12-18.acacia',
      });

      sgMail.setApiKey(sendgridApiKeyValue);
      console.log('Secrets initialized successfully');
    } catch (error) {
      console.error('Error initializing secrets:', error);
      throw error;
    }
  }
}

export async function stripeWebhookHandler(req, res) {
  try {
    await initializeSecrets();

    const sig = req.headers['stripe-signature'] || '';
    const event = stripeInstance.webhooks.constructEvent(req.body, sig, stripeWebhookSecretValue);

    console.log(`Received event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Retrieve session with expanded customer details
        const sessionWithCustomer = await stripeInstance.checkout.sessions.retrieve(session.id, {
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

        for (const item of items) {
          console.log(
            `Processing item: ${item.name}, stripePriceId: ${item.stripePriceId}, quantity: ${item.quantity}`
          );

          // Query for the doc that contains stripePriceId
          const productQuerySnapshot = await db.collection('products')
            .where('stripePriceIds', 'array-contains', item.stripePriceId)
            .get();

          if (productQuerySnapshot.empty) {
            console.error(`No product found with stripePriceId: ${item.stripePriceId}`);
            continue;
          }

          const productDoc = productQuerySnapshot.docs[0];
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

        // Render the confirmation email template
        try {
          console.log('Rendering confirmation email template');
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

    res.status(200).send({ success: true });
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).send({ error: `Webhook Error: ${err.message}` });
  }
}