<template>
  <div class="masonry-grid-wrapper" :class="[elementClasses]" :style="`--_masonry-grid-gap: ${gap}${unit}; --_item-min-width: ${itemMinWidth}px`" ref="gridWrapper">
    <template v-for="item in gridData" :key="item.id">
      <div class="masonry-grid-item">
        <slot :name="item.id"></slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';

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

const gridWrapper = ref<HTMLDivElement>();

const getColumnCountWithinGridWrapper = () => {
  return gridWrapper.value ? Math.floor(gridWrapper.value.clientWidth / props.itemMinWidth) : 0;
};

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

onMounted(() => {
  console.log(getColumnCountWithinGridWrapper());
});

useResizeObserver(gridWrapper, () => {
  console.log(getColumnCountWithinGridWrapper());
});
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
