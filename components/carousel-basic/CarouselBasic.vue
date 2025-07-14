<template>
  <section class="carousel-basic" :class="[elementClasses, { 'controls-inside': controlsInside }]" ref="carouselWrapperRef">

    <div class="item-container" ref="carouselContainerRef">
      <div v-for="(item, index) in data?.items" :key="index" class="item" ref="carouselItems">
        <h3>{{ index }}</h3>
        <p>{{ item.alt }}</p>
      </div>
    </div>

    <div class="timeline-container">
      <div v-for="(item, index) in data?.items" :key="index" class="timeline-item">
        <div class="count">Step {{ index }}</div>
      </div>
    </div>

    <div class="controls-container">
      <div class="markers-container">
        <ul class="markers-list">
          <li v-for="(index) in Math.floor(itemCount - 1)" :key="index" class="markers-item">
            <button @click.prevent="jumpToFrame(index)" class="marker" :class="[{ active: currentIndex  === index}]"><span class="sr-only">Jump to item{{
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
  propsData: {
    type: Object as PropType<ICarouselBasic>,
    default: <ICarouselBasic>{
      items: [],
      total: 0,
      skip: 0,
      limit: 10
    }
  },
  data: {
    type: Object,
    default: <ICarouselBasic>{}
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  transitionSpeed: {
    type: Number,
    default: 200
  },
  controlsInside: {
    type: Boolean,
    default: false
  }
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const carouselWrapperRef = ref<HTMLDivElement | null>(null);
const carouselContainerRef = ref<HTMLDivElement | null>(null);
const carouselItemsRef = useTemplateRef<HTMLDivElement[]>('carouselItems');
const carouselInitComplete = ref(false);

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

const currentIndex = ref(0);
const itemCount = ref(props.data.items.length);
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
  console.log("initialSetup()");
  if (carouselItemsRef?.value && carouselItemsRef.value.length > 0 && carouselItemsRef.value[0]) {
    itemWidth.value = carouselItemsRef.value[0].offsetWidth + 'px';
  }

  carouselInitComplete.value = true;
}

useResizeObserver(carouselWrapperRef, async () => {
  initialSetup();
});

onMounted(() => {
  initialSetup();
});

watch(
  () => currentIndex.value,
  () => {
    // console.log('currentIndex changed:', currentIndex.value);
  }
);

</script>

<style lang="css">

.carousel-basic {

  --_item-gap: 10px;

  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  &.controls-inside {
    grid-template-areas: "carousel-content";
    isolation: isolate;

    .item-container {
      grid-area: carousel-content;
      z-index: 1;
    }

    .controls-container {
      grid-area: carousel-content;
      z-index: 2;
      height: fit-content;
      align-self: flex-end;
    }
  }

  .timeline-container {
    display: flex;
    gap: var(--_item-gap);
    overflow-x: auto;
    padding-block: 10px;
    padding-inline: 10px;
    outline: 1px solid light-dark(#00000090, #f00ff090);

    .timeline-item {
      display: flex;
      flex: 0 0 100%;
      max-inline-size: 800px;
      align-items: center;

      color: light-dark(#aaa, #333);
      padding-block: 10px;
      border-radius: 4px;
      outline: 1px solid light-dark(#00000090, #f00ff090);
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
        font-size: 1.2rem;
        border-radius: 8px;
        width: fit-content;
        color: light-dark(#fff, #000);
        background-color: light-dark(#000, #fff);
        padding-block: 6px;
        padding-inline: 12px;
      }
    }
  }

  .item-container {
    display: flex;
    gap: var(--_item-gap);
    overflow-x: hidden;
    padding-block: 10px;
    padding-inline: 10px;
    outline: 1px solid light-dark(#00000090, #f00ff090);
    position: relative;

    .item {
      display: flex;
      flex: 0 0 100%;
      max-inline-size: 800px;

      flex-direction: column;
      align-items: center;
      justify-content: center;

      aspect-ratio: 4 / 3;

      color: light-dar(#aaa, #333);
      padding-block: 10px;
      padding-inline: 10px;
      border-radius: 4px;
      outline: 1px solid light-dark(#00000090, #f00ff090);

      background-color: light-dark(#f00, #00f);

      &:nth-child(odd) {
        background-color: light-dark(#00f, #f00);
      }

      transition: transform v-bind(transitionSpeedStr) ease;
      transform: v-bind(itemTransform);
    }
  }

  .controls-container {

    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;

    .markers-container {

      .markers-list {
        display: flex;
        flex-direction: row;
        gap: 10px;
        list-style-type: none;
        margin: unset;
        padding: unset;

        .markers-item {
          line-height: 3px;

          &.active {
            background-color: light-dark(#f00, #0f0);
          }

          .marker {
            border: none;
            outline: none;
            box-shadow: none;
            width: 22px;
            height: 3px;
            background-color: lightgray;
            cursor: pointer;
            line-height: 3px;
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

        padding: 10px 20px;
        border-radius: 4px;
        background-color: light-dark(#000, #fff);
        color: light-dark(#fff, #000);
        border: none;
        cursor: pointer;
        height: fit-content;

        &:hover {
          background-color: light-dark(#0009, #fff9);
        }

        &:active,
        &.active {
          background-color: light-dark(#0009, #fff9);
        }
      }
    }
  }



}
</style>
