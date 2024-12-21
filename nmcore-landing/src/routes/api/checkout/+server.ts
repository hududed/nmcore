import { generateShortOrderId } from '$lib/utils/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { Item, RequestBody } from '$lib/types';

// Load the service account key from the environment variable
const serviceAccountPath = resolve(process.env.VITE_FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase app if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export const GET: RequestHandler = async () => {
  console.log('GET request received at /api/checkout');
  return new Response('API route is working', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  console.log('POST request received at /api/checkout');
  const { items }: RequestBody = await request.json();
  console.log('Items:', items);

  try {
    const successUrl = `${import.meta.env.VITE_PUBLIC_FRONTEND_URL}/status/checkout/success`;
    const cancelUrl = `${import.meta.env.VITE_PUBLIC_FRONTEND_URL}/status/checkout/fail`;

    console.log('Success URL:', successUrl);
    console.log('Cancel URL:', cancelUrl);

    const orderId = generateShortOrderId();

    const lineItems = items.map((item: Item) => {
      if (!item.stripePriceId) {
        throw new Error(`Stripe price ID is missing for item: ${item.name}`);
      }
      return {
        price: item.stripePriceId,
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add more countries as needed
      },
      metadata: {
        order_id: orderId, // Attach the order ID to the session metadata
        items: JSON.stringify(items) // Attach items to metadata for processing in webhook
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 999,
              currency: 'usd',
            },
            display_name: 'Ground shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    });

    console.log('Stripe session created:', session.id);

    return new Response(JSON.stringify({ id: session.id, orderId }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return new Response(JSON.stringify({ error: 'Error creating Stripe session' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};