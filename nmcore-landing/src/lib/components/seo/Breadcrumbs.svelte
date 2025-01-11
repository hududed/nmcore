<!-- src/lib/components/Breadcrumbs.svelte -->
<script lang="ts">

  let { items } = $props<{
    items: { name: string; url: string }[];
  }>();
</script>

<nav aria-label="Breadcrumb">
  <ol class="flex space-x-2">
    {#each items as item, index}
      <li>
        <a href={item.url} class="text-blue-600 hover:underline">
          {item.name}
        </a>
      </li>
      {#if index < items.length - 1}
        <li>/</li>
      {/if}
    {/each}
  </ol>
</nav>
