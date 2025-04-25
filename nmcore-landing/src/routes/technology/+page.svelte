<script lang="ts">
  import Benefits from './Benefits.svelte';
  import Introduction from './Introduction.svelte';
  import Solution from './Solution.svelte';

  // let NotifyForm: typeof import('./NotifyForm.svelte').default = $state();

  // onMount(async () => {
  //   const module = await import('./NotifyForm.svelte');
  //   NotifyForm = module.default;
  // });
</script>

<div class="introduction-section mt-16">
  <Introduction />
</div>

<div class="benefits-section mt-0">
  <Benefits />
</div>

<div class="solution-section mt-0">
  <Solution />
</div>

<!-- <div class="faq-section mt-0">
  <Faq />
</div> -->

<!-- <div class="card #172554 text-center mt-32 p-4">
  <h2 class="text-2xl md:text-3xl mb-4">Join Our Testing/Validation Phase</h2>
  <p class="text-lg md:text-xl mb-8">
    We invite you to participate in our testing/validation phase. Please provide your contact information below to get started.
  </p>
  {#if NotifyForm}
    <NotifyForm />
  {/if}
</div> -->