<script lang="ts">
  import Carousel from '$lib/components/Carousel.svelte';
  import ProductDetails from '$lib/components/ProductDetails.svelte';
  import Thumbnail from '$lib/components/Thumbnail.svelte';
  import type { Product } from '$lib/types';
  import { CldImage } from 'svelte-cloudinary';

  export let data: {
    product: Product;
  };

  // Extract cloudinaryId for main image
  const mainImageSrc =
    data.product.productSizes[0]?.mainImage.cloudinaryId || data.product.images[0].cloudinaryId;
</script>

<main class="container py-8 mt-24 md:mt-32">
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2 md:sticky md:top-24">
      <!-- Main Product Image -->
      <div class="text-center static-photo hidden md:block">
        <CldImage
          src={mainImageSrc}
          width={1000}
          height={1000}
          objectFit="cover"
          alt={data.product.title}
          class="w-full max-h-96 mx-auto object-contain"
        />
      </div>

      <!-- Thumbnails -->
      <div class="hidden md:block">
        <Thumbnail
          images={data.product.images.map((img) => img.cloudinaryId)}
          useCldImage={true}
          cloudName="nmcore"
        />

      </div>

      <!-- Carousel for Mobile -->
      <div class="block md:hidden mt-8">
        <Carousel
          images={data.product.images.map((image) => image.cloudinaryId)}
          useCldImage={true}
        />
      </div>

    </div>

    <!-- Product Details -->
    <div class="w-full md:w-1/2 p-4 md:overflow-y-auto md:max-h-screen">
      <ProductDetails product={data.product} />
    </div>
  </div>
</main>
