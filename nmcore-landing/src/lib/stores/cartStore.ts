import type { CartProduct, Product, ProductSize } from '$lib/types';
import { derived, writable } from 'svelte/store';

export const cartProducts = writable<CartProduct[]>([]);
export const cartOpen = writable(false);

export const cartStats = derived(cartProducts, ($cartProducts) => {
  const total = $cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = $cartProducts.reduce((sum, item) => sum + item.quantity, 0);
  return {
    total,
    quantity,
    itemCount: $cartProducts.length,
  };
});

export function addToCart(product: Product, size: ProductSize) {
  cartProducts.update((items) => {
    const existingItem = items.find((item) => item.product.id === product.id && item.size === size.code);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        id: `${product.id}-${size.code}`,
        product,
        size: size.code,
        price: size.price,
        quantity: 1,
        stripePriceId: size.stripePriceId,
      });
    }
    return items;
  });
}

export function updateQuantity(id: string, delta: number) {
  cartProducts.update((items) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        return items.filter((item) => item.id !== id);
      }
    }
    return items;
  });
}