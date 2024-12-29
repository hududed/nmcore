<script lang="ts">
  import { CldImage } from 'svelte-cloudinary';

  let { images, onThumbnailClick } = $props<{
    images: string[];
    onThumbnailClick: (cloudinaryId: string) => void;
  }>();
  // console.log('Thumbnail images:', images);

</script>

<div class="thumbnails mt-8 flex justify-center flex-wrap">
  {#each images as cloudinaryId (cloudinaryId)}
    <CldImage
      src={cloudinaryId}
      width={150}
      height={150}
      objectFit="contain"
      alt="Thumbnail"
      class="w-24 h-24 object-contain m-1"
      role="button"
      aria-label="Thumbnail image"
      onclick={() => onThumbnailClick(cloudinaryId)}
    />
  {/each}
</div>