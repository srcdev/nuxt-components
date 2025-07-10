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
          <li v-for="item, index in data?.items" class="thumbnail-item">
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
const carouselItems = useTemplateRef<HTMLDivElement>('carouselItems');
const carouselInitComplete = ref(false);

const currentIndex = ref(1);
const itemCount = ref(props.data.items.length);
const forward = ref(true);


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
    // carouselItems.value[index - 1].style.order = order;
    carouselItems.value[index - 1].style.order = order;
  }
};

const onTransitionEnd = () => {
  const items = carouselItems.value;

  if (!items || !Array.isArray(items)) return;

  // 1. Capture initial positions
  const firstRects = items.map(el => el.getBoundingClientRect());

  // 2. Update orders
  if (carouselInitComplete.value) {
    if (forward.value) {
      currentIndex.value = currentIndex.value === itemCount.value ? 1 : currentIndex.value + 1;
      let order = 1;
      for (let i = currentIndex.value; i <= itemCount.value; i++) updateOrder(i, order++);
      for (let i = 1; i < currentIndex.value; i++) updateOrder(i, order++);
    } else {
      currentIndex.value = currentIndex.value === 1 ? itemCount.value : currentIndex.value - 1;
      let order = itemCount.value;
      for (let i = currentIndex.value; i >= 1; i--) updateOrder(i, order--);
      for (let i = itemCount.value; i > currentIndex.value; i--) updateOrder(i, order--);
    }
  }

  // 3. Next tick: capture new positions & animate
  requestAnimationFrame(() => {
    const lastRects = items.map(el => el.getBoundingClientRect());

    items.forEach((el, i) => {
      const dx = firstRects[i].left - lastRects[i].left;
      const dy = firstRects[i].top - lastRects[i].top;

      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px)`;

      requestAnimationFrame(() => {
        el.style.transition = 'transform 3000ms ease';
        el.style.transform = '';
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

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        transition: transform 3000ms ease;
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
