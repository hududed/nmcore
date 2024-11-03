<script lang="ts">
  import * as Card from "$lib/components/ui/card";
</script>

<div class="container mx-auto flex flex-col gap-2 py-8 px-4 md:px-8 max-w-screen-xl">
  <Card.Root class="bg-gray-100 p-4 rounded-lg">
    <Card.Header class="p-4">
      <Card.Title class="text-4xl sm:text-5xl mb-0 text-left leading-tight">
        Maximize Your Crop Growth with <span class="sm:hidden">Nano-<br>technology</span><span class="hidden sm:inline">Nanotechnology</span>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <p class="text-2xl sm:text-3xl mb-0 text-left leading-tight">
        Finally, a breakthrough solution that enhances photosynthesis, cuts fertilizer usage, and transforms your farm’s productivity.
      </p>
    </Card.Content>
  </Card.Root>

  <div class="cards grid grid-cols-1 gap-2 md:grid-cols-2 max-w-screen-xl">
    <Card.Root class="p-4 rounded-lg">
      <Card.Header class="p-4">
        <Card.Title class="text-3xl sm:text-4xl text-left mb-0">60% More Yield</Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-xl sm:text-2xl text-left leading-tight mt-1">
          Experience a significant yield boost for the same level of effort.
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root class="p-4 rounded-lg">
      <Card.Header class="p-4">
        <Card.Title class="text-3xl sm:text-4xl text-left mb-0">20% Faster</Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-xl sm:text-2xl  text-left leading-tight mt-1">
          Enjoy a shorter crop cycle, faster turnaround times and enhanced farming efficiency.
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root class="p-4 rounded-lg">
      <Card.Header class="p-4">
        <Card.Title class="text-3xl sm:text-4xl text-left mb-0">Drought Resilience</Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-xl sm:text-2xl  text-left leading-tight mt-1">
          Ensure better plant survival and response to dry environments.
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root class="p-4 rounded-lg">
      <Card.Header class="p-4">
        <Card.Title class="text-3xl sm:text-4xl text-left mb-0">Enhanced Nutrient Absorption</Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-xl sm:text-2xl  text-left leading-tight mt-1">
          Efficient nutrient uptake leads to thicker stems, larger leaves, and more robust plant growth.
        </p>
      </Card.Content>
    </Card.Root>
  </div>
</div>