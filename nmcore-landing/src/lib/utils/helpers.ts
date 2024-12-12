// src/lib/utils/helpers.ts
import { db } from '$lib/firebase';
import { cartProducts } from '$lib/stores/cartStore';
import type { CustomerInfo } from '$lib/types';
import { loadStripe } from '@stripe/stripe-js';
import { collection, doc, writeBatch } from "firebase/firestore";
import { nanoid } from 'nanoid';
import { get } from 'svelte/store';

export async function goToCheckout(customerInfo: CustomerInfo) {
  const items = get(cartProducts).map(item => ({
    name: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
  }));

  // Save customer information to Firestore
  try {
    const batch = writeBatch(db);
    const userRef = doc(collection(db, 'customers'));
    batch.set(userRef, customerInfo);
    await batch.commit();
    console.log('Customer information saved successfully');
  } catch (e) {
    console.error('Error saving customer information: ', e);
  }

  // Create a customer in Stripe
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items, customerInfo }),
  });

  const { id } = await response.json();
  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  await stripe.redirectToCheckout({ sessionId: id });
}

// Function to generate a short, unique order ID
export function generateShortOrderId() {
  return nanoid(6).toUpperCase(); // Generate a 6-character ID
}