<template>
  <div class="ui-content-grid" :class="[applyClasses]" :data-testid="dataTestid">
    <div v-if="slots.slot1" class="col-1">
      <slot name="slot1"></slot>
    </div>
    <div v-if="slots.slot2" class="col-2">
      <slot name="slot2"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  dataTestid: {
    type: String,
    default: "ui-content-grid",
  },
  applyClasses: {
    type: String,
    default: "",
  },
});

const slots = useSlots();
</script>

<style lang="css">
.ui-content-grid {
  --_margin-inline: 0;
  --_grid-template-columns: repeat(4, 1fr);
  --_grid-template-rows: repeat(2, auto);
  --_grid-gap: 1.6rem;

  display: grid;
  gap: var(--_grid-gap);
  grid-template-columns: var(--_grid-template-columns);
  grid-template-rows: var(--_grid-template-rows);
  margin-inline: var(--_margin-inline);

  @container content (min-width: 768px) {
    --_margin-inline: 0;
    --_grid-template-columns: repeat(6, 1fr);
    --_grid-gap: 3.2rem;
  }

  @container content (min-width: 1024px) {
    --_margin-inline: 0;
    --_grid-template-columns: repeat(12, 1fr);
    --_grid-template-rows: initial;
  }

  .col-1 {
    --_grid-column: 1 / span 4;
    --_grid-row: 1;
    grid-column: var(--_grid-column);
    grid-row: var(--_grid-row);

    @container content (min-width: 768px) {
      --_grid-column: 1 / span 6;
    }

    @container content (min-width: 1024px) {
      --_grid-column: 1 / span 6;
    }
  }

  .col-2 {
    --_grid-column: 1 / span 4;
    --_grid-row: 2;
    grid-column: var(--_grid-column);
    grid-row: var(--_grid-row);

    @container content (min-width: 768px) {
      --_grid-column: 1 / span 6;
    }

    @container content (min-width: 1024px) {
      --_grid-column: 7 / span 6;
      --_grid-row: 1;
    }
  }
}
</style>
