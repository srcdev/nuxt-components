<template>
  <component
    :is="tag"
    class="banner-video"
    :class="elementClasses"
    :data-depth="depth"
    :style="{
      '--_aspect-ratio': aspectRatio,
      '--_align-self': verticalPosition,
      '--_justify-self': horizontalPosition,
    }"
  >
    <video
      :key="src"
      ref="videoEl"
      class="video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      fetchpriority="high"
      :poster="poster"
      :style="{ objectFit: props.objectFit }"
      @loadeddata="handleLoadedData"
      @canplay="handleCanPlay"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    >
      <source :src="src" type="video/mp4" />
    </video>
    <NuxtImg
      class="fallback"
      :src="poster"
      :alt="alt"
      :width="imgWidth"
      :height="imgHeight"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      :style="{ objectFit: props.objectFit, objectPosition: imgObjectPosition }"
    />
    <button
      type="button"
      class="banner-video__toggle"
      :aria-label="isPlaying ? 'Pause background video' : 'Play background video'"
      @click="togglePlayback"
    >
      <slot name="toggle-icon" :is-playing="isPlaying">
        <Icon :name="isPlaying ? pauseIcon : playIcon" aria-hidden="true" />
      </slot>
    </button>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "section" | "div" | "header" | "main" | "article";
  src: string;
  poster: string;
  alt?: string;
  imgWidth?: number;
  imgHeight?: number;
  depth?: "xs" | "sm" | "md" | "lg" | "xl";
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  verticalPosition?: "start" | "center" | "end";
  horizontalPosition?: "start" | "center" | "end";
  playIcon?: string;
  pauseIcon?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  alt: "",
  imgWidth: 1920,
  imgHeight: 1080,
  depth: "md",
  aspectRatio: "21/9",
  objectFit: "cover",
  verticalPosition: "center",
  horizontalPosition: "center",
  playIcon: "mdi:play",
  pauseIcon: "mdi:pause",
  styleClassPassthrough: () => [],
});

const positionKeywordMap = {
  vertical: { start: "top", center: "center", end: "bottom" },
  horizontal: { start: "left", center: "center", end: "right" },
} as const;

const imgObjectPosition = computed(
  () =>
    `${positionKeywordMap.horizontal[props.horizontalPosition]} ${positionKeywordMap.vertical[props.verticalPosition]}`
);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const videoEl = shallowRef<HTMLVideoElement | null>(null);
const isPlaying = ref(false);

const togglePlayback = () => {
  const v = videoEl.value;
  if (!v) return;
  if (v.paused) {
    void v.play();
  } else {
    v.pause();
  }
};

const tryPlay = async () => {
  const v = videoEl.value;
  if (!v) return;
  try {
    v.muted = true;
    await v.play();
  } catch {
    // Autoplay blocked or interrupted — fallback image will remain visible
  }
};

const kickOffLoad = async () => {
  await nextTick();
  const v = videoEl.value;
  if (!v) return;
  v.load();
  void tryPlay();
};

const handleLoadedData = () => {
  void tryPlay();
};
const handleCanPlay = () => {
  void tryPlay();
};

watch(
  () => props.src,
  () => {
    void kickOffLoad();
  },
  { immediate: true, flush: "post" }
);

onActivated(() => {
  void kickOffLoad();
});
</script>

<style lang="css">
@layer components {
  .banner-video {
    --_max-height: var(--banner-video-max-height, clamp(28rem, 38vw, 56rem));

    display: grid;
    grid-template-areas: "media";
    aspect-ratio: var(--_aspect-ratio, 16/9);
    max-height: var(--_max-height);
    width: 100%;
    overflow: hidden;

    &[data-depth="xs"] {
      --_max-height: var(--banner-video-max-height-xs, clamp(12rem, 15vw, 24rem));
    }
    &[data-depth="sm"] {
      --_max-height: var(--banner-video-max-height-sm, clamp(18rem, 22vw, 36rem));
    }
    &[data-depth="md"] {
      --_max-height: var(--banner-video-max-height-md, clamp(28rem, 38vw, 56rem));
    }
    &[data-depth="lg"] {
      --_max-height: var(--banner-video-max-height-lg, clamp(40rem, 52vw, 72rem));
    }
    &[data-depth="xl"] {
      --_max-height: var(--banner-video-max-height-xl, clamp(52rem, 65vw, 90rem));
    }

    .video {
      grid-area: media;
      display: block;
      width: 100%;
      height: auto;
      min-height: 100%;
      align-self: var(--_align-self, center);
      justify-self: var(--_justify-self, center);
    }

    .fallback {
      grid-area: media;
      display: none;
      width: 100%;
      height: 100%;
    }

    .banner-video__toggle {
      grid-area: media;
      align-self: end;
      justify-self: end;
      margin: var(--banner-video-toggle-offset, 1.2rem);
      z-index: 1;

      display: grid;
      place-items: center;
      width: var(--banner-video-toggle-size, 3.2rem);
      height: var(--banner-video-toggle-size, 3.2rem);
      padding: 0;

      background-color: var(--banner-video-toggle-background, oklch(0% 0 0 / 0.4));
      color: var(--banner-video-toggle-icon-color, white);
      border: none;
      border-radius: 100vw;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover,
      &:focus-visible {
        background-color: var(--banner-video-toggle-background-hover, oklch(0% 0 0 / 0.6));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .video {
        display: none;
      }
      .fallback {
        display: block;
      }
      .banner-video__toggle {
        display: none;
      }
    }
  }
}
</style>
