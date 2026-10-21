<template>
  <section
    ref="carouselWrapperRef"
    class="carousel-flip"
    :class="[elementClasses]"
    :data-button-layout="buttonLayout"
    :data-mounted="isMounted ? '' : undefined"
    :aria-label="ariaLabel"
  >
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      {{ itemCount > 0 ? props.itemPositionAnnouncement(currentActiveIndex + 1, itemCount) : "" }}
    </div>

    <div
      ref="carouselContainerRef"
      tabindex="0"
      class="carousel-flip-track"
      :data-allow-overflow="allowCarouselOverflow ? '' : undefined"
      role="group"
      :aria-label="itemsAriaLabel"
    >
      <div
        v-for="(item, index) in carouselDataIds"
        :key="`${index}-${item}`"
        ref="carouselItems"
        class="carousel-flip-item"
        :data-loaded="carouselInitComplete && userHasInteracted ? '' : undefined"
        :data-id="item"
        :aria-current="currentActiveIndex === index ? 'true' : undefined"
      >
        <slot :name="item"></slot>
      </div>
    </div>

    <div v-if="showControls && itemCount > 1" ref="controlsContainerRef" class="carousel-flip-controls">
      <ul class="carousel-flip-markers" role="list">
        <li v-for="index in itemCount" :key="index" class="carousel-flip-markers-item">
          <button
            type="button"
            class="carousel-flip-marker"
            :data-active="displayActiveIndex === index - 1 ? '' : undefined"
            :aria-current="displayActiveIndex === index - 1 ? 'true' : undefined"
            :aria-label="`${jumpToItemLabel} ${index}`"
            @click.prevent="jumpToFrame(index - 1)"
          ></button>
        </li>
      </ul>
    </div>

    <div v-if="itemCount > 1" class="carousel-flip-buttons">
      <InputButton
        variant="inline"
        class="carousel-flip-button carousel-flip-button-prev"
        :button-text="previousLabel"
        @click.prevent="actionPrevious()"
      >
        <template #iconOnly>
          <slot name="prev-icon">
            <Icon :name="prevIcon" class="carousel-flip-button-icon" />
          </slot>
        </template>
      </InputButton>
      <InputButton
        variant="inline"
        class="carousel-flip-button carousel-flip-button-next"
        :button-text="nextLabel"
        @click.prevent="actionNext()"
      >
        <template #iconOnly>
          <slot name="next-icon">
            <Icon :name="nextIcon" class="carousel-flip-button-icon" />
          </slot>
        </template>
      </InputButton>
    </div>
  </section>
</template>


<script setup lang="ts">
import { useEventListener, useResizeObserver, useSwipe } from "@vueuse/core";

interface Props {
  carouselDataIds?: string[];
  styleClassPassthrough?: string | string[];
  transitionSpeed?: number;
  allowCarouselOverflow?: boolean;
  useFlipAnimation?: boolean;
  useSpringEffect?: boolean;
  buttonLayout?: "sides" | "controls-flanking" | "controls-grouped-right" | "overlay" | "track-edges";
  showControls?: boolean;
  ariaLabel?: string;
  itemsAriaLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  jumpToItemLabel?: string;
  itemPositionAnnouncement?: (current: number, total: number) => string;
  prevIcon?: string;
  nextIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  carouselDataIds: () => [],
  styleClassPassthrough: () => [],
  transitionSpeed: 200,
  allowCarouselOverflow: false,
  useFlipAnimation: false,
  useSpringEffect: false,
  buttonLayout: "sides",
  showControls: true,
  ariaLabel: "Image carousel",
  itemsAriaLabel: "Carousel items",
  previousLabel: "Go to previous item",
  nextLabel: "Go to next item",
  jumpToItemLabel: "Jump to item",
  itemPositionAnnouncement: (current: number, total: number) => `Item ${current} of ${total}`,
  prevIcon: "ic:outline-keyboard-arrow-left",
  nextIcon: "ic:outline-keyboard-arrow-right",
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const carouselWrapperRef = ref<HTMLDivElement | null>(null);
const carouselContainerRef = ref<HTMLDivElement | null>(null);
const carouselItemsRef = useTemplateRef<HTMLDivElement[]>("carouselItems");
const controlsContainerRef = ref<HTMLDivElement | null>(null);
const carouselInitComplete = ref(false);
const userHasInteracted = ref(false);
const isMounted = ref(false);

const initialItemOffset = computed(() => {
  return props.useFlipAnimation ? 1 : 2;
});

const currentIndex = ref(0);
const itemCount = computed(() => props.carouselDataIds.length);
const transitionSpeedStr = computed(() => `${props.transitionSpeed}ms`);

const itemWidth = ref(0);
const itemWidthOffsetStr = computed(() => {
  if (props.useFlipAnimation) {
    return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - var(--_carousel-item-track-gap))`;
  } else {
    return `calc(-${initialItemOffset.value} * ${itemWidth.value}px - (2 * var(--_carousel-item-track-gap)))`;
  }
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
  if (!carouselItemsRef?.value || itemCount.value < 1) return;

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
          const shouldTransition =
            carouselInitComplete.value &&
            userHasInteracted.value &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          let transitionProperties = "none";

          if (shouldTransition) {
            if (props.allowCarouselOverflow) {
              if (props.useFlipAnimation) {
                transitionProperties = `transform ${transitionSpeedStr.value} ${timingFunction}`;
              } else {
                if (leftValues.minorityIndex !== index) {
                  transitionProperties = `transform ${transitionSpeedStr.value} ${timingFunction}`;
                }
              }
            } else {
              if (props.useFlipAnimation) {
                transitionProperties = `transform ${transitionSpeedStr.value} ${timingFunction}`;
              } else {
                if (leftValues.minorityIndex !== index) {
                  transitionProperties = `transform ${transitionSpeedStr.value} ${timingFunction}`;
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
  if (!carouselInitComplete.value || !carouselItemsRef?.value || itemCount.value < 2) return;

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
  if (!carouselInitComplete.value || !carouselItemsRef?.value || itemCount.value < 2) return;

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

  nextTick(() => {
    isMounted.value = true;
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

watch(
  () => props.carouselDataIds.join("\u0000"),
  () => {
    if (currentActiveIndex.value >= itemCount.value) currentActiveIndex.value = 0;
    nextTick(initialSetup);
  }
);

useResizeObserver(carouselWrapperRef, async () => {
  initialSetup();
});

onMounted(() => {
  initialSetup();
});
</script>

<style lang="css">
@layer components {
  .carousel-flip {
    --_carousel-item-track-gap: var(--carousel-flip-gap, 1rem);
    --_carousel-flip-button-direction: 1;

    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      "prev  carousel  next"
      ".     controls  .   ";
    gap: var(--carousel-flip-layout-gap, 1rem);
    opacity: 0;

    &[data-mounted] {
      opacity: 1;
    }

    &:dir(rtl) {
      --_carousel-flip-button-direction: -1;
    }

    .carousel-flip-track {
      grid-area: carousel;
      display: flex;
      gap: var(--_carousel-item-track-gap);
      overflow-x: hidden;
      position: relative;
      isolation: isolate;
      min-inline-size: 0;

      max-inline-size: var(--carousel-flip-display-max-width, 80rem);
      margin-inline: auto;

      &[data-allow-overflow] {
        overflow-x: initial;
      }

      .carousel-flip-item {
        display: flex;
        flex: 0 0 100%;
        position: relative;
        min-inline-size: 0;
        overflow-wrap: anywhere;

        margin-inline: auto;

        max-inline-size: calc(
          var(--carousel-flip-item-max-width, 80rem) + var(--_carousel-item-track-gap) -
            (2 * var(--carousel-flip-edge-preview-width, 4rem))
        );

        translate: calc(
            v-bind(itemWidthOffsetStr) - var(--_carousel-item-track-gap) +
              var(--carousel-flip-edge-preview-width, 4rem)
          )
          0;

        &[data-loaded] {
          @media (prefers-reduced-motion: no-preference) {
            transition: transform v-bind(transitionSpeedStr) ease;
          }
        }
      }
    }

    .carousel-flip-controls {
      grid-area: controls;
      display: flex;
      align-items: center;
      justify-content: center;
      min-inline-size: 0;
      max-inline-size: var(--carousel-flip-display-max-width, 80rem);
      margin-inline: auto;

      .carousel-flip-markers {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--carousel-flip-marker-gap, 1rem);
        list-style-type: none;
        margin: unset;
        padding: unset;

        .carousel-flip-marker {
          border: 1px solid transparent;
          outline: 1px solid transparent;
          box-shadow: none;
          cursor: pointer;
          transition: background-color v-bind(transitionSpeedStr) linear;

          &[data-active] {
            background-color: var(--carousel-flip-marker-active-colour, var(--theme-surface));
          }

          &:focus-visible {
            outline: var(--carousel-flip-focus-outline-width, 0.2rem) solid
              var(--carousel-flip-focus-outline-colour, var(--theme-ring));
            outline-offset: var(--carousel-flip-focus-outline-offset, 0.2rem);
          }
        }
      }
    }

    .carousel-flip-buttons {
      display: contents;
    }

    .carousel-flip-button {
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: var(--carousel-flip-button-align, center);
      z-index: 1;
      cursor: pointer;
      height: fit-content;
      min-height: 0;

      color: var(--carousel-flip-button-icon-colour, var(--theme-text));
      background-color: var(--carousel-flip-button-background-colour, var(--theme-surface-subtle));
      border: var(--carousel-flip-button-border-width, 0.1rem) solid
        var(--carousel-flip-button-border-colour, var(--theme-border));
      border-radius: var(--carousel-flip-button-border-radius, 100vw);
      padding: var(--carousel-flip-button-padding, 0.8rem);

      &:focus-visible {
        outline: var(--carousel-flip-focus-outline-width, 0.2rem) solid
          var(--carousel-flip-focus-outline-colour, var(--theme-ring));
        outline-offset: var(--carousel-flip-focus-outline-offset, 0.2rem);
      }

      .carousel-flip-button-icon {
        width: var(--carousel-flip-button-icon-size, 2.4rem);
        height: var(--carousel-flip-button-icon-size, 2.4rem);
      }
    }

    .carousel-flip-button-prev {
      grid-area: prev;
      translate: calc(-1 * var(--_carousel-flip-button-direction) * var(--carousel-flip-button-inline-offset, 0px)) 0;
    }

    .carousel-flip-button-next {
      grid-area: next;
      translate: calc(var(--_carousel-flip-button-direction) * var(--carousel-flip-button-inline-offset, 0px)) 0;
    }

    /* ── controls-flanking: buttons flank the controls row ─────── */
    &[data-button-layout="controls-flanking"] {
      .carousel-flip-button-prev {
        grid-area: unset;
        grid-column: 1;
        grid-row: 2;
      }

      .carousel-flip-button-next {
        grid-area: unset;
        grid-column: 3;
        grid-row: 2;
      }
    }

    /* ── controls-grouped-right: markers centred, buttons end ────── */
    &[data-button-layout="controls-grouped-right"] {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "carousel"
        "controls";

      .carousel-flip-buttons {
        display: flex;
        align-items: center;
        gap: var(--carousel-flip-buttons-gap, 1rem);
        grid-area: controls;
        justify-self: end;
      }

      .carousel-flip-button-prev,
      .carousel-flip-button-next {
        translate: none;
      }
    }

    /* ── track-edges: buttons overlay the ends of the visible track ── */
    &[data-button-layout="track-edges"] {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "carousel"
        "controls";

      .carousel-flip-buttons {
        grid-area: carousel;
        display: flex;
        justify-content: space-between;
        inline-size: 100%;
        max-inline-size: var(--carousel-flip-display-max-width, 80rem);
        margin-inline: auto;
        padding-inline: var(
          --carousel-flip-button-edge-inset,
          calc(var(--carousel-flip-edge-preview-width, 4rem) + 0.8rem)
        );
        box-sizing: border-box;
        z-index: 1;
        pointer-events: none;
      }

      .carousel-flip-button-prev,
      .carousel-flip-button-next {
        grid-area: unset;
        translate: none;
        pointer-events: auto;
      }
    }

    /* ── overlay: controls float at the bottom edge of the frame ── */
    &[data-button-layout="overlay"] {
      .carousel-flip-controls {
        grid-area: carousel;
        align-self: end;
        z-index: 1;
        padding-block-end: var(--carousel-flip-overlay-controls-offset, 1rem);
      }
    }
  }
}
</style>

