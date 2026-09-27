<template>
  <component
    :is="tag"
    class="layout-grid-by-cols"
    :aria-labelledby="label ? ariaLabelledby : undefined"
    :class="[elementClasses]"
    :style="{
      '--layout-grid-by-cols-column-count': columnCountValue,
      '--layout-grid-by-cols-gap': gap,
      '--layout-grid-by-cols-single-col-below': singleColBelow,
    }"
  >
    <p v-if="ariaLabelledby && label" :id="headingId" class="sr-only">{{ label }}</p>
    <div class="layout-grid-by-cols-inner">
      <template v-for="(_, name) in $slots" :key="name">
        <slot :name="name"></slot>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section";
  label?: string;
  columnCount?: 2 | 3 | 4 | 5 | 6;
  gap?: string;
  singleColBelow?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  label: "",
  columnCount: undefined,
  gap: undefined,
  singleColBelow: undefined,
  styleClassPassthrough: () => [],
});

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);

const columnCountValue = computed(() =>
  props.columnCount === undefined ? undefined : Math.max(2, Math.round(props.columnCount))
);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .layout-grid-by-cols {
    .layout-grid-by-cols-inner {
      --_cols: var(--layout-grid-by-cols-column-count, 2);
      --_column-gap: var(--layout-grid-by-cols-column-gap, var(--layout-grid-by-cols-gap, 1rem));
      /* One column once the grid is narrower than the threshold, else N equal columns (no container query, so the threshold can be a token). */
      --_collapse: calc((var(--layout-grid-by-cols-single-col-below, 768px) - 100%) * 999);
      --_column-min: calc((100% - (var(--_cols) - 1) * var(--_column-gap)) / var(--_cols) - 0.1px);

      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, max(var(--_collapse), var(--_column-min))), 1fr));
      row-gap: var(--layout-grid-by-cols-row-gap, var(--layout-grid-by-cols-gap, 1rem));
      column-gap: var(--_column-gap);
    }
  }
}
</style>
