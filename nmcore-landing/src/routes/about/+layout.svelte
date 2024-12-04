<!-- /src/routes/about/+layout.svelte -->
<script lang="ts">
    import "../../app.css";
    import { Toaster } from "$lib/components/ui/sonner";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<main class="card w-full sm:w-5/6 md:w-4/6 bg-neutral text-neutral-content mx-auto">
    <div class="card-body items-center text-center">
      {@render children?.()}
      <Toaster />
    </div>
</main>