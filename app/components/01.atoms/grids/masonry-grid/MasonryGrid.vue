<template>
  <component :is="tag" class="masonry-grid" :class="[elementClasses]">
    <div ref="gridWrapper" class="masonry-grid-wrapper" :data-multiple-cols="isSingleColumn ? undefined : ''">
      <div v-for="name in slotNames()" :key="name" class="masonry-grid-item">
        <slot :name="name"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { useElementSize, useResizeObserver } from "@vueuse/core";

interface Props {
  tag?: "div" | "section" | "article" | "main";
  /** Minimum tile width in pixels — also the fixed tile width when `fixedWidth` is set. */
  itemMinWidth?: number;
  /** Gap between tiles in pixels. */
  gap?: number;
  /** Keep every tile at exactly `itemMinWidth` instead of stretching to fill each column. */
  fixedWidth?: boolean;
  /** How the block of tiles aligns within the wrapper — only visible when `fixedWidth` is set
   * (tiles otherwise stretch to fill the full width, so there's nothing to align). */
  justify?: "left" | "center" | "right";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  itemMinWidth: 300,
  gap: 12,
  fixedWidth: false,
  justify: "left",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const slots = useSlots();
// Slot names in authoring order; a function, not a computed, because slots aren't reactive.
const slotNames = () => Object.keys(slots);

const gridWrapper = ref<HTMLElement | null>(null);
// Read from the DOM: a v-for ref array isn't guaranteed to follow DOM order, and packing depends on it.
const gridItems = shallowRef<HTMLElement[]>([]);
const readItems = () => {
  gridItems.value = Array.from(gridWrapper.value?.children ?? []) as HTMLElement[];
};
// Resize-reactive — useElementSize wires up its own ResizeObserver internally.
const { width } = useElementSize(gridWrapper);

const columnCount = computed(() => {
  if (width.value === 0) return 1;
  return Math.max(1, Math.floor(width.value / (props.itemMinWidth + props.gap)));
});
const isSingleColumn = computed(() => columnCount.value === 1);

const gapPx = computed(() => `${props.gap}px`);
const itemMinWidthPx = computed(() => `${props.itemMinWidth}px`);

// Real masonry packing: each item, in natural DOM order, is measured and placed into whichever
// column is currently shortest (a greedy bin-pack) — not CSS `columns`' column-fill, which packs
// by accumulated height per column in DOM order and can't be reordered without breaking reading
// order. Because placement follows DOM order directly, no reordering is ever needed here.
function updateGrid() {
  if (gridWrapper.value === null || columnCount.value <= 1) {
    gridItems.value.forEach((item) => {
      item?.style.removeProperty("--_masonry-grid-item-position");
      item?.style.removeProperty("--_masonry-grid-item-top");
      item?.style.removeProperty("--_masonry-grid-item-left");
      item?.style.removeProperty("--_masonry-grid-item-width");
    });
    gridWrapper.value?.style.removeProperty("--_masonry-grid-height");
    return;
  }

  const wrapperWidth = width.value;
  const itemWidth = props.fixedWidth
    ? props.itemMinWidth
    : Math.floor((wrapperWidth - (columnCount.value - 1) * props.gap) / columnCount.value);

  // Columns are placed at fixed pixel steps (itemWidth + gap) rather than equal percentage slots
  // of the container — a percentage slot only matches the item's actual width when the item
  // stretches to fill it (the non-fixedWidth case); with fixedWidth, the item is narrower than an
  // equal-percentage slot, and the leftover slot space would show up as a much bigger gap than
  // `gap` actually specifies. `justify` shifts this whole fixed-width block left/center/right
  // within the leftover space — done here in JS, not via CSS `justify-content`, since it has no
  // effect on children once they're taken out of grid flow by `position: absolute` below.
  const totalContentWidth = columnCount.value * itemWidth + (columnCount.value - 1) * props.gap;
  const startX = props.fixedWidth
    ? { left: 0, center: (wrapperWidth - totalContentWidth) / 2, right: wrapperWidth - totalContentWidth }[props.justify]
    : 0;

  const colHeights = Array(columnCount.value).fill(0);

  gridItems.value.forEach((item) => {
    const minHeight = Math.min(...colHeights);
    const minIndex = colHeights.indexOf(minHeight);

    item?.style.setProperty("--_masonry-grid-item-position", "absolute");
    item?.style.setProperty("--_masonry-grid-item-top", `${minHeight}px`);
    item?.style.setProperty("--_masonry-grid-item-left", `${startX + minIndex * (itemWidth + props.gap)}px`);
    item?.style.setProperty("--_masonry-grid-item-width", `${itemWidth}px`);

    colHeights[minIndex] += Math.floor((item?.offsetHeight ?? 0) + props.gap);
  });

  const maxHeight = Math.max(...colHeights);
  gridWrapper.value.style.setProperty("--_masonry-grid-height", `${maxHeight}px`);
}

// Re-pack whenever the measured width changes (useElementSize already wires up its own
// ResizeObserver — a second explicit useResizeObserver call here would just duplicate it).
let frame = 0;
const scheduleUpdate = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => updateGrid());
};

watch(width, () => nextTick(() => updateGrid()));

// A tile that changes height (an image loading, text wrapping) re-packs without a width change.
useResizeObserver(() => gridItems.value, scheduleUpdate);

onMounted(() => {
  readItems();
  nextTick(() => updateGrid());
});

onUpdated(() => {
  readItems();
  scheduleUpdate();
});

onBeforeUnmount(() => cancelAnimationFrame(frame));

watch(
  () => [props.fixedWidth, props.justify, props.itemMinWidth, props.gap],
  () => updateGrid()
);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .masonry-grid-wrapper {
    container-type: inline-size;
    position: relative;

    display: grid;
    gap: v-bind(gapPx);
    /* Single column always stretches to fill the full width — with only one column there's no
       "how many columns fit" question for itemMinWidth to answer, so applying its floor here
       (minmax(itemMinWidth, 1fr)) only ever hurt: on a narrow container it fights the container
       for space instead of just filling it. itemMinWidth starts governing column width once
       there's an actual choice to make, from two columns up (below). */
    grid-template-columns: minmax(0, 1fr);

    height: var(--_masonry-grid-height, auto);

    @container (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(min(100%, v-bind(itemMinWidthPx)), 1fr));
    }
    @container (min-width: 1024px) {
      grid-template-columns: repeat(3, minmax(min(100%, v-bind(itemMinWidthPx)), 1fr));
    }
    @container (min-width: 1280px) {
      grid-template-columns: repeat(4, minmax(min(100%, v-bind(itemMinWidthPx)), 1fr));
    }

    .masonry-grid-item {
      min-inline-size: 0;
      overflow-wrap: anywhere;
      outline: 0.1rem solid var(--masonry-grid-item-border-colour, var(--theme-border));
      padding: var(--masonry-grid-item-padding, 1.2rem);
    }

    &[data-multiple-cols] .masonry-grid-item {
      position: var(--_masonry-grid-item-position, static);
      top: var(--_masonry-grid-item-top, auto);
      left: var(--_masonry-grid-item-left, auto);
      width: var(--_masonry-grid-item-width, auto);

      @media (prefers-reduced-motion: no-preference) {
        transition:
          top var(--masonry-grid-transition-duration, 0.3s) ease,
          left var(--masonry-grid-transition-duration, 0.3s) ease;
      }
    }
  }
}
</style>
