<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="heading-2">Carousel (Flip)</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <CarouselFlip
            :props-data="carouselData"
            :data="carouselData"
            :style-class-passthrough="['mbe-20']"
          />
        </LayoutRow>

      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { ICarouselBasic } from "@/types/types.carousel-basic";

definePageMeta({
  layout: false,
});

useHead({
  title: 'Carousel (Basic)',
  meta: [{ name: 'description', content: 'Examples of Carousel (Basic)' }],
  bodyAttrs: {
    class: 'carousel-basic',
  },
});

const {
  data: carouselData,
  execute: carouselExecute,
  status: carouselStatus,
  error: carouselError
} = await useFetch<ICarouselBasic>("/api/carousel", {
  immediate: true
});
</script>
