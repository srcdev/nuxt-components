<template>
  <div class="page-row" :class="[elementClasses]" :data-testid="dataTestid">
    <div class="page-row-inner" :class="[{ 'full-width': isFullWidth }]">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  dataTestid: {
    type: String,
    default: 'page-row',
  },
  isFullWidth: {
    type: Boolean,
    default: false,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.page-row {
  --_gutter-width: 24px;
  --_content-width: 1fr;
  --_grid-template-columns: var(--_gutter-width) 1fr var(--_gutter-width);

  display: grid;
  grid-template-columns: var(--_grid-template-columns);

  @media screen and (min-width: 1024px) {
    --_gutter-width: 24px;
  }

  @media screen and (min-width: 1280px) {
    --_gutter-width: 32px;
  }

  .page-row-inner {
    grid-column: 2;

    &.full-width {
      --_grid-template-columns: 0fr 1fr 0fr;
      grid-column: 1 / span 3;
    }
  }
}
</style>
