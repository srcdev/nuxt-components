<template>
  <div
    ref="trackRef"
    class="sliding-toggle"
    :class="elementClasses"
    role="radiogroup"
    :aria-label="ariaLabel || undefined"
    :aria-labelledby="ariaLabelledby || undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-ready="isReady ? '' : undefined"
    :data-has-selection="checkedIndex >= 0 ? '' : undefined"
    :data-hovering="hoveredIndex !== null ? '' : undefined"
    @mouseleave="setHovered(null)"
    @keydown="handleKeydown"
  >
    <span class="sliding-toggle-indicator sliding-toggle-indicator-hover" aria-hidden="true"></span>
    <span class="sliding-toggle-indicator sliding-toggle-indicator-active" aria-hidden="true"></span>
    <button
      v-for="(option, index) in options"
      :key="`${index}-${option.value}`"
      type="button"
      role="radio"
      class="sliding-toggle-option"
      :data-index="index"
      :aria-checked="index === checkedIndex ? 'true' : 'false'"
      :tabindex="index === tabStopIndex ? 0 : -1"
      :disabled="isOptionDisabled(index)"
      @mouseenter="setHovered(index)"
      @click="select(index)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number">
import type { SlidingToggleOption } from "~/types/components";

interface Props {
  options: SlidingToggleOption<T>[];
  ariaLabel?: string;
  ariaLabelledby?: string;
  disabled?: boolean;
  trackHover?: boolean;
  transitionDuration?: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: "",
  ariaLabelledby: "",
  disabled: false,
  trackHover: true,
  transitionDuration: 200,
  styleClassPassthrough: () => [],
});

const modelValue = defineModel<T>({ required: true });

const trackRef = ref<HTMLElement | null>(null);
const isReady = ref(false);
const hoveredIndex = ref<number | null>(null);

const checkedIndex = computed(() => props.options.findIndex((option) => option.value === modelValue.value));

const isOptionDisabled = (index: number) => props.disabled || Boolean(props.options[index]?.disabled);

const enabledIndexes = computed(() =>
  props.options.map((_, index) => index).filter((index) => !isOptionDisabled(index))
);

// The checked option takes the tab stop; with nothing checked, the first enabled one does.
const tabStopIndex = computed(() =>
  checkedIndex.value >= 0 && !isOptionDisabled(checkedIndex.value) ? checkedIndex.value : (enabledIndexes.value[0] ?? -1)
);

const optionElement = (index: number) =>
  index >= 0 ? (trackRef.value?.querySelector<HTMLElement>(`[data-index="${index}"]`) ?? null) : null;

const { place, reset } = useSlidingIndicator(trackRef, { duration: () => props.transitionDuration });

const placeActive = (animate: boolean) => {
  place("sliding-toggle-active", optionElement(checkedIndex.value), animate);
};

const placeHover = (animate: boolean) => {
  const index = hoveredIndex.value ?? checkedIndex.value;
  if (index < 0) {
    reset("sliding-toggle-hover");
    return;
  }
  place("sliding-toggle-hover", optionElement(index), animate);
};

const placeAll = (animate: boolean) => {
  placeActive(animate);
  placeHover(animate);
};

const setHovered = (index: number | null) => {
  if (!props.trackHover) return;
  const next = index !== null && isOptionDisabled(index) ? null : index;
  if (hoveredIndex.value === next) return;
  hoveredIndex.value = next;
  placeHover(true);
};

const select = (index: number) => {
  const option = props.options[index];
  if (!option || isOptionDisabled(index)) return;
  modelValue.value = option.value;
  optionElement(index)?.focus();
};

const isRtl = () => trackRef.value?.closest("[dir]")?.getAttribute("dir") === "rtl";

// WAI-ARIA radio group: arrows move focus and select, wrapping and skipping disabled options.
const handleKeydown = (event: KeyboardEvent) => {
  const option = (event.target as HTMLElement).closest<HTMLElement>("[data-index]");
  const enabled = enabledIndexes.value;
  if (!option || enabled.length === 0) return;

  const position = enabled.indexOf(Number(option.dataset.index));
  const nextKeys = ["ArrowDown", isRtl() ? "ArrowLeft" : "ArrowRight"];
  const previousKeys = ["ArrowUp", isRtl() ? "ArrowRight" : "ArrowLeft"];

  let target: number | undefined;
  if (nextKeys.includes(event.key)) {
    target = enabled[(position + 1) % enabled.length];
  } else if (previousKeys.includes(event.key)) {
    target = enabled[position <= 0 ? enabled.length - 1 : position - 1];
  } else if (event.key === "Home") {
    target = enabled[0];
  } else if (event.key === "End") {
    target = enabled[enabled.length - 1];
  }

  if (target === undefined) return;
  event.preventDefault();
  select(target);
};

watch(checkedIndex, () =>
  nextTick(() => {
    placeActive(true);
    if (hoveredIndex.value === null) placeHover(true);
  })
);

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

// Re-measure when the track or any single option resizes (a late web font changes label widths
// without resizing the track), and when options are added, removed or restyled.
const observeOptions = () => {
  if (!resizeObserver || !trackRef.value) return;
  resizeObserver.disconnect();
  resizeObserver.observe(trackRef.value);
  trackRef.value.querySelectorAll<HTMLElement>("[data-index]").forEach((element) => resizeObserver?.observe(element));
};

onMounted(() => {
  placeAll(false);
  isReady.value = true;

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => placeAll(false));
    observeOptions();
  }
  if (typeof MutationObserver !== "undefined" && trackRef.value) {
    mutationObserver = new MutationObserver(() => {
      observeOptions();
      placeAll(false);
    });
    mutationObserver.observe(trackRef.value, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .sliding-toggle {
    position: relative;
    display: flex;
    inline-size: fit-content;
    max-inline-size: 100%;
    gap: var(--sliding-toggle-gap, 0.4rem);
    padding: var(--sliding-toggle-padding, 0.4rem);
    background-color: var(--sliding-toggle-surface, var(--theme-surface-subtle));
    border-radius: var(--sliding-toggle-border-radius, 0.8rem);
    corner-shape: var(--sliding-toggle-corner-shape, round);

    .sliding-toggle-indicator {
      position: absolute;
      inset-block: var(--sliding-toggle-padding, 0.4rem);
      border-radius: var(--sliding-toggle-option-border-radius, 0.6rem);
      corner-shape: var(--sliding-toggle-corner-shape, round);
      opacity: 0;
      pointer-events: none;
    }

    .sliding-toggle-indicator-hover {
      left: var(--_sliding-toggle-hover-start, 0px);
      right: var(--_sliding-toggle-hover-end, 100%);
      transition:
        left var(--_sliding-toggle-hover-duration, 0ms) ease
          calc(var(--_sliding-toggle-hover-start-delay, 0ms) * var(--sliding-toggle-indicator-stretch, 1)),
        right var(--_sliding-toggle-hover-duration, 0ms) ease
          calc(var(--_sliding-toggle-hover-end-delay, 0ms) * var(--sliding-toggle-indicator-stretch, 1));
      background-color: var(
        --sliding-toggle-hover-indicator-surface,
        color-mix(in oklch, var(--theme-surface-subtle), var(--theme-text) 6%)
      );
    }

    .sliding-toggle-indicator-active {
      left: var(--_sliding-toggle-active-start, 0px);
      right: var(--_sliding-toggle-active-end, 100%);
      transition:
        left var(--_sliding-toggle-active-duration, 0ms) ease
          calc(var(--_sliding-toggle-active-start-delay, 0ms) * var(--sliding-toggle-indicator-stretch, 1)),
        right var(--_sliding-toggle-active-duration, 0ms) ease
          calc(var(--_sliding-toggle-active-end-delay, 0ms) * var(--sliding-toggle-indicator-stretch, 1));
      background-color: var(--sliding-toggle-indicator-surface, var(--theme-on-surface));
      box-shadow: var(--sliding-toggle-indicator-shadow, 0 0.1rem 0.3rem rgb(0 0 0 / 0.1));
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        inset-inline: 0;
        inset-block-end: 0;
        block-size: var(--sliding-toggle-marker-height, 0.2rem);
        background-color: var(--sliding-toggle-marker-colour, var(--theme-accent));
      }
    }

    &[data-ready][data-has-selection] .sliding-toggle-indicator-active,
    &[data-ready][data-has-selection] .sliding-toggle-indicator-hover,
    &[data-ready][data-hovering] .sliding-toggle-indicator-hover {
      opacity: 1;
    }

    .sliding-toggle-option {
      appearance: none;
      position: relative;
      z-index: 1;
      flex: var(--sliding-toggle-option-flex, 0 1 auto);
      min-inline-size: 0;
      margin: 0;
      padding: var(--sliding-toggle-option-padding, 0.8rem 1.6rem);
      border: 0;
      border-radius: var(--sliding-toggle-option-border-radius, 0.6rem);
      corner-shape: var(--sliding-toggle-corner-shape, round);
      background-color: transparent;
      font: inherit;
      font-size: var(--sliding-toggle-option-font-size, inherit);
      font-weight: var(--sliding-toggle-option-font-weight, 500);
      line-height: 1.2;
      white-space: var(--sliding-toggle-option-white-space, normal);
      overflow-wrap: anywhere;
      color: var(--sliding-toggle-option-colour, color-mix(in oklch, var(--theme-text) 70%, transparent));
      cursor: pointer;
      transition: color var(--sliding-toggle-transition-duration, 200ms) ease;

      &[aria-checked="true"] {
        color: var(--sliding-toggle-option-colour-active, var(--theme-text));
      }

      &:focus-visible {
        outline: var(--sliding-toggle-focus-ring-width, 0.2rem) solid
          var(--sliding-toggle-focus-ring-colour, var(--theme-border-focus));
        outline-offset: 0.1rem;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    &:not([data-ready]) .sliding-toggle-option[aria-checked="true"] {
      background-color: var(--sliding-toggle-indicator-surface, var(--theme-on-surface));
      box-shadow:
        inset 0 calc(-1 * var(--sliding-toggle-marker-height, 0.2rem)) 0
          var(--sliding-toggle-marker-colour, var(--theme-accent)),
        var(--sliding-toggle-indicator-shadow, 0 0.1rem 0.3rem rgb(0 0 0 / 0.1));
    }
  }
}
</style>
