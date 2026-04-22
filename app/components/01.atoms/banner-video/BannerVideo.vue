<template>
  <component
    :is="tag"
    class="banner-video"
    :class="[elementClasses, { 'video-failed': videoFailed }]"
    :style="{
      '--_max-height': maxHeight,
      '--_max-height-tablet': maxHeightTablet,
      '--_max-height-mobile': maxHeightMobile,
      '--_aspect-ratio': aspectRatio,
    }"
  >
    <video
      class="video"
      autoplay
      muted
      loop
      playsinline
      :poster="poster"
      :style="{ objectFit: props.objectFit, objectPosition: props.objectPosition }"
      @error="videoFailed = true"
    >
      <source :src="src" type="video/mp4" @error="videoFailed = true" />
    </video>
    <NuxtImg
      class="fallback"
      :src="poster"
      :alt="alt"
      :width="imgWidth"
      :height="imgHeight"
      loading="eager"
      decoding="async"
      :style="{ objectFit: props.objectFit, objectPosition: props.objectPosition }"
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
  /**
   * Focal point within the video and fallback image. Any valid CSS `object-position` value.
   * Examples: `"50% 50%"`, `"top"`, `"center bottom"`, `"25% 75%"`.
   */
  objectPosition?: string;
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
  objectPosition: "50% 50%",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const videoFailed = ref(false);
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

    .video,
    .fallback {
      grid-area: media;
      display: block;
      width: 100%;
      height: 100%;
    }

    .fallback {
      display: none;
    }

    &.video-failed {
      .video {
        display: none;
      }
      .fallback {
        display: block;
      }
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
