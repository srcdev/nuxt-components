<template>
  <section class="carousel-basic" :class="[elementClasses, { 'controls-inside': controlsInside}]">

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
import { useCarouselSlider } from '../../composables/useCarouselSlider';
import { useStyleClassPassthrough } from '../../composables/useStyleClassPassthrough';
import { templateRef } from '@vueuse/core';
import { ref, onMounted } from 'vue';
import type { PropType } from 'vue';

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
    default: 500
  },
  controlsInside: {
    type: Boolean,
    default: false
  }
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const carouselItems = templateRef<HTMLDivElement[]>('carouselItems');
const thumbnailItems = templateRef<HTMLLIElement[]>('thumbnailItems');

const itemCount = ref(props.data.items.length);

const { animateNext, animatePrev, initialSetup } = useCarouselSlider(
  carouselItems,
  thumbnailItems,
  itemCount,
  props.transitionSpeed
);

const actionPrevious = () => {
  animatePrev();
}

const actionNext = () => {
  animateNext();
}

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
      overflow-x: hidden;
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
        overflow-x: hidden;

        .thumbnail-list {
          display: flex;
          gap: 10px;
          list-style-type: none;
          padding-block: 8px;
          padding-inline: 8px;
          margin-block: 0;
          margin-inline: 0;

          outline: 1px solid light-dark(#00000090, #f00ff090);
          /* overflow-x: auto; */

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
          }
        }
      }
    }

  }

</style>
