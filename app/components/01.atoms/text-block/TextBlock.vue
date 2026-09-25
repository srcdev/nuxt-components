<template>
  <component :is="tag" class="text-block" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
    <slot name="default" :heading-id="headingId"></slot>
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

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);

watch(
  () => props.styleClassPassthrough,
  (newVal) => {
    resetElementClasses(newVal ?? []);
  }
);
</script>

<style lang="css">
@layer components {
  .text-block {
    padding-block-start: var(--text-block-padding-block-start, var(--fluid-space-48-96));
    padding-block-end: var(--text-block-padding-block-end, var(--fluid-space-48-96));
  }
}
</style>
