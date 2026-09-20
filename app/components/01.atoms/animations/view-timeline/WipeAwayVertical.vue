<template>
  <component
    :is="tag"
    ref="scrollContainerRef"
    class="wipe-away-vertical"
    :class="[elementClasses]"
    :style="{ 'timeline-scope': timelineScope }"
  >
    <div ref="stickyItemsContainerRef" class="sticky-items-container">
      <div
        v-for="(item, key) in itemCount"
        :key="key"
        ref="stickyItemsRef"
        class="sticky-item"
        :style="{
          'animation-timeline': key === itemCount - 1 ? 'none' : `--section-${timelineId}-${key}`,
          'z-index': itemCount - key,
        }"
      >
        <slot :name="`stickyItem-${key}`"></slot>
      </div>
    </div>

    <section
      v-for="(item, key) in itemCount"
      :key="key"
      ref="scrollingItemsRef"
      class="scrolling-section"
      :style="{
        'view-timeline-name': `--section-${timelineId}-${key}`,
      }"
    >
      <slot :name="`scrollingItem-${key}`"></slot>
    </section>

    <div class="trailing-buffer" aria-hidden="true"></div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "main" | "article" | "aside";
  itemCount: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const timelineId = useId();
const stickyItemsContainerRef = useTemplateRef<HTMLElement | null>("stickyItemsContainerRef");
const stickyItemsRef = useTemplateRef<HTMLElement[] | null>("stickyItemsRef");
const scrollContainerRef = useTemplateRef<HTMLElement | null>("scrollContainerRef");
const scrollingItemsRef = useTemplateRef<HTMLElement[] | null>("scrollingItemsRef");
const timelineInset = ref("35% 35%");
const topPercent = ref("0");
const bottomPercent = ref("0");

const timelineScope = computed(() =>
  Array.from({ length: props.itemCount }, (_, i) => `--section-${timelineId}-${i}`).join(", ")
);

const calculateInset = () => {
  if (!stickyItemsContainerRef.value) return;

  const rect = stickyItemsContainerRef.value.getBoundingClientRect();
  const innerHeight = window.innerHeight;

  topPercent.value = ((rect.top / innerHeight) * 100).toFixed(2);
  bottomPercent.value = (((innerHeight - rect.bottom) / innerHeight) * 100).toFixed(2);

  timelineInset.value = `${topPercent.value}% ${bottomPercent.value}%`;

  if (!scrollContainerRef.value) return;
  scrollContainerRef.value.style.setProperty("--_wipe-away-vertical-calculated-inset", timelineInset.value);
};

let requestAnimationFrameId: number | null = null;
const onScrollDebounce = () => {
  if (requestAnimationFrameId !== null) return;
  requestAnimationFrameId = requestAnimationFrame(() => {
    calculateInset();
    requestAnimationFrameId = null;
  });
};

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const fallbackScrollHandler = () => {
  const sections = scrollingItemsRef.value || [];
  const layers = stickyItemsRef.value || [];

  const mid = window.innerHeight / 2;

  sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();
    const active = rect.top <= mid && rect.bottom >= mid;
    if (layers[i]) layers[i].style.opacity = active ? "1" : "0";
  });
};

const supportsScrollTimeline = import.meta.client ? CSS.supports("animation-timeline: view()") : false;

onMounted(() => {
  calculateInset();
  if (supportsScrollTimeline) {
    window.addEventListener("scroll", onScrollDebounce);
  } else {
    window.addEventListener("scroll", fallbackScrollHandler);
  }
});

onUnmounted(() => {
  if (supportsScrollTimeline) {
    window.removeEventListener("scroll", onScrollDebounce);
  } else {
    window.removeEventListener("scroll", fallbackScrollHandler);
  }
});
</script>

<style lang="css">
@layer components {
  .wipe-away-vertical {
    .sticky-items-container {
      position: sticky;
      top: 50vh;
      height: var(--wipe-away-vertical-height, 100vh);
      transform: translateY(-50%);

      .sticky-item {
        position: absolute;
        inset: 0;
        border-radius: var(--wipe-away-vertical-border-radius, 0.5rem);
        width: 100%;
      }
    }

    .scrolling-section {
      view-timeline-axis: block;
      view-timeline-inset: var(--_wipe-away-vertical-calculated-inset);
    }

    .trailing-buffer {
      height: var(--wipe-away-vertical-trailing-buffer, 50vh);
    }
  }

  @supports (animation-timeline: view()) {
    @keyframes wipe-out {
      0% {
        clip-path: inset(0 0 0% 0);
      }
      100% {
        clip-path: inset(0 0 100% 0);
      }
    }

    .sticky-item {
      animation: wipe-out var(--wipe-away-vertical-animation-duration, 1s) linear both;
      animation-range: entry 0% entry 100%;
    }
  }

  @supports not (animation-timeline: view()) {
    .sticky-item {
      opacity: 0;
      transition: opacity var(--wipe-away-vertical-fallback-transition-duration, 0.4s) ease-in-out;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sticky-item {
      animation: none !important;
      transition: none !important;
      opacity: 1 !important;
    }
  }
}
</style>
