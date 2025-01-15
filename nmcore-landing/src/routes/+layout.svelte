<script lang="ts">
  import Cart from '$lib/components/Cart.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { Toaster } from "$lib/components/ui/sonner";
  import { CLOUDINARY_CLOUD_NAME } from '$lib/secrets';
  import { cartOpen } from '$lib/stores/cartStore';
  import type { Product } from '$lib/types';
  import { onMount } from 'svelte';
  import { configureCloudinary } from 'svelte-cloudinary';
  import "../app.css";

  // Set Cloudinary options globally
  configureCloudinary({
    cloudName: CLOUDINARY_CLOUD_NAME,
  });

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
  let products = $state<Product[]>([]);
  let open = $state<boolean>(false); // Define open state

  $effect(() => {
    open = $cartOpen;
  });

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

  <Cart {products} {open} />

  <Footer />
</div>