<template>
  <section class="carousel-flip" :class="[elementClasses]" ref="carouselWrapperRef" role="region" aria-label="Image carousel">
    <div aria-live="polite" aria-atomic="true" class="sr-only">Item {{ currentActiveIndex + 1 }} of {{ itemCount }}</div>

    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <div tabindex="0" class="item-container" :class="{ 'allow-overflow': allowCarouselOverflow }" ref="carouselContainerRef" role="group" aria-label="Carousel items">
        <div
          v-for="(item, index) in carouselDataIds"
          :key="index"
          class="item"
          :class="{ loaded: carouselInitComplete && userHasInteracted }"
          ref="carouselItems"
          :data-id="item"
          :aria-current="currentActiveIndex === index ? 'true' : 'false'"
        >
          <slot :name="item"></slot>
        </div>
      </div>
    </LayoutRow>

    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <div tabindex="0" class="controls-container" ref="controlsContainerRef">
        <div class="markers-container">
          <ul class="markers-list">
            <li v-for="index in itemCount" :key="index" class="markers-item">
              <button
                @click.prevent="jumpToFrame(index - 1)"
                class="btn-marker"
                :class="[{ active: currentActiveIndex === getOffsetIndex(index - 1, circularOffsetBase, itemCount) }]"
                :aria-label="`Jump to item ${Math.floor(index + 1)}`"
              ></button>
            </li>
          </ul>
        </div>
        <div class="buttons-container">
          <button type="button" @click.prevent="actionPrevious()" class="btn-action" aria-label="Go to previous item">
            <Icon name="ic:outline-keyboard-arrow-left" class="arrows-icon" />
          </button>
          <button type="button" @click.prevent="actionNext()" class="btn-action" aria-label="Go to next item">
            <Icon name="ic:outline-keyboard-arrow-right" class="arrows-icon" />
          </button>
        </div>
      </div>
    </LayoutRow>
  </section>
</template>

<script setup lang="ts">
import { useEventListener, useResizeObserver, useSwipe } from '@vueuse/core';

const props = defineProps({
  carouselDataIds: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
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
  returnToStart: {
    type: Boolean,
    default: false,
  },
  useFlipAnimation: {
    type: Boolean,
    default: true,
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const carouselWrapperRef = ref<HTMLDivElement | null>(null);
const carouselContainerRef = ref<HTMLDivElement | null>(null);
const carouselItemsRef = useTemplateRef<HTMLDivElement[]>('carouselItems');
const controlsContainerRef = ref<HTMLDivElement | null>(null);
const carouselInitComplete = ref(false);
const userHasInteracted = ref(false);

const initialItemOffset = computed(() => {
  return props.useFlipAnimation ? 1 : 2;
});
const circularOffsetBase = computed(() => {
  return props.useFlipAnimation ? 1 : Math.floor(2 * initialItemOffset.value);
});

function getOffsetIndex(index: number, offset: number, itemCount: number): number {
  return (index + offset) % itemCount;
}

const currentIndex = ref(0);
const itemCount = ref(props.carouselDataIds.length);
const transitionSpeedStr = props.transitionSpeed + 'ms';

const itemWidth = ref(0);
const itemWidthOffsetStr = computed(() => {
  if (props.allowCarouselOverflow) {
    if (props.useFlipAnimation) {
      return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - var(--_carousel-item-track-gap))`; // Good
    } else {
      return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - (2 * var(--_carousel-item-track-gap)))`; // Good
    }
  } else {
    if (props.useFlipAnimation) {
      return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - var(--_carousel-item-track-gap))`; // Goof
    } else {
      return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - (2 * var(--_carousel-item-track-gap)))`; // Good
    }
  }
});
const currentActiveIndex = ref(0);

const updateItemOrder = (index: number, order: number, zIndex: number = 2) => {
  if (carouselItemsRef?.value && carouselItemsRef.value[index]) {
    carouselItemsRef.value[index].style.order = order.toString();
    carouselItemsRef.value[index].style.zIndex = zIndex.toString();
  }
};

function analyzeOffsets(offsets: number[]) {
  const counts = new Map<number, number>();

  offsets.forEach((val) => {
    counts.set(val, (counts.get(val) || 0) + 1);
  });

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  const majorityValue = sorted[0][0];
  const minorityValue = sorted[sorted.length - 1][0];
  const minorityIndex = offsets.findIndex((val) => val === minorityValue);

  return {
    majorityValue,
    minorityValue,
    minorityIndex,
  };
}

const reorderItems = (direction: 'next' | 'previous' | 'jump' = 'jump', skipAnimation: boolean = false) => {
  if (!carouselItemsRef?.value) return;

  // Capture positions before reordering (only if we're going to animate)
  const beforeRects = skipAnimation ? [] : carouselItemsRef.value.map((item) => item.getBoundingClientRect());

  // Apply new order and z-index based on direction
  let order = 1;

  // For items from currentActiveIndex to end
  for (let i = currentActiveIndex.value; i < itemCount.value; i++) {
    let zIndex = 2; // default normal z-index

    if (i === currentActiveIndex.value) {
      // The item becoming visible
      if (direction === 'previous') {
        // When going previous, the item moving to first position should go behind
        zIndex = 1;
      } else {
        // Normal case - visible item gets highest z-index
        zIndex = 3;
      }
    }

    updateItemOrder(i, order++, zIndex);
  }

  // For items from 0 to currentActiveIndex
  for (let i = 0; i < currentActiveIndex.value; i++) {
    // Items that wrap around get lower z-index to slide behind
    const zIndex = 1;
    updateItemOrder(i, order++, zIndex);
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
      return beforeRect.left - afterRect.left;
    });

    const leftValues = analyzeOffsets(offsetValues);

    carouselItemsRef.value!.forEach((item, index) => {
      const deltaX = beforeRects[index].left - afterRects[index].left;

      if (deltaX !== 0) {
        item.style.transition = 'none';
        item.style.transform = `translateX(${deltaX}px)`;

        requestAnimationFrame(() => {
          const shouldTransition = carouselInitComplete.value && userHasInteracted.value;
          let transitionProperties = 'none';

          if (shouldTransition) {
            if (props.allowCarouselOverflow) {
              if (props.useFlipAnimation) {
                transitionProperties = `transform ${transitionSpeedStr} ease`;
              } else {
                if (leftValues.minorityIndex !== index) {
                  transitionProperties = `transform ${transitionSpeedStr} ease`;
                }
              }
            } else {
              if (props.useFlipAnimation) {
                transitionProperties = `transform ${transitionSpeedStr} ease`;
              } else {
                if (leftValues.minorityIndex !== index) {
                  transitionProperties = `transform ${transitionSpeedStr} ease`;
                }
              }
            }
          }

          item.style.transition = transitionProperties;
          item.style.transform = 'translateX(0)';

          // After animation completes, normalize z-index values
          const handleTransitionEnd = (event: TransitionEvent) => {
            if (event.propertyName === 'transform') {
              // Set final z-index: current item gets highest, others get normal
              const isCurrentlyVisible = index === currentActiveIndex.value;
              item.style.zIndex = isCurrentlyVisible ? '3' : '2';
              item.removeEventListener('transitionend', handleTransitionEnd);
            }
          };

          if (shouldTransition) {
            item.addEventListener('transitionend', handleTransitionEnd);
          } else {
            // If no transition, immediately normalize z-index
            const isCurrentlyVisible = index === currentActiveIndex.value;
            item.style.zIndex = isCurrentlyVisible ? '3' : '2';
          }
        });
      }
    });
  });
};

const actionPrevious = () => {
  if (!carouselInitComplete.value || !carouselItemsRef?.value) return;

  userHasInteracted.value = true;

  if (props.returnToStart && currentActiveIndex.value === 0) {
    currentActiveIndex.value = itemCount.value - 1;
  } else {
    currentActiveIndex.value = currentActiveIndex.value === 0 ? itemCount.value - 1 : currentActiveIndex.value - 1;
  }

  reorderItems('previous');
  currentIndex.value = currentActiveIndex.value;
};

const actionNext = () => {
  if (!carouselInitComplete.value || !carouselItemsRef?.value) return;

  userHasInteracted.value = true;

  if (props.returnToStart && currentActiveIndex.value === itemCount.value - 1) {
    currentActiveIndex.value = 0;
  } else {
    currentActiveIndex.value = currentActiveIndex.value === itemCount.value - 1 ? 0 : currentActiveIndex.value + 1;
  }

  reorderItems('next');
  currentIndex.value = currentActiveIndex.value;
};

const jumpToFrame = (index: number) => {
  if (index >= 0 && index < itemCount.value) {
    // Only mark as user interaction if carousel is already initialized
    if (carouselInitComplete.value) {
      userHasInteracted.value = true;
    }

    currentActiveIndex.value = getOffsetIndex(index, circularOffsetBase.value, itemCount.value);

    // currentActiveIndex.value = index;
    reorderItems('jump');
    currentIndex.value = currentActiveIndex.value;
  }
};

const checkAndMoveLastItem = () => {
  if (props.allowCarouselOverflow || !props.useFlipAnimation) {
    currentActiveIndex.value = itemCount.value - initialItemOffset.value;
    reorderItems('jump', true); // Skip animation during initial setup
    currentIndex.value = currentActiveIndex.value;
  }
};

const initialSetup = () => {
  if (carouselItemsRef?.value && carouselItemsRef.value.length > 0 && carouselItemsRef.value[0]) {
    itemWidth.value = carouselItemsRef.value[0].offsetWidth;

    // Set initial order and z-index for all items
    carouselItemsRef.value.forEach((item, index) => {
      item.style.order = String(index + 1);
      item.dataset.order = String(index + 1);
      // First item gets higher z-index, others get normal z-index
      item.style.zIndex = index === 0 ? '3' : '2';
    });
  }

  carouselInitComplete.value = true;
  checkAndMoveLastItem();
};

const { direction } = useSwipe(carouselContainerRef, {
  passive: false,
  onSwipeEnd() {
    if (direction.value === 'left') {
      actionNext();
    } else if (direction.value === 'right') {
      actionPrevious();
    }
  },
});

useEventListener(carouselContainerRef, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    actionPrevious();
  } else if (event.key === 'ArrowRight') {
    actionNext();
  }
});

useEventListener(controlsContainerRef, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    actionPrevious();
  } else if (event.key === 'ArrowRight') {
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

      max-inline-size: calc(var(--_carousel-container-width) + var(--_carousel-item-track-gap) - (2 * var(--_carousel-item-edge-preview-width)));

      translate: calc(v-bind(itemWidthOffsetStr) - var(--_carousel-item-track-gap) + var(--_carousel-item-edge-preview-width)) 0;

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
            border: none;
            outline: none;
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
