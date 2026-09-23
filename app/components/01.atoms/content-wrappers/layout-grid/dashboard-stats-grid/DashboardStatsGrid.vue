<template>
  <div class="dashboard-stats-grid" :class="[elementClasses]">
    <section class="top-row">
      <div class="top-row-slot-1">
        <div class="top-row-slot-1-inner">
          <div v-for="key in topRowSlot1ItemCount" :key="key" class="panel">
            <slot :name="`top-row-slot1-${key}-content`"></slot>
          </div>
        </div>
      </div>

      <div class="top-row-slot-2">
        <div class="panel">
          <slot name="top-row-slot-2"></slot>
        </div>
      </div>
      <div class="top-row-slot-3">
        <div class="panel">
          <slot name="top-row-slot-3"></slot>
        </div>
      </div>
    </section>

    <section class="bottom-row">
      <div v-for="key in bottomRowItemCount" :key="key" class="panel">
        <slot :name="`bottom-row-${key}-content`"></slot>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Props {
  topRowSlot1ItemCount?: number;
  bottomRowItemCount?: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  topRowSlot1ItemCount: 6,
  bottomRowItemCount: 4,
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
  .dashboard-stats-grid {
    .panel {
      border: var(--dashboard-stats-grid-border-width, 0.1rem) solid
        var(--dashboard-stats-grid-border-colour, hsl(0, 29%, 3%));
      border-radius: var(--dashboard-stats-grid-border-radius, 1.2rem);
      padding: var(--dashboard-stats-grid-panel-padding, 1.2rem);
      height: auto;
    }

    container-type: inline-size;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--dashboard-stats-grid-gap, 1.2rem);
    width: 100%;
    margin-inline: auto;

    /* CSS Gap Decorations (rule/rule-break/rule-inset) — limited browser support as of 2026, transparent by default */
    rule: var(--dashboard-stats-grid-rule-width, 0.1rem) solid var(--dashboard-stats-grid-rule-colour, transparent);
    rule-break: intersection;
    rule-inset: var(--dashboard-stats-grid-rule-inset, 0);

    .top-row {
      display: grid;
      gap: var(--dashboard-stats-grid-gap, 1.2rem);
      width: 100%;

      grid-template-columns: 1fr;
      grid-template-areas:
        "slot1"
        "slot2"
        "slot3";

      @container (min-width: 1024px) {
        grid-template-columns: 1fr minmax(46rem, 33%);
        grid-template-areas:
          "slot1 slot2"
          "slot3 slot2";
      }
    }

    .top-row-slot-1 {
      grid-area: slot1;
      container-type: inline-size;

      .top-row-slot-1-inner {
        display: grid;
        grid-template-columns: repeat(2, 1fr);

        gap: var(--dashboard-stats-grid-gap, 1.2rem);

        @container (min-width: 680px) {
          grid-template-columns: repeat(3, 1fr);
        }

        .panel {
          display: grid;
        }
      }
    }

    .top-row-slot-2 {
      grid-area: slot2;
      display: grid;
    }
    .top-row-slot-3 {
      grid-area: slot3;
      display: grid;
    }

    .bottom-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--dashboard-stats-grid-gap, 1.2rem);
    }
  }
}
</style>
