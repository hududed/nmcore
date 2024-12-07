<script lang="ts">
  import Carousel from '$lib/components/Carousel.svelte';
  import ProductDetails from '$lib/components/ProductDetails.svelte';
  import Thumbnail from '$lib/components/Thumbnail.svelte';
  import { largePhoto, selectedProduct } from '$lib/stores/productStore';
  import type { Product } from '$lib/types';
  import { onMount } from 'svelte';

  export let params;

  let products: Product[] = [];

  onMount(async () => {
    const res = await fetch(`/api/products/${params.id}`);
    const product = await res.json();
    selectedProduct.set(product);
    largePhoto.set(product.images[0]);

    // Assuming you have a way to fetch all products or related products
    const allProductsRes = await fetch('/api/products');
    products = await allProductsRes.json();
  });
</script>

<main class="container mx-auto py-8">
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2">
      <div class="text-center static-photo">
        <img src={$largePhoto} class="w-full max-h-96 mx-auto object-contain" alt={$selectedProduct.title} onerror={() => console.error('Error loading large photo:', $largePhoto)} />
      </div>

      <Carousel {products} />
      <Thumbnail {products} />
    </div>

    <div class="w-full md:w-1/2 p-4">
      <ProductDetails {products} />
    </div>
  </div>
</main>