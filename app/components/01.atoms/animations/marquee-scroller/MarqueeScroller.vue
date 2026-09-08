<template>
  <div
    v-if="displayComponent"
    ref="rootEl"
    class="marquee-scroller"
    :class="{ reverse: reverse, paused: isPaused, 'reduced-motion': prefersReducedMotion }"
    role="region"
    :aria-label="ariaLabel"
    :aria-live="isPaused ? 'polite' : 'off'"
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
      :aria-label="isPaused ? playLabel : pauseLabel"
      type="button"
      @click="togglePause"
    >
      <slot name="toggle-icon" :is-paused="isPaused">
        <Icon :name="isPaused ? playIcon : pauseIcon" aria-hidden="true" />
      </slot>
    </button>

    <div class="marquee-track" :aria-hidden="!isPaused">
      <div ref="groupEl" class="marquee-group">
        <template v-for="copy in repeatCount" :key="copy">
          <div v-for="item in marqueeData" :key="`${copy}-${item.id}`" class="item">
            <slot :name="item.id"></slot>
          </div>
        </template>
      </div>
      <div class="marquee-group" aria-hidden="true">
        <template v-for="copy in repeatCount" :key="copy">
          <div v-for="item in marqueeData" :key="`duplicate-${copy}-${item.id}`" class="item">
            <slot :name="item.id"></slot>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MarqueeItem, MarqueeItemConfig } from "~/types/components";

interface Props {
  animationRuntime?: string;
  reverse?: boolean;
  marqueeData?: MarqueeItem[];
  itemConfig?: MarqueeItemConfig;
  /** aria-label on the root region — override for localisation. */
  ariaLabel?: string;
  /** Screen-reader-only instructions rendered inside the region — override for localisation. */
  ariaDescription?: string;
  showControls?: boolean;
  respectReducedMotion?: boolean;
  /** Iconify icon name shown on the control button while paused. Ignored if the toggle-icon slot is used. */
  playIcon?: string;
  /** Iconify icon name shown on the control button while playing. Ignored if the toggle-icon slot is used. */
  pauseIcon?: string;
  /** Control button aria-label while paused — override for localisation. */
  playLabel?: string;
  /** Control button aria-label while playing — override for localisation. */
  pauseLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  animationRuntime: "40s",
  reverse: false,
  marqueeData: () => [],
  itemConfig: () => ({ width: "50px", height: "50px", gap: "16px" }),
  ariaLabel: "Scrolling content",
  ariaDescription: "Use spacebar to pause or play the animation.",
  showControls: false,
  respectReducedMotion: true,
  playIcon: "mdi:play",
  pauseIcon: "mdi:pause",
  playLabel: "Play animation",
  pauseLabel: "Pause animation",
});

const displayComponent = ref(false);
const isPaused = ref(false);
const isFocused = ref(false);
const prefersReducedMotion = ref(false);
const rootEl = ref<HTMLElement | null>(null);
const groupEl = ref<HTMLElement | null>(null);
const repeatCount = ref(1);
let resizeObserver: ResizeObserver | null = null;

const height = computed(() => props.itemConfig.height || "50px");
const width = computed(() => props.itemConfig.width || "50px");
const gap = computed(() => props.itemConfig.gap || "16px");
const itemCount = computed(() => props.marqueeData.length * repeatCount.value);

// A single copy of marqueeData may not be wide enough to fill a wide container — if it
// isn't, the loop briefly shows empty space before snapping back into view. Repeat the
// data enough times per track group to always exceed the container's width.
const updateRepeatCount = () => {
  if (!rootEl.value || !groupEl.value || props.marqueeData.length === 0) return;
  const baseGroupWidth = groupEl.value.scrollWidth / repeatCount.value;
  if (baseGroupWidth <= 0) return;
  const needed = Math.max(1, Math.ceil(rootEl.value.offsetWidth / baseGroupWidth));
  if (needed !== repeatCount.value) repeatCount.value = needed;
};

// Check for reduced motion preference
const checkReducedMotion = () => {
  if (typeof window !== "undefined" && props.respectReducedMotion) {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.value = mediaQuery.matches;

    // Listen for changes
    mediaQuery.addEventListener("change", (e) => {
      prefersReducedMotion.value = e.matches;
      if (e.matches) {
        isPaused.value = true;
      }
    });
  }
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === " " || event.key === "Spacebar") {
    event.preventDefault();
    togglePause();
  }
};

const handleFocus = () => {
  isFocused.value = true;
  if (props.respectReducedMotion) {
    isPaused.value = true;
  }
};

const handleBlur = () => {
  isFocused.value = false;
  if (!prefersReducedMotion.value) {
    isPaused.value = false;
  }
};

watch(
  () => [props.marqueeData, props.itemConfig],
  () => {
    repeatCount.value = 1;
    nextTick(updateRepeatCount);
  },
  { deep: true }
);

onMounted(async () => {
  displayComponent.value = true;
  checkReducedMotion();

  // Auto-pause if user prefers reduced motion
  if (prefersReducedMotion.value) {
    isPaused.value = true;
  }

  await nextTick();
  updateRepeatCount();

  if (typeof ResizeObserver !== "undefined" && rootEl.value) {
    resizeObserver = new ResizeObserver(() => updateRepeatCount());
    resizeObserver.observe(rootEl.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<style lang="css">
@layer components {
  .marquee-scroller {
    --_fade-width: var(--marquee-scroller-fade-width, 10%);

    width: 100%;
    height: v-bind(height);
    overflow: hidden;
    mask-image: linear-gradient(
      to right,
      transparent,
      #000 var(--_fade-width) calc(100% - var(--_fade-width)),
      transparent
    );
    position: relative;

    /* Focus styles */
    &:focus-visible {
      outline: var(--marquee-scroller-focus-outline-width, 2px) solid var(--theme-ring);
      outline-offset: var(--marquee-scroller-focus-outline-offset, 2px);
    }

    /* Paused state */
    &.paused .marquee-track {
      animation-play-state: paused;
    }

    /* Reduced motion - disable animation completely */
    &.reduced-motion .marquee-track {
      animation: none !important;
    }

    &:hover .marquee-track {
      animation-play-state: paused;
    }

    &:hover .item {
      filter: var(--marquee-scroller-group-hover-filter, grayscale(1));
    }

    /* Screen reader only text */
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

    /* Control button */
    .control-btn {
      position: absolute;
      inset-block-start: var(--marquee-scroller-control-offset, 8px);
      inset-inline-end: var(--marquee-scroller-control-offset, 8px);
      z-index: 10;
      background: var(--marquee-scroller-control-background-colour, rgba(0, 0, 0, 0.7));
      color: var(--marquee-scroller-control-text-colour, white);
      border: none;
      border-radius: var(--marquee-scroller-control-border-radius, 4px);
      padding: var(--marquee-scroller-control-padding, 8px);
      cursor: pointer;
      font-size: var(--marquee-scroller-control-font-size, 14px);
      transition: background-color var(--marquee-scroller-control-transition-duration, 0.2s);

      &:hover {
        background-color: var(--marquee-scroller-control-background-colour-hover, rgba(0, 0, 0, 0.9));
      }

      &:focus-visible {
        outline: var(--marquee-scroller-focus-outline-width, 2px) solid var(--theme-ring);
        outline-offset: 2px;
      }
    }

    .marquee-track {
      --_track-shift: calc(v-bind(itemCount) * (v-bind(width) + v-bind(gap)));

      display: flex;
      width: fit-content;
      gap: v-bind(gap);
      animation: marqueeMove v-bind(animationRuntime) linear infinite;
    }

    &.reverse .marquee-track {
      animation-direction: reverse;
    }

    .marquee-group {
      display: flex;
      gap: v-bind(gap);
      flex-shrink: 0;
    }

    .item {
      width: v-bind(width);
      height: v-bind(height);
      display: grid;
      place-items: center;
      aspect-ratio: 1 / 1;
      transition: filter var(--marquee-scroller-item-transition-duration, 0.5s);
      flex-shrink: 0;

      border: var(--marquee-scroller-item-border-width, 1px) solid
        var(--marquee-scroller-item-border-colour, light-dark(var(--slate-10), var(--slate-00)));
      border-radius: var(--marquee-scroller-item-border-radius, 4px);

      &:hover {
        filter: var(--marquee-scroller-item-hover-filter, grayscale(0));
      }
    }
  }

  @keyframes marqueeMove {
    from {
      transform: translateX(0);
    }
    to {
      /* Not -50%: the track's own gap between the two groups makes that overshoot the seam. */
      transform: translateX(calc(-1 * var(--_track-shift)));
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .marquee-scroller {
      .control-btn {
        background: ButtonFace;
        color: ButtonText;
        border: var(--marquee-scroller-control-border-width, 1px) solid ButtonText;
      }
    }
  }

  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .marquee-scroller .marquee-track {
      animation: none !important;
    }
  }
}
</style>
