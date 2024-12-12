// src/routes/api/checkout/+server.ts
import { generateShortOrderId } from '$lib/utils/helpers';
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface RequestBody {
  items: Item[];
}

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: Item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Add more countries as needed
      },
      metadata: {
        order_id: orderId, // Attach the order ID to the session metadata
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