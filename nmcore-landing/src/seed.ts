import type { ServiceAccount } from 'firebase-admin/app';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../serviceAccountKey.json';

// Initialize Admin SDK using the service account JSON
initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

// This productSizes is a literal array in JavaScript, so Firestore will store it as an array.
const products = [
  {
    id: "nm_bloom_household",
    brand: "NMCore",
    category: "Household",
    desc: "Bloom is an organic advanced nanotechnology foliar spray that helps plants struggling in low-light environments.",
    discountPercentage: 0,
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    meta: {
      barcode: "123456789012",
      createdAt: "2024-12-15T23:35:56.940Z",
      qrCode: "https://example.com/qrcode",
      updatedAt: "2024-12-15T23:35:56.940Z"
    },
    minimumOrderQuantity: 1,

    // *** Key part: productSizes is a real array, not a map. ***
    productSizes: [
      {
        availabilityStatus: "In Stock",
        code: "refill",
        dimensions: { depth: 5, height: 20, width: 10 },
        price: 2799,
        sku: "BLOOM-REFILL",
        stock: 50,
        stripePriceId: "price_1QTb07GV3ULNhXDgRL5KAHhy",
        stripeProductId: "prod_RMJdfxE0RjAUkU",
        weight: 1.2
      },
      {
        availabilityStatus: "In Stock",
        code: "starter_kit",
        dimensions: { depth: 6, height: 24, width: 12 },
        price: 3999,
        sku: "BLOOM-STARTER",
        stock: 30,
        stripePriceId: "price_1QTazPGV3ULNhXDgVKPCIwRn",
        stripeProductId: "prod_RMJcq5ccixGiHG",
        weight: 1.5
      }
    ],

    rating: 4.5,
    returnPolicy: "30-day return policy",
    reviews: [] as any[],
    shippingInformation: "Ships in 3-5 business days",
    tags: ["organic", "nanotechnology", "foliar spray"],
    thumbnail: "https://example.com/thumbnail.jpg",
    title: "BLOOM",
    warrantyInformation: "1 year warranty"
  }
];

async function seedFirestore() {
  const batch = db.batch();

  for (const product of products) {
    // Create a top-level array of stripePriceIds for quick lookups in your webhook
    const stripePriceIds = product.productSizes.map((size) => size.stripePriceId);

    // Force productSizes to remain an array
    const productDoc = {
      ...product,
      productSizes: [...product.productSizes], // Ensure it's truly an array
      stripePriceIds
    };

    // Overwrite the entire doc so old data doesn't remain
    const productRef = db.collection('products').doc(product.id);
    batch.set(productRef, productDoc, { merge: false }); 
    // note: merge:false ensures we replace any old map with the new array
  }

  await batch.commit();
  console.log('Firestore seeding completed with productSizes as an array and stripePriceIds at top level.');
}

seedFirestore().catch(console.error);
