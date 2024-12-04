<script lang="ts">
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
  .product-container {
    display: flex;
    flex-wrap: wrap;
  }
  .product-images {
    flex: 1;
    max-width: 50%;
  }
  .product-details {
    flex: 1;
    max-width: 50%;
    padding: 20px;
  }
  .size-button {
    margin: 5px;
    padding: 10px 20px;
    cursor: pointer;
  }
  .add-to-cart-button, .shop-pay-button {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 10px 20px;
    cursor: pointer;
  }
</style>

<main class="container mx-auto py-8">
  <div class="product-container">
    <div class="product-images">
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

    <div class="product-details">
      <h1>Photosynthesis Enhancer</h1>
      <p>${price.toFixed(2)}</p>
      <p>User rating: 5-star (100 ratings)</p>
      <a href="#ratings">See all ratings</a>

      <h2>SIZE</h2>
      <button class="size-button" onclick={() => selectSize('Spray')}>Spray</button>
      <button class="size-button" onclick={() => selectSize('Refill')}>Refill</button>

      <button class="add-to-cart-button">ADD TO CART</button>
      <button class="shop-pay-button">Buy with Shop Pay</button>
    </div>
  </div>
</main>