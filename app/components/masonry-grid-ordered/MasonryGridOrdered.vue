<template>
  <div class="masonry-grid-ordered" :class="[elementClasses]">
    <div class="masonry-grid-ordered-wrapper" ref="gridWrapper">
      <div v-for="item in gridData" :key="item.id" class="masonry-grid-ordered-item" ref="gridItemsRefs">
        <slot :name="item.id"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints, useElementSize, useResizeObserver } from "@vueuse/core"

const props = defineProps({
  gridData: {
    type: Object,
    default: {},
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
    type: Array as PropType<string[]>,
    default: () => [],
  },
  mobilePreferredColCount: {
    type: Number,
    default: 1,
  },
  fixedWidth: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String as PropType<String>,
    default: "left",
    validator: (val: string) => ["left", "center", "right"].includes(val),
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const gridData = toRef(() => props.gridData)

const minTileWidth = toRef(() => props.minTileWidth)
const gridWrapper = ref<null | HTMLDivElement>(null)
const gridItemsRefs = ref<HTMLDivElement[]>([])
const { width } = useElementSize(gridWrapper)
const columnCount = computed(() => {
  return Math.floor(width.value / minTileWidth.value)
})

const gapNum = toRef(props.gap)
const gapStr = toRef(props.gap + "px")

const fixedWidth = toRef(() => props.fixedWidth)
const minTileWidthStr = toRef(props.minTileWidth + "px")
const maxTileWidth = computed(() => {
  return fixedWidth.value ? minTileWidth.value + "px" : "1fr"
})

const justify = computed(() => {
  return fixedWidth.value ? props.justify : "stretch"
})

const updateGrid = () => {
  if (gridWrapper.value !== null) {
    const wrapperWidth = gridWrapper.value?.offsetWidth ?? 0
    const itemWidth = fixedWidth.value
      ? minTileWidth.value
      : Math.floor((wrapperWidth - (columnCount.value - 1) * gapNum.value) / columnCount.value)

    const colHeights = Array(columnCount.value).fill(0)

    gridItemsRefs.value.forEach((item) => {
      const minHeight = Math.min(...colHeights)
      const minIndex = colHeights.indexOf(minHeight)

      item?.style.setProperty("--_position", "absolute")
      item?.style.setProperty("--_position-top", minHeight + "px")
      item?.style.setProperty("--_position-left", minIndex * (100 / columnCount.value) + "%")
      item?.style.setProperty("--_element-width", itemWidth + "px")

      colHeights[minIndex] += Math.floor(item.offsetHeight + gapNum.value)
    })

    const maxHeight = Math.max(...colHeights)
    gridWrapper.value?.style.setProperty("--_wrapper-height", maxHeight + "px")
  }
}

useResizeObserver(gridWrapper, () => {
  updateGrid()
})

watch(
  () => fixedWidth.value,
  () => {
    updateGrid()
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
    display: grid;
    justify-self: v-bind(justify);
    grid-gap: v-bind(gapStr);
    grid-template-columns: repeat(1, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth)));
    position: relative;

    height: var(--_wrapper-height);

    @container (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth)));
    }

    @container (min-width: 1024px) {
      grid-template-columns: repeat(3, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth)));
    }
    @container (min-width: 1280px) {
      grid-template-columns: repeat(4, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth)));
    }

    .masonry-grid-ordered-item {
      transition: position var(--_transition-duration) ease, top var(--_transition-duration) ease,
        left var(--_transition-duration) ease;

      position: var(--_position);
      top: var(--_position-top);
      left: var(--_position-left);
      width: var(--_element-width);

      outline: 0.1rem solid var(--_border-color);
      padding: 1.2rem;
      border-radius: 4px;
    }
  }
}
</style>
