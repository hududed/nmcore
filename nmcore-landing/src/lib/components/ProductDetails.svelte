<script lang="ts">
  import { goto } from '$app/navigation';
  import Faq from '$lib/components/Faq.svelte';
  import { Button } from "$lib/components/ui/button/index.js";
  import { addToCart, cartOpen } from '$lib/stores/cartStore';
  import { largePhoto, size } from '$lib/stores/productStore';
  import type { Product, ProductSize } from '$lib/types';
  import { getCloudinaryId } from '$lib/utils/images';
  import { get } from 'svelte/store';
  import ProductDesc from './ProductDesc.svelte';

  // Declare the product prop
  const { product } = $props<{ product: Product }>();

  // Store for selected size
  let selectedSize = $state<ProductSize | null>(
    get(size) ?? product?.productSizes[0] ?? null
  );

  // Automatically update `largePhoto` whenever `selectedSize` changes
  $effect(() => {
    if (selectedSize) {
      console.log('Setting largePhoto to ID:', selectedSize.mainImage.cloudinaryId);
      largePhoto.set(getCloudinaryId(selectedSize.mainImage.cloudinaryId)); // Pass only the ID
    }
  });

  // Update selectedSize and largePhoto when a size is selected
  function selectSize(code: string): void {
    const newSelectedSize = product.productSizes.find(
      (size: ProductSize) => size.code === code
    );
    if (newSelectedSize) {
      selectedSize = newSelectedSize;
      size.set(newSelectedSize);
      largePhoto.set(getCloudinaryId(newSelectedSize.mainImage.cloudinaryId)); // Pass only the ID
      console.log('Navigating to variant:', code);
      goto(`/products/${product.id}?variant=${code}`, { replaceState: true });
    }
  }

  // Function to handle adding to cart
  function handleAddToCart() {
    if (product && selectedSize) {
      addToCart(product, selectedSize);
      cartOpen.set(true);
    }
  }
</script>

<div class="bg-white shadow-md rounded-lg p-6">
  {#if product}
    <h1 class="text-2xl font-bold mb-2">{product.title}</h1>

    <!-- Dynamic price for selected size -->
    <p class="text-xl text-gray-700 mb-4">
      ${selectedSize ? (selectedSize.price / 100).toFixed(2) : 'Loading...'}
    </p>

    <!-- Dynamic ratings -->
    <p class="text-gray-600 mb-2">
      User rating: {product.rating}-star ({product.reviews.length || 0} ratings)
    </p>
    <a href="#ratings" class="text-blue-500 underline mb-4 block">See all ratings</a>

    <h2 class="text-lg font-semibold mb-2">SIZE</h2>
    <div class="flex justify-center space-x-2 mb-4">
      {#each product.productSizes as productSize}
        <Button
          class={`size-button ${
            selectedSize?.code === productSize.code
              ? 'bg-zinc-300'
              : 'bg-zinc-50'
          } text-zinc-800 border border-black hover:bg-zinc-300 focus:bg-zinc-300 active:bg-zinc-300`}
          onclick={() => selectSize(productSize.code)}
        >
          {productSize.code}
        </Button>
      {/each}
    </div>

    <Button class="w-full bg-zinc-800 text-white py-2 px-4 rounded mb-2" onclick={handleAddToCart}>
      ADD TO CART
    </Button>

    <ProductDesc />
  {:else}
    <p class="text-red-500">Error: Product data not available</p>
  {/if}

  <div class="mt-8">
    <h3 class="text-lg font-semibold mb-2">FREQUENTLY ASKED QUESTIONS:</h3>
    <Faq />
  </div>
</div>
