<template>
  <figure
    class="reveal-frame"
    :class="[elementClasses]"
    :style="{
      '--_frame-height': frameHeight,
      '--_parallax-offset': parallaxOffset,
      '--_radius': radius,
      '--_focal-x': focalX,
    }"
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
  </figure>
</template>

<script setup lang="ts">
/**
 * ScrollRevealImage
 *
 * A parallax-style scroll reveal effect using CSS Scroll-driven Animations.
 * No scroll listeners, no requestAnimationFrame, no IntersectionObserver.
 *
 * How it works:
 *   - The <figure> is a fixed-height clipping window (overflow: hidden).
 *   - It registers a named view-timeline scoped to itself.
 *   - The <img> inside is taller than the frame by `parallaxOffset`.
 *   - As the frame scrolls through the viewport, the img translates upward
 *     by `parallaxOffset`, revealing different vertical slices of the image.
 *   - The browser drives the animation entirely from its scroll position —
 *     no JS style recalculation on each frame.
 *
 * Browser support (as of 2026):
 *   Chrome 115+, Edge 115+, Firefox 114+, Safari 17.2+
 *   Falls back gracefully to a static cropped image in older browsers.
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
   * The image is made taller than the frame by this amount so there is
   * always content to reveal.
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

const props = withDefaults(defineProps<Props>(), {
  alt: "",
  imgWidth: 1920,
  imgHeight: 1080,
  frameHeight: "540px",
  parallaxOffset: "36rem",
  focalX: "50%",
  radius: "0px",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .reveal-frame {
    /* Public tokens (overridable by consumer) */
    --_frame-height: 540px;
    --_parallax-offset: 36rem;
    --_radius: 0px;
    --_focal-x: 50%;

    position: relative;
    height: var(--_frame-height);
    width: 100%;
    overflow: hidden;
    border-radius: var(--_radius);

    /*
     * Named view-timeline lets the child image reference this element's
     * scroll progress rather than its own (which would be distorted by the
     * artificially inflated height).
     */
    view-timeline: --reveal-frame-timeline block;
  }

  .reveal-image {
    display: block;
    width: 100%;
    /*
     * Image is taller than the frame by parallaxOffset so there is always
     * content to travel into as the animation progresses.
     */
    height: calc(100% + var(--_parallax-offset));
    object-fit: cover;
    /*
     * Y is always 0% — the animation handles vertical travel via translateY.
     * focalX lets the consumer pin the horizontal crop point.
     */
    object-position: var(--_focal-x) 0%;

    animation: reveal-pan linear both;
    animation-timeline: --reveal-frame-timeline;
    animation-range: entry 0% exit 100%;
  }

  @keyframes reveal-pan {
    from { transform: translateY(0); }
    to   { transform: translateY(calc(-1 * var(--_parallax-offset))); }
  }

  /* ── Fallback: browsers without Scroll-driven Animations ── */
  @supports not (animation-timeline: scroll()) {
    .reveal-image {
      animation: none;
      height: 100%;
      object-position: var(--_focal-x) 50%;
    }
  }

  /* ── Reduced-motion: static centered crop, no travel ── */
  @media (prefers-reduced-motion: reduce) {
    .reveal-image {
      animation: none;
      height: 100%;
      object-position: var(--_focal-x) 50%;
    }
  }
}
</style>
