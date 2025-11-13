<template>
  <div class="masonry-grid-ordered" :class="[elementClasses]">
    <div class="masonry-grid-ordered-wrapper" ref="gridWrapper">
      <div v-for="item in props.gridData" :key="item.id" class="masonry-grid-ordered-item" ref="gridItemsRefs">
        <slot :name="item.id"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type PropType } from "vue"
import { useElementSize, useResizeObserver } from "@vueuse/core"

const props = defineProps({
  gridData: {
    type: Array as PropType<{ id: string }[]>,
    default: () => [],
  },
  minTileWidth: {
    type: Number,
    default: 312,
  },
  gap: {
    type: Number,
    default: 12,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  fixedWidth: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String as PropType<"left" | "center" | "right">,
    default: "left",
    validator: (val: string) => ["left", "center", "right"].includes(val),
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const gridWrapper = ref<null | HTMLDivElement>(null)
const gridItemsRefs = ref<HTMLDivElement[]>([])
const { width } = useElementSize(gridWrapper)

const columnCount = computed(() => {
  if (width.value === 0) return 1
  return Math.max(1, Math.floor(width.value / props.minTileWidth))
})

const isSingleColumn = computed(() => columnCount.value === 1)

const gapStr = computed(() => `${props.gap}px`)

const minTileWidthStr = computed(() => `${props.minTileWidth}px`)
const maxTileWidth = computed(() => {
  return props.fixedWidth ? `${props.minTileWidth}px` : "1fr"
})

const justifyContent = computed(() => {
  return props.fixedWidth ? props.justify : "stretch"
})

const updateGrid = () => {
  if (gridWrapper.value !== null) {
    // For single column, no need for complex calculations - just use CSS grid
    if (columnCount.value === 1) {
      // Reset any absolute positioning for single column
      gridItemsRefs.value.forEach((item) => {
        item?.style.removeProperty("--_position")
        item?.style.removeProperty("--_position-top")
        item?.style.removeProperty("--_position-left")
        item?.style.removeProperty("--_element-width")
      })
      gridWrapper.value?.style.removeProperty("--_wrapper-height")
      return
    }

    // Only run complex masonry calculations for 2+ columns
    const wrapperWidth = gridWrapper.value?.offsetWidth ?? 0
    const itemWidth = props.fixedWidth
      ? props.minTileWidth
      : Math.floor((wrapperWidth - (columnCount.value - 1) * props.gap) / columnCount.value)

    const colHeights = Array(columnCount.value).fill(0)

    gridItemsRefs.value.forEach((item) => {
      const minHeight = Math.min(...colHeights)
      const minIndex = colHeights.indexOf(minHeight)

      item?.style.setProperty("--_position", "absolute")
      item?.style.setProperty("--_position-top", minHeight + "px")
      item?.style.setProperty("--_position-left", minIndex * (100 / columnCount.value) + "%")
      item?.style.setProperty("--_element-width", itemWidth + "px")

      colHeights[minIndex] += Math.floor(item.offsetHeight + props.gap)
    })

    const maxHeight = Math.max(...colHeights)
    gridWrapper.value?.style.setProperty("--_wrapper-height", maxHeight + "px")
  }
}

useResizeObserver(gridWrapper, () => {
  updateGrid()
})

onMounted(() => {
  nextTick(() => updateGrid())
})

watch(
  () => props.fixedWidth,
  () => {
    updateGrid()
  }
)

watch(
  () => props.gridData,
  () => {
    nextTick(() => updateGrid())
  }
)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style scoped lang="css">
.masonry-grid-ordered {
  --_border-color: light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%));
  --_transition-duration: 0.3s;

  container-type: inline-size;
  position: relative;

  transition: max-width var(--_transition-duration) ease;

  .masonry-grid-ordered-wrapper {
    background-color: blueviolet;
    display: grid;
    justify-self: v-bind(justifyContent);
    gap: v-bind(gapStr);
    /* grid-template-columns: repeat(1, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth))); */
    grid-auto-flow: row;
    position: relative;

    /* Only set explicit height for multi-column layouts */
    height: var(--_wrapper-height);
    width: 100%;

    /* 2 columns: when container can fit 2 * minTileWidth + 1 gap (hard coded for now) */
    @container (width >= 636px) {
      grid-auto-flow: unset;
      grid-template-columns: repeat(2, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth)));
    }

    /* Next querie commented as it's my intention to not need them */
    /* 3 columns: when container can fit 3 * minTileWidth + 2 gaps */
    /* @container (min-width: 1024px) {
      grid-template-columns: repeat(3, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth)));
    } */

    /* 4 columns: when container can fit 4 * minTileWidth + 3 gaps */
    /* @container (min-width: 1280px) {
      grid-template-columns: repeat(4, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth)));
    } */

    .masonry-grid-ordered-item {
      /* width: auto; */

      outline: 0.1rem solid var(--_border-color);
      padding: 1.2rem;
      border-radius: 4px;

      background-color: brown;

      @container (min-width: calc(2 * v-bind(minTileWidthStr) + v-bind(gapStr))) {
        position: var(--_position, static);
        top: var(--_position-top, auto);
        left: var(--_position-left, auto);
        width: var(--_element-width, auto);

        transition: position var(--_transition-duration) ease, top var(--_transition-duration) ease,
          left var(--_transition-duration) ease;
      }
    }
  }
}
</style>
