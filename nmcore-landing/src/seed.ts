import type { ServiceAccount } from 'firebase-admin/app';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../serviceAccountKey.json';

// Initialize Admin SDK using the service account JSON
initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

// 3. Define your product data
// Define product data
const products = [
  {
    id: "nm_bloom_household",
    brand: "NMCORE",
    category: "Household",
    desc: "Boost low-light plant growth and yield with our carbon quantum dot technology, enhancing photosynthesis across UV, VIS, and IR spectrums.",
    discountPercentage: 0,

    // Top-level images for universal display
    images: [
      { cloudinaryId: "bloom-refill-1", width: 1920, height: 1080 },
      { cloudinaryId: "bloom-starter-kit-1", width: 1920, height: 1080 },
      { cloudinaryId: "tomatoes-thumbnail", width: 1920, height: 1080 },
      { cloudinaryId: "nmcore-landing-banner-1", width: 1920, height: 1080 },
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
        code: "refill",
        mainImage: { cloudinaryId: "bloom-refill-1", width: 1080, height: 1920 },
        availabilityStatus: "In Stock",
        dimensions: { depth: 5, height: 20, width: 10 },
        price: 2799, // in cents
        sku: "BLOOM-REFILL",
        stock: 50,
        stripePriceId: "price_1QTb07GV3ULNhXDgRL5KAHhy",
        stripeProductId: "prod_RMJdfxE0RjAUkU",
        weight: 1.2
      },
      {
        code: "starter_kit",
        mainImage: { cloudinaryId: "bloom-starter-kit-1", width: 1080, height: 1920 },
        availabilityStatus: "In Stock",
        dimensions: { depth: 6, height: 24, width: 12 },
        price: 3999, // in cents
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
    tags: ["carbon quantum dot technology, photosynthesis, low-light plant growth, nanotechnology, agriculture, crop health, yield improvement"],
    thumbnail: "https://res.cloudinary.com/nmcore/image/upload/v1736218233/bloom-starter-kit-1.png",
    title: "BLOOM",
    warrantyInformation: "1 year warranty"
  }
];

async function seedFirestore() {
  const batch = db.batch();

  for (const product of products) {
    // Extract stripePriceIds for quick lookup
    const stripePriceIds = product.productSizes.map((size) => size.stripePriceId);

    // Build the document object
    const productDoc = {
      ...product,
      productSizes: [...product.productSizes], // Ensure productSizes remains an array
      stripePriceIds
    };

    // Reference Firestore document by ID
    const productRef = db.collection('products').doc(product.id);
    batch.set(productRef, productDoc, { merge: false }); // Overwrite existing doc
  }

  // Commit the batch
  await batch.commit();
  console.log('Firestore seeding completed with Cloudinary image references.');
}

// Run the seed script
seedFirestore().catch(console.error);