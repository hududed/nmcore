<script lang="ts">
  // filepath: nmcore-landing/src/lib/components/Cart.svelte
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { cartOpen, cartProducts, cartStats, updateQuantity } from '$lib/stores/cartStore';
  import type { Product } from '$lib/types';
  import { goToCheckout } from '$lib/utils/checkout';
  import { CldImage } from 'svelte-cloudinary';
 // Import the CldImage component

  const { open, products } = $props<{ open: boolean, products: Product[] }>(); // Use $props to define the open and products props
  // export let products: Product[];

  function toggleCart() {
    cartOpen.update(open => !open);
  }

  function handleCheckout() {
    goToCheckout();
  }
</script>

<Sheet.Root open={open} onOpenChange={toggleCart}>
  <Sheet.Content class="w-3/5 max-w-lg max-h-[calc(100vh-100px)] overflow-y-auto bg-zinc-100">
    <Sheet.Header>
      <Sheet.Title>Shopping Cart</Sheet.Title>
    </Sheet.Header>
    <Sheet.Description>
      {#if $cartProducts.length > 0}
        {#each $cartProducts as item, index}
          <div class="flex items-center mb-4">
            <CldImage
              src={item.mainImage.cloudinaryId}
              width={150}
              height={150}
              objectFit="contain"
              alt="Product Thumbnail"
              class="w-24 h-24 object-contain m-1"
            />
            <div class="ml-4">
              <p class="font-bold">{item.product.title}</p>
              <p>Size: {item.size}</p>
              <div class="flex items-center">
                <button class="bg-zinc-300 border-none p-2 cursor-pointer" onclick={() => updateQuantity(item.id, -1)}>-</button>
                <span class="mx-2 w-8 text-center">{item.quantity}</span>
                <button class="bg-zinc-300 border-none p-2 cursor-pointer" onclick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <p>Total: ${(item.price / 100 * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        {/each}
      {:else}
        <p>Your cart is currently empty</p>
      {/if}
    </Sheet.Description>
    {#if $cartProducts.length > 0}
      <div class="sticky bottom-0 bg-zinc-300 p-4 border-t border-gray-200 flex flex-col items-center">
        <span>Subtotal: ${($cartStats.total / 100).toFixed(2)}</span>
        <p class="text-gray-600 text-sm">Shipping, taxes, and discount codes calculated at checkout.</p>
        <button style="background-color: #39B54A;"  class="text-white p-4 rounded mt-4 w-full text-center" onclick={handleCheckout}>Checkout</button>
      </div>
    {/if}
  </Sheet.Content>
</Sheet.Root>