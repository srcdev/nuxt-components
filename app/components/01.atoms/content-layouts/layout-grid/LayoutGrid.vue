<template>
  <component
    :is="tag"
    class="layout-grid"
    :aria-labelledby="needsLabel ? headingId : undefined"
    :class="[elementClasses]"
  >
    <p v-if="needsLabel" :id="headingId" class="sr-only">
      {{ props.label || "If tag='section' then a label is required" }}
    </p>
    <div class="layout-grid__inner">
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
  /** Integer → repeat(N, 1fr)  |  CSS string → repeat(auto-fill, minmax(value, 1fr)) */
  columns?: number | string;
  gap?: string;
  singleColBelow?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  label: "",
  columns: 2,
  gap: "1rem",
  singleColBelow: "0px",
  styleClassPassthrough: () => [],
});

const gridTemplateColumns = computed(() =>
  typeof props.columns === "number"
    ? `repeat(${props.columns}, 1fr)`
    : `repeat(auto-fill, minmax(${props.columns}, 1fr))`
);

const headingId = useId();
const needsLabel = computed(() => props.tag === "section");

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
  .layout-grid {
    container-type: inline-size;
    container-name: layoutGrid;

    .layout-grid__inner {
      display: grid;
      gap: v-bind(gap);
      grid-template-columns: v-bind(gridTemplateColumns);

      @container layoutGrid (width >= v-bind(singleColBelow)) {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
