<template>
  <section class="carousel-basic" :class="[elementClasses, { 'controls-inside': controlsInside }]">

    <div class="item-container" ref="carouselContent">
      <div v-for="(item, index) in data?.items" :key="index" class="item" ref="carouselItems">
        <h3>{{ index }}</h3>
        <p>{{ item.alt }}</p>
      </div>

    </div>

    <div class="controls-container">
      <div class="buttons-container">
        <button type="submit" @click.prevent="actionPrevious()" class="btn-action">Prev</button>
        <button type="submit" @click.prevent="actionNext()" class="btn-action">Next</button>
      </div>
      <div class="thumbnail-container">
        <ul class="thumbnail-list">
          <li v-for="item, index in data?.items" class="thumbnail-item" ref="thumbnailItems">
            <div class="thumbnail-item_inner">{{ index }}</div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ICarouselBasic } from "@/types/types.carousel-basic";
import { useElementSize, useEventListener, useResizeObserver } from "@vueuse/core";
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
    default: 1000
  },
  controlsInside: {
    type: Boolean,
    default: false
  }
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const carouselContentRef = useTemplateRef<HTMLDivElement>('carouselContent');
const carouselItems = useTemplateRef<HTMLDivElement[]>('carouselItems');
const thumbnailItems = useTemplateRef<HTMLLIElement[]>('thumbnailItems');
const carouselInitComplete = ref(false);

const currentIndex = ref(1);
const itemCount = ref(props.data.items.length);
const offset = ref(1);
const previousOffset = ref(1);
const transitionSpeedStr = props.transitionSpeed + 'ms';

const actionPrevious = () => {
  offset.value = -1;
  onTransitionEnd();
}

const actionNext = () => {
  offset.value = 1;
  onTransitionEnd();
}

const updateOrder = (index: number, order: number) => {
  if (carouselItems.value !== null && thumbnailItems.value !== null) {
    carouselItems.value[index - 1].style.order = order.toString();
    thumbnailItems.value[index - 1].style.order = order.toString();
  }
};


const initialSetup = () => {
  const items = carouselItems.value;
  const thumbs = thumbnailItems.value;

  items?.forEach((item, index) => {
    item.style.zIndex = index === 0 || index === itemCount.value - 1 ? '1' : '2';
    item.style.order = String(index + 1);
    // item.setAttribute('data-order', String(index + 1));
  });
  thumbs?.forEach((thumb, index) => {
    thumb.style.zIndex = index === 0 || index === itemCount.value - 1 ? '1' : '2';
    thumb.style.order = String(index + 1);
    // thumb.setAttribute('data-order', String(index + 1));
  });
  carouselInitComplete.value = true;
}

const onTransitionEnd = () => {

  const items = carouselItems.value;
  const thumbs = thumbnailItems.value;

  if (!items || !Array.isArray(items)) return;
  if (!thumbs || !Array.isArray(thumbs)) return;

  // 1. Capture initial positions for both main items and thumbnails
  const firstRects = items.map(el => el.getBoundingClientRect());
  const firstThumbRects = thumbs.map(el => el.getBoundingClientRect());

  // 2. Update orders
  let firstVisualElementIndex = currentIndex.value; // Track which element should be visually first

  if (carouselInitComplete.value) {
    if (offset.value === 1) {
      const localOffset = offset.value === previousOffset.value ? offset.value : 2; // Ensure we have a valid offset
      currentIndex.value = currentIndex.value === itemCount.value ? 1 : currentIndex.value + localOffset;
      firstVisualElementIndex = currentIndex.value;
      let order = 1;

      for (let i = currentIndex.value; i <= itemCount.value; i++) updateOrder(i, order++);
      for (let i = 1; i < currentIndex.value; i++) updateOrder(i, order++);

    } else {
      const localOffset = offset.value === previousOffset.value ? offset.value : -2; // Ensure we have a valid offset
      currentIndex.value = currentIndex.value === 1 ? itemCount.value : currentIndex.value + localOffset;
      firstVisualElementIndex = currentIndex.value;
      let order = itemCount.value;

      for (let i = currentIndex.value; i >= 1; i--) updateOrder(i, order--);
      for (let i = itemCount.value; i > currentIndex.value; i--) updateOrder(i, order--);
    }
    previousOffset.value = offset.value; // Store the previous offset for next transition

  }

  // 3. Next tick: capture new positions & animate both main items and thumbnails
  requestAnimationFrame(() => {
    const lastRects = items.map(el => el.getBoundingClientRect());
    const lastThumbRects = thumbs.map(el => el.getBoundingClientRect());

    // Animate main carousel items
    items.forEach((el, i) => {
      const dx = firstRects[i].left - lastRects[i].left;
      const dy = firstRects[i].top - lastRects[i].top;

      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px)`;

      requestAnimationFrame(() => {
        el.style.transition = `transform ${transitionSpeedStr} ease`;
        el.style.transform = '';

        // Set z-index after the transition actually completes
        const elementIndex = i + 1; // Convert to 1-based index to match your logic
        const isFirstVisual = elementIndex === firstVisualElementIndex;

        // Listen for transition end to update z-index
        const handleTransitionEnd = (event: TransitionEvent) => {
          if (event.propertyName === 'transform') {
            el.style.zIndex = isFirstVisual ? '1' : '2';
            el.removeEventListener('transitionend', handleTransitionEnd);
          }
        };

        el.addEventListener('transitionend', handleTransitionEnd);
      });
    });

    // Animate thumbnail items
    thumbs.forEach((thumb, i) => {
      const dx = firstThumbRects[i].left - lastThumbRects[i].left;
      const dy = firstThumbRects[i].top - lastThumbRects[i].top;

      thumb.style.transition = 'none';
      thumb.style.transform = `translate(${dx}px, ${dy}px)`;

      requestAnimationFrame(() => {
        thumb.style.transition = `transform ${transitionSpeedStr} ease`;
        thumb.style.transform = '';

        // Set z-index after the transition actually completes
        const thumbIndex = i + 1; // Convert to 1-based index
        const isActiveThumbnail = thumbIndex === firstVisualElementIndex;

        // Listen for transition end to update z-index
        const handleThumbTransitionEnd = (event: TransitionEvent) => {
          if (event.propertyName === 'transform') {
            thumb.style.zIndex = isActiveThumbnail ? '1' : '2';
            thumb.removeEventListener('transitionend', handleThumbTransitionEnd);
          }
        };

        thumb.addEventListener('transitionend', handleThumbTransitionEnd);
      });
    });
  });

  carouselInitComplete.value = true;
};

onMounted(() => {
  initialSetup();
});

</script>

<style lang="css">
.carousel-basic {

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

  .item-container {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-block: 10px;
    padding-inline: 10px;
    outline: 1px solid light-dark(#00000090, #f00ff090);

    /* scroll-snap-type: x mandatory; */

    /* isolation: isolate; */
    position: relative;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      /* transition: transform v-bind(transitionSpeedStr) ease; */
      /* For FLIP smoothness */

      aspect-ratio: 4 / 3;

      min-inline-size: 600px;
      color: light-dar(#aaa, #333);
      padding-block: 10px;
      padding-inline: 10px;
      border-radius: 4px;
      outline: 1px solid light-dark(#00000090, #f00ff090);

      background-color: light-dark(#f00, #00f);

      /* scroll-snap-align: none center; */

      &:nth-child(odd) {
        background-color: light-dark(#00f, #f00);
      }
    }
  }


  .controls-container {

    display: flex;
    gap: 20px;

    .buttons-container {
      display: flex;
      flex-grow: 1;
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

        &:active {
          background-color: light-dark(#0009, #fff9);
        }
      }
    }

    .thumbnail-container {
      padding-block: 10px;
      padding-inline: 10px;
      outline: 1px solid light-dark(#00000090, #f00ff090);
      max-inline-size: 40%;

      .thumbnail-list {
        display: flex;
        gap: 10px;
        list-style-type: none;
        padding-block: 8px;
        padding-inline: 8px;
        margin-block: 0;
        margin-inline: 0;

        outline: 1px solid light-dark(#00000090, #f00ff090);
        overflow-x: auto;

        .thumbnail-item {

          display: flex;
          align-items: center;
          justify-content: center;

          aspect-ratio: 3 / 4;
          min-inline-size: 120px;
          outline: 1px solid light-dark(#f00, #00f);
          border-radius: 4px;

          background-color: light-dark(#f00, #00f);

          &:nth-child(odd) {
            background-color: light-dark(#00f, #f00);
          }


          .thumbnail-item_inner {}
        }
      }
    }
  }

}
</style>
