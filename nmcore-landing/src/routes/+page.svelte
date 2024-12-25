<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from "$lib/components/ui/button/index.js";

  function shopNow() {
    // Navigate to the product page dynamically with ID
    goto('/products/nm_bloom_household'); // Replace with dynamic ID if applicable
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

<div class="banner-section bg-zinc-50 text-zinc-800 text-left py-16 px-4 md:px-8 mt-16">
  <div class="container mx-auto flex flex-col gap-8 py-8 px-4 md:px-8 max-w-screen-xl">
    <div class="text-column flex-2/3 text-left text-xl sm:text-xl md:text-2xl leading-relaxed pr-4 md:pr-4 select-none">
      <h1 class="text-2xl md:text-3xl font-semibold mb-8 text-zinc-400">Midnight Bloom</h1>
      <h2 class="text-3xl md:text-4xl font-semibold mb-8">GROW IN THE DARK</h2>
      <Button class="bg-zinc-800 text-zinc-50 py-2 px-4 rounded" onclick={shopNow}>SHOP NOW</Button>
    </div>
  </div>
</div>