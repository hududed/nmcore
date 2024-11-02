<!-- /src/routes/+layout.svelte -->
<script lang="ts">
    import "../app.css";
    import { Toaster } from "$lib/components/ui/sonner";
</script>

<main class="card w-full bg-neutral text-neutral-content mx-auto">
    <div class="card-body items-center text-center">
      <slot/>
      <Toaster />
    </div>
</main>