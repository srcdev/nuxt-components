<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Carousel (Basic)</h1>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <CarouselBasic
            v-if="carouselStatus === 'success'"
            :carousel-data-ids
            :allow-carousel-overflow="true"
            :return-to-start="true"
            :style-class-passthrough="['carousel-basic-demo', 'mbe-20']"
          >
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
import type { ICarouselBasic } from "~/types/components"

definePageMeta({
  layout: false,
})

useHead({
  title: "Carousel (Basic)",
  meta: [{ name: "description", content: "Examples of Carousel (Basic)" }],
  bodyAttrs: {
    class: "carousel-basic-example-page",
  },
})

const {
  data: carouselData,
  execute: carouselExecute,
  status: carouselStatus, // See v-if on CarouselBasic
  error: carouselError,
} = await useFetch<ICarouselBasic>("/api/carousel", {
  immediate: true,
})

const carouselDataStatic = {
  items: [
    {
      id: 1,
      url: "/images/spotlights/v2/dining-out.webp",
      alt: "Dining out",
    },
    {
      id: 2,
      url: "/images/spotlights/v2/beer-gardens.webp",
      alt: "Entertaining the kids",
    },
    {
      id: 3,
      url: "/images/spotlights/v2/will-it-rain.webp",
      alt: "Will it rain?",
    },
    {
      id: 4,
      url: "/images/spotlights/v2/nightlife.webp",
      alt: "Nightlife",
    },
    {
      id: 5,
      url: "/images/spotlights/v2/got-toothache-2.webp",
      alt: "Dental Services",
    },
    {
      id: 6,
      url: "/images/spotlights/v2/days-out.webp",
      alt: "Days Out",
    },
  ],
  total: 6,
  skip: 0,
  limit: 4,
}

const carouselDataIds = computed(() => {
  return carouselData.value?.items.map((item) => item.id) || []
  // return carouselData?.items.map((item) => item.id) || [];
})
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

.carousel-basic-demo {
  &.carousel-basic {
    /* Var used in calcs */
    --_carousel-item-track-gap: 10px;

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
          content: "";
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
          --gradient-glow-dark:
            var(--gray-7), var(--gray-5), var(--gray-8), var(--gray-6), var(--gray-7), var(--gray-8), var(--gray-7);
          --gradient-glow-light: var(--gray-4), var(--gray-6), var(--gray-0), var(--gray-6), var(--gray-4);

          padding-block: 10px;
          padding-inline: 10px;
          border-radius: 100%;
          /* background-color: light-dark(#000, #fff); */
          /* color: light-dark(#fff, #000); */

          border: 3px solid transparent;
          background:
            linear-gradient(var(--surface, canvas) 0 0) padding-box,
            conic-gradient(from var(--glow-deg), var(--gradient-glow-dark)) border-box;
          outline: 1px solid light-dark(var(--gray-9), var(--gray-7));

          position: relative;
          isolation: isolate;

          animation: glow 10s infinite linear;
          animation-play-state: paused;
          transition: outline-color 0.3s ease;

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

          &:hover {
            animation-play-state: running;
            outline-color: light-dark(var(--gray-9), var(--gray-4));
          }

          .arrows-icon {
            width: 24px;
            height: 24px;

            /* &:hover {
              background-color: light-dark(#0009, #fff9);
            }

            &:active,
            &.active {
              background-color: light-dark(#0009, #fff9);
            }

            &:focus-visible {
              outline: 1px solid light-dark(#0f0, #f0f);
            } */
          }
        }
      }
    }
  }
}
</style>
