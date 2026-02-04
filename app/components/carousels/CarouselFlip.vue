<template>
  <section
    ref="carouselWrapperRef"
    class="carousel-flip"
    :class="[elementClasses]"
    role="region"
    aria-label="Image carousel"
  >
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      Item {{ currentActiveIndex + 1 }} of {{ itemCount }}
    </div>

    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <div
        ref="carouselContainerRef"
        tabindex="0"
        class="item-container"
        :class="{ 'allow-overflow': allowCarouselOverflow }"
        role="group"
        aria-label="Carousel items"
      >
        <div
          v-for="(item, index) in carouselDataIds"
          :key="index"
          ref="carouselItems"
          class="item"
          :class="{ loaded: carouselInitComplete && userHasInteracted }"
          :data-id="item"
          :aria-current="currentActiveIndex === index ? 'true' : 'false'"
        >
          <slot :name="item"></slot>
        </div>
      </div>
    </LayoutRow>

    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <div ref="controlsContainerRef" tabindex="0" class="controls-container">
        <div class="markers-container">
          <ul class="markers-list">
            <li v-for="index in itemCount" :key="index" class="markers-item">
              <button
                class="btn-marker"
                :class="[{ active: displayActiveIndex === index - 1 }]"
                :aria-label="`Jump to item ${Math.floor(index + 1)}`"
                @click.prevent="jumpToFrame(index - 1)"
              ></button>
            </li>
          </ul>
        </div>
        <div class="buttons-container">
          <button type="button" class="btn-action" aria-label="Go to previous item" @click.prevent="actionPrevious()">
            <Icon name="ic:outline-keyboard-arrow-left" class="arrows-icon" />
          </button>
          <button type="button" class="btn-action" aria-label="Go to next item" @click.prevent="actionNext()">
            <Icon name="ic:outline-keyboard-arrow-right" class="arrows-icon" />
          </button>
        </div>
      </div>
    </LayoutRow>
  </section>
</template>

<script setup lang="ts">
import { useEventListener, useResizeObserver, useSwipe } from "@vueuse/core";

const props = defineProps({
  carouselDataIds: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  transitionSpeed: {
    type: Number,
    default: 200,
  },
  allowCarouselOverflow: {
    type: Boolean,
    default: false,
  },
  useFlipAnimation: {
    type: Boolean,
    default: false,
  },
  useSpringEffect: {
    type: Boolean,
    default: false,
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const carouselWrapperRef = ref<HTMLDivElement | null>(null);
const carouselContainerRef = ref<HTMLDivElement | null>(null);
const carouselItemsRef = useTemplateRef<HTMLDivElement[]>("carouselItems");
const controlsContainerRef = ref<HTMLDivElement | null>(null);
const carouselInitComplete = ref(false);
const userHasInteracted = ref(false);

const initialItemOffset = computed(() => {
  return props.useFlipAnimation ? 1 : 2;
});

const currentIndex = ref(0);
const itemCount = ref(props.carouselDataIds.length);
const transitionSpeedStr = props.transitionSpeed + "ms";

const itemWidth = ref(0);
const itemWidthOffsetStr = computed(() => {
  // if (props.allowCarouselOverflow) {
  if (props.useFlipAnimation) {
    return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - var(--_carousel-item-track-gap))`; // Good
  } else {
    return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - (2 * var(--_carousel-item-track-gap)))`; // Good
  }
  // } else {
  //   if (props.useFlipAnimation) {
  //     return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - var(--_carousel-item-track-gap))` // Goof
  //   } else {
  //     return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - (2 * var(--_carousel-item-track-gap)))` // Good
  //   }
  // }
});
const currentActiveIndex = ref(0);

// Computed property to get the display index (what the user sees as active)
const displayActiveIndex = computed(() => {
  return currentActiveIndex.value;
});

const updateItemOrder = (index: number, order: number, zIndex: number = 2) => {
  if (carouselItemsRef?.value && carouselItemsRef.value[index]) {
    if (order !== -1) {
      carouselItemsRef.value[index].style.order = order.toString();
    }
    carouselItemsRef.value[index].style.zIndex = zIndex.toString();
  }
};

function analyzeOffsets(offsets: number[]) {
  const counts = new Map<number, number>();

  offsets.forEach((val) => {
    counts.set(val, (counts.get(val) || 0) + 1);
  });

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  // Handle empty sorted array
  if (sorted.length === 0) {
    return {
      majorityValue: 0,
      minorityValue: 0,
      minorityIndex: -1,
    };
  }

  const majorityValue = sorted[0]![0];
  const minorityValue = sorted[sorted.length - 1]![0];
  const minorityIndex = offsets.findIndex((val) => val === minorityValue);

  return {
    majorityValue,
    minorityValue,
    minorityIndex,
  };
}

const reorderItems = (skipAnimation: boolean = false) => {
  if (!carouselItemsRef?.value) return;

  // Capture positions before reordering (only if we're going to animate)
  const beforeRects = skipAnimation ? [] : carouselItemsRef.value.map((item) => item.getBoundingClientRect());

  // Store current order positions before reordering
  const currentOrderMap = new Map<number, number>();
  if (!skipAnimation) {
    carouselItemsRef.value.forEach((item, index) => {
      const currentOrder = parseInt(item.style.order || "1");
      currentOrderMap.set(index, currentOrder);
    });
  }

  // Apply new order and calculate z-index based on order transition
  let order = 1;

  // Helper function to determine if an item should go behind during transition
  const shouldGoBehind = (currentOrder: number, newOrder: number) => {
    // Normal case: moving to higher order (left to right)
    if (currentOrder < newOrder) return true;

    // Wrap case: moving from end to beginning (high order to low order with big gap)
    // This happens when an item at the end wraps to the beginning
    const orderDifference = Math.abs(currentOrder - newOrder);
    const isWrapping = orderDifference > itemCount.value / 2;
    if (isWrapping && currentOrder > newOrder) return true;

    return false;
  };

  // First, place the previous item (for visual continuity)
  const prevIndex = currentActiveIndex.value === 0 ? itemCount.value - 1 : currentActiveIndex.value - 1;
  const prevCurrentOrder = currentOrderMap.get(prevIndex) || 1;
  const prevNewOrder = order++;
  const prevZIndex = shouldGoBehind(prevCurrentOrder, prevNewOrder) ? 1 : 2;
  updateItemOrder(prevIndex, prevNewOrder, prevZIndex);

  // Then place the current active item
  const currentOrder = currentOrderMap.get(currentActiveIndex.value) || 1;
  const newCurrentOrder = order++;
  const currentZIndex = shouldGoBehind(currentOrder, newCurrentOrder) ? 1 : 2;
  updateItemOrder(currentActiveIndex.value, newCurrentOrder, currentZIndex);

  // Then place all remaining items in sequence
  let nextIndex = currentActiveIndex.value + 1;
  while (nextIndex !== prevIndex) {
    if (nextIndex >= itemCount.value) {
      nextIndex = 0; // Wrap around
    }
    if (nextIndex === prevIndex) break; // Don't place the previous item again

    const itemCurrentOrder = currentOrderMap.get(nextIndex) || 1;
    const itemNewOrder = order++;
    const itemZIndex = shouldGoBehind(itemCurrentOrder, itemNewOrder) ? 1 : 2;
    updateItemOrder(nextIndex, itemNewOrder, itemZIndex);
    nextIndex++;
  }

  // Skip animation if requested (for initial setup)
  if (skipAnimation) {
    return;
  }

  // Animate using FLIP technique
  requestAnimationFrame(() => {
    const afterRects = carouselItemsRef.value!.map((item) => item.getBoundingClientRect());

    // Calculate offset values
    const offsetValues = beforeRects.map((beforeRect, index) => {
      const afterRect = afterRects[index];
      return beforeRect.left - (afterRect?.left ?? beforeRect.left);
    });

    const leftValues = analyzeOffsets(offsetValues);

    carouselItemsRef.value!.forEach((item, index) => {
      const beforeRect = beforeRects[index];
      const afterRect = afterRects[index];
      const deltaX = (beforeRect?.left ?? 0) - (afterRect?.left ?? 0);
      const timingFunction = props.useSpringEffect ? "var(--spring-easing)" : "ease";

      if (deltaX !== 0) {
        // Optimize for upcoming transform animation
        item.style.willChange = "transform";
        item.style.transition = "none";
        item.style.transform = `translateX(${deltaX}px)`;

        requestAnimationFrame(() => {
          const shouldTransition = carouselInitComplete.value && userHasInteracted.value;
          let transitionProperties = "none";

          if (shouldTransition) {
            if (props.allowCarouselOverflow) {
              if (props.useFlipAnimation) {
                transitionProperties = `transform ${transitionSpeedStr} ${timingFunction}`;
              } else {
                if (leftValues.minorityIndex !== index) {
                  transitionProperties = `transform ${transitionSpeedStr} ${timingFunction}`;
                }
              }
            } else {
              if (props.useFlipAnimation) {
                transitionProperties = `transform ${transitionSpeedStr} ${timingFunction}`;
              } else {
                if (leftValues.minorityIndex !== index) {
                  transitionProperties = `transform ${transitionSpeedStr} ${timingFunction}`;
                }
              }
            }
          }

          item.style.transition = transitionProperties;
          item.style.transform = "translateX(0)";

          // After animation completes, clean up will-change (keep z-index as set)
          const handleTransitionEnd = (event: TransitionEvent) => {
            if (event.propertyName === "transform") {
              item.style.willChange = "auto";
              item.removeEventListener("transitionend", handleTransitionEnd);
            }
          };

          if (shouldTransition) {
            item.addEventListener("transitionend", handleTransitionEnd);
          } else {
            // If no transition, just clean up will-change (keep z-index as set)
            item.style.willChange = "auto";
          }
        });
      }
    });
  });
};

const actionPrevious = () => {
  if (!carouselInitComplete.value || !carouselItemsRef?.value) return;

  userHasInteracted.value = true;

  if (currentActiveIndex.value === 0) {
    currentActiveIndex.value = itemCount.value - 1;
  } else {
    currentActiveIndex.value = currentActiveIndex.value === 0 ? itemCount.value - 1 : currentActiveIndex.value - 1;
  }

  reorderItems();
  currentIndex.value = currentActiveIndex.value;
};

const actionNext = () => {
  if (!carouselInitComplete.value || !carouselItemsRef?.value) return;

  userHasInteracted.value = true;

  if (currentActiveIndex.value === itemCount.value - 1) {
    currentActiveIndex.value = 0;
  } else {
    currentActiveIndex.value = currentActiveIndex.value === itemCount.value - 1 ? 0 : currentActiveIndex.value + 1;
  }

  reorderItems();
  currentIndex.value = currentActiveIndex.value;
};

const jumpToFrame = (index: number) => {
  if (index >= 0 && index < itemCount.value) {
    // Only mark as user interaction if carousel is already initialized
    if (carouselInitComplete.value) {
      userHasInteracted.value = true;
    }

    currentActiveIndex.value = index;

    reorderItems();
    currentIndex.value = currentActiveIndex.value;
  }
};

const checkAndMoveLastItem = () => {
  // We need to reorder items for the initial layout regardless of the settings
  // Keep currentActiveIndex at 0 (first item) but reorder visually
  reorderItems(true); // Skip animation during initial setup
  currentIndex.value = currentActiveIndex.value;
};

const initialSetup = () => {
  if (carouselItemsRef?.value && carouselItemsRef.value.length > 0 && carouselItemsRef.value[0]) {
    itemWidth.value = carouselItemsRef.value[0].offsetWidth;

    // Set initial order and z-index for all items
    carouselItemsRef.value.forEach((item, index) => {
      item.style.order = String(index + 1);
      item.dataset.order = String(index + 1);
      // First item gets higher z-index, others get normal z-index
      item.style.zIndex = index === 0 ? "3" : "2";
    });
  }

  carouselInitComplete.value = true;
  checkAndMoveLastItem();

  // Add mounted class to trigger opacity transition after setup is complete
  nextTick(() => {
    if (carouselWrapperRef.value) {
      carouselWrapperRef.value.classList.add("mounted");
    }
  });
};

const { direction } = useSwipe(carouselContainerRef, {
  passive: false,
  onSwipeEnd() {
    if (direction.value === "left") {
      actionNext();
    } else if (direction.value === "right") {
      actionPrevious();
    }
  },
});

useEventListener(carouselContainerRef, "keydown", (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") {
    actionPrevious();
  } else if (event.key === "ArrowRight") {
    actionNext();
  }
});

useEventListener(controlsContainerRef, "keydown", (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") {
    actionPrevious();
  } else if (event.key === "ArrowRight") {
    actionNext();
  }
});

useResizeObserver(carouselWrapperRef, async () => {
  initialSetup();
});

onMounted(() => {
  initialSetup();
});
</script>

<style lang="css">
.carousel-flip {
  --_carousel-item-track-gap: 10px;

  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  opacity: 0;

  &.mounted {
    opacity: 1;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .item-container {
    display: flex;
    gap: var(--_carousel-item-track-gap);
    overflow-x: hidden;
    position: relative;
    isolation: isolate;

    max-inline-size: var(--_carousel-display-max-width);
    margin-inline: auto;

    &.allow-overflow {
      overflow-x: initial;
    }

    .item {
      display: flex;
      flex: 0 0 100%;
      position: relative;

      margin-inline: auto;

      max-inline-size: calc(
        var(--_carousel-container-max-inline-size) + var(--_carousel-item-track-gap) -
          (2 * var(--_carousel-item-edge-preview-width))
      );

      translate: calc(
          v-bind(itemWidthOffsetStr) - var(--_carousel-item-track-gap) + var(--_carousel-item-edge-preview-width)
        )
        0;

      &.loaded {
        transition: transform v-bind(transitionSpeedStr) ease;
      }
    }
  }

  .controls-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    max-inline-size: var(--_carousel-display-max-width);
    margin-inline: auto;

    .markers-container {
      .markers-list {
        display: flex;
        flex-direction: row;
        gap: 10px;
        list-style-type: none;
        margin: unset;
        padding: unset;

        .markers-item {
          .btn-marker {
            border: 1px solid transparent;
            outline: 1px solid transparent;
            box-shadow: none;
            cursor: pointer;
            transition: background-color v-bind(transitionSpeedStr) linear;

            &.active {
              background-color: light-dark(var(--gray-12), var(--gray-00));
            }
          }
        }
      }
    }

    .buttons-container {
      display: flex;
      align-items: center;
      justify-content: end;
      gap: 20px;

      .btn-action {
        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;
        height: fit-content;

        .arrows-icon {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
}
</style>
