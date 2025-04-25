<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
</script>

<div class="container mx-auto flex flex-col gap-8 py-8 px-4 md:px-8 max-w-screen-xl " style="font-family: 'DIN2014', sans-serif;">
  <div class="columns flex flex-col md:flex-row gap-0"> <!-- Adjusted gap to 0 -->
    <div class="text-column flex-2/3 text-left text-xl sm:text-xl md:text-2xl leading-relaxed pr-4 md:pr-4 select-none"> <!-- Increased text size at sm breakpoint and added select-none -->
      <p>
        <span class="font-din2014-bold">BLOOM</span> is a groundbreaking photosynthesis enhancer developed using cutting-edge nanotechnology. This biocompatible organic compound, similar to chlorophyll, significantly boosts photosynthesis in plants. When applied to leaves, <span class="font-din2014-bold">BLOOM</span> integrates with chloroplasts, optimizing photon absorption and electron transfer, enhancing the natural process of photosynthesis.
        <br><br>
        This results in up to 3X increase in photosynthetic efficiency.
      </p>
      <Table.Root class="mt-8 w-full text-base sm:text-xl md:text-2xl">
        <Table.Header>
          <Table.Row>
            <Table.Head>Analysis</Table.Head>
            <Table.Cell>0 - 0 - 0</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Head>Ingredients</Table.Head>
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
              <img src="/images/BLOOM_Mixing.jpg" alt="Easy Mixing" class="w-full mb-4 pointer-events-none select-none" draggable="false"> <!-- Added pointer-events-none and select-none to prevent copying -->
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
      <img src="/images/BLOOM_product.png" alt="About BLOOM" class="max-w-xs pointer-events-none select-none" draggable="false"> <!-- Added pointer-events-none and select-none to prevent copying -->
      <div class="mt-8 flex flex-col items-center gap-4 w-full"> <!-- Stacked buttons and centered them -->
        <Button href="/products/bloom/sell_sheet" variant="default" class="text-lg w-full max-w-xs bg-zinc-700 text-white">Sell Sheet</Button>
        <Button href="/products/bloom/label" variant="default" class="text-lg w-full max-w-xs bg-zinc-700 text-white">General Label</Button>
        <Button href="/products/bloom/sds" variant="default" class="text-lg w-full max-w-xs bg-zinc-700 text-white">General SDS</Button>
      </div>
    </div>
  </div>
</div>