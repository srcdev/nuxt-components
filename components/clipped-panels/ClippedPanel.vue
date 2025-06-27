<template>
  <component :is="tag" class="clipped-panel" :class="[variant, elementClasses]">
    <slot name="default"></slot>
  </component>
</template>

<script lang="ts">
const TAGS_ALLOWED = <string[]>['div', 'p', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav', 'ul', 'ol'];
</script>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: 'div',
    validator(value: string) {
      return TAGS_ALLOWED.includes(value);
    },
  },
  variant: {
    type: String,
    default: 'square',
    validator(value: string) {
      return ['circle-cutout', 'rectangle', 'square'].includes(value);
    },
  },
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
.clipped-panel {
  --_foreground-color: light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%));

  /* Component styles */

  background-color: red;
  /* color: var(--_foreground-color); */
  outline: 1px solid var(--_foreground-color);
  /* box-shadow: 5px 5px 5px 5px white; */

  aspect-ratio: 1;

  &.rectangle {

    --_max-x-position: 300px;
    --_curve-radius: 10px;

    clip-path: path('M 10, 50 L 140, 50 A 10, 10, 0, 0, 0 150, 40 L 150, 10 A 10, 10, 0, 0, 1 160, 0 L 290, 0 A 10, 10, 0, 0, 1 300, 10 L 300, 190 A 10, 10, 0, 0, 1 290, 200 L 10, 200 A 10, 10, 0, 0, 1 0, 190 L 0, 60 A 10, 10, 0, 0, 1 10, 50 Z');
    width: 300px;
  }
  &.square {
    /* clip-path: path('M 10, 50 L 90, 50 A 10, 10, 0, 0, 0 100, 40 L 100, 10 L 110, 0 L 190, 0 L 200, 10 L 200, 190 L 190, 200 L 10, 200 L 0, 190 L 0, 60 L 10, 50 Z'); */
    clip-path: path('M 10, 50 L 90, 50 A 10, 10, 0, 0, 0 100, 40 L 100, 10 A 10, 10, 0, 0, 1 110, 0 L 190, 0 A 10, 10, 0, 0, 1 200, 10 L 200, 190 A 10, 10, 0, 0, 1 190, 200 L 10, 200 A 10, 10, 0, 0, 1 0, 190 L 0, 60 A 10, 10, 0, 0, 1 10, 50 Z');
    width: 200px;
  }
  &.circle-cutout {
    clip-path: path('M  Z');
  }
}
</style>
