<template>
  <component
    :is="tag"
    class="masonry-grid-wrapper"
    :class="[elementClasses]"
    :style="`--_masonry-grid-gap: ${gap}${unit}; --_item-min-width: ${itemMinWidth}px`"
  >
    <div v-for="(_, name) in $slots" :key="name" class="masonry-grid-item">
      <slot :name="name"></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main";
  itemMinWidth?: number;
  gap?: number;
  unit?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  itemMinWidth: 300,
  gap: 1.2,
  unit: "rem",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .masonry-grid-wrapper {
    columns: auto var(--_item-min-width);
    column-gap: var(--_masonry-grid-gap);

    .masonry-grid-item {
      break-inside: avoid;
      outline: 0.1rem solid var(--masonry-grid-item-border-colour, var(--theme-border));
      padding: var(--masonry-grid-item-padding, 1.2rem);
      margin-block-end: var(--_masonry-grid-gap);
    }
  }
}
</style>
