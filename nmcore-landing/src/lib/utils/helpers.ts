// src/lib/utils/helpers.ts
import { cartProducts } from '$lib/stores/cartStore';
import { loadStripe } from '@stripe/stripe-js';
import { get } from 'svelte/store';

export async function goToCheckout() {
  const items = get(cartProducts).map(item => ({
    name: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
  }));

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  const { id } = await response.json();
  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  await stripe.redirectToCheckout({ sessionId: id });
}

