<template>
  <component
    :is="tag"
    class="banner-video"
    :class="elementClasses"
    :style="{
      '--_max-height': maxHeight,
      '--_max-height-tablet': maxHeightTablet,
      '--_max-height-mobile': maxHeightMobile,
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
  /** Maximum height at desktop (≥64em). Defaults to `"56rem"`. */
  maxHeight?: string;
  /** Maximum height at tablet (48em–64em). Falls back to `maxHeight` when unset. */
  maxHeightTablet?: string;
  /** Maximum height on mobile (<48em). Falls back to `maxHeightTablet` then `maxHeight` when unset. */
  maxHeightMobile?: string;
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
  tag: "section",
  alt: "",
  imgWidth: 1920,
  imgHeight: 1080,
  maxHeight: "56rem",
  maxHeightTablet: undefined,
  maxHeightMobile: undefined,
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
    display: grid;
    grid-template-areas: "media";
    aspect-ratio: var(--_aspect-ratio, 16/9);
    max-height: var(--_max-height-mobile, var(--_max-height, 56rem));
    width: 100%;
    overflow: hidden;

    @media (min-width: 48em) {
      max-height: var(--_max-height-tablet, var(--_max-height, 56rem));
    }

    @media (min-width: 64em) {
      max-height: var(--_max-height, 56rem);
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
