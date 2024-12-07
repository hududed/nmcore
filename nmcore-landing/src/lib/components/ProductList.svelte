<script lang="ts">
  import { goto } from '$app/navigation';
  import { selectedProduct } from '$lib/stores/productStore';
  import type { Product } from '$lib/types';
  import { onMount } from 'svelte';

  let products: Product[] = [];

  onMount(async () => {
    const res = await fetch('/api/products');
    products = await res.json();
  });

  function viewProduct(product: Product) {
    selectedProduct.set(product);
    goto(`/products/${product.id}`);
  }
</script>

<main class="container mx-auto py-8">
  <h1 class="text-2xl font-bold mb-4">Product List</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each products as product}
      <button type="button" class="bg-white shadow-md rounded-lg p-4 cursor-pointer" onclick={() => viewProduct(product)} onkeydown={(e) => e.key === 'Enter' && viewProduct(product)} aria-label={`View details for ${product.title}`}>
        <img src={product.images[0]} alt={product.title} class="w-full h-48 object-contain mb-4" />
        <h2 class="text-xl font-bold">{product.title}</h2>
        <p class="text-gray-700">${product.price.toFixed(2)}</p>
      </button>
    {/each}
  </div>
</main>