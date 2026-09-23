<template>
  <div class="dashboard-quad-grid-wrapper" :class="[elementClasses]">
    <div class="dashboard-quad-grid">
      <div class="slot1">
        <slot name="slot1"></slot>
      </div>
      <div class="slot2">
        <slot name="slot2"></slot>
      </div>
      <div class="slot3">
        <slot name="slot3"></slot>
      </div>
      <div class="slot4">
        <slot name="slot4"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
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
  .dashboard-quad-grid-wrapper {
    container-type: inline-size;

    .dashboard-quad-grid {
      display: grid;
      gap: var(--dashboard-quad-grid-gap, 2rem);

      /* CSS Gap Decorations (rule/rule-break/rule-inset) — limited browser support as of 2026, transparent by default */
      rule: var(--dashboard-quad-grid-rule-width, 0.1rem) solid var(--dashboard-quad-grid-rule-colour, transparent);
      rule-break: intersection;
      rule-inset: var(--dashboard-quad-grid-rule-inset, 0);

      & > div {
        padding: var(--dashboard-quad-grid-padding, 2rem);
        outline: var(--dashboard-quad-grid-outline-width, 0.1rem) solid
          var(--dashboard-quad-grid-outline-colour, black);
        outline-offset: var(--dashboard-quad-grid-outline-offset, 0);
        border: var(--dashboard-quad-grid-border-width, 0) solid
          var(--dashboard-quad-grid-border-colour, black);
        border-radius: var(--dashboard-quad-grid-border-radius, 0.5rem);
      }

      @container (min-width: 768px) {
        grid-template-columns: repeat(2, auto);
        grid-template-rows: repeat(3, auto);

        .slot1 {
          grid-column: 1 / span 2;
          grid-row: 1;
        }

        .slot2 {
          grid-column: 1 / span 2;
          grid-row: 2;
        }

        .slot3 {
          grid-column: 1;
          grid-row: 3;
        }

        .slot4 {
          grid-column: 2;
          grid-row: 3;
        }
      }

      @container (min-width: 1060px) {
        grid-template-columns: repeat(3, auto);
        grid-template-rows: repeat(2, auto);

        .slot1 {
          grid-column: 1;
          grid-row: 1 / span 2;
        }

        .slot2 {
          grid-column: 2 / span 2;
          grid-row: 1;
        }

        .slot3 {
          grid-column: 2;
          grid-row: 2;
        }

        .slot4 {
          grid-column: 3;
          grid-row: 2;
        }
      }
    }
  }
}
</style>
