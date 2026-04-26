<template>
  <ScrollRevealFrame
    :frame-height="frameHeight"
    :parallax-offset="parallaxOffset"
    :radius="radius"
    :style-class-passthrough="styleClassPassthrough"
    :style="{ '--_focal-x': focalX }"
  >
    <NuxtImg
      class="reveal-image"
      :src="src"
      :alt="alt"
      :width="imgWidth"
      :height="imgHeight"
      loading="lazy"
      decoding="async"
    />
  </ScrollRevealFrame>
</template>

<script setup lang="ts">
/**
 * ScrollRevealImage
 *
 * A single-image convenience wrapper around ScrollRevealFrame.
 * Adds NuxtImg optimisation (src, alt, intrinsic dimensions) and horizontal
 * focal-point control (focalX → CSS object-position x-axis).
 *
 * For a grid of images or arbitrary slot content use ScrollRevealFrame directly.
 */

interface Props {
  src: string;
  alt?: string;
  /** Intrinsic width of the source image — required for NuxtImg optimisation. */
  imgWidth?: number;
  /** Intrinsic height of the source image — required for NuxtImg optimisation. */
  imgHeight?: number;
  /** Height of the visible clipping frame. */
  frameHeight?: string;
  /**
   * How far the image travels vertically as the frame scrolls through the
   * viewport. Larger = more image revealed = stronger parallax feel.
   */
  parallaxOffset?: string;
  /**
   * Horizontal focal point — CSS `object-position` x-axis value.
   * Controls which horizontal slice of the image is kept in view.
   * Examples: "50%", "left", "30%".
   */
  focalX?: string;
  /** Optional rounded corners on the frame. */
  radius?: string;
  styleClassPassthrough?: string | string[];
}

withDefaults(defineProps<Props>(), {
  alt: "",
  imgWidth: 1920,
  imgHeight: 1080,
  frameHeight: "540px",
  parallaxOffset: "36rem",
  focalX: "50%",
  radius: "0px",
  styleClassPassthrough: () => [],
});
</script>

<style lang="css">
@layer components {
  .reveal-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /*
     * Y is always 0% — ScrollRevealFrame's translateY handles vertical travel.
     * focalX (--_focal-x) lets the consumer pin the horizontal crop point.
     */
    object-position: var(--_focal-x, 50%) 0%;
  }

  /* ── Fallback: centre the crop vertically when there is no animation ── */
  @supports not (animation-timeline: scroll()) {
    .reveal-image {
      object-position: var(--_focal-x, 50%) 50%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal-image {
      object-position: var(--_focal-x, 50%) 50%;
    }
  }
}
</style>
