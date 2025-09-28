<template>
  <section
    class="carousel-basic"
    :class="[elementClasses]"
    ref="carouselWrapperRef"
    role="region"
    aria-label="Image carousel"
  >
    <!-- Screen reader announcement for current item -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">Item {{ currentIndex + 1 }} of {{ itemCount }}</div>

    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <div
        tabindex="0"
        class="item-container"
        :class="{ 'allow-overflow': allowCarouselOverflow }"
        ref="carouselContainerRef"
        role="group"
        aria-label="Carousel items"
      >
        <div
          v-for="(item, index) in carouselDataIds"
          :key="index"
          class="item"
          ref="carouselItems"
          :aria-current="currentIndex === index ? 'true' : 'false'"
        >
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
                :class="[{ active: currentIndex === index - 1 }]"
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

<script lang="ts">
export interface CarouselBasicItem {
  id: number | string
  url: string
  alt: string
}

export interface CarouselModifiedItem {
  id: number | string
  url: string
  alt: string
  order: number
}

export interface ICarouselBasic {
  items: CarouselBasicItem[] | CarouselModifiedItem[]
  total: number
  skip: number
  limit: number
}
</script>

<script setup lang="ts">
import { useEventListener, useResizeObserver, useSwipe } from "@vueuse/core"

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
  returnToStart: {
    type: Boolean,
    default: false,
  },
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const carouselWrapperRef = ref<HTMLDivElement | null>(null)
const carouselContainerRef = ref<HTMLDivElement | null>(null)
const carouselItemsRef = useTemplateRef<HTMLDivElement[]>("carouselItems")
const controlsContainerRef = ref<HTMLDivElement | null>(null)
const carouselInitComplete = ref(false)

const currentIndex = ref(0)
const itemCount = ref(props.carouselDataIds.length)
const offset = ref(0)
const transitionSpeedStr = props.transitionSpeed + "ms"
const itemTransform = computed(() => {
  return `translateX(calc(${offset.value} * (${itemWidth.value} + var(--_carousel-item-track-gap))))`
})

const itemWidth = ref("0px")

const actionPrevious = () => {
  if (props.returnToStart && currentIndex.value === 0) {
    offset.value = -itemCount.value
    doAction()
  }

  if (offset.value >= 0) {
    return
  }

  offset.value = Math.min(offset.value + 1)
  doAction()
}

const actionNext = () => {
  if (props.returnToStart && offset.value <= -1 * (itemCount.value - 1)) {
    offset.value = 0
    doAction()
    return
  }

  if (offset.value <= -1 * (itemCount.value - 1)) {
    return
  }

  offset.value = Math.min(offset.value - 1)
  doAction()
}

const doAction = () => {
  currentIndex.value = Math.abs(offset.value)
}

const jumpToFrame = (index: number) => {
  if (index >= 0 && index < itemCount.value) {
    offset.value = -index
    doAction()
  }
}

const initialSetup = () => {
  if (carouselItemsRef?.value && carouselItemsRef.value.length > 0 && carouselItemsRef.value[0]) {
    itemWidth.value = carouselItemsRef.value[0].offsetWidth + "px"
  }

  carouselInitComplete.value = true
}

const { direction } = useSwipe(carouselContainerRef, {
  passive: false,
  onSwipeEnd() {
    if (direction.value === "left") {
      actionNext()
    } else if (direction.value === "right") {
      actionPrevious()
    }
  },
})

useEventListener(carouselContainerRef, "keydown", (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") {
    actionPrevious()
  } else if (event.key === "ArrowRight") {
    actionNext()
  }
})

useEventListener(controlsContainerRef, "keydown", (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft") {
    actionPrevious()
  } else if (event.key === "ArrowRight") {
    actionNext()
  }
})

useResizeObserver(carouselWrapperRef, async () => {
  initialSetup()
})

onMounted(() => {
  initialSetup()
})
</script>

<style lang="css">
.carousel-basic {
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

  .timeline-container {
    display: flex;
    gap: var(--_carousel-item-track-gap);
    overflow-x: hidden;

    .timeline-item {
      display: flex;
      flex: 0 0 100%;
      max-inline-size: 800px;
      align-items: center;
      transform: v-bind(itemTransform);
      position: relative;

      &::before {
        content: "";
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
    gap: var(--_carousel-item-track-gap);
    overflow-x: hidden;
    position: relative;

    &.allow-overflow {
      overflow-x: initial;
    }

    .item {
      display: flex;
      flex: 0 0 100%;
      max-inline-size: 800px;
      transition: transform v-bind(transitionSpeedStr) ease;
      transform: v-bind(itemTransform);
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
