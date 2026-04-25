<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
          <h1 class="page-heading-1">ScrollParallaxSection Component</h1>
          <p class="mbe-12">
            JS-driven fixed background — works on all devices including iOS and Safari. The background image stays
            fixed in the viewport while the section scrolls past it, replicating <code>background-attachment: fixed</code>.
          </p>
        </LayoutRow>
        <ScrollParallaxSection
          tag="section"
          background-image="/images/rotating-carousel/image-3.webp"
          :style-class-passthrough="['mbe-20']"
        >
          <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section']">
            <h2 class="page-heading-1">First Section</h2>
            <p class="page-body-normal">Scroll down to see the parallax effect in action.</p>
            <p class="page-body-normal">The background image moves slower than the page, creating a depth effect.</p>
          </LayoutRow>
        </ScrollParallaxSection>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section', 'mbe-20']">
          <h2 class="page-heading-2">Between sections</h2>
          <p class="page-body-normal">Regular page content between two parallax sections.</p>
        </LayoutRow>
        <ScrollParallaxSection
          tag="section"
          background-image="/images/rotating-carousel/image-1.webp"
          :style-class-passthrough="['mbe-20']"
        >
          <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['expanding-panel-section']">
            <h2 class="page-heading-1">Second Section</h2>
            <p class="page-body-normal">A second section to demonstrate multiple fixed-background sections on the same page.</p>
          </LayoutRow>
        </ScrollParallaxSection>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "ScrollParallaxSection Component",
  meta: [
    {
      name: "description",
      content: "JS-driven parallax background section — works on all devices including iOS and Safari.",
    },
  ],
  bodyAttrs: {
    class: "scroll-parallax-section-page",
  },
});
</script>

<style lang="css">
.scroll-parallax-section-page {
  margin-block-end: 100vh;
}
</style>
