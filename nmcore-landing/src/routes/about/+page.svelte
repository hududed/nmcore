<script lang="ts">
  import Benefits from './Benefits.svelte';
  import Faq from './Faq.svelte';
  import NotifyForm from "../NotifyForm.svelte";
  import { Button } from "$lib/components/ui/button"; 
</script>


<div class="container mx-auto flex flex-col gap-8 py-32 px-4 md:px-8 max-w-screen-xl">
  <div class="w-full flex flex-col pt-4 px-2">
    <h1 class="text-center font-jura text-5xl pb-8">
      nmcore <span class="font-din2014-bold">BLOOM</span>
    </h1>
  </div>
  <div class="columns flex flex-col md:flex-row gap-0"> <!-- Adjusted gap to 0 -->
    <div class="text-column flex-1 text-left text-xl sm:text-2xl md:text-2xl leading-relaxed pr-4 md:pr-4"> <!-- Increased text size at sm breakpoint -->
      <p>
        <span class="font-din2014-bold">BLOOM</span> is a groundbreaking photosynthesis enhancer developed using cutting-edge nanotechnology. This biocompatible organic compound, similar to chlorophyll, significantly boosts photosynthesis in plants. When applied to leaves, <span class="font-din2014-bold">BLOOM</span> integrates with chloroplasts, optimizing photon absorption and electron transfer, enhancing the natural process of photosynthesis.
        <br><br>
        This results in up to 3X increase in photosynthetic efficiency.
      </p>
    </div>
    <div class="image-column flex-1 flex flex-col justify-center items-center pl-4 md:pl-8"> <!-- Added padding-left and flex-col -->
      <img src="/images/product.jpg" alt="About BLOOM" class="max-w-xs sm:max-w-1/2 md:max-w-xs lg:max-w-xs"> <!-- Adjusted max-width for different breakpoints -->
      <div class="mt-8 flex flex-col items-center gap-4 w-full"> <!-- Stacked buttons and centered them -->
        <Button href="/products/bloom/sell_sheet" variant="default" class="text-lg w-full max-w-xs">Sell Sheet</Button>
        <Button href="/products/bloom/label" variant="default" class="text-lg w-full max-w-xs">General Label</Button>
        <Button href="/products/bloom/sds" variant="default" class="text-lg w-full max-w-xs">General SDS</Button>
      </div>
    </div>
  </div>
</div>

<div class="benefits-section mt-16">
  <Benefits />
</div>

<!-- Render the FAQ component -->
<div class="faq-section mt-32">
<Faq />
</div>

<div class="card #172554 shadow-xl p-10 text-center mt-0">
    <h2 class="text-2xl md:text-3xl mb-4">Join Our Testing/Validation Phase</h2>
    <p class="text-xl sm:text-2xl md:text-2xl mb-8 leading-relaxed">
      We invite you to participate in our testing/validation phase for free. Please provide your contact information below to get started.
    </p>
    <NotifyForm />
  </div>