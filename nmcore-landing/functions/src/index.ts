import cors from 'cors';
import express from 'express';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions/v2';
import { cloudinaryHandler } from './api-handlers/cloudinary';
import { stripeWebhook } from './stripeWebhook';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

// Create an Express app
const expressApp = express();
expressApp.use(cors({ origin: true }));
expressApp.use(express.json()); // Parse JSON body

// Define the /api/cloudinary route
expressApp.post('/api/cloudinary', cloudinaryHandler);

// Define the /products/:id route
expressApp.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is missing from the URL' });
  }

  try {
    const productSnapshot = await db.collection('products').where('id', '==', id).get();

    if (productSnapshot.empty) {
      return res.status(404).json({ error: `Product not found for ID: ${id}` });
    }

    const productDoc = productSnapshot.docs[0];
    const product = productDoc.data();

    return res.json({
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
export const app = functions.https.onRequest(expressApp);

// Export stripeWebhook as its own Cloud Function
export { stripeWebhook };
