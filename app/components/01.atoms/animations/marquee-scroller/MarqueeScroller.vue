<template>
  <div
    v-if="displayComponent"
    ref="rootEl"
    class="marquee-scroller"
    :class="elementClasses"
    :data-reverse="reverse ? '' : undefined"
    :data-paused="isPaused ? '' : undefined"
    :data-reduced-motion="prefersReducedMotion ? '' : undefined"
    role="region"
    :aria-label="ariaLabel"
    :aria-live="isPaused ? 'polite' : 'off'"
    tabindex="0"
    @keydown="handleKeydown"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <div class="marquee-scroller-description">
      {{ ariaDescription }}
    </div>

    <InputButton
      v-if="showControls"
      type="button"
      variant="inline"
      :button-text="isPaused ? playLabel : pauseLabel"
      style-class-passthrough="marquee-scroller-control"
      @click="togglePause"
    >
      <template #iconOnly>
        <slot name="toggle-icon" :is-paused="isPaused">
          <Icon :name="isPaused ? playIcon : pauseIcon" aria-hidden="true" />
        </slot>
      </template>
    </InputButton>

    <div class="marquee-scroller-track" :aria-hidden="isPaused ? undefined : 'true'">
      <div ref="groupEl" class="marquee-scroller-group">
        <template v-for="copy in repeatCount" :key="copy">
          <div v-for="item in marqueeData" :key="`${copy}-${item.id}`" class="marquee-scroller-item">
            <slot :name="item.id"></slot>
          </div>
        </template>
      </div>
      <div class="marquee-scroller-group" aria-hidden="true" inert>
        <template v-for="copy in repeatCount" :key="copy">
          <div v-for="item in marqueeData" :key="`duplicate-${copy}-${item.id}`" class="marquee-scroller-item">
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
  /** Control button label while paused — override for localisation. */
  playLabel?: string;
  /** Control button label while playing — override for localisation. */
  pauseLabel?: string;
  styleClassPassthrough?: string | string[];
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
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const MAX_REPEAT_COUNT = 50;

const displayComponent = ref(false);
const isPaused = ref(false);
const prefersReducedMotion = ref(false);
const rootEl = ref<HTMLElement | null>(null);
const groupEl = ref<HTMLElement | null>(null);
const repeatCount = ref(1);
let pausedByFocus = false;
let resizeObserver: ResizeObserver | null = null;
let reducedMotionQuery: MediaQueryList | null = null;

const height = computed(() => props.itemConfig.height || "50px");
const width = computed(() => props.itemConfig.width || "50px");
const gap = computed(() => props.itemConfig.gap || "16px");
const itemCount = computed(() => props.marqueeData.length * repeatCount.value);

// One copy of marqueeData may not fill a wide container; repeat it until a group covers the width.
const updateRepeatCount = () => {
  if (!rootEl.value || !groupEl.value || props.marqueeData.length === 0) return;
  const baseGroupWidth = groupEl.value.scrollWidth / repeatCount.value;
  if (baseGroupWidth <= 0) return;
  const needed = Math.min(MAX_REPEAT_COUNT, Math.max(1, Math.ceil(rootEl.value.offsetWidth / baseGroupWidth)));
  if (needed !== repeatCount.value) repeatCount.value = needed;
};

const handleReducedMotionChange = (event: MediaQueryListEvent) => {
  prefersReducedMotion.value = event.matches;
  if (event.matches) isPaused.value = true;
};

const checkReducedMotion = () => {
  if (typeof window === "undefined" || !props.respectReducedMotion) return;
  reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = reducedMotionQuery.matches;
  reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
  pausedByFocus = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.target !== event.currentTarget) return;
  if (event.key === " " || event.key === "Spacebar") {
    event.preventDefault();
    togglePause();
  }
};

const handleFocusIn = (event: FocusEvent) => {
  if ((event.target as Element | null)?.closest(".marquee-scroller-control")) return;
  if (!isPaused.value) {
    isPaused.value = true;
    pausedByFocus = true;
  }
};

const handleFocusOut = (event: FocusEvent) => {
  if (rootEl.value?.contains(event.relatedTarget as Node | null)) return;
  if (pausedByFocus && !prefersReducedMotion.value) isPaused.value = false;
  pausedByFocus = false;
};

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

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
  reducedMotionQuery?.removeEventListener("change", handleReducedMotionChange);
});
</script>

<style lang="css">
@layer components {
  .marquee-scroller {
    --_fade-width: var(--marquee-scroller-fade-width, 10%);
    --_focus-outline: var(--marquee-scroller-focus-outline-width, 2px) solid
      var(--marquee-scroller-focus-outline-colour, var(--theme-ring));

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

    &:focus-visible {
      outline: var(--_focus-outline);
      outline-offset: var(--marquee-scroller-focus-outline-offset, 2px);
    }

    .marquee-scroller-description {
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

    .marquee-scroller-control.input-button {
      position: absolute;
      inset-block-start: var(--marquee-scroller-control-offset, 8px);
      inset-inline-end: var(--marquee-scroller-control-offset, 8px);
      z-index: 10;
      box-sizing: border-box;
      min-height: auto;
      background: var(--marquee-scroller-control-background-colour, rgba(0, 0, 0, 0.7));
      color: var(--marquee-scroller-control-text-colour, white);
      border: none;
      border-radius: var(--marquee-scroller-control-border-radius, 4px);
      padding: var(--marquee-scroller-control-padding, 8px);
      cursor: pointer;
      font-size: var(--marquee-scroller-control-font-size, 14px);
      transition: background-color var(--marquee-scroller-control-transition-duration, 0.2s);

      & .input-button-icon {
        margin: 0;
      }

      &:hover {
        background-color: var(--marquee-scroller-control-background-colour-hover, rgba(0, 0, 0, 0.9));
      }

      &:focus-visible {
        outline: var(--_focus-outline);
        outline-offset: var(--marquee-scroller-focus-outline-offset, 2px);
      }
    }

    .marquee-scroller-track {
      --_track-shift: calc(v-bind(itemCount) * (v-bind(width) + v-bind(gap)));

      display: flex;
      width: fit-content;
      gap: v-bind(gap);
      animation: marquee-scroller-move v-bind(animationRuntime) linear infinite;

      .marquee-scroller[data-reverse] & {
        animation-direction: reverse;
      }

      .marquee-scroller[data-paused] &,
      .marquee-scroller:hover & {
        animation-play-state: paused;
      }

      .marquee-scroller[data-reduced-motion] & {
        animation: none;
      }
    }

    .marquee-scroller-group {
      display: flex;
      gap: v-bind(gap);
      flex-shrink: 0;
    }

    .marquee-scroller-item {
      width: v-bind(width);
      height: v-bind(height);
      display: grid;
      place-items: center;
      overflow-wrap: anywhere;
      transition: filter var(--marquee-scroller-item-transition-duration, 0.5s);
      flex-shrink: 0;

      border: var(--marquee-scroller-item-border-width, 1px) solid
        var(--marquee-scroller-item-border-colour, var(--slate-10));
      border-radius: var(--marquee-scroller-item-border-radius, 4px);

      .marquee-scroller:hover & {
        filter: var(--marquee-scroller-group-hover-filter, grayscale(1));
      }

      &:hover {
        filter: var(--marquee-scroller-item-hover-filter, grayscale(0));
      }
    }
  }

  @keyframes marquee-scroller-move {
    from {
      transform: translateX(0);
    }
    to {
      /* Not -50%: the track's own gap between the two groups makes that overshoot the seam. */
      transform: translateX(calc(-1 * var(--_track-shift)));
    }
  }

  @media (prefers-contrast: high) {
    .marquee-scroller .marquee-scroller-control.input-button {
      background: ButtonFace;
      color: ButtonText;
      border: var(--marquee-scroller-control-border-width, 1px) solid ButtonText;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-scroller .marquee-scroller-track {
      animation: none;
    }
  }
}
</style>
