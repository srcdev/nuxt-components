<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['view-transition-banner']">
          <h2 class="page-heading-2">Wipe Away Vertical</h2>
        </LayoutRow>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['view-transition-banner']">
          <p class="page-body-normal">Some dummy content</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="full">
          <WipeAwayVertical :item-count="scrollingSection.length">
            <template v-for="(item, index) in stickyItems" :key="`sticky-${index}`" v-slot:[`stickyItem-${index}`]>
              <div class="sticky-item-container">
                <NuxtImg :src="item.src" :alt="item.alt" class="sticky-item-image" />
              </div>
            </template>

            <template
              v-for="(section, index) in scrollingSection"
              :key="`scrolling-${index}`"
              v-slot:[`scrollingItem-${index}`]
            >
              <div class="scrolling-section-content">
                <h3 class="section-heading-3">{{ section.title }}</h3>
                <p class="body-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
              </div>
            </template>
          </WipeAwayVertical>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['view-transition-banner']">
          <p class="page-body-normal">Some dummy content</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['view-transition-banner']">
          <p class="page-body-normal">Some dummy content</p>
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
  title: "Wipe Away Vertical",
  meta: [
    {
      name: "description",
      content: "Wipe Away Vertical Meta description content",
    },
  ],
  bodyAttrs: {
    class: "wipe-away-vertical-page",
  },
})

const stickyItems = [
  {
    src: "/images/rotating-carousel/image-1.webp",
    alt: "Sample Image 1",
  },
  {
    src: "/images/rotating-carousel/image-2.webp",
    alt: "Sample Image 2",
  },
  {
    src: "/images/rotating-carousel/image-4.webp",
    alt: "Sample Image 4",
  },
  {
    src: "/images/rotating-carousel/image-5.webp",
    alt: "Sample Image 5",
  },
  {
    src: "/images/rotating-carousel/image-6.webp",
    alt: "Sample Image 6",
  },
]

const scrollingSection = [
  { title: "View Timeline 1" },
  { title: "View Timeline 2" },
  { title: "View Timeline 3" },
  { title: "View Timeline 4" },
  { title: "View Timeline 5" },
]
</script>

<style lang="css">
.wipe-away-vertical-page {
  /* CSS styles */

  .view-transition-banner {
    min-block-size: 75svh;
  }

  .wipe-away-vertical {
    .sticky-items-container {
      width: 50%;
      aspect-ratio: 1;

      @media (width >= 1024px) {
        width: 512px;
      }
    }

    .scrolling-section {
      min-height: 100vh;

      background-color: darkcyan;
      overflow-y: hidden;

      &:nth-child(odd) {
        background-color: darkgoldenrod;
      }
    }
  }
}
</style>
