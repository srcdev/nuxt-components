<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
          <h1 class="page-heading-1">SectionParallax Component</h1>
          <p class="mbe-12">Static image displayed as page scrolls through it.</p>
        </LayoutRow>
        <SectionParallax
          background-image="/images/rotating-carousel/image-3.webp"
          :style-class-passthrough="['mbe-20']"
        >
          <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
            <h1 class="page-heading-1">SectionParallax Content</h1>
            <p class="page-body-normal">This is default slot content for the SectionParallax component.</p>
            <p class="page-body-normal">As it's a slot, any html content can be placed here.</p>
          </LayoutRow>
        </SectionParallax>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: "SectionParallax Component",
  meta: [
    {
      name: "description",
      content: "SectionParallax Component description content",
    },
  ],
  bodyAttrs: {
    class: "section-parallax-page",
  },
})

const forceOpened = ref(false)
</script>

<style lang="css">
.section-parallax-page {
  /* Page specific styles */

  margin-block-end: 100vh;

  .section-parallax {
  }
}
</style>
