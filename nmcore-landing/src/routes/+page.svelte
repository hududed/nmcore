<script lang="ts">
  import Benefits from './Benefits.svelte';
  import Faq from './Faq.svelte';
  import NotifyForm from "./NotifyForm.svelte";
  import Solution from './Solution.svelte';
  import Introduction from './Introduction.svelte';
</script>

<div class="introduction-section mt-16">
  <Introduction />
</div>

<div class="benefits-section mt-32">
  <Benefits />
</div>

<div class="solution-section mt-32">
  <Solution />
</div>

<div class="faq-section mt-32">
  <Faq />
</div>

<div class="card #172554 shadow-xl text-center mt-32 p-4">
  <h2 class="text-2xl md:text-3xl mb-4">Join Our Testing/Validation Phase</h2>
  <p class="text-lg md:text-xl mb-8">
    We invite you to participate in our testing/validation phase. Please provide your contact information below to get started.
  </p>
  <NotifyForm />
</div>