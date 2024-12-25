<script lang="ts">
    import { CldImage } from 'svelte-cloudinary';

  export let images: string[] = []; // Array of Cloudinary public IDs
  export let useCldImage: boolean = true; // Optional toggle to use CldImage
</script>

<div class="carousel-container mt-8">
  {#each images as cloudinaryId, i (i)}
    <div class="carousel-item w-full max-h-96">
      {#if useCldImage}
        <CldImage
          src={cloudinaryId}
          width={600}
          height={600}
          objectFit="cover"
          alt={`Carousel Photo ${i + 1}`}
          class="w-full max-h-96 mx-auto object-contain"
        />
      {:else}
        <img
          src={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${cloudinaryId}`}
          alt={`Carousel Photo ${i + 1}`}
          class="w-full max-h-96 mx-auto object-contain"
        />
      {/if}
    </div>
  {/each}
</div>
