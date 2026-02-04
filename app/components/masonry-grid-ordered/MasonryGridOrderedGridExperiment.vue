<template>
  <div class="masonry-grid-ordered" :class="[elementClasses]">
    <div
      ref="gridWrapper"
      class="masonry-grid-ordered-wrapper"
      :class="[{ 'multiple-cols': !isSingleColumn, 'setup-complete': isSetupComplete }]"
    >
      <div v-for="item in props.gridData" :key="item.id" ref="gridItemsRefs" class="masonry-grid-ordered-item">
        <div ref="gridContentRefs" class="masonry-grid-ordered-content">
          <slot :name="item.id"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize, useResizeObserver } from "@vueuse/core";

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
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const gridWrapper = ref<null | HTMLDivElement>(null);
const gridItemsRefs = ref<HTMLDivElement[]>([]);
const gridContentRefs = ref<HTMLDivElement[]>([]);
const { width } = useElementSize(gridWrapper);

// Track item properties for masonry positioning
interface ItemData {
  height: number;
  column: number;
  row: number;
  top: number;
  bottom: number;
  translateY: number;
}
const itemDataArray = ref<ItemData[]>([]);
const isSetupComplete = ref(false);

const columnCount = computed(() => {
  if (width.value === 0) return 1;
  // Match the CSS container query breakpoint (636px hard-coded for now)
  // if (width.value < 636) return 1
  return Math.max(1, Math.floor(width.value / (props.minTileWidth + props.gap)));
});

const isSingleColumn = computed(() => columnCount.value === 1);

const gapStr = computed(() => `${props.gap}px`);

const minTileWidthStr = computed(() => `${props.minTileWidth}px`);

const updateGrid = () => {
  if (gridWrapper.value !== null && columnCount.value > 1) {
    // Initialize or reset the item data array
    itemDataArray.value = Array(props.gridData.length)
      .fill(null)
      .map(() => ({ height: 0, column: 0, row: 0, top: 0, bottom: 0, translateY: 0 }));

    // Step 1: Hide items for measurement
    gridItemsRefs.value.forEach((itemEl) => {
      if (itemEl) {
        itemEl.style.setProperty("--_opacity", "0");
      }
    });

    // Force a reflow to get accurate measurements in grid layout
    void gridWrapper.value.offsetHeight;

    // Step 2: Measure heights and store in array
    gridContentRefs.value.forEach((contentEl, index) => {
      if (!contentEl || !gridItemsRefs.value[index] || !itemDataArray.value[index]) return;

      const itemEl = gridItemsRefs.value[index];
      const contentHeight = contentEl.offsetHeight;

      // Calculate which column this item would be in based on CSS Grid's auto-fit
      const column = index % columnCount.value;

      // Calculate which row this item would be in based on CSS Grid's auto-fit
      const row = Math.floor(index / columnCount.value);

      let top: number;
      let bottom: number;
      let translateY: number;

      // Always get the actual measured position first
      const wrapperRect = gridWrapper.value!.getBoundingClientRect();
      const itemRect = itemEl.getBoundingClientRect();
      const actualTop = itemRect.top - wrapperRect.top;

      if (row === 0) {
        // First row: use natural CSS Grid position
        top = actualTop;
        bottom = top + contentHeight;
        translateY = 0; // No transform needed for first row
      } else {
        // Subsequent rows: position based on item above in same column
        const itemAboveIndex = index - columnCount.value;
        const itemAbove = itemDataArray.value[itemAboveIndex];

        if (itemAbove) {
          top = itemAbove.bottom + props.gap;
          bottom = top + contentHeight;
          // Calculate the transform needed to move from actual position to desired position
          translateY = top - actualTop;
        } else {
          // Fallback to natural position if no item above found
          top = actualTop;
          bottom = top + contentHeight;
          translateY = 0;
        }
      }

      // Store the data in our tracking array
      itemDataArray.value[index].height = contentHeight;
      itemDataArray.value[index].column = column;
      itemDataArray.value[index].row = row;
      itemDataArray.value[index].top = top;
      itemDataArray.value[index].bottom = bottom;
      itemDataArray.value[index].translateY = translateY;

      // Set the CSS custom properties
      itemEl.style.setProperty("--_item-height", `${contentHeight}px`);
      itemEl.style.setProperty("--_translate-y", `${translateY}px`);
      itemEl.style.setProperty("--_opacity", "1");
    });

    // Log the complete item data array when calculations are complete
    // console.log("📊 Item data array:", itemDataArray.value)

    // Mark setup as complete
    isSetupComplete.value = true;
  } else {
    // Reset setup state for single column
    isSetupComplete.value = false;

    // Reset item data array
    itemDataArray.value = [];

    // Single column: reset to normal flow
    gridItemsRefs.value.forEach((itemEl) => {
      if (itemEl) {
        itemEl.style.removeProperty("--_opacity");
        itemEl.style.removeProperty("--_item-height");
        itemEl.style.removeProperty("--_translate-y");
      }
    });
    gridWrapper.value?.style.removeProperty("--_wrapper-height");
  }
};

useResizeObserver(gridWrapper, async () => {
  // console.log("useResizeObserver triggered")
  // itemDataArray.value = [] // Clear previous data
  // await useSleep(100)
  // console.log("useResizeObserver after sleep")
  nextTick(() => updateGrid());

  // requestAnimationFrame(() => {
  // updateGrid()
  // nextTick(() => updateGrid())
  // })

  // Add a small delay to ensure DOM is fully rendered and measured
  // setTimeout(() => {
  //   nextTick(() => updateGrid())
  // }, 100)
});

onMounted(() => {
  // Add a small delay to ensure DOM is fully rendered and measured
  setTimeout(() => {
    nextTick(() => updateGrid());
  }, 100);
});

watch(
  () => props.fixedWidth,
  () => {
    updateGrid();
  }
);

watch(
  () => props.gridData,
  () => {
    // nextTick(() => updateGrid())
  }
);

watch(
  () => width.value,
  (newWidth) => {
    if (newWidth > 0) {
      // nextTick(() => updateGrid())
    }
  }
);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
.masonry-grid-ordered {
  --_transition-duration: 0.3s;

  .masonry-grid-ordered-wrapper {
    display: grid;
    gap: v-bind(gapStr);
    grid-template-columns: repeat(auto-fit, minmax(v-bind(minTileWidthStr), 1fr));

    height: var(--_wrapper-height, auto);

    &.multiple-cols {
      .masonry-grid-ordered-item {
        height: var(--_item-height, auto);
        opacity: var(--_opacity, 1);
        transform: translateY(var(--_translate-y, 0px));
        transition: transform var(--_transition-duration) ease;
      }
    }
  }
}
</style>
