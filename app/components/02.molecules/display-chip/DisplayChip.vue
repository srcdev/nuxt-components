<template>
  <component
    :is="tag"
    class="display-chip"
    :class="elementClasses"
    :data-shape="shape"
    :data-status="status"
    :style="chipStyles"
  >
    <slot name="default"></slot>
    <Icon v-if="config?.icon" :name="config.icon" class="display-chip-icon" aria-hidden="true" />
    <span v-if="labelGraphemes.length" class="display-chip-label" :data-length="displayLength">{{ displayLabel }}</span>
    <span v-if="statusLabel" class="sr-only">{{ statusLabel }}</span>
  </component>
</template>

<script setup lang="ts">
import type { DisplayChipConfig, DisplayChipStatus } from "~/types/components";

interface Props {
  tag?: "div" | "span";
  shape?: "circle" | "square";
  status?: DisplayChipStatus;
  statusLabel?: string;
  config?: DisplayChipConfig;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "span",
  shape: "circle",
  status: "offline",
  statusLabel: "",
  config: () => ({}),
  styleClassPassthrough: () => [],
});

const MAX_LABEL_LENGTH = 3;

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const labelGraphemes = computed(() => {
  const label = props.config?.label?.trim();
  if (!label) return [];
  return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(label), ({ segment }) => segment);
});

const displayLabel = computed(() => labelGraphemes.value.slice(0, MAX_LABEL_LENGTH).join(""));
const displayLength = computed(() => Math.min(labelGraphemes.value.length, MAX_LABEL_LENGTH));

watch(
  labelGraphemes,
  (graphemes) => {
    if (graphemes.length > MAX_LABEL_LENGTH) {
      console.warn(
        `DisplayChip: label "${props.config?.label}" exceeds maximum length of ${MAX_LABEL_LENGTH} characters. Truncating to "${displayLabel.value}"`
      );
    }
  },
  { immediate: true }
);

// Always written inline so a nested chip never inherits its parent's geometry.
const chipStyles = computed(() => ({
  "--_chip-size": props.config?.size || "var(--display-chip-size, 1.2rem)",
  "--_chip-mask-width": props.config?.maskWidth || "var(--display-chip-mask-width, 0.4rem)",
  "--_chip-offset": props.config?.offset || "var(--display-chip-offset, 0rem)",
  "--_chip-angle": props.config?.angle || "var(--display-chip-angle, 90deg)",
}));
</script>

<style lang="css">
@layer components {
  .display-chip {
    --_size: max(0px, var(--_chip-size));
    --_mask-diameter: calc(var(--_size) + (max(0px, var(--_chip-mask-width)) * 2));
    --_dot-colour: var(--display-chip-colour-offline, var(--status-neutral));

    position: relative;
    display: inline-block;

    &[data-shape="circle"] {
      --_offset: calc((100% / 2) + var(--_chip-offset));
      --_position-x: calc(var(--_offset) * cos(var(--_chip-angle) - 90deg) + (100% / 2));
      --_position-y: calc(var(--_offset) * sin(var(--_chip-angle) - 90deg) + (100% / 2));
    }

    &[data-shape="square"] {
      --_circle-x: calc(50% + (50% + var(--_chip-offset) + (var(--_size) / 2)) * cos(var(--_chip-angle) - 90deg));
      --_circle-y: calc(50% + (50% + var(--_chip-offset) + (var(--_size) / 2)) * sin(var(--_chip-angle) - 90deg));
      --_position-x: clamp(calc(var(--_chip-offset) * -1), var(--_circle-x), calc(100% + var(--_chip-offset)));
      --_position-y: clamp(calc(var(--_chip-offset) * -1), var(--_circle-y), calc(100% + var(--_chip-offset)));
    }

    &[data-status="online"] {
      --_dot-colour: var(--display-chip-colour-online, var(--status-success));
    }

    &[data-status="idle"] {
      --_dot-colour: var(--display-chip-colour-idle, var(--status-warning));
    }

    &[data-status="dnd"] {
      --_dot-colour: var(--display-chip-colour-dnd, var(--status-danger));
    }

    &::after {
      content: "";
      background: var(--_dot-colour);
      position: absolute;
      width: var(--_size);
      height: var(--_size);
      border-radius: 100%;
      z-index: 1;
    }

    &::after,
    .display-chip-icon,
    .display-chip-label {
      top: calc(var(--_position-y) - (var(--_size) / 2));
      left: calc(var(--_position-x) - (var(--_size) / 2));
    }

    .display-chip-icon {
      position: absolute;
      font-size: var(--_size);
      color: var(--display-chip-text-colour, black);
      z-index: 2;
    }

    .display-chip-label {
      --_font-size-adjust: 0.7;

      position: absolute;
      width: var(--_size);
      height: var(--_size);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--display-chip-text-colour, black);
      z-index: 2;
      font-size: calc(var(--_size) * var(--_font-size-adjust));
      line-height: 1;
      letter-spacing: -0.05rem;
      white-space: nowrap;
      user-select: none;

      &[data-length="2"] {
        --_font-size-adjust: 0.6;
      }

      &[data-length="3"] {
        --_font-size-adjust: 0.5;
      }
    }

    & > *:not(.display-chip-icon, .display-chip-label, .sr-only) {
      mask-image: radial-gradient(
        var(--_mask-diameter) var(--_mask-diameter) at var(--_position-x) var(--_position-y),
        transparent calc(50% - 0.5px),
        black calc(50% + 0.5px)
      );
    }
  }
}
</style>
