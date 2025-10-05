<template>
  <component :is="tag" class="display-chip-core" :class="[shape, elementClasses]" :style="chipStyles">
    <slot name="default"></slot>
    <Icon v-if="config?.icon" :name="config.icon" class="chip-icon" />
    <span v-if="config?.label" class="chip-label" :class="`length-${config.label.length}`">{{ validatedLabel }}</span>
  </component>
</template>

<script lang="ts">
export interface DisplayChipConfig {
  size: string
  maskWidth: string
  offset: string
  angle: string
  icon?: string
  label?: string
}

export interface DisplayChipProps {
  tag?: "div" | "span"
  shape?: "circle" | "square"
  config?: DisplayChipConfig
  styleClassPassthrough?: string | string[]
}

export interface ChipSlots {
  default(props?: {}): any
  // content(props?: {}): any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<DisplayChipProps>(), {
  tag: "div",
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
})
const slots = defineSlots<ChipSlots>()
// const slots = useSlots()

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

// Validate and truncate label to max 3 characters
const validatedLabel = computed(() => {
  if (!props.config?.label) return props.config?.label
  if (props.config.label.length > 3) {
    console.warn(
      `DisplayChip: label "${
        props.config.label
      }" exceeds maximum length of 3 characters. Truncating to "${props.config.label.slice(0, 3)}"`
    )
    return props.config.label.slice(0, 3)
  }
  return props.config.label
})

const chipStyles = computed(() => ({
  "--chip-size": props.config?.size,
  "--chip-mask-width": props.config?.maskWidth,
  "--chip-offset": props.config?.offset,
  "--chip-angle": props.config?.angle,
}))
</script>

<style lang="css">
.display-chip-core {
  --computed-mask-diameter: calc(var(--chip-size) + (var(--chip-mask-width) * 2));

  &.circle {
    --computed-chip-offset: calc((100% / 2) + var(--chip-offset));
    --computed-position-x: calc(var(--computed-chip-offset) * cos(var(--chip-angle) - 90deg) + (100% / 2));
    --computed-position-y: calc(var(--computed-chip-offset) * sin(var(--chip-angle) - 90deg) + (100% / 2));
  }

  &.square {
    --circle-x: calc(50% + (50% + var(--chip-offset) + (var(--chip-size) / 2)) * cos(var(--chip-angle) - 90deg));
    --circle-y: calc(50% + (50% + var(--chip-offset) + (var(--chip-size) / 2)) * sin(var(--chip-angle) - 90deg));
    --computed-position-x: clamp(calc(var(--chip-offset) * -1), var(--circle-x), calc(100% + var(--chip-offset)));
    --computed-position-y: clamp(calc(var(--chip-offset) * -1), var(--circle-y), calc(100% + var(--chip-offset)));
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
    width: var(--chip-size);
    border-radius: 100%;
    z-index: 1;
  }
  .chip-icon {
    position: absolute;
    width: var(--chip-size);
    height: var(--chip-size);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    z-index: 2;
  }

  .chip-label {
    --_font-size-adjust: 0.7;
    position: absolute;
    width: var(--chip-size);
    height: var(--chip-size);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    z-index: 2;
    font-size: calc(var(--chip-size) * var(--_font-size-adjust));
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

  & > * {
    /*
    create the cutout mask around the image,
    it's just a radial gradient positioned at the same place as the
    psuedo-element ::after
    */

    &:not(.chip-icon, .chip-label) {
      mask-image: radial-gradient(
        var(--computed-mask-diameter) var(--computed-mask-diameter) at var(--computed-position-x)
          var(--computed-position-y),
        transparent calc(50% - 0.5px),
        black calc(50% + 0.5px)
      );
    }
  }

  &.circle {
    &::after,
    .chip-icon,
    .chip-label {
      top: calc(var(--computed-position-y) - (var(--chip-size) / 2));
      left: calc(var(--computed-position-x) - (var(--chip-size) / 2));
    }
  }

  &.square {
    &::after,
    .chip-icon,
    .chip-label {
      top: calc(var(--computed-position-y) - (var(--chip-size) / 2));
      left: calc(var(--computed-position-x) - (var(--chip-size) / 2));
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
}
</style>
