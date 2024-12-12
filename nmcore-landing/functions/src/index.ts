// functions/src/index.ts
import { render } from '@react-email/components';
import sgMail from "@sendgrid/mail";
import express from 'express';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { createElement } from 'react';
import Stripe from 'stripe';
import { ConfirmationEmail } from './email/confirmation-email'; // Adjust the import path as needed
import { InviteCollaboration } from './email/invite-collaboration'; // Adjust the import path as needed

initializeApp();
const db = getFirestore();

const sendgridApiKey = defineSecret('SENDGRID_KEY');
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

export const sendEmail = onRequest(
  { secrets: [sendgridApiKey], cors: true },
  async (req, res) => {
    sgMail.setApiKey(sendgridApiKey.value());
    const { email, fullName } = req.body;

    const emailHtml = await render(createElement(InviteCollaboration, { fullName }));

    const msg = {
      to: email,
      from: "Hud Wahab <hud@nmcore.com>", 
      subject: "Invitation to collaborate with nmcore",
      html: emailHtml,
    };

    console.log("Form submitted");
    try {
      const output = await sgMail.send(msg);
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.status(200).json(output);
    } catch (error) {
      console.error("Error sending email:", error);
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.status(500).json({ error: 'Error sending email' });
    }
  }
);

// Create an Express app
const app = express();

// Use express.raw to ensure the raw body is passed to the Stripe webhook handler
app.use(express.raw({ type: 'application/json' }));

// Simplified handleStripeWebhook function
app.post('/handleStripeWebhook', async (req, res) => {
  const stripe = new Stripe(stripeSecretKey.value(), {
    apiVersion: '2024-11-20.acacia',
  });

  const sig = req.headers['stripe-signature'];
  console.log('Raw body:', req.body.toString());
  console.log('Signature:', sig);

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret.value());
  } catch (err) {
    console.error(`Webhook Error: ${(err as Error).message}`);
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata.order_id; // Retrieve the order ID from metadata

    // Save customer information to Firestore
    await saveCustomerInfo(session, orderId);

    // Send confirmation email
    await sendConfirmationEmail(session, orderId);
  }

  res.json({ received: true });
});

// Export the Express app as a Firebase function
export const handleStripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret], cors: true },
  app
);

async function saveCustomerInfo(session: Stripe.Checkout.Session, orderId: string) {
  const customerInfo = {
    email: session.customer_details?.email,
    name: session.customer_details?.name,
    address: session.shipping_details?.address,
    orderId,
    created: new Date(),
  };

  try {
    const docRef = await db.collection('customers').add(customerInfo);
    console.log('Customer Info Saved with ID:', docRef.id);
  } catch (error) {
    console.error('Error saving customer info:', error);
  }
}

async function sendConfirmationEmail(session: Stripe.Checkout.Session, orderId: string) {
  const emailHtml = await render(createElement(ConfirmationEmail, { name: session.customer_details?.name, orderId: orderId }));

  const msg = {
    to: session.customer_details?.email,
    from: "Hud Wahab <hud@nmcore.com>",
    subject: "Order Confirmation",
    html: emailHtml,
  };

  try {
    await sgMail.send(msg);
    console.log('Confirmation Email Sent');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}