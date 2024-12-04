<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let largePhoto = $state<string>('');
  let photos = $state([
    '/images/BLOOM_product.jpg',
    '/images/BLOOM_particle.jpg',
    '/images/BLOOM_thylakloid.jpg',
  ]);
  let price = $state<number>(9.99);
  let size = $state<string>('Spray');

  onMount(() => {
    largePhoto = photos[0]; // Set the initial large photo
    console.log('Initial large photo:', largePhoto);
  });

  function selectPhoto(photo: string): void {
    largePhoto = photo;
    console.log('Selected photo:', largePhoto);
  }

  function selectSize(selectedSize: string): void {
    size = selectedSize;
    price = selectedSize === 'Refill' ? 19.99 : 9.99;
  }
</script>

<style>
  .large-photo {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  .thumbnail {
    cursor: pointer;
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin: 5px;
  }
  .thumbnails {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>

<main class="container mx-auto py-8">
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2">
      <div class="text-center">
        <img src={largePhoto} alt="Large Product Photo" class="large-photo" onerror={() => console.error('Error loading large photo:', largePhoto)} />
      </div>

      <div class="thumbnails mt-8">
        {#each photos as photo, i (i)}
          <button type="button" class="thumbnail-button" onclick={() => selectPhoto(photo)}>
            <img src={photo} alt={`Product Photo ${i + 1}`} class="thumbnail" onerror={() => console.error('Error loading thumbnail:', photo)} />
          </button>
        {/each}
      </div>
    </div>

    <div class="w-full md:w-1/2 p-4">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-2">Photosynthesis Enhancer</h1>
        <p class="text-xl text-gray-700 mb-4">${price.toFixed(2)}</p>
        <p class="text-gray-600 mb-2">User rating: 5-star (100 ratings)</p>
        <a href="#ratings" class="text-blue-500 underline mb-4 block">See all ratings</a>

        <h2 class="text-lg font-semibold mb-2">SIZE</h2>
        <div class="flex justify-center space-x-2 mb-4">
          <Button class="size-button" onclick={() => selectSize('Spray')}>Spray</Button>
          <Button class="size-button" onclick={() => selectSize('Refill')}>Refill</Button>
        </div>

        <Button class="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2">ADD TO CART</Button>
        <Button class="w-full bg-purple-500 text-white py-2 px-4 rounded">Buy with Shop Pay</Button>
      </div>
    </div>
  </div>
</main>