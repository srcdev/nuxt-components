<template>
  <section class="carousel-flip" :class="[elementClasses]" ref="carouselWrapperRef" role="region" aria-label="Image carousel">
    <!-- Screen reader announcement for current item -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">Item {{ currentVisibleIndex + 1 }} of {{ itemCount }}</div>

    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <div tabindex="0" class="item-container" :class="{ 'allow-overflow': allowCarouselOverflow }" ref="carouselContainerRef" role="group" aria-label="Carousel items">
        <div
          v-for="(item, index) in carouselDataIds"
          :key="index"
          class="item"
          :class="{ loaded: carouselInitComplete }"
          ref="carouselItems"
          :aria-current="currentVisibleIndex === index ? 'true' : 'false'"
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
                :class="[{ active: currentVisibleIndex === index - 1 }]"
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
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const carouselWrapperRef = ref<HTMLDivElement | null>(null);
const carouselContainerRef = ref<HTMLDivElement | null>(null);
const carouselItemsRef = useTemplateRef<HTMLDivElement[]>('carouselItems');
const controlsContainerRef = ref<HTMLDivElement | null>(null);
const carouselInitComplete = ref(false);

const currentIndex = ref(0);
const itemCount = ref(props.carouselDataIds.length);
const transitionSpeedStr = props.transitionSpeed + 'ms';

const itemWidth = ref(0);
const itemWidthOffsetStr = computed(() => {
  return `-${itemWidth.value}px`;
});
const currentVisibleIndex = ref(0);

const carouselContainerRefLeftPosition = computed(() => {
  return carouselContainerRef.value ? carouselContainerRef.value.getBoundingClientRect().left : 0;
});
const fullScreenOffsset = computed(() => {
  return `-${Math.floor(carouselContainerRefLeftPosition.value)}px`;
});

const updateItemOrder = (index: number, order: number, zIndex: number = 2) => {
  if (carouselItemsRef?.value && carouselItemsRef.value[index]) {
    carouselItemsRef.value[index].style.order = order.toString();
    carouselItemsRef.value[index].style.zIndex = zIndex.toString();
  }
};

const reorderItems = (direction: 'next' | 'previous' | 'jump' = 'jump') => {
  // if (!carouselItemsRef?.value || !carouselInitComplete.value) return;
  if (!carouselItemsRef?.value) return;

  // Capture positions before reordering
  const beforeRects = carouselItemsRef.value.map((item) => item.getBoundingClientRect());

  // Apply new order and z-index based on direction
  let order = 1;

  // For items from currentVisibleIndex to end
  for (let i = currentVisibleIndex.value; i < itemCount.value; i++) {
    let zIndex = 2; // default normal z-index

    if (i === currentVisibleIndex.value) {
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

  // For items from 0 to currentVisibleIndex
  for (let i = 0; i < currentVisibleIndex.value; i++) {
    // Items that wrap around get lower z-index to slide behind
    const zIndex = 1;
    updateItemOrder(i, order++, zIndex);
  }

  // Animate using FLIP technique
  requestAnimationFrame(() => {
    const afterRects = carouselItemsRef.value!.map((item) => item.getBoundingClientRect());

    carouselItemsRef.value!.forEach((item, index) => {
      const deltaX = beforeRects[index].left - afterRects[index].left;

      if (deltaX !== 0) {
        item.style.transition = 'none';
        item.style.transform = `translateX(${deltaX}px)`;

        requestAnimationFrame(() => {
          item.style.transition = carouselInitComplete.value ? `transform ${transitionSpeedStr} ease` : 'none';
          item.style.transform = 'translateX(0)';

          // After animation completes, normalize z-index values
          const handleTransitionEnd = (event: TransitionEvent) => {
            if (event.propertyName === 'transform') {
              // Set final z-index: current item gets highest, others get normal
              const isCurrentlyVisible = index === currentVisibleIndex.value;
              item.style.zIndex = isCurrentlyVisible ? '3' : '2';
              item.removeEventListener('transitionend', handleTransitionEnd);
            }
          };

          item.addEventListener('transitionend', handleTransitionEnd);
        });
      }
    });
  });
};

const actionPrevious = () => {
  if (!carouselInitComplete.value || !carouselItemsRef?.value) return;

  if (props.returnToStart && currentVisibleIndex.value === 0) {
    currentVisibleIndex.value = itemCount.value - 1;
  } else {
    currentVisibleIndex.value = currentVisibleIndex.value === 0 ? itemCount.value - 1 : currentVisibleIndex.value - 1;
  }

  reorderItems('previous');
  currentIndex.value = currentVisibleIndex.value;
};

const actionNext = () => {
  if (!carouselInitComplete.value || !carouselItemsRef?.value) return;

  if (props.returnToStart && currentVisibleIndex.value === itemCount.value - 1) {
    currentVisibleIndex.value = 0;
  } else {
    currentVisibleIndex.value = currentVisibleIndex.value === itemCount.value - 1 ? 0 : currentVisibleIndex.value + 1;
  }

  reorderItems('next');
  currentIndex.value = currentVisibleIndex.value;
};

const jumpToFrame = (index: number) => {
  if (index >= 0 && index < itemCount.value) {
    currentVisibleIndex.value = index;
    reorderItems('jump');
    currentIndex.value = currentVisibleIndex.value;
  }
};

const checkAndMoveLastItem = () => {
  if (props.allowCarouselOverflow) {
    const itemsFit = Math.floor(carouselContainerRefLeftPosition.value / itemWidth.value + 1);
    jumpToFrame(itemCount.value - 1);
  }
};

const initialSetup = () => {
  if (carouselItemsRef?.value && carouselItemsRef.value.length > 0 && carouselItemsRef.value[0]) {
    itemWidth.value = carouselItemsRef.value[0].offsetWidth;

    // Set initial order and z-index for all items
    carouselItemsRef.value.forEach((item, index) => {
      item.style.order = String(index + 1);
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
  --_item-gap: 10px;

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
    gap: var(--_item-gap);
    overflow-x: hidden;
    position: relative;

    &.allow-overflow {
      overflow-x: initial;

      .item {
        translate: calc(v-bind(itemWidthOffsetStr) - var(--_item-gap)) 0;
      }
    }

    .item {
      display: flex;
      flex: 0 0 100%;
      max-inline-size: 800px;
      position: relative;

      &.loaded {
        transition: transform v-bind(transitionSpeedStr) ease;
      }
    }
  }

  .controls-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;

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
              background-color: red;
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
