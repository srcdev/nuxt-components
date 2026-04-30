<template>
  <component :is="tag" class="auto-grid" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
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
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .auto-grid {
    --auto-grid-min-col-size: 250px;
    --auto-grid-gap: 1rem;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size), 100%), 1fr));
    gap: var(--auto-grid-gap);
  }
}
</style>
