<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Services Card Grid</h1>
          <p class="page-body-normal">Example of a services card grid component.</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <PriceList :price-list-data="priceListData" :style-class-passthrough="['mbe-20']" />
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Price List",
  meta: [{ name: "description", content: "Price List" }],
  bodyAttrs: {
    class: "price-list-page",
  },
});

const priceListData = [
  {
    headingtext: "Cutting & Treatment",
    items: [
      { description: "Cut & Blow Dry", price: "£45" },
      { description: "Restyle", price: "£65" },
      { description: "Wash & Blow Dry", price: "£35" },
      { description: "Trim & Tidy", price: "£25" },
      { description: "Keratin Treatment", price: "£120" },
    ],
  },
  {
    headingtext: "Hair Colouring",
    items: [
      { description: "Full Head Colour", price: "£75" },
      { description: "Half Head Highlights", price: "£65" },
      { description: "Full Head Highlights", price: "£85" },
      { description: "Balayage", price: "£95" },
      { description: "Toner", price: "£35" },
    ],
  },
];
</script>

<style lang="css">
.price-list-page {
}
</style>
