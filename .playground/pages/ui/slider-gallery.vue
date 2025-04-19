<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['display-details-section', 'mbe-20']">
          <h2 class="heading-2">Slider Gallery Component</h2>

          <SliderGallery v-model:gallery-data="galleryData" :auto-run="false" />
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

const galleryData = ref([
  {
    src: '/images/rotating-carousel/image-4.webp',
    alt: 'Balayage highlights',
    stylist: 'Luxury Locs',
    title: 'Balayage Highlights',
    category: 'Hair Colouring',
    description:
      'Balayage highlights are a hair coloring technique where color is painted onto the hair in a sweeping motion, creating a natural, sun-kissed look. This method allows for a soft gradation of color, typically lighter towards the ends, and can be used on various hair shades, not just blondes.',
    thumbnail: {
      title: 'Balayage',
      description: 'Heighlights',
    },
  },
  {
    src: '/images/rotating-carousel/spanish-green-stripe.webp',
    alt: 'Lowlights with a green tinge',
    stylist: 'Luxury Locs',
    title: 'Lowlights with a green tinge',
    category: 'Hair Colouring',
    description: 'Get into the party mood with striking temporary colours and some lowlights.',
    thumbnail: {
      title: 'Hair Colouring',
      description: 'Striking Lime',
    },
  },

  {
    src: '/images/rotating-carousel/image-1.webp',
    alt: 'Image 1',
    stylist: 'Luxury Locs',
    title: 'Highlights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/image-2.webp',
    alt: 'Image 2',
    stylist: 'Luxury Locs',
    title: 'Highlights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/55-woman-garden-backdrop.webp',
    alt: 'Image 3',
    stylist: 'Luxury Locs',
    title: 'Any Age',
    category: 'Hair',
    description: 'Cut and style.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/35-light-brown-highlights.webp',
    alt: 'Image 4',
    stylist: 'Luxury Locs',
    title: 'Any Age',
    category: 'Hair',
    description: 'Cut and style.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/image-3.webp',
    alt: 'Image 3',
    stylist: 'Luxury Locs',
    title: 'Highlights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/image-5.webp',
    alt: 'Image 5',
    stylist: 'Luxury Locs',
    title: 'Highlights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/indian-pink-stripe.webp',
    alt: 'Pink stripe',
    stylist: 'Luxury Locs',
    title: 'Party colouring, pink stripe',
    category: 'Hair Colouring',
    description: 'Get into the party mood with striking temporary colours.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/image-6.webp',
    alt: 'Image 6',
    stylist: 'Luxury Locs',
    title: 'Low lights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/image-7.webp',
    alt: 'Image 7',
    stylist: 'Luxury Locs',
    title: 'Highlights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/image-8.webp',
    alt: 'Image 8',
    stylist: 'Luxury Locs',
    title: 'Highlights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
  {
    src: '/images/rotating-carousel/image-9.webp',
    alt: 'Image 9',
    stylist: 'Luxury Locs',
    title: 'Highlights',
    category: 'Hair',
    description: 'This is some description text about the image and the hair shown in the image.',
    thumbnail: {
      title: '',
      description: '',
    },
  },
]);
</script>

<style lang="css">
.slider-gallery-page {
  .slider-gallery {
    --_thumbnailBorder: 1px solid light-dark(white, dark);
    --_thumbnailOutline: 1px solid light-dark(black, white);
    --_thumbnailBorderRadius: 20px;

    /* Thumbnail sizes */
    --_thumbnailMobileWidth: 100px;
    --_thumbnailMobileHeight: 165px;

    --_thumbnailDesktopWidth: 150px;
    --_thumbnailDesktopHeight: 220px;

    .list {
      .item {
        .content {
          /* Placeholder for author styles */
          .author {
          }
          /* Placeholder for title styles */
          .title {
            font-size: var(--step-5);
            margin-block: var(--step-0);
          }
          /* Placeholder for topic styles */
          .topic {
            color: white;
            font-size: var(--step-3);
            margin-block: var(--step-0);
            mix-blend-mode: difference;
          }
          /* Placeholder for description styles */
          .desc {
            line-height: 1.5;
          }
        }
      }
    }

    .thumbnail {
      .item {
        .content {
          /* Placeholder for title styles */
          .title {
          }
          /* Placeholder for description styles */
          .description {
          }
        }
      }
    }
  }
}
</style>
