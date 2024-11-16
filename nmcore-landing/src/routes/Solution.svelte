<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import * as Tabs from "$lib/components/ui/tabs";
</script>

<div class="container mx-auto flex flex-col items-center justify-center gap-4 py-12 md:py-24 lg:py-48 px-4 md:px-8 max-w-screen-xl"> <!-- Centered content and set min height -->
  <div class="w-full flex flex-col pt-4 px-2">
    <h3 class="text-left font-jura text-4xl sm:text-5xl pb-8">
      Our solution
    </h3>
  </div>
  <!-- Tabs for screens larger than 800px -->
  <div class="hidden md:block w-full max-w-screen-xl">
    <Tabs.Root value="particle" class="w-full">
      <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="particle" class="text-2xl">The particle</Tabs.Trigger>
        <Tabs.Trigger value="effects" class="text-2xl">The effects</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="particle" class="w-full">
        <Card.Root class="w-full flex flex-col md:flex-row gap-8">
          <div class="flex-1">
            <Card.Content class="space-y-2 text-left">
              <div class="space-y-1 text-xl select-none">
                Our advanced carbon quantum dot technology is designed to help plants make better use of light across the UV, visible (VIS), and infrared (IR) spectrum. These tiny particles move easily through leaves and roots, reaching key areas in the plant, like the chloroplasts where photosynthesis happens. By doing so, they boost the plant's natural growth processes and energy production. Though this nanotechnology is new to agriculture, it's already widely used in many fields, from science and electronics to medicine, showing great promise for improving crop health and yield.
              </div>
            </Card.Content>
          </div>
          <div class="flex-2/3 flex justify-center items-center max-w-full p-4">
            <img src="/images/BLOOM_particle.jpg" alt="particle" class="w-full max-w-3xl pointer-events-none select-none" draggable="false">
          </div>
        </Card.Root>
      </Tabs.Content>
      <Tabs.Content value="effects" class="w-full">
        <Card.Root class="w-full flex flex-col md:flex-row gap-8">
          <div class="flex-1">
            <Card.Content class="space-y-2 text-left">
              <div class="space-y-1 text-xl select-none">
                Our carbon quantum dot technology (CQD) effectively maximizes light capture. Unlike traditional delivery methods, CQDs travel to crucial photosynthetic structures like the thylakoid membranes and chlorophyll-rich light-harvesting complexes. This precision enables efficient nutrient distribution at the cellular level, enhancing the plant’s ability to capture and utilize light energy for growth while minimizing environmental losses.
              </div>
            </Card.Content>
          </div>
          <div class="flex-2/3 flex justify-center items-center max-w-full p-4">
            <img src="/images/BLOOM_thylakloid.jpg" alt="effects" class="w-full max-w-3xl pointer-events-none select-none" draggable="false">
          </div>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  </div>
  <!-- Headers for screens 800px and lower -->
  <div class="block md:hidden w-full max-w-screen-xl">
    <div class="faq-item mb-8">
      <h4 class="text-2xl font-bold text-left py-4 px-2">The particle</h4>
      <div class="w-full flex flex-col gap-8 px-2">
        <div class="flex-1">
          <div class="space-y-2 text-left">
            <div class="space-y-1 text-xl select-none">
              Our advanced carbon quantum dot technology is designed to help plants make better use of light across the UV, visible (VIS), and infrared (IR) spectrum. These tiny particles move easily through leaves and roots, reaching key areas in the plant, like the chloroplasts where photosynthesis happens. By doing so, they boost the plant's natural growth processes and energy production. Though this nanotechnology is new to agriculture, it's already widely used in many fields, from science and electronics to medicine, showing great promise for improving crop health and yield.
            </div>
          </div>
        </div>
        <div class="flex-2/3 flex justify-center items-center max-w-full p-4">
          <img src="/images/BLOOM_particle.jpg" alt="particle" class="w-full max-w-3xl pointer-events-none select-none" draggable="false">
        </div>
      </div>
    </div>
    <div class="faq-item mb-8">
      <h4 class="text-2xl font-bold text-left py-4 px-2">The effects</h4>
      <div class="w-full flex flex-col gap-8 px-2">
        <div class="flex-1">
          <div class="space-y-2 text-left">
            <div class="space-y-1 text-xl select-none">
              Our carbon quantum dot technology (CQD) effectively maximizes light capture. Unlike traditional delivery methods, CQDs travel to crucial photosynthetic structures like the thylakoid membranes and chlorophyll-rich light-harvesting complexes. This precision enables efficient nutrient distribution at the cellular level, enhancing the plant’s ability to capture and utilize light energy for growth while minimizing environmental losses.
            </div>
          </div>
        </div>
        <div class="flex-2/3 flex justify-center items-center max-w-full p-4">
          <img src="/images/BLOOM_thylakloid.jpg" alt="effects" class="w-full max-w-3xl pointer-events-none select-none" draggable="false">
        </div>
      </div>
    </div>
  </div>
</div>