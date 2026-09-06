<template>
  <div class="animated-svg-text" :class="[elementClasses]">
    <slot name="text"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
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
@layer components {

@keyframes animatedSvgText {
  0% {
    fill: transparent;
    stroke-dashoffset: var(--animated-svg-text-stroke-dasharray, 1000);
    stroke-width: var(--animated-svg-text-stroke-width, 0.3);
  }
  70% {
    fill: transparent;
    stroke-width: var(--animated-svg-text-stroke-width, 0.3);
  }
  100% {
    fill: var(--animated-svg-text-fill-colour, var(--theme-text));
    stroke-dashoffset: 0;
    stroke-width: 0;
  }
}

.animated-svg-text {
  svg path,
  svg text {
    stroke: var(--animated-svg-text-stroke-colour, var(--theme-text));
    stroke-width: var(--animated-svg-text-stroke-width, 0.3);
    stroke-dasharray: var(--animated-svg-text-stroke-dasharray, 1000);
    stroke-dashoffset: var(--animated-svg-text-stroke-dasharray, 1000);
    animation: animatedSvgText var(--animated-svg-text-animation-duration, 2s) linear 1 forwards;
  }
}

}
</style>
