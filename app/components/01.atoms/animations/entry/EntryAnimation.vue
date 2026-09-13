<template>
  <component :is="tag" :class="[elementClasses]">
    <slot name="default"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "aside";
  animationType?: "entry-slide-in" | "entry-zoom-reveal" | "entry-exit-blur";
  /** Renders as a plain element with no animation class — e.g. the first item in a looped list
   * that's already above the fold, where an entry animation would just delay visible content. */
  skipAnimation?: boolean;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  animationType: "entry-slide-in",
  skipAnimation: false,
  styleClassPassthrough: () => [],
});

const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

if (!props.skipAnimation) {
  updateElementClasses(props.animationType);
}
</script>
