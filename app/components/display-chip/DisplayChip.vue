<template>
  <component :is="tag" class="display-chip-core" :class="[shape, elementClasses]" :style="chipStyles">
    <slot></slot>
  </component>
</template>

<script lang="ts">
export interface DisplayChipConfig {
  size: string
  maskWidth: string
  offset: string
  angle: string
}

export interface DisplayChipProps {
  tag?: "div" | "span"
  shape?: "circle" | "square"
  styleClassPassthrough?: string | string[]
}

export interface ChipSlots {
  default(props?: {}): any
  content(props?: {}): any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<DisplayChipProps>(), {
  tag: "div",
  shape: "circle",
  styleClassPassthrough: () => [],
})
defineSlots<ChipSlots>()

const chipConfig = defineModel<DisplayChipConfig>({
  type: Object as PropType<{
    size: string
    maskWidth: string
    offset: string
    angle: string
  }>,
  default: () => ({
    size: "12px",
    maskWidth: "4px",
    offset: "0px",
    angle: "90deg",
  }),
  required: false,
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const chipStyles = computed(() => ({
  "--chip-size": chipConfig.value.size,
  "--chip-mask-width": chipConfig.value.maskWidth,
  "--chip-offset": chipConfig.value.offset,
  "--chip-angle": chipConfig.value.angle,
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
  }

  & > * {
    /*
    create the cutout mask around the image,
    it's just a radial gradient positioned at the same place as the
    psuedo-element ::after
    */

    mask-image: radial-gradient(
      var(--computed-mask-diameter) var(--computed-mask-diameter) at var(--computed-position-x)
        var(--computed-position-y),
      transparent calc(50% - 0.5px),
      black calc(50% + 0.5px)
    );
  }

  &.circle {
    &::after {
      top: calc(var(--computed-position-y) - (var(--chip-size) / 2));
      left: calc(var(--computed-position-x) - (var(--chip-size) / 2));
    }
  }

  &.square {
    &::after {
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

  .chip-label {
    display: none;
  }
}
</style>
