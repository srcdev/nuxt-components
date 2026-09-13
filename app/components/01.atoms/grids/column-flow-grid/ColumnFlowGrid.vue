<template>
  <component
    :is="tag"
    class="column-flow-grid-wrapper"
    :class="[elementClasses]"
    :style="`--_column-flow-grid-gap: ${gap}${unit}; --_item-min-width: ${itemMinWidth}px`"
  >
    <div v-for="(_, name) in $slots" :key="name" class="column-flow-grid-item">
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
  .column-flow-grid-wrapper {
    columns: auto var(--_item-min-width);
    column-gap: var(--_column-flow-grid-gap);

    .column-flow-grid-item {
      break-inside: avoid;
      outline: 0.1rem solid var(--column-flow-grid-item-border-colour, var(--theme-border));
      padding: var(--column-flow-grid-item-padding, 1.2rem);
      margin-block-end: var(--_column-flow-grid-gap);
    }
  }
}
</style>
