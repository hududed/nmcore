<script lang="ts">
  // filepath: nmcore-landing/src/routes/products/%5Bid%5D/%2Bpage.svelte
  import Carousel from '$lib/components/Carousel.svelte';
  import ProductDetails from '$lib/components/ProductDetails.svelte';
  import Meta from '$lib/components/seo/Meta.svelte';
  import StructuredData from '$lib/components/seo/StructuredData.svelte';
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

<!-- Meta Tags for SEO and Social Sharing -->
<Meta
  title={data.product.title}
  description={data.product.desc}
  keywords={data.product.tags}
  url={`https://www.nmcore.com/products/${data.product.id}`}
  image={data.product.thumbnail}
/>

<!-- Structured Data for Product -->
<StructuredData
  data={{
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": data.product.title,
    "image": [data.product.thumbnail],
    "description": data.product.desc,
    "sku": data.product.productSizes[0]?.sku,
    "brand": {
      "@type": "Brand",
      "name": data.product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.nmcore.com/products/${data.product.id}`,
      "priceCurrency": "USD",
      "price": (data.product.productSizes[0]?.price || 0) / 100,
      "priceValidUntil": "2025-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  }}
/>

<main class="container py-8 mt-12 md:mt-16 bg-zinc-300">
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



<!-- TODO: Updated showing 1. image(s) fetched from product.reviews.images (CldImage links, can be empty) 2. Rating (product.reviews.rating), 3. Date (re) 4. Reviews (prdocuts.reviews.review)-->
<!-- Reviews Section -->
<!-- <div id="reviews" class="container mx-auto p-4 mt-8 max-w-screen-xl bg-zinc-300">
  <h2 class="text-2xl font-bold mb-4 text-zinc-600">Reviews</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each data.product.reviews as review}
      <Card.Root class="bg-zinc-100 p-4 rounded-lg border border-zinc-600">
        <Card.Header class="p-4 text-left">
          <div class="flex items-center mb-2">
            <StarRateRounded style="width: 1.5em; height: 1.5em;" />
            <span class="ml-1">{review.rating}</span>
          </div>
          <div class="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
        </Card.Header>
        <Card.Content class="p-4 text-left">
          <p>{review.review}</p>
          {#if review.images && review.images.length > 0}
            <div class="mt-4 grid grid-cols-2 gap-2">
              {#each review.images as image}
                <CldImage src={image.cloudinaryId} width="100" height="100" crop="fill" class="rounded-lg" />
              {/each}
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    {/each}
  </div>
</div> -->