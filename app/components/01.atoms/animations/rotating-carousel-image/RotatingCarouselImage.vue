<template>
  <component
    :is="tag"
    ref="carouselRef"
    class="rotating-carousel"
    :class="[elementClasses, { paused: isPaused, 'reduced-motion': prefersReducedMotion, 'hover-pauses': props.pauseOnHover }]"
    :style="`--_rotate-x: ${rotateXProp}deg; --_perspective: ${perspectiveProp}; --_translateZ: ${translateZProp}`"
    role="region"
    :aria-label="ariaLabel"
    tabindex="0"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <div class="sr-only">
      {{ ariaDescription }}
    </div>

    <button
      v-if="showControls"
      class="control-btn"
      type="button"
      :aria-label="isPaused ? playLabel : pauseLabel"
      @click="togglePause"
    >
      <slot name="toggle-icon" :is-paused="isPaused">
        <Icon :name="isPaused ? playIcon : pauseIcon" aria-hidden="true" />
      </slot>
    </button>

    <div class="slider" :style="`--_quantity: ${data.length}`">
      <div v-for="(item, key) in data" :key="key" class="item" :style="`--_position: ${key}`">
        <NuxtImg :src="item.src" :alt="item.alt" />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { CarouselImageData } from "~/types/components"

interface Props {
  data?: CarouselImageData[]
  tag?:
    | "div"
    | "p"
    | "span"
    | "section"
    | "article"
    | "aside"
    | "header"
    | "footer"
    | "main"
    | "nav"
    | "ul"
    | "ol"
  rotateX?: number
  perspective?: number
  translateZ?: number
  /** Pauses the rotation while the pointer hovers over the carousel. */
  pauseOnHover?: boolean
  /** Drives rotateX from scroll position instead of the static `rotateX` prop. */
  useParallaxEffect?: boolean
  showControls?: boolean
  respectReducedMotion?: boolean
  ariaLabel?: string
  ariaDescription?: string
  playIcon?: string
  pauseIcon?: string
  playLabel?: string
  pauseLabel?: string
  styleClassPassthrough?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  tag: "div",
  rotateX: 0,
  perspective: 1000,
  translateZ: 1000,
  pauseOnHover: false,
  useParallaxEffect: true,
  showControls: false,
  respectReducedMotion: true,
  ariaLabel: "Rotating image carousel",
  ariaDescription: "Use spacebar to pause or play the rotation.",
  playIcon: "mdi:play",
  pauseIcon: "mdi:pause",
  playLabel: "Play rotation",
  pauseLabel: "Pause rotation",
  styleClassPassthrough: () => [],
})

const perspectiveProp = computed(() => `${props.perspective.toString()}px`)
const translateZProp = computed(() => `${props.translateZ.toString()}px`)

const carouselRef = ref<HTMLElement | null>(null)
const rotateXProp = ref(props.rotateX)
const minRotateX = -32
const maxRotateX = 32

const isPaused = ref(false)
const prefersReducedMotion = ref(false)

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)

watch(
  () => props.rotateX,
  () => {
    if (!props.useParallaxEffect) {
      rotateXProp.value = props.rotateX
    }
  }
)

watch(
  () => props.useParallaxEffect,
  (currentValue) => {
    if (currentValue) {
      handleScroll()
      window.addEventListener("scroll", handleScroll)
    } else {
      window.removeEventListener("scroll", handleScroll)
    }
  }
)

const handleScroll = () => {
  if (!carouselRef.value) return
  const rect = (carouselRef.value as HTMLElement).getBoundingClientRect()
  const viewportHeight = window.innerHeight

  const elementCenter = rect.top + rect.height / 2
  const viewportCenter = viewportHeight / 2
  const distanceFromCenter = viewportCenter - elementCenter
  const maxDistance = viewportHeight / 2 + rect.height / 2

  const progress = (distanceFromCenter + maxDistance) / (maxDistance * 2)
  const clampedProgress = Math.max(0, Math.min(1, progress))

  rotateXProp.value = minRotateX + (maxRotateX - minRotateX) * clampedProgress
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === " " || event.key === "Spacebar") {
    event.preventDefault()
    togglePause()
  }
}

const handleFocus = () => {
  isPaused.value = true
}

const handleBlur = () => {
  if (!prefersReducedMotion.value) {
    isPaused.value = false
  }
}

const checkReducedMotion = () => {
  if (typeof window !== "undefined" && props.respectReducedMotion) {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    prefersReducedMotion.value = mediaQuery.matches
    if (mediaQuery.matches) {
      isPaused.value = true
    }

    mediaQuery.addEventListener("change", (event) => {
      prefersReducedMotion.value = event.matches
      if (event.matches) {
        isPaused.value = true
      }
    })
  }
}

onMounted(async () => {
  checkReducedMotion()

  if (props.useParallaxEffect) {
    handleScroll()
    await nextTick()
    window.addEventListener("scroll", handleScroll)
  }
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style lang="css">
@layer components {
  @keyframes autoRun {
    from {
      transform: perspective(var(--_perspective)) rotateX(var(--_rotate-x)) rotateY(0deg);
    }
    to {
      transform: perspective(var(--_perspective)) rotateX(var(--_rotate-x)) rotateY(360deg);
    }
  }

  .rotating-carousel {
    width: 100%;
    height: var(--rotating-carousel-height, 70svh);
    text-align: center;
    overflow: hidden;
    position: relative;

    &:focus-visible {
      outline: var(--rotating-carousel-focus-outline-width, 2px) solid var(--theme-ring);
      outline-offset: var(--rotating-carousel-focus-outline-offset, 2px);
    }

    &.paused .slider {
      animation-play-state: paused;
    }

    &.reduced-motion .slider {
      animation: none !important;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .control-btn {
      position: absolute;
      inset-block-start: var(--rotating-carousel-control-offset, 8px);
      inset-inline-end: var(--rotating-carousel-control-offset, 8px);
      z-index: 10;
      background: var(--rotating-carousel-control-background-colour, rgba(0, 0, 0, 0.7));
      color: var(--rotating-carousel-control-text-colour, white);
      border: none;
      border-radius: var(--rotating-carousel-control-border-radius, 4px);
      padding: var(--rotating-carousel-control-padding, 8px);
      cursor: pointer;
      font-size: var(--rotating-carousel-control-font-size, 14px);
      transition: background-color var(--rotating-carousel-control-transition-duration, 0.2s);

      &:hover {
        background-color: var(--rotating-carousel-control-background-colour-hover, rgba(0, 0, 0, 0.9));
      }

      &:focus-visible {
        outline: var(--rotating-carousel-focus-outline-width, 2px) solid var(--theme-ring);
        outline-offset: var(--rotating-carousel-focus-outline-offset, 2px);
      }
    }

    .slider {
      position: absolute;
      width: var(--rotating-carousel-item-width, 200px);
      height: var(--rotating-carousel-item-height, 250px);
      bottom: var(--rotating-carousel-offset-bottom, 35%);
      left: calc(50% - (var(--rotating-carousel-item-width, 200px) / 2));
      transform-style: preserve-3d;
      transform: perspective(var(--_perspective));
      animation: autoRun var(--rotating-carousel-rotation-duration, 30s) linear infinite;
      z-index: var(--rotating-carousel-z-index, 2);

      .item {
        position: absolute;
        inset: 0 0 0 0;
        transform: rotateY(calc((var(--_position) - 1) * (360 / var(--_quantity)) * 1deg))
          translateZ(var(--_translateZ));

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    &.hover-pauses:hover .slider {
      animation-play-state: paused;
    }
  }

  @media (prefers-contrast: high) {
    .rotating-carousel .control-btn {
      background: ButtonFace;
      color: ButtonText;
      border: var(--rotating-carousel-control-border-width, 1px) solid ButtonText;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .rotating-carousel .slider {
      animation: none !important;
    }
  }
}
</style>
