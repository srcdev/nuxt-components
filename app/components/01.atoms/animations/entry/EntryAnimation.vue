<template>
  <component :is="tag" :class="[elementClasses]">
    <slot name="default"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "aside";
  animationType?: "entry-slide-in" | "entry-zoom-reveal" | "entry-exit-blur";
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  animationType: "entry-slide-in",
  styleClassPassthrough: () => [],
});

const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

updateElementClasses(props.animationType);
</script>
