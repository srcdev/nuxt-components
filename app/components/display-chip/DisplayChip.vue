<template>
  <component :is="tag" class="display-chip-core" :class="[shape, elementClasses]" ref="chip">
    <slot></slot>
    <span class="chip-label"><slot v-if="slots.label" name="label"></slot></span>
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
    type: String as PropType<"circle" | "square" | "rounded">,
    default: "circle",
    validator(value: string) {
      return ["circle", "square", "rounded"].includes(value)
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const slots = useSlots()
const chipRef = useTemplateRef("chip")

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
:root {
  /* demo vars for controlling */

  --status-size: 12px; /* size of the status */
  --status-gap: 2px; /* size of the gap around the status */
  --status-offset: 4px; /* how far from the circumference to offset the status */
  --status-angle: 45deg; /* where on the edge we want the status */
}

.display-chip-core {
  &.circle {
    --d: calc(var(--status-size) + (var(--status-gap) * 2)); /* diameter of the mask */
    --r: calc((100% / 2) + var(--status-offset)); /* distance from edge of avatar */
    --x: calc(var(--r) * cos(var(--status-angle) - 90deg) + (100% / 2)); /* x coord of status/mask */
    --y: calc(var(--r) * sin(var(--status-angle) - 90deg) + (100% / 2)); /* y coord of status/mask */
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
  }

  &.circle {
    &::after {
      border-radius: 100%;
      top: calc(var(--y) - (var(--status-size) / 2));
      left: calc(var(--x) - (var(--status-size) / 2));
    }

    & > * {
      /* create the cutout mask around the image,
              it's just a radial gradient positioned at the same place as the
              psuedo-element ::after */

      mask-image: radial-gradient(
        var(--d) var(--d) at var(--x) var(--y),
        transparent calc(50% - 0.5px),
        black calc(50% + 0.5px)
      );
    }
  }

  &.square {
    &::after {
      content: "";
      aspect-ratio: 1;
      background: var(--color-offline);
      border-radius: 4px;
      position: absolute;
      width: var(--status-size);
      top: calc(var(--y) - (var(--status-size) / 2));
      left: calc(var(--x) - (var(--status-size) / 2));
    }

    & > * {
      /* create the cutout mask around the image,
              it's just a radial gradient positioned at the same place as the
              psuedo-element ::after */

      mask-image: radial-gradient(
        var(--d) var(--d) at var(--x) var(--y),
        transparent calc(50% - 0.5px),
        black calc(50% + 0.5px)
      );
    }
  }

  &.online&::after {
    background-color: var(--color-online);
  }
  &.idle&::after {
    background-color: var(--color-idle);
  }
  &.dnd&::after {
    background-color: var(--color-dnd);
  }

  .chip-label {
    display: none;
  }
}

.display-chip-core-OLD {
  --_chip-width: 12px;
  --_chip-pos-x: calc(-1 * var(--_chip-width) / 2);
  --_chip-pos-y: calc(-1 * var(--_chip-width) / 2);

  position: relative;
  display: inline-block;
  outline: 1px solid var(--gray-0);

  &.circle {
    border-radius: 50%;
  }
  &.square {
    border-radius: 0;
  }

  .chip-label {
    position: absolute;
    display: inline-block;
    aspect-ratio: 1;
    width: var(--_chip-width);
    background-color: red;
    border-radius: 50%;

    top: var(--_chip-pos-y);
    right: var(--_chip-pos-x);
  }
}
</style>
