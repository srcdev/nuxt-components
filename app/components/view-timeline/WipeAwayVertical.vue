<template>
  <component
    :is="tag"
    class="wipe-away-vertical"
    :class="[elementClasses]"
    :style="{ 'timeline-scope': timelineScope }"
    ref="scrollContainerRef"
  >
    <div ref="stickyItemsContainerRef" class="sticky-items-container">
      <div
        class="sticky-item"
        v-for="(item, key) in itemCount"
        :key="key"
        :style="{
          'animation-timeline': key === itemCount - 1 ? 'none' : `--section-${timelineId}-${key}`,
          'z-index': itemCount - key,
        }"
        ref="stickyItemsRef"
      >
        <slot :name="`stickyItem-${key}`"></slot>
      </div>
    </div>

    <section
      v-for="(item, key) in itemCount"
      :key="key"
      class="scrolling-section"
      :style="{
        'view-timeline-name': `--section-${timelineId}-${key}`,
      }"
      ref="scrollingItemsRef"
    >
      <slot :name="`scrollingItem-${key}`"></slot>
    </section>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String as PropType<"div" | "section" | "main" | "article" | "aside">,
    default: "div",
    validator: (val: string) => ["div", "section", "main", "article", "aside"].includes(val),
  },
  itemCount: {
    type: Number as PropType<number>,
    default: 0,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const timelineId = useId()
const stickyItemsContainerRef = useTemplateRef<HTMLElement | null>("stickyItemsContainerRef")
const stickyItemsRef = useTemplateRef<HTMLElement[] | null>("stickyItemsRef")
const scrollContainerRef = useTemplateRef<HTMLElement | null>("scrollContainerRef")
const scrollingItemsRef = useTemplateRef<HTMLElement[] | null>("scrollingItemsRef")
const timelineInset = ref("35% 35%")
const topPercent = ref("0")
const bottomPercent = ref("0")

const timelineScope = computed(() =>
  Array.from({ length: props.itemCount }, (_, i) => `--section-${timelineId}-${i}`).join(", ")
)

const calculateInset = () => {
  if (!stickyItemsContainerRef.value) return

  const rect = stickyItemsContainerRef.value.getBoundingClientRect()
  const innerHeight = window.innerHeight

  topPercent.value = ((rect.top / innerHeight) * 100).toFixed(2)
  bottomPercent.value = (((innerHeight - rect.bottom) / innerHeight) * 100).toFixed(2)

  timelineInset.value = `${topPercent.value}% ${bottomPercent.value}%`

  if (!scrollContainerRef.value) return
  scrollContainerRef.value.style.setProperty("--calculated-inset", timelineInset.value)
}

let requestAnimationFrameId: number | null = null
const onScrollDebounce = () => {
  if (requestAnimationFrameId !== null) return
  requestAnimationFrameId = requestAnimationFrame(() => {
    calculateInset()
    requestAnimationFrameId = null
  })
}

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)

const fallbackScrollHandler = () => {
  const sections = scrollingItemsRef.value || []
  const layers = stickyItemsRef.value || []

  const mid = window.innerHeight / 2

  sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect()
    const active = rect.top <= mid && rect.bottom >= mid
    if (layers[i]) layers[i].style.opacity = active ? "1" : "0"
  })
}

const supportsScrollTimeline = import.meta.client ? CSS.supports("animation-timeline: view()") : false

onMounted(() => {
  calculateInset()
  if (supportsScrollTimeline) {
    window.addEventListener("scroll", onScrollDebounce)
  } else {
    window.addEventListener("scroll", fallbackScrollHandler)
  }
})

onUnmounted(() => {
  if (supportsScrollTimeline) {
    window.removeEventListener("scroll", onScrollDebounce)
  } else {
    window.removeEventListener("scroll", fallbackScrollHandler)
  }
})
</script>

<style lang="css">
.wipe-away-vertical {
  .sticky-items-container {
    position: sticky;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);

    .sticky-item {
      position: absolute;
      inset: 0;
      border-radius: 0.5rem;
      width: 100%;
    }
  }

  .scrolling-section {
    view-timeline-axis: block;
    view-timeline-inset: var(--calculated-inset);
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
    animation: wipe-out 1s linear both;
    animation-range: entry 0% entry 100%;
  }
}

@supports not (animation-timeline: view()) {
  .sticky-item {
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  }
}
</style>
