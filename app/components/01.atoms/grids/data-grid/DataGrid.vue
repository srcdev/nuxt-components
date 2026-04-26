<template>
  <component :is="tag" class="data-grid" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
    <slot v-for="(_, name) in $slots" :key="name" :name="name"></slot>
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
const { ariaLabelledby } = useAriaLabelledById(props.tag);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough),
);
</script>

<style lang="css">
@layer components {
  .data-grid {
    /* CSS Tockens for @container grid-template-columns */
    --data-grid-columns: repeat(auto-fit, minmax(250px, 1fr));
    --data-grid-gap: 1rem;

    display: grid;
    grid-template-columns: var(--data-grid-columns);
    gap: var(--data-grid-gap);
  }
}
</style>
