<script lang="ts">
    //filepath: nmcore-landing/src/routes/review/%2Bpage.svelte
  import { enhance } from '$app/forms';
  let { data } = $props<{ data: { validToken: boolean; orderId: string } }>();

  console.log('🚀 Loaded Page Props:', data );

  let review = $state('');
  let rating = $state(0);
</script>

<!-- <div class="mt-24">
  <p>DEBUG: validToken = {String(data.validToken)} (type: {typeof data.validToken})</p>
  <p>DEBUG: orderId = {data.orderId}</p>
</div> -->

{#if data?.validToken}
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Leave a Review</h1>
    <form
      method="POST"
      action="?/submitReview"
      use:enhance={
        (_context) => {
          // Return a callback function that receives the action result.
          // We declare its parameter as "any" to bypass type errors.
          return async (actionResult: any) => {
            console.log("Action result:", actionResult);
          };
        }
      }
    >
      <input type="hidden" name="orderId" value={data.orderId} />
      <input
        type="number"
        name="rating"
        min="1"
        max="5"
        bind:value={rating}
        class="border p-2 mb-2"
        placeholder="Rating (1-5)" />
      <textarea
        name="review"
        bind:value={review}
        class="border p-2 mb-2 w-full"
        placeholder="Write your review"></textarea>
      <button type="submit" class="bg-blue-500 text-white p-2 rounded">
        Submit Review
      </button>
    </form>
  </div>
{:else}
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Invalid or Expired Token</h1>
    <p>Please check your email for the correct review link.</p>
  </div>
{/if}