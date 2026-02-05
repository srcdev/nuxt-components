<template>
  <div ref="containerGlowWrapper" class="container-glow-wrapper" :class="elementClasses">
    <component
      :is="tag"
      v-for="(item, key) in itemCount"
      :key="key"
      ref="containerGlowItem"
      class="container-glow-core"
    >
      <div class="glows"></div>
      <slot :name="`container-glow-${key}`"></slot>
    </component>
  </div>
</template>

<script setup lang="ts">
interface Config {
  proximity: number;
  spread: number;
  blur: number;
  gap: number;
  vertical: boolean;
  opacity: number;
}

const props = defineProps({
  itemCount: {
    type: Number,
    required: true,
  },
  tag: {
    type: String as PropType<string>,
    default: "div",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  config: {
    type: Object as PropType<Config>,
    default: () => ({
      proximity: 40,
      spread: 80,
      blur: 20,
      gap: 32,
      vertical: false,
      opacity: 0.15,
    }),
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const controller = new AbortController();

const containerGlowWrapper = ref<HTMLElement>();
const containerGlowItem = ref<HTMLElement[]>([]);

// Cache frequently used values to avoid repeated access
const configCache = computed(() => ({
  proximity: props.config.proximity,
  opacityStr: String(props.config.opacity),
  gapStr: String(props.config.gap),
  blurStr: String(props.config.blur),
  spreadStr: String(props.config.spread),
  direction: props.config.vertical ? "column" : "row",
}));

// Pre-calculate constants to avoid repeated calculations
const ANGLE_OFFSET = 90;
const FULL_CIRCLE = 360;
const RAD_TO_DEG = 180 / Math.PI;

// Throttle mechanism using RAF
let rafId: number | null = null;
let lastEventData: { x: number; y: number } | null = null;

const updateStyles = (event: PointerEvent) => {
  // Early return if event coordinates are not available
  if (typeof event.x !== "number" || typeof event.y !== "number") {
    return;
  }

  // Store event data and schedule update
  lastEventData = { x: event.x, y: event.y };

  if (rafId !== null) {
    return; // Already scheduled
  }

  rafId = requestAnimationFrame(() => {
    if (!lastEventData) {
      rafId = null;
      return;
    }

    const { x: eventX, y: eventY } = lastEventData;
    const { proximity, opacityStr } = configCache.value;

    // Process all elements
    for (const cardElem of containerGlowItem.value) {
      // Check the card against the proximity and then start updating
      const cardBounds = cardElem.getBoundingClientRect();

      // Pre-calculate bounds to avoid repeated operations
      const leftBound = cardBounds.left - proximity;
      const rightBound = cardBounds.left + cardBounds.width + proximity;
      const topBound = cardBounds.top - proximity;
      const bottomBound = cardBounds.top + cardBounds.height + proximity;

      // Check proximity with pre-calculated bounds
      const isInProximity = eventX > leftBound && eventX < rightBound && eventY > topBound && eventY < bottomBound;

      // Set opacity based on proximity
      cardElem.style.setProperty("--opacity-active", isInProximity ? "1" : opacityStr);

      if (isInProximity) {
        // Only calculate angle when in proximity
        const cardCentreX = cardBounds.left + cardBounds.width * 0.5;
        const cardCentreY = cardBounds.top + cardBounds.height * 0.5;

        let angle = Math.atan2(eventY - cardCentreY, eventX - cardCentreX) * RAD_TO_DEG;
        angle = angle < 0 ? angle + FULL_CIRCLE : angle;

        cardElem.style.setProperty("--start", String(angle + ANGLE_OFFSET));
      }
    }

    rafId = null;
  });
};

const applyStyles = () => {
  if (!containerGlowWrapper.value) return;

  const { gapStr, blurStr, spreadStr, direction } = configCache.value;
  const wrapper = containerGlowWrapper.value;

  // Batch DOM updates
  wrapper.style.setProperty("--gap", gapStr);
  wrapper.style.setProperty("--blur", blurStr);
  wrapper.style.setProperty("--spread", spreadStr);
  wrapper.style.setProperty("--direction", direction);
};

// Watch for config changes and reapply styles
watch(() => props.config, applyStyles, { deep: true });

onMounted(() => {
  applyStyles();
  if (containerGlowWrapper.value) {
    document.body.addEventListener("pointermove", updateStyles, {
      signal: controller.signal,
      passive: true, // Improve scroll performance
    });
  }
});

onBeforeUnmount(() => {
  // Clean up RAF if pending
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  lastEventData = null;
  controller.abort();
});
</script>

<style lang="css">
.container-glow-wrapper {
  @property --start {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }

  display: flex;
  gap: 3.2rem;

  .container-glow-core {
    & *,
    & *:after,
    & *:before {
      box-sizing: border-box;
    }

    --gradient: conic-gradient(
      from 180deg at 50% 70%,
      hsla(0, 0%, 98%, 1) 0deg,
      #eec32d 72.0000010728836deg,
      #ec4b4b 144.0000021457672deg,
      #709ab9 216.00000858306885deg,
      #4dffbf 288.0000042915344deg,
      hsla(0, 0%, 98%, 1) 1turn
    );
    --opacity-active: 0.15;
    --start: 0;

    position: relative;

    height: 100%;
    background: light-dark(white, hsl(246 44% 7%));
    padding: 2rem;
    aspect-ratio: 330 / 400;
    border-radius: 12px;
    min-width: 280px;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &:is(:hover, :focus-visible) {
      z-index: 2;
    }

    &::before,
    &::after {
      content: "";
      position: absolute;
      inset: 0;
    }

    &::before {
      pointer-events: none;

      border: 2px solid transparent;
      border-radius: 12px;
      background: hsl(280 10% 50% / 1);
      background-attachment: fixed;
      border-radius: 12px;
      mask:
        linear-gradient(#0000, #0000),
        conic-gradient(
          from calc(((var(--start) + (var(--spread) * 0.25)) - (var(--spread) * 1.5)) * 1deg),
          hsl(0 0% 100% / 0.15) 0deg,
          white,
          hsl(0 0% 100% / 0.15) calc(var(--spread) * 2.5deg)
        );
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
      opacity: var(--opacity-active);
      transition: opacity 1s;
    }

    &::after {
      pointer-events: none;

      background: var(--gradient);
      background-attachment: fixed;
      border-radius: 12px;
      opacity: var(--opacity-active, 0);
      transition: opacity 1s;
      --alpha: 0;
      border: 2px solid transparent;
      mask:
        linear-gradient(#0000, #0000),
        conic-gradient(
          from calc(((var(--start) + (var(--spread) * 0.25)) - (var(--spread) * 0.5)) * 1deg),
          #0000 0deg,
          #fff,
          #0000 calc(var(--spread) * 0.5deg)
        );
      filter: brightness(1.5);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }

    .glows {
      pointer-events: none;
      position: absolute;
      inset: 0;
      filter: blur(calc(var(--blur) * 1px));

      &::after,
      &::before {
        --alpha: 0;
        content: "";
        background: var(--gradient);
        background-attachment: fixed;
        position: absolute;
        inset: -5px;
        border: 10px solid transparent;
        border-radius: 12px;
        mask:
          linear-gradient(#0000, #0000),
          conic-gradient(
            from calc((var(--start) - (var(--spread) * 0.5)) * 1deg),
            #000 0deg,
            #fff,
            #0000 calc(var(--spread) * 1deg)
          );
        mask-composite: intersect;
        mask-clip: padding-box, border-box;
        opacity: var(--opacity-active);
        transition: opacity 1s;
      }
    }
  }
}
</style>
