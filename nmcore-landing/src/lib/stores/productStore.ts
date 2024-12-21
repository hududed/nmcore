import type { Product, ProductSize } from '$lib/types';
import { writable } from 'svelte/store';

export const selectedProduct = writable<Product | null>(null);
export const largePhoto = writable<string>('');
export const size = writable<ProductSize | null>(null);