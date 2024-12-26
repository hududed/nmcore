<script lang="ts">
  import Carousel from '$lib/components/Carousel.svelte';
  import ProductDetails from '$lib/components/ProductDetails.svelte';
  import Thumbnail from '$lib/components/Thumbnail.svelte';
  import { largePhoto } from '$lib/stores/productStore';
  import type { CloudinaryImage, Product } from '$lib/types';
  import { getCloudinaryId } from '$lib/utils/images';
  import { onMount } from 'svelte';
  import { CldImage } from 'svelte-cloudinary';

  const { data } = $props<{ data: { product: Product } }>();

  // Extract cloudinaryId for main image
  const initialMainImageSrc =
    getCloudinaryId(data.product.productSizes[0]?.mainImage.cloudinaryId) ||
    getCloudinaryId(data.product.images[0]?.cloudinaryId);
  
  // Local reactive state for the large photo
  let largePhotoSrc = $state<string | undefined>(initialMainImageSrc);

  onMount(() => {
    largePhoto.set(initialMainImageSrc);
  });

  $effect(() => {
    const unsubscribe = largePhoto.subscribe(value => {
      largePhotoSrc = value;
    });
    return () => unsubscribe();
  });

  function handleThumbnailClick(cloudinaryId: string) {
    largePhoto.set(cloudinaryId);
  }
</script>

<main class="container py-8 mt-24 md:mt-32">
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2 md:sticky md:top-24">
      <!-- Main Product Image -->
      <div class="text-center static-photo hidden md:block">
        {#if largePhotoSrc}
          <CldImage
            src={largePhotoSrc}
            width={1000}
            height={1000}
            objectFit="cover"
            alt={data.product.title}
            class="w-full max-h-96 mx-auto object-contain"
          />
        {:else}
          <p class="text-gray-500">Image not available</p>
        {/if}
      </div>

      <!-- Thumbnails -->
      <div class="hidden md:block">
        <Thumbnail
          images={data.product.images.map((img: CloudinaryImage) => getCloudinaryId(img.cloudinaryId))}
          onThumbnailClick={handleThumbnailClick}
        />
      </div>

      <!-- Carousel for Mobile -->
      <div class="block md:hidden mt-8">
        <Carousel
          images={data.product.images.map((image: CloudinaryImage) => getCloudinaryId(image.cloudinaryId))}
        />
      </div>
    </div>

    <!-- Product Details -->
    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:max-h-screen">
      <ProductDetails product={data.product} />
    </div>
  </div>
</main>