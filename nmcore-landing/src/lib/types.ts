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

export type CloudinaryImage = {
  cloudinaryId: string;
  width?: number;
  height?: number;
};

export type ProductSize = {
  availabilityStatus: string;
  code: string;
  dimensions: {
    depth: number;
    height: number;
    width: number;
  };
  mainImage: CloudinaryImage; // Updated to reflect the structure of `mainImage`
  price: number;
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
  images: CloudinaryImage[]; // Updated to reflect the structure of `images`
  meta: {
    barcode: string;
    createdAt: string;
    qrCode: string;
    updatedAt: string;
  };
  minimumOrderQuantity: number;
  productSizes: ProductSize[];
  rating: number;
  returnPolicy: string;
  reviews: any[]; // Adjust this type as per your reviews structure
  shippingInformation: string;
  stripePriceIds: string[];
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
  mainImage: CloudinaryImage; // Add mainImage to CartProduct
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
