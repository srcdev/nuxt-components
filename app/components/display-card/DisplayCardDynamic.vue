<template>
  <component
    :is="tag"
    class="display-card-dynamic"
    :class="[variant, elementClasses, { 'has-dividers': hasDividers }, { 'no-outline': noOutline }]"
  >
    <template v-for="(_, name) in $slots" :key="name">
      <div>
        <slot :name="name"></slot>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "aside" | "main" | "nav";
  hasDividers?: boolean;
  noOutline?: boolean;
  variant?: "solid" | "subtle" | "soft" | "outline";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  hasDividers: false,
  noOutline: false,
  variant: "solid",
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
  .display-card-dynamic {
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

    .display-card-dynamic-header {
      padding: var(--_inner-padding);
    }

    .display-card-dynamic-content {
      padding: var(--_inner-padding);
    }

    .display-card-dynamic-footer {
      padding: var(--_inner-padding);
    }
  }
}
</style>
