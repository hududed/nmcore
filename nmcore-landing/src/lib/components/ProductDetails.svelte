<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from "$lib/components/ui/button/index.js";
  import { addToCart, cartOpen } from '$lib/stores/cartStore';
  import { largePhoto, selectedProduct, size } from '$lib/stores/productStore';
  import type { Product } from '$lib/types';

  export let products: Product[] = [];

  function selectSize(selectedSize: string): void {
    size.set(selectedSize);
    const product = selectedSize === 'Refill' ? products[1] : products[0];
    selectedProduct.set(product);
    largePhoto.set(product.images[0]);
    goto(`/products/bloom?variant=${product.id}`);
  }

  function handleAddToCart() {
    addToCart($selectedProduct);
    cartOpen.set(true);
  }
</script>

{#if $selectedProduct}
  <div class="bg-white shadow-md rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-2">{$selectedProduct.title}</h1>
    <p class="text-xl text-gray-700 mb-4">${$selectedProduct.price.toFixed(2)}</p>
    <p class="text-gray-600 mb-2">User rating: {$selectedProduct.rating}-star ({$selectedProduct.reviews.length} ratings)</p>
    <a href="#ratings" class="text-blue-500 underline mb-4 block">See all ratings</a>

    <h2 class="text-lg font-semibold mb-2">SIZE</h2>
    <div class="flex justify-center space-x-2 mb-4">
      <Button class="size-button" onclick={() => selectSize('Spray')}>Spray</Button>
      <Button class="size-button" onclick={() => selectSize('Refill')}>Refill</Button>
    </div>

    <Button class="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2" onclick={handleAddToCart}>ADD TO CART</Button>
  </div>
{:else}
  <p>Loading product details...</p>
{/if}