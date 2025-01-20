// file: nmcore-landing/src/routes/api/products/%2Bserver.ts
import { error, json } from '@sveltejs/kit';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Use `process.env` for secrets
const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!serviceAccountKeyBase64) {
  throw error(500, 'Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable');
}

const serviceAccountKey = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf8');
const serviceAccount = JSON.parse(serviceAccountKey);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export const GET = async () => {
  console.log('GET request received at /api/products');
  try {
    // Fetch products from Firestore
    const productsSnapshot = await db.collection('products').get();

    if (productsSnapshot.empty) {
      console.log('No products found in Firestore');
      throw error(404, 'No products found');
      };

    // Map Firestore documents to an array of product objects
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return json(products);
  } catch (err) {
    console.error('Error fetching products from Firestore:', err);
    return error(500, 'Failed to fetch products');
  }
};
