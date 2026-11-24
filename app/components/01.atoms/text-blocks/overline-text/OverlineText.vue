<template>
  <component :is="tag" class="overline-text" :class="[elementClasses]" :data-font-size="fontSize">
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
  .overline-text {
    text-transform: uppercase;
    background-clip: text;
    background-image: var(--overline-text-bg-img, linear-gradient(135deg, #c2a770, #b4747e, #d1bd94));
    font-family: var(--overline-text-font-family, inherit);
    font-style: var(--overline-text-font-style, italic);
    font-weight: var(--overline-text-font-weight, inherit);
    letter-spacing: var(--overline-text-letter-spacing, inherit);
    color: transparent;
    overflow-wrap: anywhere;

    &[data-font-size="large"] {
      font-size: var(--overline-text-large, 1.4rem);
    }

    &[data-font-size="medium"] {
      font-size: var(--overline-text-medium, 1.2rem);
    }

    &[data-font-size="small"] {
      font-size: var(--overline-text-small, 1rem);
    }
  }
}
</style>
