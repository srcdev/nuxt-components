<template>
  <div class="masonry-grid-ordered" :class="[elementClasses]">
    <div class="masonry-grid-ordered-wrapper" ref="gridWrapper">
      <div v-for="item in props.gridData" :key="item.id" class="masonry-grid-ordered-item" ref="gridItemsRefs">
        <div class="masonry-grid-ordered-content" ref="gridContentRefs">
          <slot :name="item.id"></slot>
        </div>
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
const gridItemsRefs = ref<HTMLDivElement[]>([]) // Refs to item elements (with styling)
const gridContentRefs = ref<HTMLDivElement[]>([]) // Refs to content elements (no styling)
const { width } = useElementSize(gridWrapper)

const columnCount = computed(() => {
  if (width.value === 0) return 1
  // Match the CSS container query breakpoint (636px hard-coded for now)
  if (width.value < 636) return 1
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
  console.log("🧪 Debug info:", {
    gridWrapperExists: !!gridWrapper.value,
    width: width.value,
    columnCount: columnCount.value,
    minTileWidth: props.minTileWidth,
    condition: gridWrapper.value !== null && columnCount.value > 1,
  })

  if (gridWrapper.value !== null && columnCount.value > 1) {
    console.log("🎯 Starting updateGrid - columnCount:", columnCount.value)

    // Step 1: Hide items and reset to static positioning for measurement
    gridItemsRefs.value.forEach((itemEl, index) => {
      if (itemEl) {
        itemEl.style.setProperty("--_position", "static")
        itemEl.style.setProperty("--_opacity", "0")
        itemEl.style.removeProperty("--_position-top")
      }
    })

    // Force a reflow to get accurate measurements in grid layout
    gridWrapper.value.offsetHeight

    // Step 2: Measure natural heights while items are in CSS grid
    const colHeights = Array(columnCount.value).fill(0)
    const measurements: { contentHeight: number; itemHeight: number; totalHeight: number; itemWidth: number }[] = []

    gridContentRefs.value.forEach((contentEl, index) => {
      if (!contentEl || !gridItemsRefs.value[index]) return

      const itemEl = gridItemsRefs.value[index]

      // Get the natural height of the content and item (with proper grid width)
      const contentHeight = contentEl.offsetHeight
      const itemHeight = itemEl.offsetHeight
      const itemWidth = itemEl.offsetWidth // Capture the grid-constrained width

      // Add the item's padding to get total height needed
      const computedStyle = getComputedStyle(itemEl)
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0
      const totalItemHeight = contentHeight + paddingTop + paddingBottom

      measurements.push({ contentHeight, itemHeight: totalItemHeight, totalHeight: totalItemHeight, itemWidth })

      console.log(`📏 Item ${index} (measured in grid):`, {
        contentHeight,
        itemHeight,
        paddingTop,
        paddingBottom,
        totalItemHeight,
        itemWidth: itemEl.offsetWidth,
      })
    }) // Step 3: Apply absolute positioning with measured heights and widths
    measurements.forEach((measurement, index) => {
      const itemEl = gridItemsRefs.value[index]
      if (!itemEl) return

      // Find the shortest column
      const minHeight = Math.min(...colHeights)
      const minIndex = colHeights.indexOf(minHeight)

      // Apply masonry positioning with captured width
      itemEl.style.setProperty("--_position", "absolute")
      itemEl.style.setProperty("--_position-top", minHeight + "px")
      itemEl.style.setProperty("--_position-left", (minIndex * (measurement.itemWidth + props.gap)) + "px")
      itemEl.style.setProperty("--_element-width", measurement.itemWidth + "px")
      itemEl.style.setProperty("--_opacity", "1") // Show the item

      console.log(
        `📍 Positioning item ${index} at top: ${minHeight}px, left: ${minIndex * (measurement.itemWidth + props.gap)}px in column ${minIndex}, width: ${measurement.itemWidth}px`
      )

      // Update column height for next item
      colHeights[minIndex] += measurement.totalHeight + props.gap
    })

    // Set container height based on tallest column
    const maxHeight = Math.max(...colHeights) - props.gap // Remove last gap
    gridWrapper.value?.style.setProperty("--_wrapper-height", maxHeight + "px")

    console.log("📊 Column heights:", colHeights)
    console.log("🎨 Container height set to:", maxHeight + "px")
  } else {
    console.log("🔄 Single column mode - resetting positioning")
    // Single column: reset to normal flow
    gridItemsRefs.value.forEach((itemEl) => {
      if (itemEl) {
        itemEl.style.removeProperty("--_position")
        itemEl.style.removeProperty("--_position-top")
        itemEl.style.removeProperty("--_position-left")
        itemEl.style.removeProperty("--_element-width")
        itemEl.style.removeProperty("--_opacity")
      }
    })
    gridWrapper.value?.style.removeProperty("--_wrapper-height")
  }
}

useResizeObserver(gridWrapper, () => {
  // updateGrid()
})

onMounted(() => {
  // Add a small delay to ensure DOM is fully rendered and measured
  setTimeout(() => {
    nextTick(() => updateGrid())
  }, 100)
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
  () => width.value,
  (newWidth) => {
    console.log("📐 Width changed:", newWidth)
    if (newWidth > 0) {
      nextTick(() => updateGrid())
    }
  }
)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
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
    grid-template-columns: repeat(auto-fit, minmax(v-bind(minTileWidthStr), 1fr));
    /* grid-auto-flow: row; */
    position: relative;

    /* Only set explicit height for multi-column layouts */
    height: var(--_wrapper-height, auto);
    width: 100%;

    /* 2 columns: when container can fit 2 * minTileWidth + 1 gap (hard coded for now) */
    @container (width >= 636px) {
      position: relative;
      /* grid-template-columns: repeat(auto-fit, minmax(v-bind(minTileWidthStr), v-bind(maxTileWidth))); */
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

      @container (width >= 636px) {
        position: var(--_position);
        top: var(--_position-top);
        left: var(--_position-left);
        width: var(--_element-width);
        opacity: var(--_opacity, 1);

        transition: position var(--_transition-duration) ease, top var(--_transition-duration) ease,
          left var(--_transition-duration) ease;
      }
    }

    /* Content element has no styling - just contains slot for accurate height measurement */
  }
}
</style>
