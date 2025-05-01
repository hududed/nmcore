import { config } from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load environment variables for the correct environment
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFile });

// Initialize Firebase Admin SDK
const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
if (!serviceAccountKeyBase64) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable');
}
const serviceAccountKey = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf8');
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(serviceAccountKey)),
  });
}

const db = getFirestore();

// Define static inventory reset values
const resetProducts = [
  {
    id: 'nm_bloom_household',
    sizes: [
      { code: 'Refill', stock: 80, availabilityStatus: 'In Stock' },
      { code: 'Starter Kit', stock: 20, availabilityStatus: 'In Stock' }
    ]
  }
];

async function seedInventory() {
  const batch = db.batch();

  for (const { id, sizes } of resetProducts) {
    const docRef = db.collection('products').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      console.warn(`Product with ID ${id} not found, skipping.`);
      continue;
    }
    const existing = snap.data();
    const existingSizes = existing.productSizes as Array<Record<string, any>>;

    // Build updated sizes array, preserving all other fields
    const newSizes = existingSizes.map(sizeEntry => {
      const override = sizes.find(o => o.code === sizeEntry.code);
      return override
        ? { ...sizeEntry, stock: override.stock, availabilityStatus: override.availabilityStatus }
        : sizeEntry;
    });

    batch.update(docRef, { productSizes: newSizes });
  }

  await batch.commit();
  console.log('Inventory seeding completed.');
}

seedInventory().catch(console.error);
