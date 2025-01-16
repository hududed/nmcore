//filepath: /functions/src/index.ts
import cors from 'cors';
import express from 'express';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { createCloudinaryHandler } from './api-handlers/cloudinary';
import { stripeWebhook } from './stripeWebhook';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

// Define Cloudinary secrets
const CLOUDINARY_API_SECRET = defineSecret('CLOUDINARY_API_SECRET');
const CLOUDINARY_API_KEY = defineSecret('CLOUDINARY_API_KEY');
const CLOUDINARY_CLOUD_NAME = defineSecret('CLOUDINARY_CLOUD_NAME');

// Create an Express app
const expressApp = express();
expressApp.use(cors({ origin: true }));
expressApp.use(express.json()); // Parse JSON body

// Define /api/cloudinary route
expressApp.post('/api/cloudinary', async (req, res) => {
  try {
    const cloudinaryHandler = createCloudinaryHandler({
      cloudName: CLOUDINARY_CLOUD_NAME.value(),
      apiKey: CLOUDINARY_API_KEY.value(),
      apiSecret: CLOUDINARY_API_SECRET.value(),
    });

    return cloudinaryHandler(req, res);
  } catch (err) {
    console.error('Error in /api/cloudinary route:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define /api/products route (get all products)
expressApp.get('/api/products', async (req, res) => {
  console.log('GET request received at /api/products');
  try {
    const productsSnapshot = await db.collection('products').get();

    if (productsSnapshot.empty) {
      return res.status(404).json({ message: 'No products found' });
    }

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Define /api/products/:id route (get specific product by ID)
expressApp.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is missing from the URL' });
  }

  try {
    console.log(`Fetching product with ID: ${id}`);
    const productSnapshot = await db.collection('products').where('id', '==', id).get();

    if (productSnapshot.empty) {
      return res.status(404).json({ error: `Product not found for ID: ${id}` });
    }

    const productDoc = productSnapshot.docs[0];
    const product = productDoc.data();

    return res.status(200).json({
      product: {
        ...product,
        images: product.images.map((img: any) => ({
          cloudinaryId: img.cloudinaryId,
        })),
        productSizes: product.productSizes.map((size: any) => ({
          ...size,
          mainImage: {
            cloudinaryId: size.mainImage.cloudinaryId,
          },
        })),
      },
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the Express app as a Cloud Function
export const app = onRequest(
  {
    secrets: [
      CLOUDINARY_API_SECRET,
      CLOUDINARY_API_KEY,
      CLOUDINARY_CLOUD_NAME,
    ],
  },
  expressApp
);

// Export stripeWebhook as its own Cloud Function
export { stripeWebhook };
