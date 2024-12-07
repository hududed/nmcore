<script lang="ts">
  import * as Card from "$lib/components/ui/card";
</script>

<div class="bg-zinc-800 text-zinc-50 py-12 md:py-24 lg:py-48 px-2 md:px-8 w-full">
  <div class="container mx-auto flex flex-col gap-2 max-w-screen-xl">
    <Card.Root class="bg-zinc-700 p-4 rounded-lg border border-zinc-600">
      <Card.Header class="p-4">
        <Card.Title class="text-4xl sm:text-5xl mb-0 text-left leading-tight text-zinc-50">
          Maximize Your Crop Growth with <span class="sm:hidden">Nano-<br>technology</span><span class="hidden sm:inline">Nanotechnology</span>
        </Card.Title>
      </Card.Header>
      <Card.Content class="p-4">
        <p class="text-2xl sm:text-3xl mb-0 text-left leading-tight text-zinc-300">
          Finally, a breakthrough solution that enhances photosynthesis, cuts fertilizer usage, and transforms your farm’s productivity.
        </p>
      </Card.Content>
    </Card.Root>

    <div class="cards grid grid-cols-1 gap-2 md:grid-cols-2 max-w-screen-xl">
      <Card.Root class="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
        <Card.Header class="p-4">
          <Card.Title class="text-3xl sm:text-4xl text-left mb-0 text-zinc-50">60% More Yield</Card.Title>
        </Card.Header>
        <Card.Content class="p-4">
          <p class="text-xl sm:text-2xl text-left leading-tight mt-1 text-zinc-300">
            Experience a significant yield boost for the same level of effort.
          </p>
        </Card.Content>
      </Card.Root>

      <Card.Root class="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
        <Card.Header class="p-4">
          <Card.Title class="text-3xl sm:text-4xl text-left mb-0 text-zinc-50">20% Faster</Card.Title>
        </Card.Header>
        <Card.Content class="p-4">
          <p class="text-xl sm:text-2xl text-left leading-tight mt-1 text-zinc-300">
            Enjoy a shorter crop cycle, faster turnaround times and enhanced farming efficiency.
          </p>
        </Card.Content>
      </Card.Root>

      <Card.Root class="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
        <Card.Header class="p-4">
          <Card.Title class="text-3xl sm:text-4xl text-left mb-0 text-zinc-50">Drought Resilience</Card.Title>
        </Card.Header>
        <Card.Content class="p-4">
          <p class="text-xl sm:text-2xl text-left leading-tight mt-1 text-zinc-300">
            Ensure better plant survival and response to dry environments.
          </p>
        </Card.Content>
      </Card.Root>

      <Card.Root class="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
        <Card.Header class="p-4">
          <Card.Title class="text-3xl sm:text-4xl text-left mb-0 text-zinc-50">Enhanced Nutrient Absorption</Card.Title>
        </Card.Header>
        <Card.Content class="p-4">
          <p class="text-xl sm:text-2xl text-left leading-tight mt-1 text-zinc-300">
            Efficient nutrient uptake leads to thicker stems, larger leaves, and more robust plant growth.
          </p>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>