<script lang="ts">
  import { CldImage } from 'svelte-cloudinary';

  export let images: string[] = []; // Array of Cloudinary public IDs
  export let useCldImage: boolean = true; // Toggle to use CldImage or plain img
  export let cloudName: string; // Cloudinary cloud name (required for plain img)
</script>

<div class="thumbnails mt-8 flex justify-center flex-wrap">
  {#each images as cloudinaryId (cloudinaryId)}
    {#if useCldImage}
      <CldImage
        src={cloudinaryId}
        width={150}
        height={150}
        objectFit="contain"
        alt="Thumbnail"
        class="w-24 h-24 object-contain m-1"
      />
    {:else}
      <img
        src={`https://res.cloudinary.com/${cloudName}/image/upload/${cloudinaryId}`}
        alt="Thumbnail"
        class="w-24 h-24 object-contain m-1"
      />
    {/if}
  {/each}
</div>
