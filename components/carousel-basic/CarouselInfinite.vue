<template>
  <section class="carousel-basic" :class="[elementClasses]" ref="carouselWrapperRef" role="region" aria-label="Image carousel">
    <!-- Screen reader announcement for current item -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">Item {{ currentVisibleIndex + 1 }} of {{ itemCount }}</div>

    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <div tabindex="0" class="item-container" :class="{ 'allow-overflow': allowCarouselOverflow }" ref="carouselContainerRef" role="group" aria-label="Carousel items">
        <div v-for="(item, index) in carouselDataIds" :key="index" class="item" ref="carouselItems" :aria-current="currentVisibleIndex === index ? 'true' : 'false'">
          <slot :name="item"></slot>
        </div>
      </div>
    </LayoutRow>

    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <div class="timeline-container">
        <div v-for="index in itemCount" :key="index" class="timeline-item">
          <div class="count">Step {{ index }}</div>
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

const itemWidth = ref('0px');
const currentVisibleIndex = ref(0);

const updateItemOrder = (index: number, order: number) => {
  if (carouselItemsRef?.value && carouselItemsRef.value[index]) {
    carouselItemsRef.value[index].style.order = order.toString();
  }
};

const reorderItems = () => {
  if (!carouselItemsRef?.value || !carouselInitComplete.value) return;

  // Capture positions before reordering
  const beforeRects = carouselItemsRef.value.map((item) => item.getBoundingClientRect());

  // Apply new order
  let order = 1;
  for (let i = currentVisibleIndex.value; i < itemCount.value; i++) {
    updateItemOrder(i, order++);
  }
  for (let i = 0; i < currentVisibleIndex.value; i++) {
    updateItemOrder(i, order++);
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
          item.style.transition = `transform ${transitionSpeedStr} ease`;
          item.style.transform = 'translateX(0)';
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

  reorderItems();
  currentIndex.value = currentVisibleIndex.value;
};

const actionNext = () => {
  if (!carouselInitComplete.value || !carouselItemsRef?.value) return;

  if (props.returnToStart && currentVisibleIndex.value === itemCount.value - 1) {
    currentVisibleIndex.value = 0;
  } else {
    currentVisibleIndex.value = currentVisibleIndex.value === itemCount.value - 1 ? 0 : currentVisibleIndex.value + 1;
  }

  reorderItems();
  currentIndex.value = currentVisibleIndex.value;
};

const jumpToFrame = (index: number) => {
  if (index >= 0 && index < itemCount.value) {
    currentVisibleIndex.value = index;
    reorderItems();
    currentIndex.value = currentVisibleIndex.value;
  }
};

const initialSetup = () => {
  if (carouselItemsRef?.value && carouselItemsRef.value.length > 0 && carouselItemsRef.value[0]) {
    itemWidth.value = carouselItemsRef.value[0].offsetWidth + 'px';

    // Set initial order for all items
    carouselItemsRef.value.forEach((item, index) => {
      item.style.order = String(index + 1);
    });
  }

  carouselInitComplete.value = true;
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
.carousel-basic {
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

  .timeline-container {
    display: flex;
    gap: var(--_item-gap);
    overflow-x: hidden;

    .timeline-item {
      display: flex;
      flex: 0 0 100%;
      max-inline-size: 800px;
      align-items: center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        height: 2px;
        background-color: #fff;
        left: 70px;
        right: 0;
      }

      .count {
        width: fit-content;
      }
    }
  }

  .item-container {
    display: flex;
    gap: var(--_item-gap);
    overflow-x: hidden;
    position: relative;

    &.allow-overflow {
      overflow-x: initial;
    }

    .item {
      display: flex;
      flex: 0 0 100%;
      max-inline-size: 800px;
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
