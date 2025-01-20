//filepath: /functions/src/index.js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
import cors from 'cors';
import express from 'express';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Server } from '../server/index.js';
import { manifest, prerendered } from '../server/manifest.js';
import { createCloudinaryHandler } from './api-handlers/cloudinary.js';
import { db } from './firestore.js';
import { stripeWebhookHandler } from './stripeWebhookHandler.js';

installPolyfills();

// Define Cloudinary secrets
const CLOUDINARY_API_SECRET = defineSecret('CLOUDINARY_API_SECRET');
const CLOUDINARY_API_KEY = defineSecret('CLOUDINARY_API_KEY');
const CLOUDINARY_CLOUD_NAME = defineSecret('CLOUDINARY_CLOUD_NAME');

// Define Stripe secrets
const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');
const SENDGRID_API_KEY = defineSecret('SENDGRID_KEY');

// Helper function to convert Express request to SvelteKit request
function toSvelteKitRequest(request) {
  const protocol = request.headers['x-forwarded-proto'] || 'http';
  const host = `${protocol}://${request.headers['x-forwarded-host']}`;
  const { href } = new URL(request.url || '', host);
  return new Request(href, {
    method: request.method,
    headers: toSvelteKitHeaders(request.headers),
    body: request.rawBody ? request.rawBody : null,
  });
}

// Helper function to convert headers
function toSvelteKitHeaders(headers) {
  const finalHeaders = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      finalHeaders[key] = Array.isArray(value) ? value.join(',') : value;
    }
  }

  return new Headers(finalHeaders);
}

// Middleware to handle SvelteKit requests
async function handleSvelteKitRequest(req, res, next) {
  if (prerendered.has(req.url)) {
    console.log(`Prerendered route found for ${req.url}`);
    return next();
  }

  const server = new Server(manifest);
  await server.init({ env: process.env });

  const sveltekitRequest = toSvelteKitRequest(req);
  const rendered = await server.respond(sveltekitRequest);

  if (!rendered) {
    return res.writeHead(404, 'Not Found').end();
  }

  /** @type {ArrayBuffer} */
  const body = await rendered.arrayBuffer();
  return res
    .writeHead(rendered.status, Object.fromEntries(rendered.headers))
    .end(Buffer.from(body));
}

// Create an Express app
const expressApp = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// console.log('filename:', __filename);
// console.log('dirname:', __dirname);

expressApp.use(cors({ origin: true }));
expressApp.use(express.json()); // Parse JSON body

// Serve pre-rendered HTML files
expressApp.use(express.static(join(__dirname, '../prerendered')));

// Serve client-side assets
expressApp.use(express.static(join(__dirname, '../client')));

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
  console.log('[DEBUG] Route hit: /api/products');
  try {
    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      console.log('[DEBUG] No products found');
      return res.status(404).json({ message: 'No products found' });
    }

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log('[DEBUG] Products fetched:', products);

    return res.status(200).json(products);
  } catch (err) {
    console.error('[DEBUG] Error fetching products:', err);
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
    console.log(`[DEBUG] Fetching product with ID: ${id}`);
    const productSnapshot = await db.collection('products').where('id', '==', id).get();

    if (productSnapshot.empty) {
      return res.status(404).json({ error: `Product not found for ID: ${id}` });
    }

    const productDoc = productSnapshot.docs[0];
    const product = productDoc.data();

    return res.status(200).json({
      product: {
        ...product,
        images: product.images.map((img) => ({
          cloudinaryId: img.cloudinaryId,
        })),
        productSizes: product.productSizes.map((size) => ({
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

// Define /api/stripe-webhook route
expressApp.post(
  '/api/stripe-webhook',
  express.raw({ type: 'application/json' }), // Use raw body parser for Stripe
  stripeWebhookHandler
);

// Handle all other routes with SvelteKit
expressApp.use(handleSvelteKitRequest);

// Export the Express app as a Cloud Function
export const app = onRequest(
  {
    secrets: [
      CLOUDINARY_API_SECRET,
      CLOUDINARY_API_KEY,
      CLOUDINARY_CLOUD_NAME,
      STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET,
      SENDGRID_API_KEY,
    ],
    region: 'us-central1'
  },
  expressApp
);
