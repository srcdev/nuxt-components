<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Magnetic Navigation</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="full" :style-class-passthrough="['mbe-20']">
          <MagneticNavigation />
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: "Magnetic Navigation",
  meta: [
    {
      name: "description",
      content: "MagneticNavigation Meta description content",
    },
  ],
  bodyAttrs: {
    class: "magnetic-navigation-page",
  },
})
</script>

<style lang="css">
.magnetic-navigation-page {
  /* CSS styles */
  --_background-image: url("/images/rotating-carousel/image-2.webp");
  --_background-position: 0 0;

  background-image: var(--_background-image);
  background-size: cover;
  background-position: var(--_background-position);
  background-attachment: fixed;

  .magnetic-navigation {
  }
}
</style>
