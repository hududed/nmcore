<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import type { CartProduct, Product } from '$lib/types';
  import ShoppingCart from 'phosphor-svelte/lib/ShoppingCart';
  import { onMount } from 'svelte';
  import { derived, writable } from 'svelte/store';

  let { data } = $props();

  let largePhoto = writable<string>('');
  let selectedProduct = writable<Product>(data.products[0]);
  let size = writable<string>('Spray');

  let cartOpen = writable(false);
  let cartProducts = writable<CartProduct[]>([]);

  const cartStats = derived(cartProducts, ($cartProducts) => {
    let quantity = 0;
    let total = 0;
    for (const product of $cartProducts) {
      quantity += product.quantity;
      total += product.product.price * product.quantity;
    }
    return {
      quantity,
      total
    };
  });

  const qualifiesForFreeShipping = derived(cartStats, $cartStats => $cartStats.total >= 50);

  let freeShippingAlertCount = 0;

  qualifiesForFreeShipping.subscribe(value => {
    if (freeShippingAlertCount > 0) return;
    if (value) {
      alert('You have qualified for free shipping!');
      freeShippingAlertCount++;
    }
  });

  function updateQuantity(id: string, delta: number) {
    cartProducts.update(products => {
      const index = products.findIndex(product => product.id === id);
      if (index !== -1) {
        products[index].quantity += delta;
        if (products[index].quantity <= 0) {
          products.splice(index, 1);
        }
      }
      return [...products];
    });
  }

  onMount(() => {
    largePhoto.set(data.products[0].images[0]); // Set the initial large photo
  });

  function selectPhoto(photo: string): void {
    largePhoto.set(photo);
  }

  function selectSize(selectedSize: string): void {
    size.set(selectedSize);
    const product = selectedSize === 'Refill' ? data.products[1] : data.products[0];
    selectedProduct.set(product);
    largePhoto.set(product.images[0]);
  }

  function goToCheckout(): void {
    goto('/checkouts');
  }

  function toggleCart() {
    cartOpen.update(open => !open);
  }

  function addToCart(product: Product) {
    cartProducts.update(products => {
      const index = products.findIndex(p => p.product.id === product.id);
      if (index !== -1) {
        products[index].quantity += 1;
      } else {
        products.push({
          id: crypto.randomUUID(),
          quantity: 1,
          product: product
        });
      }
      return [...products];
    });
    cartOpen.set(true);
  }
</script>

<style>
  @media (max-width: 768px) {
    .carousel-container {
      display: block;
    }
    .thumbnails, .static-photo {
      display: none;
    }
  }
  @media (min-width: 769px) {
    .carousel-container {
      display: none;
    }
    .static-photo {
      display: block;
    }
  }
</style>

<div class="flex items-center bg-gray-300 p-4">
  <span class="text-lg font-bold">NMCore</span>
  <div class="relative ml-auto flex items-center">
    <button
      onclick={toggleCart}
      class="flex items-center rounded-full bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
    >
      <ShoppingCart class="mr-2 size-5" />
      <span>({$cartStats.quantity})</span>
    </button>
  </div>
</div>

<main class="container mx-auto py-8">
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/2">
      <div class="text-center static-photo">
        <img src={$largePhoto} class="w-full max-h-96 mx-auto object-contain" alt="Large product photo" onerror={() => console.error('Error loading large photo:', $largePhoto)} />
      </div>

      <div class="carousel-container mt-8">
        <Carousel.Root>
          <Carousel.Content>
            {#each data.products as product}
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

      <div class="thumbnails mt-8 flex justify-center flex-wrap">
        {#each data.products as product}
          {#each product.images as photo, i (i)}
            <button type="button" class="cursor-pointer w-24 h-24 object-contain m-1" onclick={() => selectPhoto(photo)} onkeydown={(e) => e.key === 'Enter' && selectPhoto(photo)}>
              <img src={photo} alt={`Product Photo ${i + 1}`} class="w-full h-full object-contain" onerror={() => console.error('Error loading thumbnail:', photo)} />
            </button>
          {/each}
        {/each}
      </div>
    </div>

    <div class="w-full md:w-1/2 p-4">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-2">{$selectedProduct.title}</h1>
        <p class="text-xl text-gray-700 mb-4">${$selectedProduct.price.toFixed(2)}</p>
        <p class="text-gray-600 mb-2">User rating: {$selectedProduct.rating}-star ({$selectedProduct.reviews.length} ratings)</p>
        <a href="#ratings" class="text-blue-500 underline mb-4 block">See all ratings</a>

        <h2 class="text-lg font-semibold mb-2">SIZE</h2>
        <div class="flex justify-center space-x-2 mb-4">
          <Button class="size-button" onclick={() => selectSize('Spray')}>Spray</Button>
          <Button class="size-button" onclick={() => selectSize('Refill')}>Refill</Button>
        </div>

        <Button class="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2" onclick={() => addToCart($selectedProduct)}>ADD TO CART</Button>
      </div>
    </div>
  </div>
</main>

<Sheet.Root open={$cartOpen} onOpenChange={toggleCart}>
  <Sheet.Content class="w-3/5 max-w-lg max-h-[calc(100vh-100px)] overflow-y-auto">
    <Sheet.Header>
      <Sheet.Title>Shopping Cart</Sheet.Title>
    </Sheet.Header>
    <Sheet.Description>
      {#if $cartProducts.length > 0}
        {#each $cartProducts as item, index}
          <div class="flex items-center mb-4">
            <img src={item.product.thumbnail} alt="Product Thumbnail" class="w-24 h-24 object-contain m-1" />
            <div class="ml-4">
              <p class="font-bold">{item.product.title}</p>
              <p>Size: {$size}</p>
              <div class="flex items-center">
                <button class="bg-gray-200 border-none p-2 cursor-pointer" onclick={() => updateQuantity(item.id, -1)}>-</button>
                <span class="mx-2 w-8 text-center">{item.quantity}</span>
                <button class="bg-gray-200 border-none p-2 cursor-pointer" onclick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <p>Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        {/each}
        <div class="mt-4">
          <p class="font-bold">YOU'LL ALSO LOVE</p>
          {#each data.products as product}
            <div class="flex items-center mt-2">
              <img src={product.images[0]} alt="{product.title} Thumbnail" class="w-24 h-24 object-contain m-1" />
              <div class="ml-4">
                <p class="font-bold">{product.title}</p>
                <p>${product.price.toFixed(2)}</p>
                <Button class="size-button" onclick={() => addToCart(product)}>ADD TO CART</Button>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p>Your cart is currently empty</p>
      {/if}
    </Sheet.Description>
    {#if $cartProducts.length > 0}
      <div class="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex flex-col items-center">
        <span>Subtotal: ${$cartStats.total.toFixed(2)}</span>
        <p class="text-gray-600 text-sm">Shipping, taxes, and discount codes calculated at checkout.</p>
        <button class="bg-green-500 text-white p-4 rounded mt-4 w-full text-center" onclick={goToCheckout}>Checkout</button>
      </div>
    {/if}
  </Sheet.Content>
</Sheet.Root>