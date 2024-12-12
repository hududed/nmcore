<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { addToCart, cartOpen, cartProducts, cartStats, updateQuantity } from '$lib/stores/cartStore';
  import { size } from '$lib/stores/productStore';
  import type { CustomerInfo, Product } from '$lib/types';
  import { goToCheckout } from '$lib/utils/helpers';

  export let products: Product[] = [];
  export let open: boolean;

  let customerInfo: CustomerInfo = {
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  };

  function toggleCart() {
    cartOpen.update(open => !open);
  }

  function handleCheckout() {
    goToCheckout(customerInfo);
  }
</script>

<Sheet.Root open={open} onOpenChange={toggleCart}>
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
          {#each products as product}
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
        <button class="bg-green-500 text-white p-4 rounded mt-4 w-full text-center" onclick={handleCheckout}>Checkout</button>
      </div>
    {/if}
  </Sheet.Content>
</Sheet.Root>