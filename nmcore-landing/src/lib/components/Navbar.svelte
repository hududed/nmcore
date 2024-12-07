<script lang="ts">
  import { cartOpen, cartStats } from '$lib/stores/cartStore';
  import ShoppingCart from 'phosphor-svelte/lib/ShoppingCart';

  function toggleCart() {
    cartOpen.update(open => !open);
  }
</script>

<nav class="bg-gray-800 p-4">
  <div class="container mx-auto flex justify-between items-center">
    <div class="text-white text-lg font-bold">NMCore</div>
    <div class="relative">
      <button
        onclick={toggleCart}
        class="flex items-center rounded-full bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
      >
        <ShoppingCart class="mr-2 size-5" />
        <span>({$cartStats.quantity})</span>
      </button>
    </div>
  </div>
</nav>