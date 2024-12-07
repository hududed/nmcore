<script lang="ts">
  import { goto } from '$app/navigation';
  import Faq from '$lib/components/Faq.svelte';
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
      <Button class="size-button bg-zinc-50 text-zinc-800 border border-black hover:bg-zinc-300 focus:bg-zinc-300 active:bg-zinc-300" onclick={() => selectSize('Spray')}>Spray</Button>
      <Button class="size-button bg-zinc-50 text-zinc-800 border border-black hover:bg-zinc-300 focus:bg-zinc-300 active:bg-zinc-300" onclick={() => selectSize('Refill')}>Refill</Button>
    </div>

    <Button class="w-full bg-zinc-800 text-white py-2 px-4 rounded mb-2" onclick={handleAddToCart}>ADD TO CART</Button>

    <div class="mt-8 text-left">
      <h2 class="text-xl font-bold mb-4">Meet BLOOM: Your Plant’s Glow-Up in a Bottle!</h2>
      <p class="mb-4">BLOOM is a photosynthesis enhancer like no other. Available in a handy 16oz spray bottle or an 85oz refill, it’s here to bring struggling plants back to life.</p>
      <p class="mb-4">Spray it on your leaves, and BLOOM works its magic, boosting photosynthesis up to 3X—even in low light! Think of it as sunlight in a bottle for your plant babies.</p>
      <h3 class="text-lg font-semibold mb-2">Why You’ll Love It:</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Plant-Safe Formula: Organic and inspired by nature.</li>
        <li>Effortless Use: Just spray and watch them thrive.</li>
        <li>Low-Light Hero: Helps plants flourish where others can’t.</li>
      </ul>
      <p class="mb-4">Designed with love, for plant-lovers. Let BLOOM brighten up your garden or indoor jungle. 🌿</p>
      <p class="mb-4">Grab yours now and give your plants the boost they deserve!</p>

      <div class="mt-8">
        <a href="/products/bloom/sds" class="text-zinc-800 underline">NMCore BLOOM Safety Data Sheet</a>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-2">DIRECTIONS FOR USE:</h3>
        <p class="mb-4">Shake vigorously until mixed. That’s it! You are ready to go!</p>
        <p class="mb-4">Spray diluted solution onto plant, thoroughly coating all plant surfaces. Don’t forget the undersides of the leaves! Re-apply as needed.</p>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-2">FREQUENTLY ASKED QUESTIONS:</h3>
        <Faq />
      </div>
    </div>
  </div>
{:else}
  <p>Loading product details...</p>
{/if}