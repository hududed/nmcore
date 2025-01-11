<!-- src/lib/components/seo/StructuredData.svelte -->
<script lang="ts">

  // Destructure props using $props
  let { data } = $props<{
    data: Record<string, any>;
  }>();
</script>

<svelte:head>
  <script type="application/ld+json">
    {JSON.stringify(data)}
  </script>
</svelte:head>
