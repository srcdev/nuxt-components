<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="heading-2">Carousel (Basic)</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <CarouselBasic v-if="carouselStatus === 'success'" :carousel-data-ids :style-class-passthrough="['carousel-basic-demo', 'mbe-20']">
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
import type { ICarouselBasic } from '@/types/types.carousel-basic';

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
  error: carouselError,
} = await useFetch<ICarouselBasic>('/api/carousel', {
  immediate: true,
});

const carouselDataIds = computed(() => {
  return carouselData.value?.items.map((item) => item.id) || [];
});
</script>

<style lang="css">
.carousel-basic-demo {
  &.carousel-basic {
    /* Var used in calcs */
    --_item-gap: 10px;

    .timeline-container {
      padding-block: 10px;
      padding-inline: 10px;
      outline: 1px solid light-dark(#00000090, #f00ff090);

      .timeline-item {
        max-inline-size: 800px;

        color: light-dark(#aaa, #333);
        padding-block: 10px;
        border-radius: 4px;
        outline: 1px solid light-dark(#00000090, #f00ff090);

        &::before {
          content: '';
          position: absolute;
          height: 2px;
          background-color: #fff;
          left: 70px;
          right: 0;
        }

        .count {
          font-size: 1.2rem;
          border-radius: 8px;
          color: light-dark(#fff, #000);
          background-color: light-dark(#000, #fff);
          padding-block: 6px;
          padding-inline: 12px;
        }
      }
    }

    .item-container {
      padding-block: 10px;
      padding-inline: 10px;
      outline: 1px solid light-dark(#00000090, #f00ff090);

      .item {
        max-inline-size: 800px;

        background-color: light-dark(#f00, #00f);

        &:nth-child(odd) {
          background-color: light-dark(#00f, #f00);
        }

        .case-study-item {
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

    .controls-container {
      gap: 20px;

      .markers-container {
        .markers-list {
          .markers-item {
            line-height: 3px;

            &.active {
              background-color: light-dark(#f00, #0f0);
            }

            .btn-marker {
              width: 22px;
              height: 3px;
              background-color: lightgray;
              line-height: 3px;

              &.active {
                background-color: red;
              }

              &:focus-visible {
                outline: 1px solid light-dark(#000, #fff);
              }
            }
          }
        }
      }

      .buttons-container {
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 20px;

        .btn-action {
          padding: 10px 20px;
          border-radius: 4px;
          background-color: light-dark(#000, #fff);
          color: light-dark(#fff, #000);
          border: none;

          &:hover {
            background-color: light-dark(#0009, #fff9);
          }

          &:active,
          &.active {
            background-color: light-dark(#0009, #fff9);
          }

          &:focus-visible {
            outline: 1px solid light-dark(#0f0, #f0f);
          }
        }
      }
    }
  }
}
</style>
