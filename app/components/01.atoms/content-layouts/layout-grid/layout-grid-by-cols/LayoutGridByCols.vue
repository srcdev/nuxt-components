<template>
  <component
    :is="tag"
    class="layout-grid-by-cols"
    :aria-labelledby="needsLabel ? headingId : undefined"
    :class="[elementClasses]"
  >
    <p v-if="needsLabel" :id="headingId" class="sr-only">
      {{ props.label || "If tag='section' then a label is required" }}
    </p>
    <div class="layout-grid-inner">
      <template v-for="index in itemCount" :key="index">
        <slot :name="`item-${index - 1}`"></slot>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section";
  label?: string;
  itemCount: number;
  columnCount?: 2 | 3 | 4 | 5 | 6;
  gap?: string;
  singleColBelow?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  label: "",
  columnCount: 2,
  gap: "1rem",
  singleColBelow: "768px",
  styleClassPassthrough: () => [],
});

const headingId = useId();
const needsLabel = computed(() => props.tag === "section");
const columnCount = computed(() => (props.columnCount < 2 ? 2 : props.columnCount));

const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    updateElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .layout-grid-by-cols {
    container-type: inline-size;
    container-name: layoutGrid;

    --_gap: v-bind(gap);

    .layout-grid-inner {
      display: grid;
      grid-auto-flow: row;
      gap: var(--_gap);

      @container layoutGrid (width >= 768px) {
        grid-template-columns: repeat(v-bind(columnCount), 1fr);
        gap: var(--_gap);
      }
    }
  }
}
</style>
