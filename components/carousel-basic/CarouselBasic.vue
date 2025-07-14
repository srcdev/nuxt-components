<template>
  <section class="carousel-basic" :class="[elementClasses]" ref="carouselWrapperRef">

    <div tabindex="0" class="item-container" ref="carouselContainerRef">
      <div v-for="(item, index) in carouselDataIds" :key="index" class="item" ref="carouselItems">
        <slot :name="item"></slot>
      </div>
    </div>

    <div class="timeline-container">
      <div v-for="index in itemCount" :key="index" class="timeline-item">
        <div class="count">Step {{ Math.floor(index + 1) }}</div>
      </div>
    </div>

    <div class="controls-container">
      <div class="markers-container">
        <ul class="markers-list">
          <li v-for="index in itemCount" :key="index" class="markers-item">
            <button @click.prevent="jumpToFrame(index)" class="btn-marker"
              :class="[{ active: currentIndex  === index - 1}]"><span class="sr-only">Jump to item{{
                Math.floor(index + 1) }}</span></button>
          </li>
        </ul>
      </div>
      <div class="buttons-container">
        <button type="submit" @click.prevent="actionPrevious()" class="btn-action">Prev</button>
        <button type="submit" @click.prevent="actionNext()" class="btn-action">Next</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ICarouselBasic } from "@/types/types.carousel-basic";
import { useEventListener, useResizeObserver, useSwipe } from "@vueuse/core";

const props = defineProps({
  carouselDataIds: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  transitionSpeed: {
    type: Number,
    default: 200
  }
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const carouselWrapperRef = ref<HTMLDivElement | null>(null);
const carouselContainerRef = ref<HTMLDivElement | null>(null);
const carouselItemsRef = useTemplateRef<HTMLDivElement[]>('carouselItems');
const carouselInitComplete = ref(false);

const currentIndex = ref(0);
const itemCount = ref(props.carouselDataIds.length);
const offset = ref(0);
const transitionSpeedStr = props.transitionSpeed + 'ms';
const itemTransform = computed(() => {
  return `translateX(calc(${offset.value} * (${itemWidth.value} + var(--_item-gap))))`;
})

const itemWidth = ref('0px');

const actionPrevious = () => {
  if (offset.value >= 0) {
    return;
  }

  offset.value = Math.min(offset.value + 1);
  doAction();
}

const actionNext = () => {
  if (offset.value <= -1 * (itemCount.value - 1)) {
    return;
  }

  offset.value = Math.min(offset.value - 1);
  doAction();
}

const doAction = () => {
  currentIndex.value = Math.abs(offset.value);
}

const jumpToFrame = (index: number) => {

  if (index >= 0 && index < itemCount.value) {
    offset.value = -index;
    doAction();
  }
}

const initialSetup = () => {
  if (carouselItemsRef?.value && carouselItemsRef.value.length > 0 && carouselItemsRef.value[0]) {
    itemWidth.value = carouselItemsRef.value[0].offsetWidth + 'px';
  }

  carouselInitComplete.value = true;
}

const { direction } = useSwipe(
  carouselContainerRef,
  {
    passive: false,
    onSwipeEnd() {
      if (direction.value === 'left') {
        actionNext();
      } else if (direction.value === 'right') {
        actionPrevious();
      }
    },
  },
);

useEventListener(
  carouselContainerRef,
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      actionPrevious();
    } else if (event.key === 'ArrowRight') {
      actionNext();
    }
  },
);

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

  .timeline-container {
    display: flex;
    gap: var(--_item-gap);
    overflow-x: hidden;

    .timeline-item {
      display: flex;
      flex: 0 0 100%;
      max-inline-size: 800px;
      align-items: center;
      transform: v-bind(itemTransform);
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
        cursor: pointer;
        height: fit-content;
      }
    }
  }
}
</style>
