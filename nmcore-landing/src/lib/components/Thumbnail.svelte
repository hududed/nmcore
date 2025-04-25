<script lang="ts">
  import { CldImage } from 'svelte-cloudinary';

  // “images” and “onThumbnailClick” come in via props
  let { images, onThumbnailClick } = $props<{
    images: string[];
    onThumbnailClick: (cloudinaryId: string) => void;
  }>();
</script>

<!--
  - grid-cols-4: four columns
  - gap-2: 8px gap (you can tweak)
  - w-full: span 100% of the parent (same as your large image)
-->
<div class="thumbnails mt-8 grid grid-cols-4 gap-8 w-full">
  {#each images as cloudinaryId}
    <button 
      class="w-full aspect-square overflow-hidden"
      onclick={() => onThumbnailClick(cloudinaryId)}
      aria-label="Thumbnail"
    >
      <CldImage
        src={cloudinaryId}
        width={400}  
        height={400}
        objectFit="contain"
        class="w-full h-full"
        alt="Thumbnail"
        on:error={() => console.error('Failed to load thumbnail:', cloudinaryId)}
      />
    </button>
  {/each}
</div>
