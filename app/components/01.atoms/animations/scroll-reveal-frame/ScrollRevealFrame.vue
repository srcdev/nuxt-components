<template>
  <figure
    class="scroll-reveal-frame"
    :class="[elementClasses]"
    :style="{
      '--scroll-reveal-frame-height': frameHeight,
      '--scroll-reveal-frame-parallax-offset': parallaxOffset,
      '--scroll-reveal-frame-radius': radius,
    }"
  >
    <div class="scroll-reveal-frame-content">
      <slot></slot>
    </div>
  </figure>
</template>

<script setup lang="ts">
interface Props {
  frameHeight?: string;
  parallaxOffset?: string;
  radius?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  frameHeight: undefined,
  parallaxOffset: undefined,
  radius: undefined,
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
  .scroll-reveal-frame {
    margin: 0;
    position: relative;
    height: var(--scroll-reveal-frame-height, 540px);
    width: 100%;
    overflow: hidden;
    border-radius: var(--scroll-reveal-frame-radius, 0px);

    /* Named so the taller child animates on this element's progress, not its own. */
    view-timeline: --scroll-reveal-frame-timeline block;

    .scroll-reveal-frame-content {
      --_parallax-offset: var(--scroll-reveal-frame-parallax-offset, 36rem);

      display: block;
      width: 100%;
      height: calc(100% + var(--_parallax-offset));

      animation: scroll-reveal-frame-pan linear both;
      animation-timeline: --scroll-reveal-frame-timeline;
      animation-range: entry 0% exit 100%;

      @supports not (animation-timeline: scroll()) {
        animation: none;
        height: 100%;
      }

      @media (prefers-reduced-motion: reduce) {
        animation: none;
        height: 100%;
      }
    }
  }

  @keyframes scroll-reveal-frame-pan {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-1 * var(--_parallax-offset)));
    }
  }
}
</style>
