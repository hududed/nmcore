<script lang="ts">
  import * as Card from "$lib/components/ui/card";
</script>

<div class="container mx-auto flex flex-col gap-8 py-8 px-4 md:px-8 max-w-screen-xl">
  <Card.Root class="bg-gray-100 p-4 rounded-lg">
    <Card.Header>
      <Card.Title class="text-5xl mb-0 text-left">
        Maximize Your Crop Growth with <span class="sm:hidden">Nano-<br>technology</span><span class="hidden sm:inline">Nanotechnology</span>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <p class="text-2xl mb-0 text-left leading-tight">
        Finally, a breakthrough solution that enhances photosynthesis, cuts fertilizer usage, and transforms your farm’s productivity.
      </p>
    </Card.Content>
  </Card.Root>

  <div class="cards grid grid-cols-1 gap-8 md:grid-cols-2">
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-3xl text-left mb-0">Increased Yield</Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-xl text-left leading-tight mt-1">
          Experience a significant yield boost of 20% to 60% (depending on crops and nutrient management strategies), ensuring greater productivity and profitability for farmers.
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title class="text-3xl text-left mb-0">Shortened Crop Cycles</Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-xl text-left leading-tight mt-1">
          Enjoy a 20% reduction in the crop cycle, enabling faster turnaround times and enhanced farming efficiency.
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title class="text-3xl text-left mb-0">Drought Resilience</Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-xl text-left leading-tight mt-1">
          Enhances crop resilience to drought conditions, ensuring better plant survival and response to dry environments.
        </p>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title class="text-3xl text-left mb-0">Enhanced Nutrient Absorption</Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-xl text-left leading-tight mt-1">
          Enables plants to absorb and utilize nutrients more effectively. This leads to thicker stems, larger leaves, and more robust plant growth.
        </p>
      </Card.Content>
    </Card.Root>
  </div>
</div>