<template>
  <figure
    class="reveal-frame"
    :class="[elementClasses]"
    :style="{
      '--_frame-height': frameHeight,
      '--_parallax-offset': parallaxOffset,
      '--_radius': radius,
    }"
  >
    <div class="reveal-content">
      <slot></slot>
    </div>
  </figure>
</template>

<script setup lang="ts">
/**
 * ScrollRevealFrame
 *
 * Generic clipping frame that pans its slot content vertically as it scrolls
 * through the viewport — driven entirely by CSS Scroll-driven Animations.
 * No scroll listeners, no JS animation.
 *
 * How it works:
 *   - The <figure> is a fixed-height clipping window (overflow: hidden).
 *   - It registers a named view-timeline scoped to itself.
 *   - The inner .reveal-content wrapper is taller than the frame by
 *     `parallaxOffset`, and animates translateY as the frame scrolls.
 *   - Any slot content (single image, grid, video, etc.) fills that wrapper.
 *
 * Browser support (as of 2026):
 *   Chrome 115+, Edge 115+, Firefox 114+, Safari 17.2+
 *   Falls back gracefully to a static cropped view in older browsers.
 *
 * For single-image use with NuxtImg optimisation and focal-point control,
 * use ScrollRevealImage instead — it wraps this component.
 */

interface Props {
  /** Height of the visible clipping frame. */
  frameHeight?: string;
  /**
   * How far the content travels vertically as the frame scrolls through the
   * viewport. Larger = more content revealed = stronger parallax feel.
   */
  parallaxOffset?: string;
  /** Optional rounded corners on the frame. */
  radius?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  frameHeight: "540px",
  parallaxOffset: "36rem",
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

    position: relative;
    height: var(--_frame-height);
    width: 100%;
    overflow: hidden;
    border-radius: var(--_radius);

    /*
     * Named view-timeline lets the child content reference this element's
     * scroll progress rather than its own (which would be distorted by the
     * artificially inflated height).
     */
    view-timeline: --reveal-frame-timeline block;
  }

  .reveal-content {
    display: block;
    width: 100%;
    /*
     * Content is taller than the frame by parallaxOffset so there is always
     * content to travel into as the animation progresses.
     */
    height: calc(100% + var(--_parallax-offset));

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
    .reveal-content {
      animation: none;
      height: 100%;
    }
  }

  /* ── Reduced-motion: static view, no travel ── */
  @media (prefers-reduced-motion: reduce) {
    .reveal-content {
      animation: none;
      height: 100%;
    }
  }
}
</style>
