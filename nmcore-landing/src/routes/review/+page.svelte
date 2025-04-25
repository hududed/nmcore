<script lang="ts">
    //filepath: nmcore-landing/src/routes/review/%2Bpage.svelte
  import { enhance } from '$app/forms';
  import { PUBLIC_CLOUDINARY_API_KEY, PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET } from '$env/static/public';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Ratings } from '@skeletonlabs/skeleton';
  import { CldUploadButton } from 'svelte-cloudinary';
  import StarRateOutlineRounded from '~icons/material-symbols/star-rate-outline-rounded';
  import StarRateRounded from '~icons/material-symbols/star-rate-rounded';

  let { data } = $props<{ data: { validToken: boolean; productId: string, reviewToken: string } }>();

  console.log('🚀 Loaded Page Props:', data );

  let review = $state('');
  let rating = $state(0);
  let useCase = $state('garden');  // default: "garden" or "houseplant"
  let uploadedImages = $state<Array<{ cloudinaryId: string, width: number, height: number }>>([]);

  function iconClick(event: CustomEvent<{ index: number }>): void {
    rating = event.detail.index; // Ratings are 0-indexed, so add 1
  }

  // Called when Cloudinary upload returns a result
  function handleUpload(info: any) {
    if (info.event === 'success') {
      const { public_id, width, height } = info.info;
      uploadedImages = [...uploadedImages, { cloudinaryId: public_id, width, height }];
    }
  }

</script>

{#if data?.validToken}
  <div class="container mx-auto p-4 mt-32">
    <h1 class="text-2xl font-bold mb-4">Leave a Review</h1>
    <form
      method="POST"
      action="?/submitReview"
      use:enhance={
        (_context) => {
          return async (actionResult: any) => {
            console.log("Action result:", actionResult);
          };
        }
      }
    >
      <input type="hidden" name="productId" value={data.productId} />
      <input type="hidden" name="reviewToken" value={data.reviewToken} />
      <input type="hidden" name="rating" value={rating} />
      <!-- Stringify the array of Cloudinary images -->
      <input type="hidden" name="images" value={JSON.stringify(uploadedImages)} />
      <input type="hidden" name="useCase" value={useCase} />

      <!-- Rating Component -->
      <div class="mb-4">
        <label for="rating" class="block mb-1">Rating:</label>
        <Ratings id="rating" bind:value={rating} max={5} interactive on:icon={iconClick}>
          <svelte:fragment slot="empty">
            <StarRateOutlineRounded style="width: 3em; height: 3em;" />
          </svelte:fragment>
          <svelte:fragment slot="full">
            <StarRateRounded style="width: 3em; height: 3em;" />
          </svelte:fragment>
        </Ratings>
      </div>

      <!-- Review Text -->
      <div class="mb-4">
        <label for="review" class="block mb-1">Review:</label>
        <Textarea id="review" name="review" bind:value={review} placeholder="Write your review" class="mb-4"/>
      </div>

      <!-- Use Case Selector -->
      <div class="mb-4">
        <label for="useCase" class="block mb-1">Use Case:</label>
        <select id="useCase" name="useCase" bind:value={useCase}>
          <option value="garden">Garden</option>
          <option value="houseplant">Houseplant</option>
        </select>
      </div>

      <!-- Cloudinary Upload Widget using signed requests -->
      <div class="w-full flex flex-row justify-end mb-4">
        <CldUploadButton
          uploadPreset={PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          signatureEndpoint="/api/sign-cloudinary-params"
          class="px-4 py-2 rounded-lg border-gray-900 bg-zinc-300 text-gray-900 border font-semibold hover:bg-gray-200"
          onUpload={handleUpload}
          config={{
            cloud: {
              cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
              apiKey: PUBLIC_CLOUDINARY_API_KEY,
            },
          }}
        />
      </div>

      <!-- Submit Button -->
      <Button type="submit" class="bg-zinc-800 text-white p-2 rounded">Submit Review</Button>

    </form>
  </div>
{:else}
  <div class="container mx-auto p-4 mt-32">
    <h1 class="text-2xl font-bold mb-4">Invalid or Expired Token</h1>
    <p>Please check your email for the correct review link.</p>
  </div>
{/if}