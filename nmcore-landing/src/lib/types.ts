// src/lib/types.ts

export type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

export type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type Meta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

export type ProductSize = {
  availabilityStatus: string;
  code: string; // e.g. "refill" or "starter_kit"
  dimensions: Dimensions;
  price: number; // price in cents
  sku: string;
  stock: number;
  stripePriceId: string;
  stripeProductId: string;
  weight: number;
};

export type Product = {
  id: string;
  brand: string;
  category: string;
  desc: string;
  discountPercentage: number;
  images: string[];
  meta: Meta;
  minimumOrderQuantity: number;
  productSizes: ProductSize[];
  /**
   * Newly added top-level array for Firestore queries.
   * e.g. ["price_123abc", "price_456xyz"]
   */
  stripePriceIds: string[]; 
  rating: number;
  returnPolicy: string;
  reviews: Review[];
  shippingInformation: string;
  tags: string[];
  thumbnail: string;
  title: string;
  warrantyInformation: string;
};

export type CartProduct = {
  id: string;
  product: Product;
  size: string;
  price: number;
  quantity: number;
  stripePriceId: string;
};

export type CustomerInfo = {
  name: string;
  email: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

// Webhook items
export interface Item {
  name: string;
  price: number;
  quantity: number;
  productId?: string;
  sizeCode?: string;
  stripePriceId: string;
}

export interface RequestBody {
  items: Item[];
}

// Emails
export type EmailData = {
  name: string;
  orderId: string;
  email: string;
};

export type EmailType = 'confirmation' | 'shippingNotification' | 'inviteCollaboration';
