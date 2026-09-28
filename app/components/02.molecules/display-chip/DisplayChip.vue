<template>
  <component :is="tag" class="display-chip" :class="[shape, elementClasses]" :style="chipStyles">
    <slot name="default"></slot>
    <Icon v-if="config?.icon" :name="config.icon" class="chip-icon" />
    <span v-if="config?.label" class="chip-label" :class="`length-${config.label.length}`">{{ validatedLabel }}</span>
  </component>
</template>

<script setup lang="ts">
import type { DisplayChipConfig } from "~/types/components";

interface Props {
  tag?: "div" | "span";
  shape?: "circle" | "square";
  config?: DisplayChipConfig;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "span",
  shape: "circle",
  config: () => ({
    size: "12px",
    maskWidth: "4px",
    offset: "0px",
    angle: "90deg",
    icon: undefined,
    label: undefined,
  }),
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const validatedLabel = computed(() => {
  if (!props.config?.label) return props.config?.label;
  if (props.config.label.length > 3) {
    console.warn(
      `DisplayChip: label "${
        props.config.label
      }" exceeds maximum length of 3 characters. Truncating to "${props.config.label.slice(0, 3)}"`
    );
    return props.config.label.slice(0, 3);
  }
  return props.config.label;
});

const chipStyles = computed(() => ({
  "--_chip-size": props.config?.size,
  "--_chip-mask-width": props.config?.maskWidth,
  "--_chip-offset": props.config?.offset,
  "--_chip-angle": props.config?.angle,
}));
</script>

<style lang="css">
@layer components {
  .display-chip {
    --_mask-diameter: calc(var(--_chip-size) + (var(--_chip-mask-width) * 2));
    --_dot-colour: var(--display-chip-colour-offline, slategrey);

    position: relative;
    display: inline-block;

    &.circle {
      --_offset: calc((100% / 2) + var(--_chip-offset));
      --_position-x: calc(var(--_offset) * cos(var(--_chip-angle) - 90deg) + (100% / 2));
      --_position-y: calc(var(--_offset) * sin(var(--_chip-angle) - 90deg) + (100% / 2));
    }

    &.square {
      --_circle-x: calc(50% + (50% + var(--_chip-offset) + (var(--_chip-size) / 2)) * cos(var(--_chip-angle) - 90deg));
      --_circle-y: calc(50% + (50% + var(--_chip-offset) + (var(--_chip-size) / 2)) * sin(var(--_chip-angle) - 90deg));
      --_position-x: clamp(calc(var(--_chip-offset) * -1), var(--_circle-x), calc(100% + var(--_chip-offset)));
      --_position-y: clamp(calc(var(--_chip-offset) * -1), var(--_circle-y), calc(100% + var(--_chip-offset)));
    }

    &.online {
      --_dot-colour: var(--display-chip-colour-online, rgb(0, 255, 135));
    }

    &.idle {
      --_dot-colour: var(--display-chip-colour-idle, rgb(255, 185, 51));
    }

    &.dnd {
      --_dot-colour: var(--display-chip-colour-dnd, rgb(255, 40, 80));
    }

    &::after {
      content: "";
      aspect-ratio: 1;
      background: var(--_dot-colour);
      position: absolute;
      width: var(--_chip-size);
      border-radius: 100%;
      z-index: 1;
    }

    &::after,
    .chip-icon,
    .chip-label {
      top: calc(var(--_position-y) - (var(--_chip-size) / 2));
      left: calc(var(--_position-x) - (var(--_chip-size) / 2));
    }

    .chip-icon {
      position: absolute;
      font-size: var(--_chip-size);
      color: var(--display-chip-text-colour, black);
      z-index: 2;
    }

    .chip-label {
      --_font-size-adjust: 0.7;

      position: absolute;
      width: var(--_chip-size);
      height: var(--_chip-size);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--display-chip-text-colour, black);
      z-index: 2;
      font-size: calc(var(--_chip-size) * var(--_font-size-adjust));
      line-height: 1;
      letter-spacing: -0.05rem;
      user-select: none;

      &.length-2 {
        --_font-size-adjust: 0.6;
      }

      &.length-3 {
        --_font-size-adjust: 0.5;
      }
    }

    & > *:not(.chip-icon, .chip-label) {
      mask-image: radial-gradient(
        var(--_mask-diameter) var(--_mask-diameter) at var(--_position-x) var(--_position-y),
        transparent calc(50% - 0.5px),
        black calc(50% + 0.5px)
      );
    }
  }
}
</style>
