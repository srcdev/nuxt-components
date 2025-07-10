<template>
  <section class="carousel-basic" :class="elementClasses">

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
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const carouselContentRef = useTemplateRef<HTMLDivElement>('carouselContent');
const carouselItems = useTemplateRef<HTMLDivElement[]>('carouselItems');
const thumbnailItems = useTemplateRef<HTMLLIElement[]>('thumbnailItems');
const carouselInitComplete = ref(false);

const currentIndex = ref(1);
const itemCount = ref(props.data.items.length);
const forward = ref(true);

// Set initial z-index values when component mounts
onMounted(() => {
  const items = carouselItems.value;
  if (items && Array.isArray(items)) {
    items.forEach((item, index) => {
      item.style.zIndex = index === 0 ? '1' : '2';
    });
  }

  const thumbs = thumbnailItems.value;
  if (thumbs && Array.isArray(thumbs)) {
    thumbs.forEach((thumb, index) => {
      thumb.style.zIndex = index === 0 ? '1' : '2';
    });
  }
});


// useEventListener(carouselContentRef, "transitionend", () => {
//   onTransitionEnd();
// });

const actionPrevious = () => {
  console.log("actionPrevious() clicked");
  forward.value = false;
  carouselInitComplete.value = true; // For testing
  onTransitionEnd(); // For testing
}

const actionNext = () => {
  console.log("actionNext() clicked");
  forward.value = true;
  carouselInitComplete.value = true; // For testing
  onTransitionEnd(); // For testing
}

const updateOrder = (index: number, order: number) => {
  // console.log(`updateOrder() | itemCount(${itemCount.value}), index(${index}), order(${order})`);

  if (carouselItems.value !== null) {
    const element = carouselItems.value[index - 1];
    element.style.order = order.toString();
  }

  // Also update thumbnail order
  if (thumbnailItems.value !== null) {
    const thumbElement = thumbnailItems.value[index - 1];
    thumbElement.style.order = order.toString();
  }
};

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
    if (forward.value) {
      currentIndex.value = currentIndex.value === itemCount.value ? 1 : currentIndex.value + 1;
      firstVisualElementIndex = currentIndex.value;
      let order = 1;
      for (let i = currentIndex.value; i <= itemCount.value; i++) updateOrder(i, order++);
      for (let i = 1; i < currentIndex.value; i++) updateOrder(i, order++);
    } else {
      currentIndex.value = currentIndex.value === 1 ? itemCount.value : currentIndex.value - 1;
      firstVisualElementIndex = currentIndex.value;
      let order = itemCount.value;
      for (let i = currentIndex.value; i >= 1; i--) updateOrder(i, order--);
      for (let i = itemCount.value; i > currentIndex.value; i--) updateOrder(i, order--);
    }
  } else {
    // Initial setup - set z-index for all items
    items.forEach((item, index) => {
      item.style.zIndex = index === 0 ? '1' : '2';
    });
    thumbs.forEach((thumb, index) => {
      thumb.style.zIndex = index === 0 ? '1' : '2';
    });
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
        el.style.transition = 'transform 3000ms ease';
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
        thumb.style.transition = 'transform 3000ms ease';
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


</script>

<style lang="css">

  .carousel-basic {

    .item-container {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-block: 10px;
      padding-inline: 10px;
      outline: 1px solid light-dark(#00000090, #f0f0f090);

      /* isolation: isolate; */
      position: relative;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        /* transition: transform 3000ms ease; */
          /* For FLIP smoothness */

        aspect-ratio: 4 / 3;

        min-inline-size: 400px;
        color: light-dar(#aaa, #333);
        padding-block: 10px;
        padding-inline: 10px;
        border-radius: 4px;
        outline: 1px solid light-dark(#00000090, #f0f0f090);

        background-color: light-dark(#f00, #0f0);

        &:nth-child(odd) {
          background-color: light-dark(#0f0, #f00);
        }
      }
    }


    .controls-container {

      display: flex;
      gap: 20px;

      margin-block-start: 10px;

      .buttons-container {
        display: flex;
        flex-grow: 1;
        justify-content: end;
        gap: 20px;


        .btn-action {

        }
      }

      .thumbnail-container {
        padding-block: 10px;
        padding-inline: 10px;
        outline: 1px solid light-dark(#00000090, #f0f0f090);
        max-inline-size: 40%;

        .thumbnail-list {
          display: flex;
          gap: 10px;
          list-style-type: none;
          padding-block: 8px;
          padding-inline: 8px;
          margin-block: 0;
          margin-inline: 0;

          outline: 1px solid light-dark(#00000090, #f0f0f090);
          overflow-x: auto;

          .thumbnail-item {

            display: flex;
            align-items: center;
            justify-content: center;

            aspect-ratio: 3 / 4;
            min-inline-size: 120px;
            outline: 1px solid light-dark(#f00, #0f0);
            border-radius: 4px;

            .thumbnail-item_inner {
            }
          }
        }
      }
    }

  }

</style>
