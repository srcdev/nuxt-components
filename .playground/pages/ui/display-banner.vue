<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="heading-2">DisplayBanner</h1>
        </LayoutRow>

        <DisplayBanner tag="div" :style-class-passthrough="['mbe-20']">
          <template #canvas>
            <NuxtImg src="/images/banners/test-banner/banner-ginger-desktop.jpeg" class="image" alt="" />
          </template>
          <template #content>
            <h2 class="heading-2">Display Banner Content</h2>
          </template>
        </DisplayBanner>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: 'Display Banner',
  meta: [
    {
      name: 'description',
      content: 'Display Banner Meta description content',
    },
  ],
  bodyAttrs: {
    class: 'display-banner-page',
  },
});
</script>

<style lang="css">
.display-banner-page {
  .display-banner {
    .canvas {
      grid-area: banner;
      width: 100%;
      height: 150px;

      @container (min-width: 768px) {
        height: 200px;
      }
      @container (min-width: 1024px) {
        height: 250px;
      }
      @container (min-width: 1280px) {
        height: 300px;
      }

      transition: height 0.3s ease-in-out;

      .image {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
    .content {
      grid-area: banner;
      align-self: center;
      justify-self: center;

      h2 {
        color: var(--gray-0);
      }
    }
  }
}
</style>
