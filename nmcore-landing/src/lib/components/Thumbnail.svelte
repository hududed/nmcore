<script lang="ts">
  import { largePhoto } from '$lib/stores/productStore';
  import type { Product } from '$lib/types';

  export let products: Product[] = [];
</script>

<div class="thumbnails mt-8 flex justify-center flex-wrap">
  {#each products as product}
    {#each product.images as photo, i (i)}
      <button type="button" class="cursor-pointer w-24 h-24 object-contain m-1" onclick={() => largePhoto.set(photo)} onkeydown={(e) => e.key === 'Enter' && largePhoto.set(photo)}>
        <img src={photo} alt={`Product Photo ${i + 1}`} class="w-full h-full object-contain" onerror={() => console.error('Error loading thumbnail:', photo)} />
      </button>
    {/each}
  {/each}
</div>