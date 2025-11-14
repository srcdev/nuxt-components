<template>
  <div class="masonry-grid-ordered" :class="[elementClasses]">
    <div class="masonry-grid-ordered-wrapper" :class="[{ 'multiple-cols': !isSingleColumn }]" ref="gridWrapper">
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
const gridItemsRefs = ref<HTMLDivElement[]>([])
const gridContentRefs = ref<HTMLDivElement[]>([])
const { width } = useElementSize(gridWrapper)

// Track item properties for masonry positioning
interface ItemData {
  height: number
  column: number
  row: number
  top: number
  bottom: number
  // Future: translateY, etc.
}
const itemDataArray = ref<ItemData[]>([])

const columnCount = computed(() => {
  if (width.value === 0) return 1
  // Match the CSS container query breakpoint (636px hard-coded for now)
  // if (width.value < 636) return 1
  return Math.max(1, Math.floor(width.value / (props.minTileWidth + props.gap)))
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
  if (gridWrapper.value !== null && columnCount.value > 1) {
    // Initialize or reset the item data array
    itemDataArray.value = Array(props.gridData.length)
      .fill(null)
      .map(() => ({ height: 0, column: 0, row: 0, top: 0, bottom: 0 }))

    // Step 1: Hide items for measurement
    gridItemsRefs.value.forEach((itemEl) => {
      if (itemEl) {
        itemEl.style.setProperty("--_opacity", "0")
      }
    })

    // Force a reflow to get accurate measurements in grid layout
    gridWrapper.value.offsetHeight

    // Step 2: Measure heights and store in array
    gridContentRefs.value.forEach((contentEl, index) => {
      if (!contentEl || !gridItemsRefs.value[index] || !itemDataArray.value[index]) return

      const itemEl = gridItemsRefs.value[index]
      const contentHeight = contentEl.offsetHeight

      // Calculate which column this item would be in based on CSS Grid's auto-fit
      const column = index % columnCount.value

      // Calculate which row this item would be in based on CSS Grid's auto-fit
      const row = Math.floor(index / columnCount.value)

      // Get the item's position relative to the grid wrapper
      const wrapperRect = gridWrapper.value!.getBoundingClientRect()
      const itemRect = itemEl.getBoundingClientRect()
      const top = itemRect.top - wrapperRect.top
      const bottom = top + contentHeight

      // Store the data in our tracking array
      itemDataArray.value[index].height = contentHeight
      itemDataArray.value[index].column = column
      itemDataArray.value[index].row = row
      itemDataArray.value[index].top = top
      itemDataArray.value[index].bottom = bottom

      // Set the CSS custom property for height
      itemEl.style.setProperty("--_item-height", `${contentHeight}px`)
      itemEl.style.setProperty("--_opacity", "1")
    })

    // Log the complete item data array when calculations are complete
    console.log("📊 Item data array:", itemDataArray.value)
  } else {
    // Reset item data array
    itemDataArray.value = []

    // Single column: reset to normal flow
    gridItemsRefs.value.forEach((itemEl) => {
      if (itemEl) {
        itemEl.style.removeProperty("--_opacity")
        itemEl.style.removeProperty("--_item-height")
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

    .masonry-grid-ordered-item {
      background-color: darkcyan;

      .masonry-grid-ordered-content {
        outline: 0.1rem solid var(--_border-color);
        padding: 1.2rem;
        border-radius: 4px;

        background-color: brown;
      }
    }

    &.multiple-cols {
      .masonry-grid-ordered-item {
        height: var(--_item-height, auto);
        opacity: var(--_opacity, 1);
      }
    }
  }
}
</style>
