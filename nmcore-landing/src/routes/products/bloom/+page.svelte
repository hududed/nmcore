<script lang="ts">
  import { page } from '$app/stores';
  import Carousel from '$lib/components/Carousel.svelte';
  import ProductDetails from '$lib/components/ProductDetails.svelte';
  import Thumbnail from '$lib/components/Thumbnail.svelte';
  import { largePhoto, selectedProduct } from '$lib/stores/productStore';
  import type { Product } from '$lib/types';
  import { onMount } from 'svelte';

  let products: Product[] = [];
  let variant: string | null = null;

  $: variant = new URLSearchParams($page.url.search).get('variant');

  onMount(async () => {
    const res = await fetch('/api/products');
    products = await res.json();

    const product = variant ? products.find(p => p.id === Number(variant)) : products[0];
    if (product) {
      selectedProduct.set(product);
      largePhoto.set(product.images[0]);
    }
  });
</script>

<main class="container mx-auto py-8">
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2">
      <div class="text-center static-photo hidden md:block">
        {#if $largePhoto}
          <img src={$largePhoto} class="w-full max-h-96 mx-auto object-contain" alt={$selectedProduct.title} onerror={() => console.error('Error loading large photo:', $largePhoto)} />
        {:else}
          <p>Loading image...</p>
        {/if}
      </div>

      <div class="hidden md:block">
        <Thumbnail {products} />
      </div>

      <div class="block md:hidden mt-8">
        <Carousel {products} />
      </div>
    </div>

    <div class="w-full md:w-1/2 p-4">
      <ProductDetails {products} />
    </div>
  </div>
</main>