<template>
  <div class="slider-gallery" ref="sliderGalleryWrapper">
    <div class="list" ref="sliderGalleryImagesList">
      <div v-for="item in galleryData" class="item">
        <img :src="item.src" />
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
      <div v-for="item in galleryData" class="item">
        <img :src="item.src" />
        <div class="content">
          <div class="title">Name Slider</div>
          <div class="description">Description</div>
        </div>
      </div>
    </div>

    <div class="arrows">
      <button id="prev" ref="prevDom" @click.prevent="doPrevious()"><</button>
      <button id="next" ref="nextDom" @click.prevent="doNext()">></button>
    </div>

    <div class="time" ref="timeDom"></div>
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
}

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const galleryData = defineModel<IGalleryData[]>('galleryData');

const sliderGalleryWrapper = useTemplateRef('sliderGalleryWrapper');
const sliderGalleryImagesList = useTemplateRef('sliderGalleryImagesList');
const sliderGalleryThumbnailsList = useTemplateRef('sliderGalleryThumbnailsList');
const timeDom = useTemplateRef('timeDom');

const animationDuration = 3000;
const autoRunInterval = 7000;

const doNext = () => {
  showSlider('next');
};

const doPrevious = () => {
  showSlider('prev');
};

let runTimeOut: any;
let runNextAuto = setTimeout(() => {
  if (!props.autoRun) return;
  doNext();
}, autoRunInterval);

function showSlider(type: string) {
  // Get fresh references to all items by querying the DOM directly
  const currentSliderItems = Array.from(sliderGalleryImagesList.value?.children || []);
  const currentThumbnailItems = Array.from(sliderGalleryThumbnailsList.value?.children || []);

  if (type === 'next') {
    // Move the first item to the end
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
    // Move the last item to the beginning
    if (currentSliderItems.length) {
      const lastItem = currentSliderItems[currentSliderItems.length - 1];
      sliderGalleryImagesList.value?.prepend(lastItem);
    }

    if (currentThumbnailItems.length) {
      const lastThumb = currentThumbnailItems[currentThumbnailItems.length - 1];
      sliderGalleryThumbnailsList.value?.prepend(lastThumb);
    }

    sliderGalleryWrapper.value?.classList.add('prev');
  }

  clearTimeout(runTimeOut);
  runTimeOut = setTimeout(() => {
    if (sliderGalleryWrapper.value) {
      sliderGalleryWrapper.value.classList.remove('next');
      sliderGalleryWrapper.value.classList.remove('prev');
    }
  }, animationDuration);

  clearTimeout(runNextAuto);
  runNextAuto = setTimeout(() => {
    if (!props.autoRun) return;
    doNext();
  }, autoRunInterval);
}

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
/* slider-gallery */
.slider-gallery {
  height: 100svh;
  /* margin-top: -50px; */
  width: 100vw;
  overflow: hidden;
  position: absolute;
  inset: 0 0 0 0;

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
      width: 150px;
      height: 220px;
      flex-shrink: 0;
      position: relative;

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
            width: 150px;
            height: 220px;
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
      animation: runningTime 3s linear 1 forwards;
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
    }

    .arrows {
      button {
        pointer-events: none;
      }
    }

    .thumbnail {
      .item {
        &:nth-child(1) {
          overflow: hidden;
          opacity: 0;
          animation: showThumbnail 0.5s linear 1 forwards;
        }
      }
    }
    .time {
      animation: runningTime 3s linear 1 forwards;
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
    transform: translateX(150px);
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
    width: 150px;
    height: 220px;
    bottom: 50px;
    left: 50%;
    border-radius: 20px;
  }
}

@keyframes contentOut {
  to {
    transform: translateY(-150px);
    filter: blur(20px);
    opacity: 0;
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
