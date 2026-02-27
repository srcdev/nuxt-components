<template>
  <component
    :is="tag"
    class="display-card"
    :class="[variant, elementClasses, { 'has-dividers': hasDividers }, { 'no-outline': noOutline }]"
  >
    <div v-if="slots.header" class="card-row display-card-header">
      <slot name="header"></slot>
    </div>
    <div v-if="slots.default" class="card-row display-card-content">
      <slot name="default"></slot>
    </div>
    <div v-if="slots.footer" class="card-row display-card-footer">
      <slot name="footer"></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: "div",
    validator(value: string) {
      return ["div", "section", "article", "aside", "main", "nav"].includes(value);
    },
  },
  hasDividers: {
    type: Boolean,
    default: false,
  },
  noOutline: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "solid",
    validator(value: string) {
      return ["solid", "subtle", "soft", "outline"].includes(value);
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
});
const slots = useSlots();

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.display-card {
  --_inner-padding: 1rem;
  --_background-color: transparent;
  --_border-color: transparent;
  --_border-width: 0.2rem;
  --_box-shadow-color: transparent;

  display: grid;
  grid-auto-flow: row;
  /* gap: 1rem; */
  border-radius: 0.5rem;
  overflow: hidden;

  background-color: var(--_background-color, transparent);
  border: var(--_border-width) solid var(--_border-color, transparent);
  box-shadow: 0 0 0.4rem var(--_border-width) var(--_box-shadow-color, transparent);

  &.no-outline {
    --_border-width: 0;
  }

  &.solid {
    --_background-color: light-dark(var(--slate-00), var(--slate-10));
    --_border-color: light-dark(var(--slate-04), var(--slate-08));
  }

  &.subtle {
    --_background-color: color-mix(in oklab, light-dark(var(--slate-01), var(--slate-08)) 50%, transparent);
    --_border-color: light-dark(var(--slate-03), var(--slate-09));
  }

  &.soft {
    --_background-color: color-mix(in oklab, light-dark(var(--slate-01), var(--slate-08)) 20%, transparent);
    --_box-shadow-color: color-mix(in oklab, light-dark(var(--slate-02), var(--slate-08)) 80%, transparent);
  }

  &.outline {
    --_background-color: transparent;
    --_border-color: light-dark(var(--slate-04), var(--slate-08));
  }

  &.has-dividers {
    .card-row + .card-row {
      border-top: 0.2rem solid var(--_border-color);
    }
  }

  .display-card-header {
    padding: var(--_inner-padding);
  }

  .display-card-content {
    padding: var(--_inner-padding);
  }

  .display-card-footer {
    padding: var(--_inner-padding);
  }
}
</style>
