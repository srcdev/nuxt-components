<template>
  <div
    class="masonry-grid-wrapper"
    :class="[elementClasses]"
    :style="`--_masonry-grid-gap: ${gap}${unit}; --_item-min-width: ${itemMinWidth}px`"
    ref="gridWrapper"
  >
    <template v-for="item in rearrangedItems" :key="item.id">
      <div class="masonry-grid-item">
        <slot :name="item.id"></slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core"

const props = defineProps({
  gridData: {
    type: Array as PropType<any[]>,
    default: () => [],
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
    default: "rem",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const gridData = toRef(() => props.gridData)

const gridWrapper = ref<HTMLDivElement>()

const getColumnCountWithinGridWrapper = () => {
  return gridWrapper.value ? Math.floor(gridWrapper.value.clientWidth / props.itemMinWidth) : 0
}

// const columns = ref(4);
const columns = computed(() => {
  return gridWrapper.value ? Math.floor(gridWrapper.value.clientWidth / props.itemMinWidth) : 0
})

const rearrangeArray = (items: any[], columns: number): any[] => {
  const rows = Math.ceil(items.length / columns)
  const rearrangedArray = []

  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      const index = row * columns + col
      if (index < items.length) {
        rearrangedArray.push(items[index])
      }
    }
  }

  return rearrangedArray
}

const rearrangedItems = computed(() => rearrangeArray(props.gridData, columns.value))
// const rearrangedItems = computed(() => {
//   const rows = Math.ceil(props.gridData.length / columns.value);
//   const rearrangedArray = [];

//   for (let col = 0; col < columns.value; col++) {
//     for (let row = 0; row < rows; row++) {
//       const index = row * columns.value + col;
//       if (index < props.gridData.length) {
//         rearrangedArray.push(props.gridData[index]);
//       }
//     }
//   }

//   return rearrangedArray;
// });

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)

// onMounted(() => {
//   console.log(getColumnCountWithinGridWrapper());
// });

// useResizeObserver(gridWrapper, () => {
//   console.log(getColumnCountWithinGridWrapper());
// });
</script>

<style lang="css">
.masonry-grid-wrapper {
  --_border-color: light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%));

  columns: var(--_item-min-width);
  gap: var(--_masonry-grid-gap);

  .masonry-grid-item {
    break-inside: avoid;
    outline: 0.1rem solid var(--_border-color);
    padding: 1.2rem;
    margin-block-end: var(--_masonry-grid-gap);
  }
}
</style>
