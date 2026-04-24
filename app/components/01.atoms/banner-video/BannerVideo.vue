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
      :poster="poster"
      :style="{ objectFit: props.objectFit }"
      @loadeddata="handleLoadedData"
      @canplay="handleCanPlay"
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
      decoding="async"
      :style="{ objectFit: props.objectFit, objectPosition: imgObjectPosition }"
    />
  </component>
</template>

<script setup lang="ts">
interface Props {
  /** HTML element to render as the root. Defaults to `section` for landmark semantics. */
  tag?: "section" | "div" | "header" | "main" | "article";
  /** Path to the video source file (mp4). */
  src: string;
  /** Path to the fallback/poster image. Used as video poster and as the visible fallback
   *  when the video cannot play or when the user prefers reduced motion. */
  poster: string;
  alt?: string;
  /** Intrinsic width of the poster image — required for NuxtImg optimisation. */
  imgWidth?: number;
  /** Intrinsic height of the poster image — required for NuxtImg optimisation. */
  imgHeight?: number;
  /**
   * Depth tier controlling the responsive max-height via a `clamp()` scale.
   * Each tier maps to a `--theme-banner-video-max-height-{depth}` CSS token that
   * consuming pages can override. Defaults to `"md"`.
   */
  depth?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * CSS aspect-ratio of the banner container (e.g. `"16/9"`, `"21/9"`, `"4/3"`).
   * Provides the intrinsic height that `max-height` caps at larger viewport widths.
   */
  aspectRatio?: string;
  /** How the video and fallback image fill the banner frame. Defaults to `"cover"`. */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Vertical crop position within the banner. Maps to `align-self` on the video and `object-position` on the fallback image. Defaults to `"center"`. */
  verticalPosition?: "start" | "center" | "end";
  /** Horizontal crop position within the banner. Maps to `object-position` on the fallback image. Defaults to `"center"`. */
  horizontalPosition?: "start" | "center" | "end";
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

const tryPlay = async () => {
  const v = videoEl.value;
  if (!v) return;
  try {
    // Ensure muted stays true — required for programmatic autoplay in all browsers
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
  // Force the media element to (re)read its source child and begin fetching
  v.load();
  // Attempt immediate play; loadeddata/canplay handlers will retry once data arrives
  void tryPlay();
};

const handleLoadedData = () => {
  void tryPlay();
};
const handleCanPlay = () => {
  void tryPlay();
};

// Runs on mount AND whenever src changes (covers route-change re-use edge cases)
watch(
  () => props.src,
  () => {
    void kickOffLoad();
  },
  { immediate: true, flush: "post" }
);

// Extra safety: when the component becomes active again (e.g. returning via keep-alive)
onActivated(() => {
  void kickOffLoad();
});
</script>

<style lang="css">
@layer components {
  .banner-video {
    --_max-height: var(--theme-banner-video-max-height, clamp(28rem, 38vw, 56rem));

    display: grid;
    grid-template-areas: "media";
    aspect-ratio: var(--_aspect-ratio, 16/9);
    max-height: var(--_max-height);
    width: 100%;
    overflow: hidden;

    &[data-depth="xs"] {
      --_max-height: var(--theme-banner-video-max-height-xs, clamp(12rem, 15vw, 24rem));
    }
    &[data-depth="sm"] {
      --_max-height: var(--theme-banner-video-max-height-sm, clamp(18rem, 22vw, 36rem));
    }
    &[data-depth="md"] {
      --_max-height: var(--theme-banner-video-max-height-md, clamp(28rem, 38vw, 56rem));
    }
    &[data-depth="lg"] {
      --_max-height: var(--theme-banner-video-max-height-lg, clamp(40rem, 52vw, 72rem));
    }
    &[data-depth="xl"] {
      --_max-height: var(--theme-banner-video-max-height-xl, clamp(52rem, 65vw, 90rem));
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

    @media (prefers-reduced-motion: reduce) {
      .video {
        display: none;
      }
      .fallback {
        display: block;
      }
    }
  }
}
</style>
