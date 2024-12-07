<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import type { Product } from '$lib/types';

  export let products: Product[] = [];
</script>

<div class="carousel-container mt-8">
  <Carousel.Root>
    <Carousel.Content>
      {#each products as product}
        {#each product.images as photo, i (i)}
          <Carousel.Item>
            <img src={photo} alt={`Product Photo ${i + 1}`} class="w-full max-h-96 mx-auto object-contain" onerror={() => console.error('Error loading photo:', photo)} />
          </Carousel.Item>
        {/each}
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root>
</div>