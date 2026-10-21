<template>
  <div class="dashboard-stats-grid" :class="[elementClasses]">
    <section class="dashboard-stats-grid-top-row">
      <div class="dashboard-stats-grid-top-row-slot-1">
        <div class="dashboard-stats-grid-top-row-slot-1-inner">
          <div v-for="key in topRowSlot1Count" :key="key" class="dashboard-stats-grid-panel">
            <slot :name="`top-row-slot1-${key}-content`"></slot>
          </div>
        </div>
      </div>

      <div class="dashboard-stats-grid-top-row-slot-2">
        <div class="dashboard-stats-grid-panel">
          <slot name="top-row-slot-2"></slot>
        </div>
      </div>
      <div class="dashboard-stats-grid-top-row-slot-3">
        <div class="dashboard-stats-grid-panel">
          <slot name="top-row-slot-3"></slot>
        </div>
      </div>
    </section>

    <section class="dashboard-stats-grid-bottom-row">
      <div v-for="key in bottomRowCount" :key="key" class="dashboard-stats-grid-panel">
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

const toItemCount = (value: number) => (Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0);
const topRowSlot1Count = computed(() => toItemCount(props.topRowSlot1ItemCount));
const bottomRowCount = computed(() => toItemCount(props.bottomRowItemCount));

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
    container-type: inline-size;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--dashboard-stats-grid-gap, 1.2rem);
    width: 100%;
    margin-inline: auto;

    /* CSS Gap Decorations (rule/rule-break/rule-inset) — limited browser support as of 2026, transparent by default */
    rule: var(--dashboard-stats-grid-rule-width, 0.1rem) solid var(--dashboard-stats-grid-rule-colour, transparent);
    rule-break: intersection;
    rule-inset: var(--dashboard-stats-grid-rule-inset, 0);

    .dashboard-stats-grid-panel {
      border: var(--dashboard-stats-grid-border-width, 0.1rem) solid
        var(--dashboard-stats-grid-border-colour, var(--theme-border));
      border-radius: var(--dashboard-stats-grid-border-radius, 1.2rem);
      padding: var(--dashboard-stats-grid-panel-padding, 1.2rem);
      height: auto;
      min-inline-size: 0;
      overflow-wrap: anywhere;
    }

    .dashboard-stats-grid-top-row {
      display: grid;
      gap: var(--dashboard-stats-grid-gap, 1.2rem);
      width: 100%;

      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "slot1"
        "slot2"
        "slot3";

      @container (min-width: 1024px) {
        grid-template-columns: minmax(0, 1fr) minmax(46rem, 33%);
        grid-template-areas:
          "slot1 slot2"
          "slot3 slot2";
      }
    }

    .dashboard-stats-grid-top-row-slot-1 {
      grid-area: slot1;
      container-type: inline-size;

      .dashboard-stats-grid-top-row-slot-1-inner {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));

        gap: var(--dashboard-stats-grid-gap, 1.2rem);

        @container (min-width: 680px) {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .dashboard-stats-grid-panel {
          display: grid;
        }
      }
    }

    .dashboard-stats-grid-top-row-slot-2 {
      grid-area: slot2;
      display: grid;
      min-inline-size: 0;
    }

    .dashboard-stats-grid-top-row-slot-3 {
      grid-area: slot3;
      display: grid;
      min-inline-size: 0;
    }

    .dashboard-stats-grid-bottom-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--dashboard-stats-grid-gap, 1.2rem);
    }
  }
}
</style>
