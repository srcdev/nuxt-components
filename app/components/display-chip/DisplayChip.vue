<template>
  <component :is="tag" class="display-chip-core" :class="[shape, elementClasses]" :style="chipStyles">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: "span",
    validator(value: string) {
      return ["div", "span"].includes(value)
    },
  },
  shape: {
    type: String as PropType<"circle" | "square">,
    default: "circle",
    validator(value: string) {
      return ["circle", "square"].includes(value)
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const chipConfig = defineModel<{
  size: string
  gap: string
  offset: string
  angle: string
}>({
  type: Object as PropType<{
    size: string
    gap: string
    offset: string
    angle: string
  }>,
  default: () => ({
    size: "12px",
    gap: "4px",
    offset: "0px",
    angle: "90deg",
  }),
  required: false,
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

// Compute the CSS custom properties based on chipConfig
const chipStyles = computed(() => ({
  "--status-size": chipConfig.value.size,
  "--status-gap": chipConfig.value.gap,
  "--status-offset": chipConfig.value.offset,
  "--status-angle": chipConfig.value.angle,
}))
</script>

<style lang="css">
.display-chip-core {
  &.circle {
    --d: calc(var(--status-size) + (var(--status-gap) * 2)); /* diameter of the mask */
    --r: calc((100% / 2) + var(--status-offset)); /* distance from edge of avatar */
    --x: calc(var(--r) * cos(var(--status-angle) - 90deg) + (100% / 2)); /* x coord of status/mask */
    --y: calc(var(--r) * sin(var(--status-angle) - 90deg) + (100% / 2)); /* y coord of status/mask */
  }

  &.square {
    /*
    --normalized-angle: calc(var(--status-angle) - 90deg);
    --abs-tan: abs(tan(var(--normalized-angle)));
    --half-size: 50%;

    --edge-distance: min(var(--half-size), var(--half-size) / var(--abs-tan));
    --base-x: calc(var(--half-size) + var(--edge-distance) * cos(var(--normalized-angle)));
    --base-y: calc(var(--half-size) + var(--edge-distance) * sin(var(--normalized-angle)));

    --x: calc(var(--base-x) + var(--status-offset) * cos(var(--normalized-angle)));
    --y: calc(var(--base-y) + var(--status-offset) * sin(var(--normalized-angle)));

    --d: calc(var(--status-size) + (var(--status-gap) * 2));
    */

    /* Simple square positioning - clamp the circular calculation to square bounds */
    --circle-x: calc(50% + (50% + var(--status-offset) + (var(--status-size) / 2)) * cos(var(--status-angle) - 90deg));
    --circle-y: calc(50% + (50% + var(--status-offset) + (var(--status-size) / 2)) * sin(var(--status-angle) - 90deg));

    /* Clamp to square bounds (0% to 100% with some padding) */
    --x: clamp(calc(var(--status-offset) * -1), var(--circle-x), calc(100% + var(--status-offset)));
    --y: clamp(calc(var(--status-offset) * -1), var(--circle-y), calc(100% + var(--status-offset)));

    --d: calc(var(--status-size) + (var(--status-gap) * 2)); /* diameter of the mask (same as circle) */
  }

  /* colors */

  --color-offline: slategrey;
  --color-online: rgb(0, 255, 135);
  --color-idle: rgb(255, 185, 51);
  --color-dnd: rgb(255, 40, 80);

  position: relative;
  display: inline-block;

  &::after {
    content: "";
    aspect-ratio: 1;
    background: var(--color-offline);
    position: absolute;
    width: var(--status-size);
    border-radius: 100%;
  }

  & > * {
    /*
    create the cutout mask around the image,
    it's just a radial gradient positioned at the same place as the
    psuedo-element ::after
    */

    mask-image: radial-gradient(
      var(--d) var(--d) at var(--x) var(--y),
      transparent calc(50% - 0.5px),
      black calc(50% + 0.5px)
    );
  }

  &.circle {
    &::after {
      top: calc(var(--y) - (var(--status-size) / 2));
      left: calc(var(--x) - (var(--status-size) / 2));
    }
  }

  &.square {
    &::after {
      top: calc(var(--y) - (var(--status-size) / 2));
      left: calc(var(--x) - (var(--status-size) / 2));
    }
  }

  &.online {
    &::after {
      background-color: var(--color-online);
    }
  }
  &.idle {
    &::after {
      background-color: var(--color-idle);
    }
  }
  &.dnd {
    &::after {
      background-color: var(--color-dnd);
    }
  }

  .chip-label {
    display: none;
  }
}
</style>
