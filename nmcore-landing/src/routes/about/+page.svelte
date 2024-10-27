<script lang="ts">
  import Benefits from './Benefits.svelte';
import Faq from './Faq.svelte';
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100vh; 
    padding: 8rem 1rem;
  }

  .columns {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .columns {
      flex-direction: row;
    }
  }

  .text-column {
    flex: 1;
    padding: 1rem;
    font-size: 1.5rem;
    text-align: left; /* Align text to the left */
    white-space: pre-line; /* Preserve whitespace and line breaks */
  }

  .image-column {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .image-column img {
    max-width: 60%;
    height: auto;
  }
</style>

<div class="container">
    <h1 class="text-3xl md:text-5xl">
        <span style="font-family: 'DIN2014'; font-weight: normal;">nmcore</span>
        <span style="font-family: 'DIN2014'; font-weight: bold;"> BLOOM</span>
      </h1>
  <div class="columns">
    <div class="text-column">
        <p>
          <span style="font-family: 'DIN2014'; font-weight: bold;">BLOOM</span> is a groundbreaking photosynthesis enhancer developed using cutting-edge nanotechnology. This biocompatible organic compound, similar to chlorophyll, significantly boosts photosynthesis in plants. When applied to leaves, <span style="font-family: 'DIN2014'; font-weight: bold;">BLOOM</span> integrates with chloroplasts, optimizing photon absorption and electron transfer, enhancing the natural process of photosynthesis.
          <br><br>
          This results in up to 3X increase in photosynthetic efficiency.
        </p>
      </div>
    <div class="image-column">
      <img src="/images/product.jpg" alt="About BLOOM">
    </div>
  </div>
</div>

<Benefits />

<!-- Render the FAQ component -->
<Faq />
