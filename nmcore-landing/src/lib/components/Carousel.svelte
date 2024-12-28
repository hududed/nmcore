<script lang="ts">
  import { type CarouselAPI } from "$lib/components/ui/carousel/context.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { largePhoto } from '$lib/stores/productStore';
  import { CldImage } from 'svelte-cloudinary';

  const { images } = $props<{ images: string[] }>(); // Array of Cloudinary public IDs

  let api = $state<CarouselAPI>();
  let currentImage = $state<string | undefined>(images[0]);

  $effect(() => {
    if (api) {
      api.on("select", () => {
        const selectedIndex = api.selectedScrollSnap();
        currentImage = images[selectedIndex];
        largePhoto.set(currentImage);
      });
    }
  });

  $effect(() => {
    const unsubscribe = largePhoto.subscribe(value => {
      currentImage = value;
      if (api) {
        const index = images.indexOf(value);
        if (index !== -1) {
          api.scrollTo(index);
        }
      }
    });
    return () => unsubscribe();
  });

  function handleCarouselClick(cloudinaryId: string) {
    largePhoto.set(cloudinaryId);
  }
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
  <Carousel.Content>
    {#each images as cloudinaryId, i (i)}
      <Carousel.Item>
        <button
          type="button"
          class="carousel-item w-full max-h-96"
          aria-label={`Carousel Photo ${i + 1}`}
          onclick={() => handleCarouselClick(cloudinaryId)}
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