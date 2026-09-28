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

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .eyebrow-text {
    text-transform: uppercase;
    background-clip: text;
    background-image: var(--eyebrow-text-bg-img, linear-gradient(135deg, #c2a770, #b4747e, #d1bd94));
    font-style: italic;
    color: transparent;

    &.large {
      font-size: var(--eyebrow-text-large, 1.4rem);
    }

    &.medium {
      font-size: var(--eyebrow-text-medium, 1.2rem);
    }

    &.small {
      font-size: var(--eyebrow-text-small, 1rem);
    }
  }
}
</style>
