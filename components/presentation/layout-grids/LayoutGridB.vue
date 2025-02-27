<template>
  <div class="layout-grid-b" :class="[elementClasses]">
    <section class="top-row">
      <div class="top-row-slot-1">
        <div class="top-row-slot-1-inner">
          <div v-for="key in topRowSlot1ItemCount" class="panel">
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
      <div v-for="key in bottomRowItemCount" class="panel">
        <slot :name="`bottom-row-${key}-content`"></slot>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  topRowSlot1ItemCount: {
    type: Number as PropType<number>,
    default: 6,
  },
  bottomRowItemCount: {
    type: Number as PropType<number>,
    default: 4,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
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
.layout-grid-b {
  --_border-color: light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%));
  --_color: light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%));
  --_gap: 12px;

  .panel {
    border: 1px solid var(--_border-color);
    border-radius: 12px;
    padding: 12px;
    height: auto;
  }

  container-type: inline-size;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--_gap);
  width: 100%;
  margin-inline: auto;

  .top-row {
    display: grid;
    gap: var(--_gap);
    width: 100%;

    grid-template-columns: 1fr;
    grid-template-areas:
      'slot1'
      'slot2'
      'slot3';

    @container (min-width: 1024px) {
      grid-template-columns: 1fr minmax(460px, 33%);
      grid-template-areas:
        'slot1 slot2'
        'slot3 slot2';
    }
  }

  .top-row-slot-1 {
    grid-area: slot1;
    container-type: inline-size;

    .top-row-slot-1-inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      gap: var(--_gap);

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
    gap: var(--_gap);
  }
}
</style>
