<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { largePhoto } from '$lib/stores/productStore';
  import { CldImage } from 'svelte-cloudinary';

  export let images: string[] = []; // Array of Cloudinary public IDs

  function handleCarouselClick(cloudinaryId: string) {
    largePhoto.set(cloudinaryId);
  }

  function handleKeyDown(event: KeyboardEvent, cloudinaryId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      largePhoto.set(cloudinaryId);
    }
  }
</script>

<Carousel.Root>
  <Carousel.Content>
    {#each images as cloudinaryId, i (i)}
      <Carousel.Item>
        <button
          type="button"
          class="carousel-item w-full max-h-96"
          aria-label={`Carousel Photo ${i + 1}`}
          on:click={() => handleCarouselClick(cloudinaryId)}
          on:keydown={(event) => handleKeyDown(event, cloudinaryId)}
        >
          <CldImage
            src={cloudinaryId}
            width={600}
            height={600}
            objectFit="cover"
            alt={`Carousel Photo ${i + 1}`}
            class="w-full max-h-96 mx-auto object-contain"
          />
        </button>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
</Carousel.Root>