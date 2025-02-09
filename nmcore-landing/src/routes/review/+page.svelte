<script lang="ts">
    //filepath: nmcore-landing/src/routes/review/%2Bpage.svelte
  import { enhance } from '$app/forms';
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Ratings } from '@skeletonlabs/skeleton';
  import StarRateOutlineRounded from '~icons/material-symbols/star-rate-outline-rounded';
  import StarRateRounded from '~icons/material-symbols/star-rate-rounded';

  let { data } = $props<{ data: { validToken: boolean; productId: string, reviewToken: string } }>();

  console.log('🚀 Loaded Page Props:', data );

  let review = $state('');
  let rating = $state(0);

  function iconClick(event: CustomEvent<{ index: number }>): void {
    rating = event.detail.index; // Ratings are 0-indexed, so add 1
  }

</script>

<!-- TODO: Interactive dialog with next/back/skip buttons
1. Rating -> reviewTokens.rating and products/[id]/ratings
2. useCase (low-light houseplants, lush gardens) -> products/[id]/useCase (garden or houseplant)
3. Show it Off ! (Add photos upload to Cloudinary with CldUploadWidget) -> reviewTokens.images (Cloudinary image IDs)
3. Tell us more! (reviews) -> reviewTokens.reviews  -->
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
      <Ratings bind:value={rating} max={5} interactive on:icon={iconClick}>
        <svelte:fragment slot="empty">
          <StarRateOutlineRounded style="width: 3em; height: 3em;" />  
        </svelte:fragment>
        <svelte:fragment slot="full">
          <StarRateRounded style="width: 3em; height: 3em;"/>
        </svelte:fragment>
      </Ratings>
      <Textarea name="review" bind:value={review} placeholder="Write your review" class="mb-4"/>
      <Button type="submit" class="bg-zinc-800 text-white p-2 rounded">Submit Review</Button>
    </form>
  </div>
{:else}
  <div class="container mx-auto p-4 mt-32">
    <h1 class="text-2xl font-bold mb-4">Invalid or Expired Token</h1>
    <p>Please check your email for the correct review link.</p>
  </div>
{/if}