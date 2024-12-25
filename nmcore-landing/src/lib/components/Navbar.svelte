<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { cartOpen, cartStats } from '$lib/stores/cartStore';
  import ShoppingCart from 'phosphor-svelte/lib/ShoppingCart';

  let mobileMenuOpen = false;

  function toggleCart() {
    cartOpen.update(open => !open);
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function navigateTo(path: string) {
    goto(path);
    mobileMenuOpen = false;
  }
</script>

<nav class="bg-white border-b border-gray-200 py-2 lg:py-4 w-full fixed top-0 left-0 z-50">
  <div class="container flex justify-between items-center">
    <div class="flex items-center space-x-4">
      <Button variant="outline" class="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none" onclick={toggleMobileMenu}>
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </Button>
      <img src="/images/nmcore_logo.jpg" alt="NMCore BLOOM Logo" class="w-36 lg:w-48" />
    </div>
    <div class="hidden md:flex space-x-4 text-sm lg:text-base">
      <a href="/products/nm_bloom_household" class="text-gray-700 hover:text-gray-900">SHOP</a>
      <a href="/technology" class="text-gray-700 hover:text-gray-900">TECHNOLOGY</a>
      <a href="/about" class="text-gray-700 hover:text-gray-900">ABOUT</a>
    </div>
    <div class="flex items-center space-x-4">
      <Button variant="outline" class="flex items-center rounded-full px-4 py-2 text-zinc-800 hover:bg-zinc-500" onclick={toggleCart}>
        <ShoppingCart class="mr-2 size-5" />
        <span>({$cartStats.quantity})</span>
      </Button>
    </div>
  </div>
</nav>

<Sheet.Root open={mobileMenuOpen} onOpenChange={toggleMobileMenu}>
  <Sheet.Content side="left" class="w-3/5 max-w-lg max-h-[calc(100vh-100px)] overflow-y-auto">
    <Sheet.Description>
      <div class="flex flex-col space-y-4">
        <a href="/products/bloom" class="text-gray-700 hover:text-gray-900" onclick={() => navigateTo('/products/bloom')}>SHOP</a>
        <a href="/technology" class="text-gray-700 hover:text-gray-900" onclick={() => navigateTo('/technology')}>TECHNOLOGY</a>
        <a href="/about" class="text-gray-700 hover:text-gray-900" onclick={() => navigateTo('/about')}>ABOUT</a>
      </div>
    </Sheet.Description>
  </Sheet.Content>
</Sheet.Root>