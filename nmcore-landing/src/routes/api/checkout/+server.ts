import type { Item, RequestBody } from '$lib/types';
import { generateShortOrderId } from '$lib/utils/checkout';
import type { RequestHandler } from '@sveltejs/kit';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import Stripe from 'stripe';

// Initialize Firebase Admin
const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!serviceAccountKeyBase64) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 env var');
const serviceAccountKey = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf8');
const serviceAccount = JSON.parse(serviceAccountKey);
if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });

// Initialize Stripe
const stripeSecretKey = process.env.VITE_STRIPE_SECRET_KEY;
if (!stripeSecretKey) throw new Error('Missing VITE_STRIPE_SECRET_KEY env var');
const stripe = new Stripe(stripeSecretKey, {
  // @ts-ignore
  apiVersion: '2024-12-18.acacia'
});

export const GET: RequestHandler = async () => {
  return new Response('API route is working', { status: 200, headers: { 'Content-Type': 'text/plain' } });
};

export const POST: RequestHandler = async ({ request }) => {
  console.log('POST /api/checkout');
  const { items }: RequestBody = await request.json();

  try {
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL.replace(/\/+$/, '');
    const successUrl = `${frontendUrl}/status/checkout/success`;
    const cancelUrl = `${frontendUrl}/status/checkout/fail`;
    const orderId = generateShortOrderId();

    const lineItems = items.map((item: Item) => {
      if (!item.stripePriceId) throw new Error(`Missing priceId for ${item.name}`);
      return { price: item.stripePriceId, quantity: item.quantity };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // Enable invoice creation so Parcelcraft can update and trigger invoice.updated
      invoice_creation: { enabled: true },
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      metadata: {
        order_id: orderId,
        items: JSON.stringify(items),
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
    });

    console.log('Stripe session created:', session.id);
    return new Response(JSON.stringify({ id: session.id, orderId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return new Response(JSON.stringify({ error: 'Error creating session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
