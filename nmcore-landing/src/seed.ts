import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

const db = getFirestore();

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
  products.forEach((product) => {
    const productRef = db.collection('products').doc(product.id);
    batch.set(productRef, product);
  });
  await batch.commit();
  console.log('Firestore seeding completed.');
}

seedFirestore().catch(console.error);