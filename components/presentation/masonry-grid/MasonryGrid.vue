<template>
  <div class="masonry-grid-wrapper" :class="[elementClasses]" :style="`--_masonry-grid-gap: ${gap}${unit}; --_item-min-width: ${itemMinWidth}px`">
    <template v-for="item in gridData" :key="item.id">
      <div class="masonry-grid-item">
        <slot :name="item.id"></slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  gridData: {
    type: Object,
    default: {},
  },
  itemMinWidth: {
    type: Number,
    default: 300,
  },
  gap: {
    type: Number,
    default: 1.2,
  },
  unit: {
    type: String,
    default: 'rem',
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const gridData = toRef(() => props.gridData);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.masonry-grid-wrapper {
  --_border-color: light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%));
  --_color: light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%));

  columns: var(--_item-min-width);
  gap: 12px;

  .masonry-grid-item {
    break-inside: avoid;
    outline: 0.1rem solid var(--_border-color);
    padding: 1.2rem;
    margin-block-end: var(--_masonry-grid-gap);
  }
}
</style>
