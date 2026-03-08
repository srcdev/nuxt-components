<template>
  <component :is="tag" class="text-block" :class="[elementClasses]">
    <slot name="default"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main";
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .text-block {
    padding-block-start: var(--fluid-40-80);
    padding-block-end: var(--fluid-40-80);
  }
}
</style>
