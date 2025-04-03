<template>
  <div class="animated-svg-text" :class="[elementClasses]">
    <slot name="text"></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@keyframes textAnimation {
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
    fill: var(--_animated-svg-fill-color, var(--_animated-svg-text-fill-light));
    stroke-dashoffset: 0;
    stroke-width: 0;
  }
}
.animated-svg-text {
  svg path {
    stroke: var(--_animated-svg-text-color, var(--_animated-svg-text-stroke-light));
    stroke-width: 0.3;
    stroke-dasharray: var(--_animated-svg-text-stroke-dasharray);
    stroke-dashoffset: var(--_animated-svg-text-stroke-dasharray);
    animation: textAnimation var(--_animated-svg-animation-duration) linear 1 forwards;
  }

  @media (prefers-color-scheme: light) {
    --_animated-svg-text-color: var(--_animated-svg-text-stroke-light);
    --_animated-svg-fill-color: var(--_animated-svg-text-fill-light);
  }

  @media (prefers-color-scheme: dark) {
    --_animated-svg-text-color: var(--_animated-svg-text-stroke-dark);
    --_animated-svg-fill-color: var(--_animated-svg-text-fill-dark);
  }
}

html {
  &[data-color-scheme='light'] {
    --_animated-svg-text-color: var(--_animated-svg-text-stroke-light);
    --_animated-svg-fill-color: var(--_animated-svg-text-fill-light);
  }
  &[data-color-scheme='dark'] {
    --_animated-svg-text-color: var(--_animated-svg-text-stroke-dark);
    --_animated-svg-fill-color: var(--_animated-svg-text-fill-dark);
  }
}
</style>
