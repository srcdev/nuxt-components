<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Carousel (Flip)</h1>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <CarouselFlip
            v-if="carouselStatus === 'success'"
            :carousel-data-ids
            :allow-carousel-overflow="true"
            :transition-speed="500"
            :use-flip-animation="true"
            :style-class-passthrough="['carousel-flip-demo', 'mbe-20']"
          >
            <template v-for="(item, index) in carouselData?.items" #[item.id]>
              <div class="custom-carousel-item">
                <h3>{{ index + 1 }}</h3>
                <p>{{ item.alt }}</p>
              </div>
            </template>
          </CarouselFlip>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { ICarouselBasic } from "@/types/types.carousel-basic"

definePageMeta({
  layout: false,
})

useHead({
  title: "Carousel (Basic)",
  meta: [{ name: "description", content: "Examples of Carousel (Basic)" }],
  bodyAttrs: {
    class: "carousel-flip",
  },
})

const {
  data: carouselData,
  execute: carouselExecute,
  status: carouselStatus,
  error: carouselError,
} = await useFetch<ICarouselBasic>("/api/carousel", {
  immediate: true,
})

const carouselDataIds = computed(() => {
  return carouselData.value?.items.map((item) => item.id) || []
})
// console.log(carouselDataIds.value);
</script>

<style lang="css">
@property --glow-deg {
  syntax: "<angle>";
  inherits: true;
  initial-value: -90deg;
}

@keyframes glow {
  100% {
    --glow-deg: 270deg;
  }
}

.carousel-flip-demo {
  &.carousel-flip {
    /* Var used in calcs */
    --_carousel-item-track-gap: 12px;
    --_carousel-container-max-inline-size: 800px;
    --_carousel-item-edge-preview-width: 12px; /* Must be at 2x var(--_carousel-item-track-gap)  */

    @media (width >= 768px) {
      --_carousel-item-track-gap: 24px;
      --_carousel-item-edge-preview-width: 80px; /* Must be at 2x var(--_carousel-item-track-gap)  */
    }

    .item-container {
      max-inline-size: 800px;
      margin-inline: auto;

      outline: 1px solid light-dark(var(--gray-8), var(--gray-1));
      padding-block: 6px;
      padding-inline: 6px;

      @media (width >= 768px) {
        padding-block: 12px;
        padding-inline: 12px;
      }

      .item {
        background-color: light-dark(var(--gray-5), var(--gray-6));

        &:nth-child(odd) {
          background-color: light-dark(var(--gray-6), var(--gray-5));
        }

        .custom-carousel-item {
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
      max-inline-size: 800px;

      .markers-container {
        --marker-height: 12px;
        --marker-width: 12px;
        --marker-border-radius: 100vw;

        @media (width >= 768px) {
          --marker-height: 22px;
          --marker-width: 22px;
        }

        .markers-list {
          .markers-item {
            width: var(--marker-width);
            height: var(--marker-height);
            border-radius: var(--marker-border-radius);
            line-height: var(--marker-height);

            .btn-marker {
              width: var(--marker-width);
              height: var(--marker-height);
              border-radius: var(--marker-border-radius);
              background-color: light-dark(var(--gray-5), var(--gray-7));
              line-height: 3px;
              transition: all 0.3s linear;
              border: 1px solid transparent;
              outline: 1px solid transparent;

              &.active {
                background-color: light-dark(var(--gray-12), var(--gray-00));
              }

              &:hover,
              &:focus-visible {
                outline-color: light-dark(#000, #fff);
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
          --gradient-glow-dark: var(--gray-7), var(--gray-5), var(--gray-8), var(--gray-6), var(--gray-7), var(--gray-8),
            var(--gray-7);
          --gradient-glow-light: var(--gray-4), var(--gray-6), var(--gray-0), var(--gray-6), var(--gray-4);

          padding-block: 6px;
          padding-inline: 6px;
          border-radius: 100%;

          border: 3px solid transparent;
          background: linear-gradient(var(--surface, canvas) 0 0) padding-box,
            conic-gradient(from var(--glow-deg), var(--gradient-glow-dark)) border-box;
          outline: 1px solid light-dark(var(--gray-9), var(--gray-7));

          position: relative;
          isolation: isolate;

          animation: glow 10s infinite linear;
          animation-play-state: paused;
          transition: outline-color 0.3s ease;

          @media (width >= 768px) {
            padding-block: 10px;
            padding-inline: 10px;
          }

          &::before,
          &::after {
            content: "";
            position: absolute;
            border-radius: inherit;
          }

          &::before {
            z-index: -1;
            background: var(--surface, canvas);
            inset: 0.5rem;
            scale: 1.2 1;
            transform-origin: right;
            filter: blur(var(--glow-size, 0.5rem));
          }

          &::after {
            z-index: -2;
            inset: -1.5rem;
            background: conic-gradient(from var(--glow-deg), var(--gradient-glow-dark));
            filter: blur(var(--glow-size, 1rem));
            opacity: var(--glow-intensity, 0.125);
          }

          &:hover,
          &:focus-visible {
            animation-play-state: running;
            outline-color: light-dark(var(--gray-9), var(--gray-4));
          }

          .arrows-icon {
            width: 16px;
            height: 16px;

            @media (width >= 768px) {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
  }
}
</style>
