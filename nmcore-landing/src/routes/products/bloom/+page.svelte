<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
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
  let quantity = $state<number>(1);
  let cartItems = $state<{ name: string; size: string; price: number; quantity: number; photo: string }[]>([]);
  let subtotal = $state<number>(0);

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
    largePhoto = selectedSize === 'Refill' ? photos[1] : photos[0];
  }

  function increaseQuantity(index: number): void {
    cartItems[index].quantity += 1;
    updateSubtotal();
  }

  function decreaseQuantity(index: number): void {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    } else {
      cartItems.splice(index, 1);
    }
    updateSubtotal();
  }

  function addToCart(): void {
    cartItems.push({ name: 'Photosynthesis Enhancer', size, price, quantity, photo: photos[0] });
    updateSubtotal();
  }

  function addRefillToCart(): void {
    cartItems.push({ name: 'Photosynthesis Enhancer Refill', size: 'Refill', price: 19.99, quantity: 1, photo: photos[1] });
    updateSubtotal();
  }

  function updateSubtotal(): void {
    subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  function goToCheckout(): void {
    goto('/checkouts');
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
  .quantity-chooser {
    display: flex;
    align-items: center;
  }
  .quantity-button {
    background-color: #e2e8f0;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  .quantity-display {
    margin: 0 10px;
    width: 30px;
    text-align: center;
  }
  .sheet-content {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
  .sheet-footer {
    position: sticky;
    bottom: 0;
    background-color: white;
    padding: 10px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .checkout-button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    width: 100%;
    text-align: center;
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
          <button type="button" class="thumbnail-button" onclick={() => selectPhoto(photo)} onkeydown={(e) => e.key === 'Enter' && selectPhoto(photo)}>
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

        <Sheet.Root>
          <Sheet.Trigger class="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2" onclick={addToCart}>ADD TO CART</Sheet.Trigger>
          <Sheet.Content>
            <Sheet.Header>
              <Sheet.Title>Shopping Cart</Sheet.Title>
            </Sheet.Header>
            <Sheet.Description class="sheet-content">
              {#each cartItems as item, index}
                <div class="flex items-center mb-4">
                  <img src={item.photo} alt="Product Thumbnail" class="thumbnail" />
                  <div class="ml-4">
                    <p class="font-bold">{item.name}</p>
                    <p>Size: {item.size}</p>
                    <div class="quantity-chooser">
                      <button class="quantity-button" onclick={() => decreaseQuantity(index)}>-</button>
                      <span class="quantity-display">{item.quantity}</span>
                      <button class="quantity-button" onclick={() => increaseQuantity(index)}>+</button>
                    </div>
                    <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              {/each}
              <div class="mt-4">
                <p class="font-bold">DON'T FORGET TO REFILL</p>
                <div class="flex items-center mt-2">
                  <img src={photos[1]} alt="Refill Product Thumbnail" class="thumbnail" />
                  <div class="ml-4">
                    <p class="font-bold">Photosynthesis Enhancer Refill</p>
                    <p>$19.99</p>
                    <Button class="size-button" onclick={addRefillToCart}>ADD TO CART</Button>
                  </div>
                </div>
              </div>
            </Sheet.Description>
            <div class="sheet-footer">
              <span>Subtotal: ${subtotal.toFixed(2)}</span>
              <p class="text-gray-600 text-sm">Shipping, taxes, and discount codes calculated at checkout.</p>
              <button class="checkout-button" onclick={goToCheckout}>Checkout</button>
            </div>
          </Sheet.Content>
        </Sheet.Root>
      </div>
    </div>
  </div>
</main>