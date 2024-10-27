<script lang="ts">
  import Benefits from './Benefits.svelte';
  import Faq from './Faq.svelte';
</script>

<div class="container mx-auto flex flex-col gap-8 py-32 px-4 md:px-8 max-w-screen-xl">
    <h1 class="text-3xl md:text-5xl">
      nmcore <span class="font-din2014-bold">BLOOM</span>
    </h1>
    <div class="columns flex flex-col md:flex-row gap-0"> <!-- Adjusted gap to 0 -->
      <div class="text-column flex-1 text-left text-xl sm:text-2xl md:text-2xl leading-relaxed pr-4 md:pr-4"> <!-- Increased text size at sm breakpoint -->
        <p>
          <span class="font-din2014-bold">BLOOM</span> is a groundbreaking photosynthesis enhancer developed using cutting-edge nanotechnology. This biocompatible organic compound, similar to chlorophyll, significantly boosts photosynthesis in plants. When applied to leaves, <span class="font-din2014-bold">BLOOM</span> integrates with chloroplasts, optimizing photon absorption and electron transfer, enhancing the natural process of photosynthesis.
          <br><br>
          This results in up to 3X increase in photosynthetic efficiency.
        </p>
      </div>
      <div class="image-column flex-1 flex justify-center items-center pl-4 md:pl-8"> <!-- Added padding-left -->
        <img src="/images/product.jpg" alt="About BLOOM" class="max-w-full sm:max-w-xs md:max-w-xs lg:max-w-xs"> <!-- Adjusted max-width for different breakpoints -->
      </div>
    </div>
  </div>

<div class="benefits-section mt-16">
  <Benefits />
</div>

<!-- Render the FAQ component -->
<Faq />