import type { CartProduct, Product } from '$lib/types';
import { derived, writable } from 'svelte/store';

export const cartProducts = writable<CartProduct[]>([]);
export const cartOpen = writable(false);

export const cartStats = derived(cartProducts, ($cartProducts) => {
  let quantity = 0;
  let total = 0;
  for (const product of $cartProducts) {
    quantity += product.quantity;
    total += product.product.price * product.quantity;
  }
  return {
    quantity,
    total
  };
});

export function updateQuantity(id: string, delta: number) {
  cartProducts.update(products => {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index].quantity += delta;
      if (products[index].quantity <= 0) {
        products.splice(index, 1);
      }
    }
    return [...products];
  });
}

export function addToCart(product: Product) {
  cartProducts.update(products => {
    const index = products.findIndex(p => p.product.id === product.id);
    if (index !== -1) {
      products[index].quantity += 1;
    } else {
      products.push({
        id: crypto.randomUUID(),
        quantity: 1,
        product: product
      });
    }
    return [...products];
  });
}