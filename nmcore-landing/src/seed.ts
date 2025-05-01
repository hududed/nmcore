//filepath: nmcore-landing/src/seed.ts
import { config } from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

// TODO: Consider separating catalog (static product data) from inventory (dynamic stock levels) into separate Firestore collections for clearer ownership and simpler updates

// Version your catalog seed
const SEED_VERSION = 1;

// Ensure the correct environment file is loaded
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFile });

const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!serviceAccountKeyBase64) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable');
}

const serviceAccountKey = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf8');
const serviceAccount = JSON.parse(serviceAccountKey);

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

// Configure Firestore Emulator if running
if (process.env.FIRESTORE_EMULATOR_HOST) {
  const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
  (db as Firestore).settings({ host: `${host}:${port}`, ssl: false });
  console.log(`Seeding Firestore Emulator at ${host}:${port}`);
}

// Define product data
const products = [
  {
    id: "nm_bloom_household",
    brand: "NMCORE",
    category: "Household",
    desc: "Boost low-light plant growth and yield with our carbon Quantum Dot technology, enhancing photosynthesis across UV, VIS, and IR spectrums.",
    discountPercentage: 0,

    // Top-level images for universal display
    images: [
      { cloudinaryId: "bloom-refill-1", width: 1920, height: 1080 },
      { cloudinaryId: "bloom-starter-kit-1", width: 1920, height: 1080 },
      { cloudinaryId: "compare-yield", width: 1920, height: 1080 },
      { cloudinaryId: "compare-lowlight", width: 1920, height: 1080 },
      { cloudinaryId: "nmcore-landing-banner-1", width: 1920, height: 1080 },
      // { cloudinaryId: "tomatoes-thumbnail", width: 1920, height: 1080 },
    ],

    meta: {
      barcode: "123456789012",
      createdAt: "2024-12-15T23:35:56.940Z",
      qrCode: "https://example.com/qrcode",
      updatedAt: "2024-12-15T23:35:56.940Z"
    },

    minimumOrderQuantity: 1,

    // Each product size with its own main image
    productSizes: [
      {
        code: "Refill",
        mainImage: { cloudinaryId: "bloom-refill-1", width: 1080, height: 1920 },
        availabilityStatus: "In Stock",
        dimensions: { depth: 5, height: 20, width: 10 },
        price: 2799, // in cents
        sku: "BLOOM-REFILL",
        stock: 79,
        stripePriceId: process.env[`BLOOM_REFILL_STRIPE_PRICE_ID`],
        stripeProductId: process.env[`BLOOM_REFILL_STRIPE_PRODUCT_ID`], 
        weight: 436
      },
      {
        code: "Starter Kit",
        mainImage: { cloudinaryId: "bloom-starter-kit-1", width: 1080, height: 1920 },
        availabilityStatus: "In Stock",
        dimensions: { depth: 6, height: 24, width: 12 },
        price: 3999, // in cents
        sku: "BLOOM-STARTER",
        stock: 19,
        stripePriceId: process.env[`BLOOM_STARTER_STRIPE_PRICE_ID`],
        stripeProductId: process.env[`BLOOM_STARTER_STRIPE_PRODUCT_ID`],
        weight: 543
      }
    ],

    rating: 4.5,
    returnPolicy: "30-day return policy",
    reviews: [] as any[],
    useCases: [] as any[],
    shippingInformation: "Ships in 5-7 business days",
    tags: ["carbon quantum dot technology, photosynthesis, low-light plant growth, nanotechnology, agriculture, crop health, yield improvement"],
    thumbnail: "https://res.cloudinary.com/nmcore/image/upload/v1736218233/bloom-starter-kit-1.png",
    title: "BLOOM",
    warrantyInformation: "1 year warranty"
  }
];

async function seedFirestore() {
  const batch = db.batch();

  for (const product of products) {
    const stripePriceIds = product.productSizes.map(size => size.stripePriceId);
    const productDoc = { ...product, productSizes: [...product.productSizes], stripePriceIds };
    const productRef = db.collection('products').doc(product.id);
    const snapshot = await productRef.get();

    if (snapshot.exists) {
      const existing = snapshot.data()!;
      productDoc.productSizes = productDoc.productSizes.map((size, i) => ({
        ...size,
        stock: existing.productSizes[i]?.stock ?? size.stock,
      }));
    }

     // Merge only static catalog fields
    batch.set(productRef, productDoc, { mergeFields: [
      'brand','category','desc','discountPercentage','images','meta',
      'minimumOrderQuantity','productSizes','stripePriceIds','rating','returnPolicy',
      'reviews','useCases','shippingInformation','tags','thumbnail','title',
      'warrantyInformation'
    ]});
  }

  await batch.commit();
  console.log('Firestore seeding completed with Cloudinary image references.');

  // Record seed version for migrations
  await db.collection('meta').doc('config').set({ catalogVersion: SEED_VERSION }, { merge: true });
  console.log(`Recorded seed version ${SEED_VERSION} in Firestore meta/config.`);
}

seedFirestore().catch(console.error);