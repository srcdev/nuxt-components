<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Carousel</h1>
        </LayoutRow>

        <!-- ── QA Panel (dev only) ───────────────────────────────── -->
        <div v-if="isDev" class="qa-panel">
          <details class="qa-panel__details">
            <summary class="qa-panel__summary">
              <span class="qa-panel__title">QA — CarouselFlip</span>
              <code class="qa-panel__status">
                overflow:{{ qaAllowOverflow ? "on" : "off" }} · speed:{{ qaTransitionSpeed }}ms · flip:{{
                  qaUseFlipAnimation ? "on" : "off"
                }}
                · spring:{{ qaUseSpringEffect ? "on" : "off" }} · {{ qaButtonLayout }}
              </code>
            </summary>
            <div class="qa-panel__body">
              <div class="qa-panel__group">
                <span class="qa-panel__label">Allow Overflow</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="opt in [true, false]"
                    :key="String(opt)"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaAllowOverflow === opt }"
                    @click="qaAllowOverflow = opt"
                  >
                    {{ opt ? "on" : "off" }}
                  </button>
                </div>
              </div>
              <div class="qa-panel__group">
                <span class="qa-panel__label">Transition Speed</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="preset in transitionSpeedPresets"
                    :key="preset"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaTransitionSpeed === preset }"
                    @click="qaTransitionSpeed = preset"
                  >
                    {{ preset }}ms
                  </button>
                </div>
              </div>
              <div class="qa-panel__group">
                <span class="qa-panel__label">Flip Animation</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="opt in [true, false]"
                    :key="String(opt)"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaUseFlipAnimation === opt }"
                    @click="qaUseFlipAnimation = opt"
                  >
                    {{ opt ? "on" : "off" }}
                  </button>
                </div>
              </div>
              <div class="qa-panel__group">
                <span class="qa-panel__label">Spring Effect</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="opt in [true, false]"
                    :key="String(opt)"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaUseSpringEffect === opt }"
                    @click="qaUseSpringEffect = opt"
                  >
                    {{ opt ? "on" : "off" }}
                  </button>
                </div>
              </div>
              <div class="qa-panel__group">
                <span class="qa-panel__label">Button Layout</span>
                <div class="qa-panel__chips">
                  <button
                    v-for="layout in buttonLayoutPresets"
                    :key="layout"
                    class="qa-panel__chip"
                    :class="{ 'is-active': qaButtonLayout === layout }"
                    @click="qaButtonLayout = layout"
                  >
                    {{ layout }}
                  </button>
                </div>
              </div>
            </div>
          </details>
        </div>

        <CarouselFlip
          v-if="carouselStatus === 'success'"
          :carousel-data-ids
          :allow-carousel-overflow="qaAllowOverflow"
          :transition-speed="qaTransitionSpeed"
          :use-flip-animation="qaUseFlipAnimation"
          :use-spring-effect="qaUseSpringEffect"
          :button-layout="qaButtonLayout"
          :style-class-passthrough="['carousel-flip-demo', 'mbe-20']"
        >
          <template v-for="(item, index) in carouselData?.items" :key="index" #[item.id]>
            <div class="custom-carousel-item">
              <h3>{{ index + 1 }}</h3>
              <p>{{ item.alt }}</p>
            </div>
          </template>
        </CarouselFlip>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { ICarouselBasic } from "~/types/components";

// ── QA controls (dev only) ────────────────────────────────────────
const isDev = import.meta.dev;
const qaAllowOverflow = ref(true);
const qaTransitionSpeed = ref(1000);
const qaUseFlipAnimation = ref(true);
const qaUseSpringEffect = ref(false);
const qaButtonLayout = ref<"sides" | "controls-flanking" | "controls-grouped-right" | "overlay">("sides");
const transitionSpeedPresets = [100, 200, 400, 600, 1000, 2000];
const buttonLayoutPresets = ["sides", "controls-flanking", "controls-grouped-right", "overlay"] as const;

definePageMeta({
  layout: false,
});

useHead({
  title: "Carousel (Basic)",
  meta: [{ name: "description", content: "Examples of Carousel (Basic)" }],
  bodyAttrs: {
    class: "carousel-flip-page",
  },
});

const { data: carouselData, status: carouselStatus } = await useFetch<ICarouselBasic>("/api/carousel", {
  immediate: true,
});

const carouselDataIds = computed(() => {
  return carouselData.value?.items.map((item) => item.id) || [];
});
</script>

<style lang="css">
.carousel-flip-page {
  /* ── QA Panel ──────────────────────────────────────────────────── */

  .qa-panel {
    background: oklch(15% 0 0);
    color: white;
    font-size: 1.3rem;
  }

  .qa-panel__details {
    padding: 1rem 2rem;
  }

  .qa-panel__summary {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1.6rem;
    list-style: none;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  .qa-panel__title {
    font-weight: 600;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .qa-panel__status {
    font-family: monospace;
    font-size: 1.2rem;
    background: oklch(0% 0 0 / 0.3);
    padding: 0.2rem 0.8rem;
    border-radius: 0.4rem;
    user-select: text;
    cursor: text;
  }

  .qa-panel__body {
    display: flex;
    flex-wrap: wrap;
    gap: 2.4rem;
    padding-block: 1.2rem 0.4rem;
  }

  .qa-panel__group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .qa-panel__label {
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.55;
  }

  .qa-panel__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .qa-panel__chip {
    font-family: monospace;
    font-size: 1.2rem;
    color: white;
    background: oklch(0% 0 0 / 0.25);
    border: 1px solid oklch(100% 0 0 / 0.18);
    padding: 0.3rem 1rem;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: oklch(0% 0 0 / 0.4);
    }

    &.is-active {
      background: oklch(55% 0.18 240);
      border-color: oklch(55% 0.18 240);
    }
  }
}

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

      outline: 1px solid light-dark(var(--slate-08), var(--slate-01));
      padding-block: 6px;
      padding-inline: 6px;

      @media (width >= 768px) {
        padding-block: 12px;
        padding-inline: 12px;
      }

      .item {
        background-color: light-dark(var(--slate-05), var(--slate-06));
        contain: layout style paint;

        &:nth-child(odd) {
          background-color: light-dark(var(--slate-06), var(--slate-05));
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
              background-color: light-dark(var(--slate-05), var(--slate-07));
              line-height: 3px;
              transition: all 0.3s linear;
              border: 1px solid transparent;
              outline: 1px solid transparent;

              &.active {
                background-color: light-dark(var(--slate-10), var(--slate-00));
                will-change: background-color;
              }

              &:hover,
              &:focus-visible {
                outline-color: light-dark(#000, #fff);
                will-change: background-color, outline-color;
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
            var(--slate-07), var(--slate-05), var(--slate-08), var(--slate-06), var(--slate-07), var(--slate-08),
            var(--slate-07);
          --gradient-glow-light: var(--slate-04), var(--slate-06), var(--slate-00), var(--slate-06), var(--slate-04);

          padding-block: 6px;
          padding-inline: 6px;
          border-radius: 100%;

          border: 3px solid transparent;
          background:
            linear-gradient(var(--surface, canvas) 0 0) padding-box,
            conic-gradient(from var(--glow-deg), var(--gradient-glow-dark)) border-box;
          outline: 1px solid light-dark(var(--slate-09), var(--slate-07));

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
            outline-color: light-dark(var(--slate-09), var(--slate-04));
            will-change: transform, opacity, filter;
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
