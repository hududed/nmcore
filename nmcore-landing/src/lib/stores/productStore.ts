import type { Product } from '$lib/types';
import { writable } from 'svelte/store';

export const selectedProduct = writable<Product>(null);
export const largePhoto = writable<string>('');
export const size = writable<string>('Spray');