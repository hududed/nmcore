<script lang="ts">
  import Cart from '$lib/components/Cart.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { Toaster } from "$lib/components/ui/sonner";
  import { cartOpen } from '$lib/stores/cartStore';
  import type { Product } from '$lib/types';
  import { onMount } from 'svelte';
  import "../app.css";

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
  let products = $state<Product[]>([]);

  onMount(async () => {
    const res = await fetch('/api/products');
    products = await res.json();
  });
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <main class="flex-grow card w-full bg-neutral text-neutral-content mx-auto overflow-x-hidden">
    <div class="card-body items-center text-center">
      {@render children?.()}
      <Toaster />
    </div>
  </main>

  <Cart {products} bind:open={$cartOpen} />

  <Footer />
</div>