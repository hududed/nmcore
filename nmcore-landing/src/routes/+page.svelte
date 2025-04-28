<script lang="ts">
  //filepath: nmcore-landing/src/routes/%2Bpage.svelte
  import { goto } from '$app/navigation';
  import Meta from '$lib/components/seo/Meta.svelte';
  import StructuredData from '$lib/components/seo/StructuredData.svelte';
  import { Button } from "$lib/components/ui/button/index.js";
  import { fetchImageURL } from '$lib/utils/images';
  import { onMount } from 'svelte';

  let backgroundImageUrl = '';

  onMount(async () => {
    backgroundImageUrl = await fetchImageURL({ cloudinaryId: 'nmcore-landing-banner-1' }, {}, fetch);
  });

  function shopNow() {
    // Navigate to the product page dynamically with ID
    console.log('Navigating to /products/nm_bloom_household');
    goto('/products/nm_bloom_household'); // Replace with dynamic ID if applicable
  }
</script>

<Meta
  title="NMCORE"
  description="Boost low-light plant growth and yield with our carbon quantum dot technology, enhancing photosynthesis across UV, VIS, and IR spectrums."
  keywords="carbon quantum dot technology, photosynthesis, low-light plant growth, nanotechnology, agriculture, crop health, yield improvement"
  url="https://www.nmcore.com/"
  image="https://www.nmcore.com/images/BLOOM_product.jpg"
/>

<StructuredData
  data={{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NMCORE, LLC",
    "url": "https://www.nmcore.com/",
    "logo": "https://www.nmcore.com/images/nmcore_logo_onwhite.png",
    "sameAs": [
      // "https://www.facebook.com/yourpage",
      // "https://www.twitter.com/yourprofile",
      // Add other social profiles if applicable
    ]
  }}
/>

<div class="banner-section bg-zinc-50 text-zinc-800 text-left py-16 px-4 md:px-8 mt-16 h-[800px] bg-cover bg-center bg-no-repeat" style="background-image: url({backgroundImageUrl});">
  <div class="container mx-auto flex flex-col gap-8 py-8 px-4 md:px-8 max-w-screen-xl">
    <div class="text-column flex-2/3 text-left text-xl sm:text-xl md:text-2xl leading-relaxed pr-4 md:pr-4 select-none">
      <h1 class="text-3xl md:text-4xl font-semibold mb-8" style="color: #39B54A;">BLOOM</h1>
      <h2 class="text-2xl md:text-3xl font-semibold mb-2 text-zinc-400">GROW IN THE DARK</h2>
      <h2 class="text-2xl md:text-3xl font-semibold mb-8 text-zinc-400">30% MORE YIELD</h2>
      <Button   class="bg-zinc-300 text-zinc-800 py-2 px-4 rounded hover:bg-[#39B54A] hover:text-white" onclick={shopNow}>SHOP NOW</Button>
    </div>
  </div>
</div>