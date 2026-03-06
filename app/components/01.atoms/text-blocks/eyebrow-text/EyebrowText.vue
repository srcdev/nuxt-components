<template>
  <component :is="tag" class="eyebrow-text" :class="[elementClasses, props.fontSize]">
    {{ textContent }}
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "p" | "div" | "span";
  fontSize?: "large" | "medium" | "small";
  textContent: string;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  fontSize: "medium",
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
.eyebrow-text {
  text-transform: uppercase;
  color: var(--colour-text-eyebrow);

  &.large {
    font-size: var(--eyebrow-text-large);
  }

  &.medium {
    font-size: var(--eyebrow-text-medium);
  }

  &.small {
    font-size: var(--eyebrow-text-small);
  }
}
}
</style>
