<template>
  <component :is="tag" class="eyebrow-text" :class="[elementClasses]">
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
.eyebrow-text {
  text-transform: uppercase;
  color: var(--colour-text-eyebrow);

  &.large {
    font-size: 4.5rem;
  }

  &.medium {
    font-size: 3.5rem;
  }

  &.small {
    font-size: 2.5rem;
  }
}
</style>
