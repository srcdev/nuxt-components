<template>
  <div ref="containerGlowWrapper" class="container-glow-wrapper" :class="elementClasses">
    <component
      :is="tag"
      v-for="(_, name) in $slots"
      :key="name"
      ref="containerGlowItem"
      class="container-glow"
    >
      <div class="glows"></div>
      <slot :name="name"></slot>
    </component>
  </div>
</template>

<script setup lang="ts">
import type { ContainerGlowConfig } from "~/types/components";

interface Props {
  tag?: "div" | "li" | "article" | "section";
  config?: ContainerGlowConfig;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  config: () => ({}),
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const controller = new AbortController();

const containerGlowWrapper = ref<HTMLElement>();
const containerGlowItem = ref<HTMLElement[]>([]);

// Cache frequently used values to avoid repeated access
const configCache = computed(() => ({
  proximity: props.config.proximity ?? 40,
  inactiveOpacityStr: String(props.config.inactiveOpacity ?? 0),
  gapStr: String(props.config.gap ?? 32),
  blurStr: String(props.config.blur ?? 20),
  spreadStr: String(props.config.spread ?? 80),
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
    const { proximity, inactiveOpacityStr } = configCache.value;

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
      cardElem.style.setProperty("--_opacity-active", isInProximity ? "1" : inactiveOpacityStr);

      if (isInProximity) {
        // Only calculate angle when in proximity
        const cardCentreX = cardBounds.left + cardBounds.width * 0.5;
        const cardCentreY = cardBounds.top + cardBounds.height * 0.5;

        let angle = Math.atan2(eventY - cardCentreY, eventX - cardCentreX) * RAD_TO_DEG;
        angle = angle < 0 ? angle + FULL_CIRCLE : angle;

        cardElem.style.setProperty("--_start", String(angle + ANGLE_OFFSET));
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
  wrapper.style.setProperty("--_gap", gapStr);
  wrapper.style.setProperty("--_blur", blurStr);
  wrapper.style.setProperty("--_spread", spreadStr);
  wrapper.style.setProperty("--_direction", direction);
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
@layer components {
  @property --_start {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }

  .container-glow-wrapper {
    display: flex;
    flex-direction: var(--_direction, row);
    gap: calc(var(--_gap, 32) * 1px);

    .container-glow {
      & *,
      & *:after,
      & *:before {
        box-sizing: border-box;
      }

      --_gradient: var(
        --container-glow-gradient,
        conic-gradient(
          from 180deg at 50% 70%,
          hsla(0, 0%, 98%, 1) 0deg,
          #eec32d 72.0000010728836deg,
          #ec4b4b 144.0000021457672deg,
          #709ab9 216.00000858306885deg,
          #4dffbf 288.0000042915344deg,
          hsla(0, 0%, 98%, 1) 1turn
        )
      );
      --_opacity-active: v-bind("props.config.inactiveOpacity ?? 0");
      --_start: 0;

      position: relative;

      height: 100%;
      background: var(--container-glow-background, light-dark(white, hsl(246 44% 7%)));
      padding: var(--container-glow-padding, 2rem);
      aspect-ratio: var(--container-glow-aspect-ratio, 330 / 400);
      border-radius: var(--container-glow-border-radius, 12px);
      min-width: var(--container-glow-min-width, 280px);
      max-width: var(--container-glow-max-width, 280px);
      display: flex;
      flex-direction: column;
      gap: var(--container-glow-content-gap, 0.25rem);

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
        border-radius: var(--container-glow-border-radius, 12px);
        background: var(--container-glow-highlight-colour, hsl(280 10% 50% / 1));
        background-attachment: fixed;
        mask:
          linear-gradient(#0000, #0000),
          conic-gradient(
            from calc(((var(--_start) + (var(--_spread) * 0.25)) - (var(--_spread) * 1.5)) * 1deg),
            hsl(0 0% 100% / 0.15) 0deg,
            white,
            hsl(0 0% 100% / 0.15) calc(var(--_spread) * 2.5deg)
          );
        mask-clip: padding-box, border-box;
        mask-composite: intersect;
        opacity: var(--_opacity-active);
        transition: opacity var(--container-glow-transition-duration, 1s);
      }

      &::after {
        pointer-events: none;

        background: var(--_gradient);
        background-attachment: fixed;
        border-radius: var(--container-glow-border-radius, 12px);
        opacity: var(--_opacity-active, 0);
        transition: opacity var(--container-glow-transition-duration, 1s);
        border: 2px solid transparent;
        mask:
          linear-gradient(#0000, #0000),
          conic-gradient(
            from calc(((var(--_start) + (var(--_spread) * 0.25)) - (var(--_spread) * 0.5)) * 1deg),
            #0000 0deg,
            #fff,
            #0000 calc(var(--_spread) * 0.5deg)
          );
        filter: brightness(var(--container-glow-brightness, 1.5));
        mask-clip: padding-box, border-box;
        mask-composite: intersect;
      }

      .glows {
        pointer-events: none;
        position: absolute;
        inset: 0;
        filter: blur(calc(var(--_blur) * 1px));

        &::after,
        &::before {
          content: "";
          background: var(--_gradient);
          background-attachment: fixed;
          position: absolute;
          inset: -5px;
          border: 10px solid transparent;
          border-radius: var(--container-glow-border-radius, 12px);
          mask:
            linear-gradient(#0000, #0000),
            conic-gradient(
              from calc((var(--_start) - (var(--_spread) * 0.5)) * 1deg),
              #000 0deg,
              #fff,
              #0000 calc(var(--_spread) * 1deg)
            );
          mask-composite: intersect;
          mask-clip: padding-box, border-box;
          opacity: var(--_opacity-active);
          transition: opacity var(--container-glow-transition-duration, 1s);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        &::before,
        &::after,
        .glows::before,
        .glows::after {
          transition: none;
        }
      }
    }
  }
}
</style>
