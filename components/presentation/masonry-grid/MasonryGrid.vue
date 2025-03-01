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
  columns: var(--_item-min-width);
  gap: var(--_masonry-grid-gap);

  .masonry-grid-item {
    break-inside: avoid;
    outline: 0.1rem solid #cdcdcd;
    padding: 1.2rem;
    margin-block-end: var(--_masonry-grid-gap);
  }
}
</style>
