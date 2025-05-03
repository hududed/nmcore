<script lang="ts">
  // filepath: nmcore-landing/src/routes/%2Blayout.svelte
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


<style> 
    /* TODO: tailwind */
    .spring-banner {
        background-color: #39B54A;
        color: white;
        text-align: center;
        padding: 0.5rem;
        font-weight: bold;
        width: 100%;
        position: fixed;
        top: 56px;
        left: 0;
        z-index: 40;
    }
    /* Adjust so main content starts right after navbar (not after banner) */
    main {
        /* Original main content position without banner */
        margin-top: 0px; /* Just navbar height */
        /* Apply padding to the top of content inside main to account for banner */
        padding-top: 0px; /* Approximate height of banner */
    }
    /* Add padding to card-body instead to prevent content from hiding under banner */
    .card-body {
        padding-top: 32px; /* Height of banner */
    }

    @media (min-width: 1024px) { /* lg breakpoint */
      .spring-banner {
          top: 72px; /* Adjust for larger navbar on desktop (py-4) */
      }

      main {
          margin-top: 0px; /* Just the larger navbar height */
          padding-top: 0; /* No padding needed here */
      }
      
      .card-body {
          padding-top: 32px; /* Height of banner */
      }
    }
</style>

<div class="flex flex-col min-h-screen">
  <Navbar />

  <div class="spring-banner">
      🌸 Spring Offer – FREE SHIPPING on all orders!
  </div>

  <main class="flex-grow card w-full bg-zinc-300 text-neutral-content mx-auto overflow-x-hidden">
    <div class="card-body items-center text-center">
      {@render children?.()}
      <Toaster />
    </div>
  </main>

  <Cart {products} {open} />

  <Footer />
</div>