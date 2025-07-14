<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="heading-2">Carousel (Basic)</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['carousel-basic-demo','mbe-20']">
          <CarouselBasic v-if="carouselStatus === 'success'" :data="carouselData" :style-class-passthrough="['mbe-20']">
            <template v-for="(item, index) in carouselData?.items" #[item.id]>
              <div class="case-study-item">
                <h3>{{ index }}</h3>
                <p>{{ item.alt }}</p>
              </div>
            </template>
          </CarouselBasic>
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
    class: 'carousel-basic-example-page',
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

<style lang="css">

.carousel-basic-demo {
  .carousel-basic {
    .item-container {
      .item {
        .case-study-item {
          color: light-dark(#aaa, #333);

          flex-direction: column;
          align-items: center;
          justify-content: center;

          aspect-ratio: 4 / 3;
          inline-size: 100%;

          color: light-dark(#aaa, #333);
          padding-block: 10px;
          padding-inline: 10px;
          border-radius: 4px;
          outline: 1px solid light-dark(#00000090, #f00ff090);
        }
      }
    }
  }
}

</style>
