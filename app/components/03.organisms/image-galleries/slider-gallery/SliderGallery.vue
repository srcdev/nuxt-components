<template>
  <div
    ref="sliderGalleryWrapper"
    class="slider-gallery"
    :class="[elementClasses, { 'has-text-scrim': textScrim }]"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
    @focusin="isPaused = true"
    @focusout="isPaused = false"
  >
    <div class="slider-gallery-loading" :class="[{ 'is-loaded': !isLoading }]" role="status">
      <div class="slider-gallery-spinner" aria-hidden="true"></div>
      <p>{{ loadingText }}</p>
    </div>

    <div v-if="showGallery" class="slider-gallery-content" :class="[{ 'is-loaded': !isLoading }]">
      <div ref="sliderGalleryImagesList" class="slider-gallery-list">
        <div
          v-for="(item, index) in galleryData"
          :key="index"
          class="slider-gallery-item"
          :data-text-brightness="item.textBrightness"
          :data-has-text="hasSlideText(item) ? '' : undefined"
        >
          <NuxtImg :src="item.src" :alt="item.alt" @load="handleImageLoad(index)" @error="handleImageError(index)" />
          <div class="slider-gallery-item-content" :class="item.textBrightness">
            <div v-if="item.stylist" class="slider-gallery-author">{{ item.stylist }}</div>
            <div v-if="item.title" class="slider-gallery-title">{{ item.title }}</div>
            <div v-if="item.category" class="slider-gallery-topic">{{ item.category }}</div>
            <div v-if="item.description" class="slider-gallery-description">{{ item.description }}</div>
            <div v-if="item.href" class="slider-gallery-actions">
              <a :href="item.href" class="slider-gallery-cta">{{ seeMoreText }}</a>
            </div>
          </div>
        </div>
      </div>

      <div ref="sliderGalleryThumbnailsList" class="slider-gallery-thumbnails" aria-hidden="true">
        <div v-for="(item, index) in galleryData" :key="index" class="slider-gallery-item">
          <div class="slider-gallery-thumbnail-overlay">
            <NuxtImg :src="item.src" alt="" loading="lazy" />
            <div class="slider-gallery-item-content" :class="item.textBrightness">
              <div v-if="item.thumbnail?.title" class="slider-gallery-title">{{ item.thumbnail.title }}</div>
              <div v-if="item.thumbnail?.description" class="slider-gallery-description">
                {{ item.thumbnail.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="slider-gallery-arrows">
        <button
          ref="prevDom"
          type="button"
          class="slider-gallery-prev"
          :aria-label="prevAriaLabel"
          @click.prevent="doPrevious()"
        >
          <Icon :name="prevIcon" class="slider-gallery-arrow-icon" aria-hidden="true" />
        </button>
        <button
          ref="nextDom"
          type="button"
          class="slider-gallery-next"
          :aria-label="nextAriaLabel"
          @click.prevent="doNext()"
        >
          <Icon :name="nextIcon" class="slider-gallery-arrow-icon" aria-hidden="true" />
        </button>
      </div>

      <div class="slider-gallery-progress" aria-hidden="true"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IGalleryData } from "../../../../types/components";

interface Props {
  autoRun?: boolean;
  autoRunInterval?: number;
  animationDuration?: number;
  /** Loading-state copy — override for localisation. */
  loadingText?: string;
  /** Per-slide link copy (shown for slides with an href) — override for localisation. */
  seeMoreText?: string;
  /** aria-label on the previous-image button — override for localisation. */
  prevAriaLabel?: string;
  /** aria-label on the next-image button — override for localisation. */
  nextAriaLabel?: string;
  /** aria-label on the carousel region — override for localisation. */
  ariaLabel?: string;
  prevIcon?: string;
  nextIcon?: string;
  /** Gradient behind the slide text, keyed to each slide's textBrightness. */
  textScrim?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  autoRun: true,
  autoRunInterval: 7000,
  animationDuration: 3000,
  loadingText: "Loading gallery...",
  seeMoreText: "SEE MORE",
  prevAriaLabel: "Previous image",
  nextAriaLabel: "Next image",
  ariaLabel: "Image gallery",
  prevIcon: "ic:outline-keyboard-arrow-left",
  nextIcon: "ic:outline-keyboard-arrow-right",
  textScrim: true,
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const galleryData = defineModel<IGalleryData[]>("galleryData", { required: true });

const hasSlideText = (item: IGalleryData) =>
  Boolean(item.stylist || item.title || item.category || item.description || item.href);

const sliderGalleryWrapper = useTemplateRef("sliderGalleryWrapper");
const sliderGalleryImagesList = useTemplateRef("sliderGalleryImagesList");
const sliderGalleryThumbnailsList = useTemplateRef("sliderGalleryThumbnailsList");

const transitionRunning = ref(false);
const isLoading = ref(true);
const showGallery = ref(false);
const isPaused = ref(false);
const loadedImages = new Set<number>();
const preloadedImages: HTMLImageElement[] = [];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const shouldAutoRun = () => props.autoRun && !prefersReducedMotion();

onMounted(async () => {
  await nextTick();

  if (!galleryData.value || galleryData.value.length === 0) {
    isLoading.value = false;
    return;
  }

  const imageLoadPromises: Promise<void>[] = [];

  const firstImageIndex = 0;
  if (galleryData.value[firstImageIndex]) {
    const img = new Image();
    img.src = galleryData.value[firstImageIndex].src;

    const promise = new Promise<void>((resolve) => {
      img.onload = () => {
        loadedImages.add(firstImageIndex);
        resolve();
      };
      img.onerror = () => {
        loadedImages.add(firstImageIndex);
        resolve();
      };
    });

    imageLoadPromises.push(promise);
    preloadedImages.push(img);
  }

  await Promise.race(imageLoadPromises);

  setTimeout(() => {
    isLoading.value = false;
  }, 500);

  showGallery.value = true;
  sliderGalleryWrapper.value?.addEventListener("keydown", handleKeyDown);
});

const handleImageLoad = (index: number) => {
  loadedImages.add(index);
};

const handleImageError = (index: number) => {
  loadedImages.add(index);
};

const doNext = () => {
  if (transitionRunning.value) return;
  showSlider("next");
};

const doPrevious = () => {
  if (transitionRunning.value) return;
  showSlider("prev");
};

let runTimeOut: ReturnType<typeof setTimeout> | undefined;
let runNextAuto: ReturnType<typeof setTimeout> | null = null;

function scheduleAutoRun() {
  if (runNextAuto) clearTimeout(runNextAuto);
  runNextAuto = setTimeout(() => {
    if (!shouldAutoRun() || isLoading.value) return;
    if (isPaused.value) {
      scheduleAutoRun();
      return;
    }
    doNext();
  }, props.autoRunInterval);
}

function showSlider(type: "next" | "prev") {
  transitionRunning.value = true;

  const currentSliderItems = Array.from(sliderGalleryImagesList.value?.children || []);
  const currentThumbnailItems = Array.from(sliderGalleryThumbnailsList.value?.children || []);

  if (type === "next") {
    const firstItem = currentSliderItems[0];
    if (firstItem) sliderGalleryImagesList.value?.appendChild(firstItem);

    const firstThumb = currentThumbnailItems[0];
    if (firstThumb) sliderGalleryThumbnailsList.value?.appendChild(firstThumb);

    sliderGalleryWrapper.value?.classList.add("is-next");
  } else {
    const lastItem = currentSliderItems[currentSliderItems.length - 1];
    if (lastItem) {
      lastItem.classList.add("is-prepended");
      sliderGalleryImagesList.value?.prepend(lastItem);
    }

    const lastThumb = currentThumbnailItems[currentThumbnailItems.length - 1];
    if (lastThumb) {
      lastThumb.classList.add("is-prepended");
      sliderGalleryThumbnailsList.value?.prepend(lastThumb);
    }

    void sliderGalleryWrapper.value?.offsetWidth; // force reflow so the prev animation restarts
    sliderGalleryWrapper.value?.classList.add("is-prev");
  }

  clearTimeout(runTimeOut);
  runTimeOut = setTimeout(() => {
    if (sliderGalleryWrapper.value) {
      sliderGalleryWrapper.value.classList.remove("is-next", "is-prev");
      sliderGalleryWrapper.value.querySelectorAll(".is-prepended").forEach((el) => el.classList.remove("is-prepended"));
    }
    transitionRunning.value = false;
  }, props.animationDuration);

  scheduleAutoRun();
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (transitionRunning.value || isLoading.value) return;

  if (event.key === "ArrowLeft") {
    doPrevious();
  } else if (event.key === "ArrowRight") {
    doNext();
  }
};

watch(isLoading, (loading) => {
  if (!loading && shouldAutoRun()) scheduleAutoRun();
});

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

onBeforeUnmount(() => {
  showGallery.value = false;
  clearTimeout(runTimeOut);
  if (runNextAuto) clearTimeout(runNextAuto);
  sliderGalleryWrapper.value?.removeEventListener("keydown", handleKeyDown);
});
</script>

<style lang="css">
@layer components {
  .slider-gallery {
    --_animation-duration: v-bind(animationDuration + "ms");
    --_accent: var(--slider-gallery-accent, #f1683a);
    --_thumbnail-width: var(--slider-gallery-thumbnail-width, 100px);
    --_thumbnail-height: var(--slider-gallery-thumbnail-height, 165px);

    height: var(--slider-gallery-height, 100svh);
    width: 100vw;
    overflow: hidden;
    position: absolute;
    inset: 0;
    z-index: var(--slider-gallery-z-index, 9999);
    container-type: inline-size;

    .slider-gallery-loading {
      position: absolute;
      inset: 0;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      background-color: var(--slider-gallery-loading-background, var(--page-bg));
      align-items: center;
      justify-content: center;
      color: var(--slider-gallery-loading-colour, var(--colour-text-default));
      opacity: 1;
      transition:
        display 0.5s,
        opacity 0.5s;
      transition-behavior: allow-discrete;

      &.is-loaded {
        display: none;
        opacity: 0;
      }

      .slider-gallery-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: var(--_accent);
        animation: slider-gallery-spinner 1s ease-in-out infinite;
        margin-bottom: 20px;
      }

      p {
        font-size: 1.2em;
        font-weight: 500;
      }
    }

    .slider-gallery-content {
      width: 100%;
      height: 100%;
      position: relative;

      @container (width >= 1024px) {
        --_thumbnail-width: var(--slider-gallery-thumbnail-width-wide, 150px);
        --_thumbnail-height: var(--slider-gallery-thumbnail-height-wide, 220px);
      }
    }

    .slider-gallery-item-content {
      &.light {
        color: var(--slider-gallery-text-light, #fff);
      }

      &.dark {
        color: var(--slider-gallery-text-dark, #000);
      }
    }

    .slider-gallery-list {
      .slider-gallery-item {
        isolation: isolate;
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;

        &:nth-child(1) {
          z-index: 1;

          .slider-gallery-item-content {
            .slider-gallery-author,
            .slider-gallery-title,
            .slider-gallery-topic,
            .slider-gallery-description,
            .slider-gallery-actions {
              transform: translateY(50px);
              filter: blur(20px);
              opacity: 0;
              animation: slider-gallery-show-content 0.5s 1s linear 1 forwards;
            }

            .slider-gallery-title {
              animation-delay: 1.2s;
            }

            .slider-gallery-topic {
              animation-delay: 1.4s;
            }

            .slider-gallery-description {
              animation-delay: 1.6s;
            }

            .slider-gallery-actions {
              animation-delay: 1.8s;
            }
          }
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          background: var(
            --slider-gallery-text-light-scrim,
            linear-gradient(to right, rgb(0 0 0 / 0.6), transparent 70%)
          );
        }

        &[data-text-brightness="dark"]::before {
          background: var(
            --slider-gallery-text-dark-scrim,
            linear-gradient(to right, rgb(255 255 255 / 0.6), transparent 70%)
          );
        }

        .slider-gallery-item-content {
          position: absolute;
          z-index: 2;
          top: 20%;
          width: 1140px;
          max-width: 80%;
          left: 50%;
          transform: translateX(-50%);
          padding-right: 30%;
          box-sizing: border-box;
          text-shadow: 0 5px 10px #0004;

          @container (width < 678px) {
            padding-right: 0;
          }

          .slider-gallery-author {
            font-weight: bold;
            letter-spacing: 10px;
          }

          .slider-gallery-title,
          .slider-gallery-topic {
            font-size: var(--slider-gallery-title-font-size, 5em);
            font-weight: bold;
            line-height: 1.3em;
          }

          .slider-gallery-title {
            @container (width < 678px) {
              font-size: var(--slider-gallery-title-font-size-narrow, 30px);
            }
          }

          .slider-gallery-actions {
            margin-top: 20px;

            .slider-gallery-cta {
              display: inline-grid;
              place-items: center;
              min-width: 130px;
              min-height: 40px;
              padding-inline: 1.2rem;
              background-color: var(--slider-gallery-cta-background, #99999975);
              border: 1px solid var(--slider-gallery-cta-border-colour, #fff);
              color: var(--slider-gallery-cta-colour, #fff);
              letter-spacing: 3px;
              font-weight: 500;
              text-decoration: none;

              &:focus-visible {
                outline: 2px solid var(--theme-ring, currentColor);
                outline-offset: 2px;
              }
            }
          }
        }
      }
    }

    .slider-gallery-thumbnails {
      position: absolute;
      bottom: 50px;
      left: 50%;
      width: max-content;
      z-index: 100;
      display: flex;
      gap: var(--slider-gallery-thumbnail-gap, 20px);

      .slider-gallery-item {
        width: var(--_thumbnail-width);
        height: var(--_thumbnail-height);
        flex-shrink: 0;
        position: relative;
        border: var(--slider-gallery-thumbnail-border, 1px solid transparent);
        outline: var(--slider-gallery-thumbnail-outline, 1px solid transparent);
        outline-offset: var(--slider-gallery-thumbnail-outline-offset, 0rem);
        border-radius: var(--slider-gallery-thumbnail-border-radius, 20px);
        overflow: hidden;

        &:hover {
          border: var(--slider-gallery-thumbnail-border-hover, var(--slider-gallery-thumbnail-border, 1px solid transparent));
          outline: var(--slider-gallery-thumbnail-outline-hover, var(--slider-gallery-thumbnail-outline, 1px solid transparent));
          outline-offset: var(--slider-gallery-thumbnail-outline-offset-hover, var(--slider-gallery-thumbnail-outline-offset, 0rem));
        }

        .slider-gallery-thumbnail-overlay {
          position: absolute;
          inset: 0;
          background-color: var(--slider-gallery-thumbnail-overlay, #0004);
          z-index: 2;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slider-gallery-item-content {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;

          .slider-gallery-title {
            font-weight: 500;
          }

          .slider-gallery-description {
            font-weight: 300;
          }
        }
      }
    }

    .slider-gallery-arrows {
      --_arrows-top: var(--slider-gallery-arrows-top, 80%);
      --_arrows-right: var(--slider-gallery-arrows-right, 52%);
      --_arrows-width: var(--slider-gallery-arrows-width, 300px);
      --_arrows-max-width: var(--slider-gallery-arrows-max-width, 30%);

      position: absolute;
      top: var(--_arrows-top);
      right: var(--_arrows-right);
      z-index: 100;
      width: var(--_arrows-width);
      max-width: var(--_arrows-max-width);
      display: flex;
      gap: var(--slider-gallery-arrow-gap, 20px);
      align-items: center;

      @container (width >= 768px) {
        --_arrows-top: var(--slider-gallery-arrows-top-tablet, var(--slider-gallery-arrows-top, 80%));
        --_arrows-right: var(--slider-gallery-arrows-right-tablet, var(--slider-gallery-arrows-right, 52%));
        --_arrows-width: var(--slider-gallery-arrows-width-tablet, var(--slider-gallery-arrows-width, 300px));
        --_arrows-max-width: var(--slider-gallery-arrows-max-width-tablet, var(--slider-gallery-arrows-max-width, 30%));
      }

      @container (width >= 1024px) {
        --_arrows-top: var(
          --slider-gallery-arrows-top-desktop,
          var(--slider-gallery-arrows-top-tablet, var(--slider-gallery-arrows-top, 80%))
        );
        --_arrows-right: var(
          --slider-gallery-arrows-right-desktop,
          var(--slider-gallery-arrows-right-tablet, var(--slider-gallery-arrows-right, 52%))
        );
        --_arrows-width: var(
          --slider-gallery-arrows-width-desktop,
          var(--slider-gallery-arrows-width-tablet, var(--slider-gallery-arrows-width, 300px))
        );
        --_arrows-max-width: var(
          --slider-gallery-arrows-max-width-desktop,
          var(--slider-gallery-arrows-max-width-tablet, var(--slider-gallery-arrows-max-width, 30%))
        );
      }

      button {
        --_arrow-border-width: var(--slider-gallery-arrow-border-width, 0.2rem);
        --_arrow-border-colour: var(--slider-gallery-arrow-border-colour, white);
        --_arrow-outline-width: var(--slider-gallery-arrow-outline-width, 0.1rem);
        --_arrow-outline-colour: var(--slider-gallery-arrow-outline-colour, transparent);

        display: grid;
        place-items: center;
        width: var(--slider-gallery-arrow-size, 40px);
        height: var(--slider-gallery-arrow-size, 40px);
        border-radius: var(--slider-gallery-arrow-border-radius, 50%);
        background-color: var(--slider-gallery-arrow-background, #eee4);
        color: var(--slider-gallery-arrow-colour, #fff);
        border: var(--_arrow-border-width) solid var(--_arrow-border-colour);
        outline: var(--_arrow-outline-width) solid var(--_arrow-outline-colour);
        transition: var(--slider-gallery-arrow-transition-duration, 0.5s);

        &:hover {
          cursor: pointer;
          background-color: var(--slider-gallery-arrow-background-hover, #fff);
          color: var(--slider-gallery-arrow-colour-hover, #000);
          border-width: var(--slider-gallery-arrow-border-width-hover, var(--_arrow-border-width));
          border-color: var(--slider-gallery-arrow-border-colour-hover, var(--_arrow-border-colour));
          outline-width: var(--slider-gallery-arrow-outline-width-hover, var(--_arrow-outline-width));
          outline-color: var(--slider-gallery-arrow-outline-colour-hover, var(--_arrow-outline-colour));
        }

        &:focus-visible {
          outline: var(--slider-gallery-arrow-outline-width-focus, 2px) solid
            var(--slider-gallery-arrow-outline-colour-focus, var(--theme-ring, currentColor));
          outline-offset: var(--slider-gallery-arrow-outline-offset-focus, 2px);
        }

        .slider-gallery-arrow-icon {
          width: var(--slider-gallery-arrow-icon-size, 24px);
          height: var(--slider-gallery-arrow-icon-size, 24px);
        }
      }
    }

    .slider-gallery-progress {
      position: absolute;
      z-index: 1000;
      width: 0%;
      height: 3px;
      background-color: var(--_accent);
      left: 0;
      top: 0;
    }

    &.has-text-scrim .slider-gallery-list .slider-gallery-item[data-has-text]:nth-child(1)::before {
      animation: slider-gallery-scrim-in 0.5s 0.5s linear forwards;
    }

    &.is-next {
      .slider-gallery-list .slider-gallery-item:nth-child(1) img {
        width: var(--_thumbnail-width);
        height: var(--_thumbnail-height);
        position: absolute;
        bottom: 50px;
        left: 50%;
        border-radius: 30px;
        animation: slider-gallery-show-image 0.5s linear 1 forwards;
      }

      .slider-gallery-arrows button {
        pointer-events: none;
      }

      .slider-gallery-thumbnails {
        animation: slider-gallery-effect-next 0.5s linear 1 forwards;

        .slider-gallery-item:nth-last-child(1) {
          overflow: hidden;
          animation: slider-gallery-show-thumbnail 0.5s linear 1 forwards;
        }
      }

      .slider-gallery-progress {
        animation: slider-gallery-running-time var(--_animation-duration) linear 1 forwards;
      }
    }

    &.is-prev {
      .slider-gallery-list {
        .slider-gallery-item {
          &:nth-child(2) {
            z-index: 2;

            img {
              animation: slider-gallery-out-frame 0.5s linear 1 forwards;
              position: absolute;
              bottom: 0;
              left: 0;
            }

            .slider-gallery-item-content {
              .slider-gallery-author,
              .slider-gallery-title,
              .slider-gallery-topic,
              .slider-gallery-description,
              .slider-gallery-actions {
                animation: slider-gallery-content-out 1.5s linear 1 forwards;
              }
            }
          }

          img {
            z-index: 100;
          }
        }

        .slider-gallery-item.is-prepended {
          z-index: 1;
        }
      }

      .slider-gallery-arrows button {
        pointer-events: none;
      }

      .slider-gallery-thumbnails {
        animation: slider-gallery-effect-prev 0.5s linear 1 forwards;

        .slider-gallery-item:nth-child(1) {
          overflow: hidden;
          animation: slider-gallery-show-thumbnail-prev 0.5s linear 1 forwards;
        }

        .slider-gallery-item.is-prepended {
          opacity: 0;
          transform: translateX(-20px);
        }
      }

      .slider-gallery-progress {
        animation: slider-gallery-running-time var(--_animation-duration) linear 1 forwards;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 1ms !important;
        animation-delay: 0s !important;
        transition-duration: 1ms !important;
      }
    }
  }

  @keyframes slider-gallery-show-content {
    to {
      transform: translateY(0px);
      filter: blur(0px);
      opacity: 1;
    }
  }

  @keyframes slider-gallery-show-image {
    to {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }

  @keyframes slider-gallery-show-thumbnail {
    from {
      width: 0;
      opacity: 0;
    }
  }

  @keyframes slider-gallery-effect-next {
    from {
      transform: translateX(calc(1 * var(--_thumbnail-width)));
    }
  }

  @keyframes slider-gallery-running-time {
    from {
      width: 100%;
    }
    to {
      width: 0;
    }
  }

  @keyframes slider-gallery-out-frame {
    to {
      width: var(--_thumbnail-width);
      height: var(--_thumbnail-height);
      bottom: 50px;
      left: 50%;
      border-radius: 20px;
    }
  }

  @keyframes slider-gallery-content-out {
    to {
      transform: translateY(calc(-1 * var(--_thumbnail-width)));
      filter: blur(20px);
      opacity: 0;
    }
  }

  @keyframes slider-gallery-effect-prev {
    from {
      transform: translateX(calc(-1 * var(--_thumbnail-width)));
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slider-gallery-show-thumbnail-prev {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slider-gallery-scrim-in {
    to {
      opacity: 1;
    }
  }

  @keyframes slider-gallery-spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
