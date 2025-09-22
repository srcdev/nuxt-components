<template>
  <div class="animated-svg-text" :class="[elementClasses]">
    <slot name="text"></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">

@keyframes animatedSvgText {
  0% {
    fill: transparent;
    stroke-dashoffset: var(--_animated-svg-text-stroke-dasharray);
    stroke-width: 0.3;
  }
  70% {
    fill: transparent;
    stroke-width: 0.3;
  }
  100% {
    fill: var(--_animated-svg-fill-color);
    stroke-dashoffset: 0;
    stroke-width: 0;
  }
}

html {

  &[data-color-scheme='light'] {
    .animated-svg-text {
      --_animated-svg-text-color: var(--_animated-svg-text-stroke-light);
      --_animated-svg-fill-color: var(--_animated-svg-text-fill-light);
    }
  }
  &[data-color-scheme='dark'] {
    .animated-svg-text {
      --_animated-svg-text-color: var(--_animated-svg-text-stroke-dark);
      --_animated-svg-fill-color: var(--_animated-svg-text-fill-dark);
    }
  }
  &[data-color-scheme='auto'] {
    .animated-svg-text {
      @media (prefers-color-scheme: light) {
        --_animated-svg-text-color: var(--_animated-svg-text-stroke-light);
        --_animated-svg-fill-color: var(--_animated-svg-text-fill-light);
      }

      @media (prefers-color-scheme: dark) {
        --_animated-svg-text-color: var(--_animated-svg-text-stroke-dark);
        --_animated-svg-fill-color: var(--_animated-svg-text-fill-dark);
      }
    }
  }

  .animated-svg-text {

    --_animated-svg-text-color: var(--_animated-svg-text-stroke-light):
    --_animated-svg-fill-color: var(--_animated-svg-text-fill-light);

    svg path {
      stroke: var(--_animated-svg-text-color);
      stroke-width: 0.3;
      stroke-dasharray: var(--_animated-svg-text-stroke-dasharray);
      stroke-dashoffset: var(--_animated-svg-text-stroke-dasharray);
      animation: animatedSvgText var(--_animated-svg-animation-duration) linear 1 forwards;
    }
  }

}
</style>
