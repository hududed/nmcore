<script lang="ts">
  import Benefits from './Benefits.svelte';
  import Faq from './Faq.svelte';
  import NotifyForm from "./NotifyForm.svelte";
  import { Button } from "$lib/components/ui/button"; 
  import * as Table from "$lib/components/ui/table";
</script>


<div class="container mx-auto flex flex-col gap-8 py-32 px-4 md:px-8 max-w-screen-xl">
  <div class="w-full flex flex-col pt-4 px-2">
    <h1 class="text-center font-jura text-5xl pb-8">
      nmcore <span class="font-din2014-bold">BLOOM</span>
    </h1>
  </div>
  <div class="columns flex flex-col md:flex-row gap-0"> <!-- Adjusted gap to 0 -->
    <div class="text-column flex-2/3 text-left text-xl sm:text-2xl md:text-2xl leading-relaxed pr-4 md:pr-4"> <!-- Increased text size at sm breakpoint -->
      <p>
        <span class="font-din2014-bold">BLOOM</span> is a groundbreaking photosynthesis enhancer developed using cutting-edge nanotechnology. This biocompatible organic compound, similar to chlorophyll, significantly boosts photosynthesis in plants. When applied to leaves, <span class="font-din2014-bold">BLOOM</span> integrates with chloroplasts, optimizing photon absorption and electron transfer, enhancing the natural process of photosynthesis.
        <br><br>
        This results in up to 3X increase in photosynthetic efficiency.
      </p>
      <!-- Added ShadCN table below the body text -->
      <Table.Root class="mt-8 w-full text-xl">
        <Table.Header>
          <Table.Row>
            <Table.Head>Analysis</Table.Head>
            <Table.Cell>0 - 0 - 0</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Head>Composition</Table.Head>
            <Table.Cell>Carbon, Silica, Water</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Head>General Application</Table.Head>
            <Table.Cell>Foliar Application</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Head>General Rate</Table.Head>
            <Table.Cell>20oz/ac (USA),  1.6L/ha (International)</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Head>Easy Mixing</Table.Head>
            <Table.Cell class="flex flex-col items-center">
              <img src="/images/BLOOM_Mixing.jpg" alt="Easy Mixing" class="w-full mb-4">
              <span>The general use rate for <span class="font-din2014-bold">BLOOM</span> is 15-20 fl oz per acre. Apply 20-25 fl oz per acre for high volume applications (greater than 50 gallons per acre). A reduced rate of 10 fl oz per acre may be used for low volume aerial applications (less than 5 gallons per acre). Use <span class="font-din2014-bold">BLOOM</span> to supplement crop nutrient applications as needed according to recommendations in your nutrient management plan.</span>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Head>Product Benefits</Table.Head>
            <Table.Cell>
              <ul class="list-disc pl-5">
                <li>Superior formulation for foliar uptake</li>
                <li>Supports drought stress recovery</li>
                <li>Enhances nutrient uptake</li>
                <li>Compatible with most liquid fertilizers</li>
                <li>Clean, easy handling and safe for the environment</li>
              </ul>
            </Table.Cell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </div>
    
    <div class="image-column flex-1/3 flex flex-col justify-center items-center pl-4 md:pl-8"> <!-- Added padding-left and flex-col -->
      <img src="/images/BLOOM_product.jpg" alt="About BLOOM" class="max-w-xs sm:max-w-1/2 md:max-w-xs lg:max-w-xs"> <!-- Adjusted max-width for different breakpoints -->
      <div class="mt-8 flex flex-col items-center gap-4 w-full"> <!-- Stacked buttons and centered them -->
        <Button href="/products/bloom/sell_sheet" variant="default" class="text-lg w-full max-w-xs">Sell Sheet</Button>
        <Button href="/products/bloom/label" variant="default" class="text-lg w-full max-w-xs">General Label</Button>
        <Button href="/products/bloom/sds" variant="default" class="text-lg w-full max-w-xs">General SDS</Button>
      </div>
    </div>
  </div>
</div>

<div class="benefits-section mt-16">
  <Benefits />
</div>

<!-- Render the FAQ component -->
<div class="faq-section mt-32">
<Faq />
</div>

<div class="card #172554 shadow-xl p-10 text-center mt-32">
    <h2 class="text-2xl md:text-3xl mb-4">Join Our Testing/Validation Phase</h2>
    <p class="text-lg md:text-xl mb-8">
        We invite you to participate in our testing/validation phase. Please provide your contact information below to get started.
      </p>
    <NotifyForm />
</div>