<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full" :styleClassPassthrough="['mbe-20']">
          <h1 class="heading-2">Rotating Carousel</h1>
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
            <div class="display-flex mbe-12" align-content="center-center" gap="12px" flex-wrap="wrap">
              <label for="useParallaxEffect">useParallaxEffect</label>
              <input type="checkbox" v-model="useParallaxEffect" id="useParallaxEffect" />
              <span>{{ useParallaxEffect }}</span>
            </div>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="full" :styleClassPassthrough="['mbe-20']" style="margin-block: 300px">
          <RotatingCarouselImage :data :rotateX="Number(rotateX)" :perspective="Number(perspective)" :translateZ="Number(translateZ)" :pauseOnHover :useParallaxEffect />
        </LayoutRow>

        <LayoutRow tag="div" variant="full" :styleClassPassthrough="['mbe-20']" style="margin-block-end: 600px">
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
            <div class="display-flex mbe-12" align-content="center-center" gap="12px" flex-wrap="wrap">
              <label for="useParallaxEffect">useParallaxEffect</label>
              <input type="checkbox" v-model="useParallaxEffect" id="useParallaxEffect" />
              <span>{{ useParallaxEffect }}</span>
            </div>
          </div>
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
const useParallaxEffect = ref<boolean>(true);

interface IAccordianData {
  src: string;
  alt: string;
}

const data = ref<IAccordianData[]>([
  {
    src: '/images/rotating-carousel/image-1.webp',
    alt: 'Image 1',
  },
  {
    src: '/images/rotating-carousel/image-2.webp',
    alt: 'Image 2',
  },
  {
    src: '/images/rotating-carousel/image-3.webp',
    alt: 'Image 3',
  },
  {
    src: '/images/rotating-carousel/image-4.webp',
    alt: 'Image 4',
  },
  {
    src: '/images/rotating-carousel/image-5.webp',
    alt: 'Image 5',
  },
  {
    src: '/images/rotating-carousel/image-6.webp',
    alt: 'Image 6',
  },
  {
    src: '/images/rotating-carousel/image-7.webp',
    alt: 'Image 7',
  },
  {
    src: '/images/rotating-carousel/image-8.webp',
    alt: 'Image 8',
  },
  {
    src: '/images/rotating-carousel/image-9.webp',
    alt: 'Image 9',
  },
]);
</script>

<style lang="css">
.classname-for-namespacing-if-desired {
  /* CSS styles */
}
</style>
