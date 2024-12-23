import { Stripe } from 'stripe';

export interface Item {
  name: string;
  price: number;
  quantity: number;
  productId?: string; // Optional, as it may not be in stripe customer metadata
  sizeCode?: string; // Optional, as it may not be in stripe customer metadata
  stripePriceId: string;
}
export interface RequestBody {
  items: Item[];
}

// response emails
export type EmailData = {
  name: string;
  orderId: string;
  email: string;
  shippingAddress: Stripe.Address;
  timestamp: number;
}

export type EmailType = 'confirmation' | 'shippingNotification';


