<template>
  <ScrollRevealFrame
    :frame-height="frameHeight"
    :parallax-offset="parallaxOffset"
    :radius="radius"
    :style-class-passthrough="styleClassPassthrough"
    :style="{ '--scroll-reveal-image-focal-x': focalX }"
  >
    <NuxtImg
      class="scroll-reveal-image"
      :src="src"
      :alt="alt"
      :width="imgWidth"
      :height="imgHeight"
      :loading="loading"
      decoding="async"
    />
  </ScrollRevealFrame>
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt?: string;
  imgWidth?: number;
  imgHeight?: number;
  frameHeight?: string;
  parallaxOffset?: string;
  focalX?: string;
  radius?: string;
  loading?: "lazy" | "eager";
  styleClassPassthrough?: string | string[];
}

withDefaults(defineProps<Props>(), {
  alt: "",
  imgWidth: 1920,
  imgHeight: 1080,
  frameHeight: undefined,
  parallaxOffset: undefined,
  focalX: undefined,
  radius: undefined,
  loading: "lazy",
  styleClassPassthrough: () => [],
});
</script>

<style lang="css">
@layer components {
  .scroll-reveal-image {
    --_focal-x: var(--scroll-reveal-image-focal-x, 50%);

    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: var(--_focal-x) var(--scroll-reveal-image-focal-y, 0%);

    @supports not (animation-timeline: scroll()) {
      object-position: var(--_focal-x) var(--scroll-reveal-image-focal-y-static, 50%);
    }

    @media (prefers-reduced-motion: reduce) {
      object-position: var(--_focal-x) var(--scroll-reveal-image-focal-y-static, 50%);
    }
  }
}
</style>
