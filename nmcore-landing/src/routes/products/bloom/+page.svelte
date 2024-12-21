<script lang="ts">
  import { page } from '$app/stores';
  import Carousel from '$lib/components/Carousel.svelte';
  import ProductDetails from '$lib/components/ProductDetails.svelte';
  import Thumbnail from '$lib/components/Thumbnail.svelte';
  import { db } from '$lib/firebase';
  import { largePhoto, selectedProduct, size } from '$lib/stores/productStore';
  import type { Product } from '$lib/types';
  import { collection, getDocs } from 'firebase/firestore';
  import { onMount } from 'svelte';

  let products = $state<Product[]>([]);
  let variant = $state<string | null>(null);
  let selectedSizeCode = $state<string | null>(null);

  $effect(() => {
    const urlParams = new URLSearchParams($page.url.search);
    variant = urlParams.get('variant');
    selectedSizeCode = urlParams.get('size');
  });

  $effect(() => {
    const product = variant ? products.find(p => p.id === variant) : products[0];
    if (product) {
      selectedProduct.set(product);
      largePhoto.set(product.images[0]);
      const selectedSize = product.productSizes.find(size => size.code === selectedSizeCode) || null;
      size.set(selectedSize);
    }
  });

  onMount(async () => {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    products = productSnapshot.docs.map(doc => doc.data() as Product);

    const product = variant ? products.find(p => p.id === variant) : products[0];
    if (product) {
      selectedProduct.set(product);
      largePhoto.set(product.images[0]);
      const selectedSize = product.productSizes.find(size => size.code === selectedSizeCode) || null;
      size.set(selectedSize);
    }
  });
</script>

<main class="container py-8 mt-24 md:mt-32">
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2 md:sticky md:top-24">
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

    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:max-h-screen">
      <ProductDetails {products} />
    </div>
  </div>
</main>