<script lang="ts">
  import * as Card from "$lib/components/ui/card";
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 80vh;
  }

  .cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .cards {
      grid-template-columns: 1fr 1fr;
    }
  }


</style>


<div class="container">
    <Card.Root style="background-color: #f0f0f0; padding: 1rem; border-radius: 0.5rem;">
        <Card.Header>
          <Card.Title class="text-5xl mb-0 text-left">Maximize Your Crop Growth with Nanotechnology</Card.Title>
        </Card.Header>
        <Card.Content class="card-content">
          <p class="text-2xl mb-0 text-left leading-tight">
            Finally, a breakthrough solution that enhances photosynthesis, cuts fertilizer usage, and transforms your farm’s productivity.
          </p>
        </Card.Content>
      </Card.Root>
  
    <div class="cards">
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-3xl text-left mb-0">Increased Yield</Card.Title>
        </Card.Header>
        <Card.Content class="card-content">
          <p class="text-xl text-left leading-tight mt-1">
            Experience a significant yield boost of 20% to 60% (depending on crops and nutrient management strategies), ensuring greater productivity and profitability for farmers.
          </p>
        </Card.Content>
      </Card.Root>
  
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-3xl text-left mb-0">Shortened Crop Cycles</Card.Title>
        </Card.Header>
        <Card.Content class="card-content">
          <p class="text-xl text-left leading-tight mt-1">
            Enjoy a 20% reduction in the crop cycle, enabling faster turnaround times and enhanced farming efficiency.
          </p>
        </Card.Content>
      </Card.Root>
  
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-3xl text-left mb-0">Drought Resilience</Card.Title>
        </Card.Header>
        <Card.Content class="card-content">
          <p class="text-xl text-left leading-tight mt-1">
            Enhances crop resilience to drought conditions, ensuring better plant survival and response to dry environments.
          </p>
        </Card.Content>
      </Card.Root>
  
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-3xl text-left mb-0">Enhanced Nutrient Absorption</Card.Title>
        </Card.Header>
        <Card.Content class="card-content">
          <p class="text-xl text-left leading-tight mt-1">
            Enables plants to absorb and utilize nutrients more effectively. This leads to thicker stems, larger leaves, and more robust plant growth.
          </p>
        </Card.Content>
      </Card.Root>
    </div>
  </div>