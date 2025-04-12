<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :styleClassPassthrough="['display-details-section', 'mbe-20']">
          <h2 class="heading-2">Slider Gallery Component</h2>

          <SliderGallery v-model:galleryData="galleryData"></SliderGallery>
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
  title: 'Slider Gallery Component',
  meta: [
    {
      name: 'description',
      content: 'Slider Gallery Component',
    },
  ],
  bodyAttrs: {
    class: 'slider-gallery-page',
  },
});

interface IGalleryData {
  src: string;
  alt: string;
  stylist?: string;
  title?: string;
  category?: string;
  description?: string;
}

const galleryData = ref<IGalleryData[]>([
  {
    src: '/images/rotating-carousel/image-1.webp',
    alt: 'Image 1',
    stylist: 'Luxury Locs',
    title: 'High lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
  {
    src: '/images/rotating-carousel/image-2.webp',
    alt: 'Image 2',
    stylist: 'Luxury Locs',
    title: 'High lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
  {
    src: '/images/rotating-carousel/image-3.webp',
    alt: 'Image 3',
    stylist: 'Luxury Locs',
    title: 'High lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
  {
    src: '/images/rotating-carousel/image-4.webp',
    alt: 'Image 4',
    stylist: 'Luxury Locs',
    title: 'High lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
  {
    src: '/images/rotating-carousel/image-5.webp',
    alt: 'Image 5',
    stylist: 'Luxury Locs',
    title: 'High lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
  {
    src: '/images/rotating-carousel/image-6.webp',
    alt: 'Image 6',
    stylist: 'Luxury Locs',
    title: 'Low lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
  {
    src: '/images/rotating-carousel/image-7.webp',
    alt: 'Image 7',
    stylist: 'Luxury Locs',
    title: 'High lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
  {
    src: '/images/rotating-carousel/image-8.webp',
    alt: 'Image 8',
    stylist: 'Luxury Locs',
    title: 'High lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
  {
    src: '/images/rotating-carousel/image-9.webp',
    alt: 'Image 9',
    stylist: 'Luxury Locs',
    title: 'High lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
  },
]);
</script>

<style lang="css">
.animated-svg-text-page {
  .animated-svg-text {
    &.luxury-locs-title {
      margin-block-start: 2em;

      --_animated-svg-animation-duration: 4s;
      --_animated-svg-text-stroke-dasharray: 176;

      /* Light mode */
      --_animated-svg-text-stroke-light: #000;
      --_animated-svg-text-fill-light: #000;

      /* Dark mode */
      --_animated-svg-text-stroke-dark: #fff;
      --_animated-svg-text-fill-dark: #fff;
    }
    &.luxury-locs-title-3 {
      margin-block-start: 2em;

      --_animated-svg-animation-duration: 6s;
      --_animated-svg-text-stroke-dasharray: 523;

      /* Light mode */
      --_animated-svg-text-stroke-light: #000;
      --_animated-svg-text-fill-light: #000;

      /* Dark mode */
      --_animated-svg-text-stroke-dark: #fff;
      --_animated-svg-text-fill-dark: #fff;
    }
  }
}
</style>
