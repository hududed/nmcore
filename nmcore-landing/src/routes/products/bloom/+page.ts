import { collection, getDocs } from 'firebase/firestore';
import type { Product } from '$lib/types';
import { db } from '$lib/firebase';

export async function load() {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map(doc => doc.data() as Product);
  return {
    products: productList
  };
}