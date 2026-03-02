<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">ColourFinder</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <ColourFinder />
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
  title: "ColourFinder",
  meta: [
    {
      name: "description",
      content: "ColourFinder Meta description content",
    },
  ],
  bodyAttrs: {
    class: "colour-finder-page",
  },
});
</script>

<style lang="css">
.colour-finder-page {
  /* CSS styles */
}
</style>
