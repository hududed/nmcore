<script lang="ts">
  import { goto } from '$app/navigation';
  import Faq from '$lib/components/Faq.svelte';
  import { Button } from "$lib/components/ui/button/index.js";
  import { addToCart, cartOpen } from '$lib/stores/cartStore';
  import { largePhoto, selectedProduct, size } from '$lib/stores/productStore';
  import type { Product, ProductSize } from '$lib/types';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import ProductDesc from './ProductDesc.svelte';

  let { products } = $props<{ products: Product[] }>();

  let selectedSizeCode = $state<string | null>(null);
  let selectedSize: ProductSize | null = null;

  $effect(() => {
    selectedSizeCode = get(size)?.code || null;
  });

  $effect(() => {
    const product = get(selectedProduct);
    if (product) {
      selectedSize = product.productSizes.find(size => size.code === selectedSizeCode) || null;
      if (!selectedSize) {
        selectedSize = product.productSizes[0] || null;
        size.set(selectedSize);
      }
    }
  });

  onMount(() => {
    const product = get(selectedProduct);
    if (product && !selectedSizeCode) {
      const defaultSize = product.productSizes[0] || null;
      size.set(defaultSize);
    }
  });

  function selectSize(code: string): void {
    const product = get(selectedProduct);
    const selectedSize = product.productSizes.find(size => size.code === code);
    if (selectedSize) {
      size.set(selectedSize);
      largePhoto.set(product.images[0]);
      goto(`/products/bloom?variant=${product.id}&size=${code}`, { replaceState: true });
    }
  }

  function handleAddToCart() {
    const product = get(selectedProduct);
    const selectedSize = get(size);
    if (product && selectedSize) {
      addToCart(product, selectedSize);
      cartOpen.set(true);
    }
  }
</script>

{#if $selectedProduct}
  <div class="bg-white shadow-md rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-2">{$selectedProduct.title}</h1>
    <p class="text-xl text-gray-700 mb-4">${$size ? ($size.price / 100).toFixed(2) : 'Loading...'}</p>
    <p class="text-gray-600 mb-2">User rating: {$selectedProduct.rating}-star ({$selectedProduct.reviews.length} ratings)</p>
    <a href="#ratings" class="text-blue-500 underline mb-4 block">See all ratings</a>

    <h2 class="text-lg font-semibold mb-2">SIZE</h2>
    <div class="flex justify-center space-x-2 mb-4">
      {#each $selectedProduct.productSizes as productSize}
        <Button class="size-button bg-zinc-50 text-zinc-800 border border-black hover:bg-zinc-300 focus:bg-zinc-300 active:bg-zinc-300" onclick={() => selectSize(productSize.code)}>
          {productSize.code}
        </Button>
      {/each}
    </div>

    <Button class="w-full bg-zinc-800 text-white py-2 px-4 rounded mb-2" onclick={handleAddToCart}>ADD TO CART</Button>

    <ProductDesc />

    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-2">FREQUENTLY ASKED QUESTIONS:</h3>
      <Faq />
    </div>
  </div>
{:else}
  <p>Loading product details...</p>
{/if}