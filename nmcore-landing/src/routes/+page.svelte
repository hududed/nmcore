<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from "$lib/components/ui/button/index.js";
  import { onMount } from 'svelte';
  import Benefits from './Benefits.svelte';
  import Faq from './Faq.svelte';
  import Footer from './Footer.svelte';
  import Introduction from './Introduction.svelte';
  import Navbar from './Navbar.svelte';
  import Solution from './Solution.svelte';

  let NotifyForm: typeof import('./NotifyForm.svelte').default = $state();

  onMount(async () => {
    const module = await import('./NotifyForm.svelte');
    NotifyForm = module.default;
  });

  function shopNow() {
    goto('/products/bloom');
  }
</script>

<svelte:head>
  <title>NMCore</title>
  <meta name="description" content="Our advanced carbon quantum dot technology is designed to help plants make better use of light across the UV, visible (VIS), and infrared (IR) spectrum. These tiny particles move easily through leaves and roots, reaching key areas in the plant, like the chloroplasts where photosynthesis happens. By doing so, they boost the plant's natural growth processes and energy production. Though this nanotechnology is new to agriculture, it's already widely used in many fields, from science and electronics to medicine, showing great promise for improving crop health and yield.">
  <meta name="keywords" content="carbon quantum dot technology, photosynthesis, UV light, visible light, infrared light, plant growth, nanotechnology, agriculture, crop health, yield improvement">
  <link rel="canonical" href="https://www.nmcore.com/" />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "NMCore",
      "description": "Our advanced carbon quantum dot technology is designed to help plants make better use of light across the UV, visible (VIS), and infrared (IR) spectrum...",
      "author": {
        "@type": "Organization",
        "name": "NMCORE, LLC"
      },
      "publisher": {
        "@type": "Organization",
        "name": "NMCORE, LLC",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.nmcore.com/images/nmcore_logo.jpg"
        }
      },
      "datePublished": "2023-10-01",
      "image": "https://www.nmcore.com/images/BLOOM_product.jpg"
    }
  </script>
</svelte:head>

<Navbar />

<div class="shop-now-section mt-32 text-center">
  <Button class="bg-blue-500 text-white py-2 px-4 rounded" onclick={shopNow}>SHOP NOW</Button>
</div>

<div class="introduction-section mt-16">
  <Introduction />
</div>

<div class="benefits-section mt-0">
  <Benefits />
</div>

<div class="solution-section mt-0">
  <Solution />
</div>

<div class="faq-section mt-0">
  <Faq />
</div>

<div class="card #172554 text-center mt-32 p-4">
  <h2 class="text-2xl md:text-3xl mb-4">Join Our Testing/Validation Phase</h2>
  <p class="text-lg md:text-xl mb-8">
    We invite you to participate in our testing/validation phase. Please provide your contact information below to get started.
  </p>
  {#if NotifyForm}
    <NotifyForm />
  {/if}
</div>

<div class="faq-section mt-32">
  <Footer />
</div>