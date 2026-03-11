<template>
  <component
    :is="tag"
    class="layout-grid-by-width"
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
  columnWidth?: string;
  gap?: string;
  singleColBelow?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  label: "",
  columnWidth: "300px",
  gap: "1rem",
  singleColBelow: "768px",
  styleClassPassthrough: () => [],
});

const headingId = useId();
const needsLabel = computed(() => props.tag === "section");

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
  .layout-grid-by-width {
    container-type: inline-size;
    container-name: layoutGrid;

    --_gap: v-bind(gap);

    .layout-grid-inner {
      display: grid;
      grid-auto-flow: row;
      gap: var(--_gap);

      @container layoutGrid (width >= 768px) {
        grid-template-columns: repeat(auto-fit, minmax(v-bind(columnWidth), 1fr));
        gap: var(--_gap);
      }
    }
  }
}
</style>
