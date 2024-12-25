import type { RequestHandler } from '@sveltejs/kit';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Initialize Firebase Admin SDK with a service account
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
if (!serviceAccountPath) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_PATH in environment variables');
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export const GET: RequestHandler = async () => {
  console.log('GET request received at /api/products');
  try {
    // Fetch products from Firestore
    const productsSnapshot = await db.collection('products').get();

    if (productsSnapshot.empty) {
      console.log('No products found in Firestore');
      return new Response(JSON.stringify({ message: 'No products found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Map Firestore documents to an array of product objects
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
