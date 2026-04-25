<template>
  <component :is="tag" ref="containerRef" class="scroll-parallax-section" :class="[elementClasses]">
    <div ref="bgRef" class="scroll-parallax-section__bg"></div>
    <div class="scroll-parallax-section__content">
      <slot></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "aside";
  backgroundImage: string;
  parallaxStrength?: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  parallaxStrength: 1,
  styleClassPassthrough: () => [],
});

const containerRef = useTemplateRef<HTMLElement>("containerRef");
const bgRef = useTemplateRef<HTMLElement>("bgRef");

const bgImage = computed(() => `url("${props.backgroundImage}")`);
const bgInset = computed(() => `-${Math.ceil(props.parallaxStrength * 100)}% 0`);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

let rafId: number | null = null;
let isVisible = false;
let observer: IntersectionObserver | null = null;

function updateParallax() {
  if (!bgRef.value || !containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const viewportCenter = window.innerHeight / 2;
  const elementCenter = rect.top + rect.height / 2;
  const offset = (viewportCenter - elementCenter) * props.parallaxStrength;
  bgRef.value.style.transform = `translate3d(0, ${offset}px, 0)`;
}

function onScroll() {
  if (!isVisible || rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    updateParallax();
    rafId = null;
  });
}

onMounted(() => {
  updateParallax();

  observer = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0]!.isIntersecting;
      if (isVisible) updateParallax();
    },
    { rootMargin: "50px" }
  );

  if (containerRef.value) observer.observe(containerRef.value);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (rafId !== null) cancelAnimationFrame(rafId);
  observer?.disconnect();
});
</script>

<style lang="css">
@layer components {
  .scroll-parallax-section {
    --scroll-parallax-section-height: 25svh;
    height: var(--scroll-parallax-section-height);
    position: relative;
    overflow: hidden;
    width: 100%;

    .scroll-parallax-section__bg {
      position: absolute;
      inset: v-bind(bgInset);
      background-image: v-bind(bgImage);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      will-change: transform;
    }

    .scroll-parallax-section__content {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
