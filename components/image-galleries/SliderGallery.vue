<template>
  <div class="slider-gallery" :class="[elementClasses]" ref="sliderGalleryWrapper">
    <div class="loading-state" :class="[{ loaded: !isLoading }]">
      <div class="loading-spinner"></div>
      <p>Loading gallery...</p>
    </div>

    <div v-if="showGallery" class="gallery-content" :class="[{ loaded: isLoading }]">
      <div class="list" ref="sliderGalleryImagesList">
        <div v-for="(item, index) in galleryData" :key="index" class="item">
          <NuxtImg :src="item.src" :alt="item.alt" @load="handleImageLoad(index)" @error="handleImageError(index)" loading="lazy" />
          <div class="content">
            <div class="author">{{ item.stylist }}</div>
            <div class="title">{{ item.title }}</div>
            <div class="topic">{{ item.category }}</div>
            <div class="des">{{ item.description }}</div>
            <div class="buttons">
              <button>SEE MORE</button>
            </div>
          </div>
        </div>
      </div>

      <div class="thumbnail" ref="sliderGalleryThumbnailsList">
        <div v-for="(item, index) in galleryData" :key="index" class="item">
          <div class="inner">
            <img :src="item.src" :alt="item.alt" loading="lazy" />
            <div class="content">
              <div class="title" v-show="item.thumbnail?.title !== ''">{{ item.thumbnail?.title }}</div>
              <div class="description" v-show="item.thumbnail?.description !== ''">{{ item.thumbnail?.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="arrows">
        <button id="prev" ref="prevDom" @click.prevent="doPrevious()"><</button>
        <button id="next" ref="nextDom" @click.prevent="doNext()">></button>
      </div>

      <div class="time"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  autoRun: {
    type: Boolean,
    default: true,
  },
  autoRunInterval: {
    type: Number,
    default: 7000,
  },
  animationDuration: {
    type: Number,
    default: 3000,
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

interface IGalleryData {
  src: string;
  alt: string;
  stylist?: string;
  title?: string;
  category?: string;
  description?: string;
  thumbnail?: {
    title: string;
    description: string;
  };
}

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const galleryData = defineModel<IGalleryData[]>('galleryData');

const sliderGalleryWrapper = useTemplateRef('sliderGalleryWrapper');
const sliderGalleryImagesList = useTemplateRef('sliderGalleryImagesList');
const sliderGalleryThumbnailsList = useTemplateRef('sliderGalleryThumbnailsList');

const isLoading = ref(true);
const showGallery = ref(false);
const loadedImages = ref<Set<number>>(new Set());
const preloadedImages = ref<Array<HTMLImageElement>>([]);

onMounted(async () => {
  await nextTick();

  // If no images or galleryData is empty, stop loading
  if (!galleryData.value || galleryData.value.length === 0) {
    isLoading.value = false;
    return;
  }

  // Create an array to hold image loading promises
  const imageLoadPromises: Promise<void>[] = [];

  // Preload the first image at minimum
  const firstImageIndex = 0;
  if (galleryData.value[firstImageIndex]) {
    const img = new Image();
    img.src = galleryData.value[firstImageIndex].src;

    const promise = new Promise<void>((resolve) => {
      img.onload = () => {
        console.log('Image preloaded:', firstImageIndex);
        loadedImages.value.add(firstImageIndex);
        resolve();
      };
      img.onerror = () => {
        console.error('Failed to preload image:', firstImageIndex);
        loadedImages.value.add(firstImageIndex); // Count as loaded anyway
        resolve();
      };
    });

    imageLoadPromises.push(promise);
    preloadedImages.value.push(img);
  }

  // Wait for at least the first image to load
  await Promise.race(imageLoadPromises);

  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

const handleImageLoad = (index: number) => {
  console.log('Image loaded:', index);
  loadedImages.value.add(index);
};

const handleImageError = (index: number) => {
  console.error(`Failed to load image at index ${index}`);
  loadedImages.value.add(index);
};

const doNext = () => {
  if (isLoading.value) return;
  showSlider('next');
};

const doPrevious = () => {
  if (isLoading.value) return;
  showSlider('prev');
};

let runTimeOut: any;
let runNextAuto: any = null;

function showSlider(type: string) {
  const currentSliderItems = Array.from(sliderGalleryImagesList.value?.children || []);
  const currentThumbnailItems = Array.from(sliderGalleryThumbnailsList.value?.children || []);

  if (type === 'next') {
    if (currentSliderItems.length) {
      const firstItem = currentSliderItems[0];
      sliderGalleryImagesList.value?.appendChild(firstItem);
    }

    if (currentThumbnailItems.length) {
      const firstThumb = currentThumbnailItems[0];
      sliderGalleryThumbnailsList.value?.appendChild(firstThumb);
    }

    sliderGalleryWrapper.value?.classList.add('next');
  } else {
    if (currentSliderItems.length) {
      const lastItem = currentSliderItems[currentSliderItems.length - 1];
      lastItem.classList.add('prepend-item');
      sliderGalleryImagesList.value?.prepend(lastItem);
    }

    if (currentThumbnailItems.length) {
      const lastThumb = currentThumbnailItems[currentThumbnailItems.length - 1];
      lastThumb.classList.add('prepend-item');
      sliderGalleryThumbnailsList.value?.prepend(lastThumb);
    }

    sliderGalleryWrapper.value?.offsetWidth; // Force reflow
    sliderGalleryWrapper.value?.classList.add('prev');
  }

  clearTimeout(runTimeOut);
  runTimeOut = setTimeout(() => {
    // Your existing cleanup code
    if (sliderGalleryWrapper.value) {
      sliderGalleryWrapper.value.classList.remove('next');
      sliderGalleryWrapper.value.classList.remove('prev');

      // Remove helper classes
      const items = sliderGalleryImagesList.value?.querySelectorAll('.prepend-item');
      items?.forEach((item) => item.classList.remove('prepend-item'));

      const thumbs = sliderGalleryThumbnailsList.value?.querySelectorAll('.prepend-item');
      thumbs?.forEach((thumb) => thumb.classList.remove('prepend-item'));
    }
  }, props.animationDuration);

  // Reset auto-run timer
  clearTimeout(runNextAuto);
  runNextAuto = setTimeout(() => {
    if (!props.autoRun || isLoading.value) return;
    doNext();
  }, props.autoRunInterval);
}

// Initialize auto-run only after loading completes
watch(isLoading, (isLoadingNow) => {
  if (!isLoadingNow && props.autoRun) {
    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
      doNext();
    }, props.autoRunInterval);
  }
});

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

onBeforeUnmount(() => {
  clearTimeout(runTimeOut);
  clearTimeout(runNextAuto);
});

onMounted(() => {
  showGallery.value = true;
});
</script>

<style lang="css">
.slider-gallery {
  --_animationDuration: v-bind(animationDuration + 'ms');

  --_thumbnailAspectRatio: 150 /220;

  --_thumbnailWidth: var(--_thumbnailMobileWidth, 100px);
  --_thumbnailHeight: var(--_thumbnailMobileHeight, 165px);

  @media screen and (min-width: 1024px) {
    --_thumbnailWidth: var(--_thumbnailDesktopWidth, 150px);
    --_thumbnailHeight: var(--_thumbnailDesktopHeight, 220px);
  }

  height: 100svh;
  width: 100vw;
  overflow: hidden;
  position: absolute;
  inset: 0 0 0 0;

  .loading-state {
    position: absolute;
    inset: 0 0 0 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    background-color: var(--page-bg);
    align-items: center;
    justify-content: center;
    color: var(--grayscale-text-body);
    opacity: 1;
    transition: display 0.5s, opacity 0.5s;
    transition-behavior: allow-discrete;

    &.loaded {
      display: none;
      opacity: 0;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #f1683a;
      animation: spinner 1s ease-in-out infinite;
      margin-bottom: 20px;
    }

    p {
      font-size: 1.2em;
      font-weight: 500;
    }
  }

  .gallery-content {
    width: 100%;
    height: 100%;
    position: relative;
    /* opacity: 0; */
    /* transition: opacity 0.5s ease-in-out; */

    &.loaded {
      /* opacity: 1; */
    }
  }

  .list {
    .item {
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0 0 0 0;

      &:nth-child(1) {
        z-index: 1;

        .content {
          .author,
          .title,
          .topic,
          .des,
          .buttons {
            transform: translateY(50px);
            filter: blur(20px);
            opacity: 0;
            animation: showContent 0.5s 1s linear 1 forwards;
          }

          .title {
            animation-delay: 1.2s !important;
          }
          .topic {
            animation-delay: 1.4s !important;
          }
          .des {
            animation-delay: 1.6s !important;
          }
          .buttons {
            animation-delay: 1.8s !important;
          }
        }
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .content {
        position: absolute;
        top: 20%;
        width: 1140px;
        max-width: 80%;
        left: 50%;
        transform: translateX(-50%);
        padding-right: 30%;
        box-sizing: border-box;
        color: #fff;
        text-shadow: 0 5px 10px #0004;

        .author {
          font-weight: bold;
          letter-spacing: 10px;
        }

        .title {
          font-size: 5em;
          font-weight: bold;
          line-height: 1.3em;
        }
        .topic {
          font-size: 5em;
          font-weight: bold;
          line-height: 1.3em;
          color: #f1683a;
        }

        .buttons {
          display: grid;
          grid-template-columns: repeat(2, 130px);
          grid-template-rows: 40px;
          gap: 5px;
          margin-top: 20px;

          button {
            background-color: #99999975;
            border: 1px solid #fff;
            color: #fff;
            letter-spacing: 3px;
            font-weight: 500;
          }
        }
      }
    }
  }

  .thumbnail {
    position: absolute;
    bottom: 50px;
    left: 50%;
    width: max-content;
    z-index: 100;
    display: flex;
    gap: 20px;

    .item {
      width: var(--_thumbnailWidth);
      height: var(--_thumbnailHeight);
      flex-shrink: 0;
      position: relative;

      border: var(--_thumbnailBorder, 1px solid transparent);
      outline: var(--_thumbnailOutline, 1px solid transparent);
      border-radius: var(--_thumbnailBorderRadius, 20px);

      .inner {
        position: absolute;
        inset: 0 0 0 0;
        background-color: #0004;
        border-radius: var(--_thumbnailBorderRadius, 20px);
        z-index: 2;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
      }

      .content {
        color: #fff;
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;

        .title {
          font-weight: 500;
        }

        .description {
          font-weight: 300;
        }
      }
    }
  }

  /* arrows */
  .arrows {
    position: absolute;
    top: 80%;
    right: 52%;
    z-index: 100;
    width: 300px;
    max-width: 30%;
    display: flex;
    gap: 10px;
    align-items: center;

    button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #eee4;
      border: none;
      color: #fff;
      font-family: monospace;
      font-weight: bold;
      transition: 0.5s;

      &:hover {
        background-color: #fff;
        color: #000;
      }
    }
  }

  .time {
    position: absolute;
    z-index: 1000;
    width: 0%;
    height: 3px;
    background-color: #f1683a;
    left: 0;
    top: 0;
  }

  /* Slider carousel animations */
  &.next {
    .list {
      .item {
        &:nth-child(1) {
          img {
            width: var(--_thumbnailWidth);
            height: var(--_thumbnailHeight);
            position: absolute;
            bottom: 50px;
            left: 50%;
            border-radius: 30px;
            animation: showImage 0.5s linear 1 forwards;
          }
        }
      }
    }

    .arrows {
      button {
        pointer-events: none;
      }
    }

    .thumbnail {
      animation: effectNext 0.5s linear 1 forwards;

      .item {
        &:nth-last-child(1) {
          overflow: hidden;
          animation: showThumbnail 0.5s linear 1 forwards;
        }
      }
    }

    .time {
      animation: runningTime var(--_animationDuration) linear 1 forwards;
    }
  }

  &.prev {
    .list {
      .item {
        &:nth-child(2) {
          z-index: 2;

          img {
            animation: outFrame 0.5s linear 1 forwards;
            position: absolute;
            bottom: 0;
            left: 0;
          }

          .content {
            .author,
            .title,
            .topic,
            .des,
            .buttons {
              animation: contentOut 1.5s linear 1 forwards !important;
            }
          }
        }
        img {
          z-index: 100;
        }
      }

      .item.prepend-item {
        z-index: 1; /* Ensure it's visible */
        /* Any initial styles needed */
      }
    }

    .arrows {
      button {
        pointer-events: none;
      }
    }

    .thumbnail {
      /* Add a transform to the entire thumbnail container */
      animation: effectPrev 0.5s linear 1 forwards;

      .item {
        &:first-child {
          /* Add the animated border effect */
          &::before {
            animation: countdownBorder 7s linear 1 forwards;
          }
        }
        &:nth-child(1) {
          overflow: hidden;
          animation: showThumbnailPrev 0.5s linear 1 forwards;
        }
      }

      .item.prepend-item {
        opacity: 0;
        transform: translateX(-20px);
        /* Initial state for thumbnail animation */
      }
    }
    .time {
      animation: runningTime var(--_animationDuration) linear 1 forwards;
    }
  }
}

@keyframes showContent {
  to {
    transform: translateY(0px);
    filter: blur(0px);
    opacity: 1;
  }
}

@keyframes showImage {
  to {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}

@keyframes showThumbnail {
  from {
    width: 0;
    opacity: 0;
  }
}

@keyframes effectNext {
  from {
    transform: translateX(calc(1 * var(--_thumbnailWidth)));
  }
}

@keyframes runningTime {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

@keyframes outFrame {
  to {
    width: var(--_thumbnailWidth);
    height: var(--_thumbnailHeight);
    bottom: 50px;
    left: 50%;
    border-radius: 20px;
  }
}

@keyframes contentOut {
  to {
    transform: translateY(calc(-1 * var(--_thumbnailWidth)));
    filter: blur(20px);
    opacity: 0;
  }
}

@keyframes effectPrev {
  from {
    transform: translateX(calc(-1 * var(--_thumbnailWidth)));
  }
  to {
    transform: translateX(0);
  }
}

@keyframes showThumbnailPrev {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 678px) {
  .slider-gallery .list .item .content {
    padding-right: 0;
  }
  .slider-gallery .list .item .content .title {
    font-size: 30px;
  }
}
</style>
