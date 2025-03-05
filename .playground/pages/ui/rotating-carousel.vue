<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Rotating Carousel</h2>
          <div class="display-flex mbe-12" align-content="center-center" gap="12px" flex-wrap="wrap">
            <div class="display-flex mbe-12" align-content="center-center" gap="12px" flex-wrap="wrap">
              <label for="rotateX">rotateX</label>
              <input type="range" min="-20" max="20" step="1" v-model="rotateX" id="rotateX" />
              <span>{{ rotateX }}deg</span>
            </div>
            <div class="display-flex mbe-12" align-content="center-center" gap="12px" flex-wrap="wrap">
              <label for="perspective">perspective</label>
              <input type="range" min="600" max="1500" step="50" v-model="perspective" id="perspective" />
              <span>{{ perspective }}px</span>
            </div>
            <div class="display-flex mbe-12" align-content="center-center" gap="12px" flex-wrap="wrap">
              <label for="translateZ">translateZ</label>
              <input type="range" min="350" max="900" step="10" v-model="translateZ" id="translateZ" />
              <span>{{ translateZ }}px</span>
            </div>
            <div class="display-flex mbe-12" align-content="center-center" gap="12px" flex-wrap="wrap">
              <label for="pauseOnHover">pauseOnHover</label>
              <input type="checkbox" v-model="pauseOnHover" id="pauseOnHover" />
              <span>{{ pauseOnHover }}</span>
            </div>
          </div>
        </LayoutRow>
        <LayoutRow tag="div" variant="full" :styleClassPassthrough="['mbe-20']">
          <RotatingCarouselImage :data :rotateX="Number(rotateX)" :perspective="Number(perspective)" :translateZ="Number(translateZ)" :pauseOnHover />
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: 'Browser title tag',
  meta: [
    {
      name: 'description',
      content: 'Meta description content',
    },
  ],
  bodyAttrs: {
    class: 'classname-for-namespacing-if-desired',
  },
});

const perspective = ref<number>(1000);
const rotateX = ref<number>(-13);
const translateZ = ref<number>(550);
const pauseOnHover = ref<boolean>(false);

interface IAccordianData {
  src: string;
  alt: string;
}

const data = ref<IAccordianData[]>([
  {
    src: '/images/rotating-carousel/dragon_1.jpg',
    alt: 'Image 1',
  },
  {
    src: '/images/rotating-carousel/dragon_2.jpg',
    alt: 'Image 2',
  },
  {
    src: '/images/rotating-carousel/dragon_3.jpg',
    alt: 'Image 3',
  },
  {
    src: '/images/rotating-carousel/dragon_4.jpg',
    alt: 'Image 4',
  },
  {
    src: '/images/rotating-carousel/dragon_5.jpg',
    alt: 'Image 5',
  },
  {
    src: '/images/rotating-carousel/dragon_6.jpg',
    alt: 'Image 6',
  },
  {
    src: '/images/rotating-carousel/dragon_7.jpg',
    alt: 'Image 7',
  },
  {
    src: '/images/rotating-carousel/dragon_8.jpg',
    alt: 'Image 8',
  },
  {
    src: '/images/rotating-carousel/dragon_9.jpg',
    alt: 'Image 9',
  },
  {
    src: '/images/rotating-carousel/dragon_10.jpg',
    alt: 'Image 10',
  },
]);
</script>

<style lang="css">
.classname-for-namespacing-if-desired {
  /* CSS styles */
}
</style>
