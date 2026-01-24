<template>
  <div
    v-if="displayComponent"
    class="marquee-scroller"
    :class="{ reverse: reverse, paused: isPaused, 'reduced-motion': prefersReducedMotion }"
    role="region"
    :aria-label="ariaLabel || 'Scrolling content'"
    :aria-live="isPaused ? 'polite' : 'off'"
    tabindex="0"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Screen reader instructions -->
    <div class="sr-only">
      {{ ariaDescription || "Use spacebar to pause/play animation, arrow keys when focused for manual control" }}
    </div>

    <!-- Pause/Play button -->
    <button
      v-if="showControls"
      class="control-btn"
      @click="togglePause"
      :aria-label="isPaused ? 'Play animation' : 'Pause animation'"
      type="button"
    >
      <span aria-hidden="true">{{ isPaused ? "▶" : "⏸" }}</span>
    </button>

    <div class="marquee-track" :aria-hidden="!isPaused">
      <div class="marquee-group">
        <div v-for="item in marqueeData" :key="item.id" class="item">
          <slot :name="item.id"></slot>
        </div>
      </div>
      <div class="marquee-group" aria-hidden="true">
        <div v-for="item in marqueeData" :key="`duplicate-${item.id}`" class="item">
          <slot :name="item.id"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  animationRuntime: {
    type: String,
    default: "40s",
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  marqueeData: {
    type: Array as PropType<Array<{ id: number; content: string }>>,
    default: () => [],
  },
  itemConfig: {
    type: Object,
    default: () => ({
      width: "50px",
      height: "50px",
      gap: "16px",
    }),
    required: true,
  },
  // Accessibility props
  ariaLabel: {
    type: String,
    default: null,
  },
  ariaDescription: {
    type: String,
    default: null,
  },
  showControls: {
    type: Boolean,
    default: false,
  },
  respectReducedMotion: {
    type: Boolean,
    default: true,
  },
})

const displayComponent = ref(false)
const isPaused = ref(false)
const isFocused = ref(false)
const prefersReducedMotion = ref(false)

const height = computed(() => props.itemConfig.height)
const width = computed(() => props.itemConfig.width)
const gap = computed(() => props.itemConfig.gap || "16px")

// Check for reduced motion preference
const checkReducedMotion = () => {
  if (typeof window !== "undefined" && props.respectReducedMotion) {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    prefersReducedMotion.value = mediaQuery.matches

    // Listen for changes
    mediaQuery.addEventListener("change", (e) => {
      prefersReducedMotion.value = e.matches
      if (e.matches) {
        isPaused.value = true
      }
    })
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case " ":
    case "Spacebar":
      event.preventDefault()
      togglePause()
      break
    case "ArrowLeft":
    case "ArrowRight":
      // Could add manual stepping functionality here
      event.preventDefault()
      break
  }
}

const handleFocus = () => {
  isFocused.value = true
  if (props.respectReducedMotion) {
    isPaused.value = true
  }
}

const handleBlur = () => {
  isFocused.value = false
  if (!prefersReducedMotion.value) {
    isPaused.value = false
  }
}

onMounted(() => {
  displayComponent.value = true
  checkReducedMotion()

  // Auto-pause if user prefers reduced motion
  if (prefersReducedMotion.value) {
    isPaused.value = true
  }
})
</script>

<style lang="css">
.marquee-scroller {
  width: 100%;
  height: v-bind(height);
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, #000 10% 90%, transparent);
  position: relative;

  /* Focus styles */
  &:focus {
    outline: 2px solid var(--color-focus, #0066cc);
    outline-offset: 2px;
  }

  /* Paused state */
  &.paused .marquee-track {
    animation-play-state: paused;
  }

  /* Reduced motion - disable animation completely */
  &.reduced-motion .marquee-track {
    animation: none !important;
  }

  &:hover .marquee-track {
    animation-play-state: paused;
  }

  &:hover .item {
    filter: grayscale(1);
  }

  /* Screen reader only text */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Control button */
  .control-btn {
    position: absolute;
    inset-block-start: 8px;
    inset-inline-end: 8px;
    z-index: 10;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.9);
    }

    &:focus {
      outline: 2px solid var(--color-focus, #0066cc);
      outline-offset: 2px;
    }
  }

  .marquee-track {
    display: flex;
    width: fit-content;
    gap: v-bind(gap);
    animation: marqueeMove v-bind(animationRuntime) linear infinite;
  }

  &.reverse .marquee-track {
    animation-direction: reverse;
  }

  .marquee-group {
    display: flex;
    gap: v-bind(gap);
    flex-shrink: 0;
  }

  .item {
    width: v-bind(width);
    height: v-bind(height);
    display: grid;
    place-items: center;
    aspect-ratio: 1 / 1;
    transition: filter 0.5s;
    flex-shrink: 0;

    border: 1px solid light-dark(var(--gray-12), var(--gray-0));
    border-radius: 4px;

    &:hover {
      filter: grayscale(0);
    }
  }
}

@keyframes marqueeMove {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .marquee-scroller {
    .control-btn {
      background: ButtonFace;
      color: ButtonText;
      border: 1px solid ButtonText;
    }
  }
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .marquee-scroller .marquee-track {
    animation: none !important;
  }
}
</style>
