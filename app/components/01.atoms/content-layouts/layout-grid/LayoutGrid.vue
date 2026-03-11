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
    <div v-if="showDevWarning" class="layout-grid__dev-warning" role="alert" aria-live="polite">
      <strong>LayoutGrid dev warning:</strong> {{ devWarningMessage }}
    </div>
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
  /** Explicit column width — overrides fractional sizing. Triggers a dev warning when set. */
  colWidth?: string;
  gap?: string;
  singleColBelow?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  label: "",
  columns: 2,
  colWidth: undefined,
  gap: "1rem",
  singleColBelow: "0px",
  styleClassPassthrough: () => [],
});

const gridTemplateColumns = computed(() => {
  if (props.colWidth) {
    if (typeof props.columns === "number") {
      return `repeat(${props.columns}, ${props.colWidth})`;
    }
    return `repeat(auto-fill, minmax(${props.colWidth}, 1fr))`;
  }
  if (typeof props.columns === "number") {
    return `repeat(${props.columns}, 1fr)`;
  }
  return `repeat(auto-fill, minmax(${props.columns}, 1fr))`;
});

const showDevWarning = computed(() => import.meta.dev && !!props.colWidth);

const devWarningMessage = computed(() => {
  if (typeof props.columns === "number") {
    return `colWidth="${props.colWidth}" overrides fractional sizing from columns=${props.columns}. Using repeat(${props.columns}, ${props.colWidth}) — may overflow on narrow containers.`;
  }
  return `Both columns="${props.columns}" (CSS string) and colWidth="${props.colWidth}" are set. colWidth wins: repeat(auto-fill, minmax(${props.colWidth}, 1fr)).`;
});

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

    .layout-grid__dev-warning {
      padding: 1rem 1.2rem;
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 0.4rem;
      color: #664d03;
      font-family: monospace;
      font-size: 1.3rem;
      line-height: 1.5;
      margin-block-end: 1rem;
    }

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
