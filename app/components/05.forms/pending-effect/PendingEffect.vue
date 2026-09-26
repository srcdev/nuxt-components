<template>
  <svg
    class="pending-effect-container"
    :class="elementClasses"
    :data-theme="theme"
    aria-hidden="true"
    focusable="false"
  >
    <rect pathLength="100" stroke-linecap="round" class="pending-effect-blur"/>
    <rect pathLength="100" stroke-linecap="round" class="pending-effect-line"/>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  theme?: "default" | "success" | "error" | "warning";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  theme: "default",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .pending-effect {
    position: relative;

    .pending-effect-container {
      --_container-offset: 10rem;
      --_offset: var(--pending-effect-offset, 1rem);

      pointer-events: none;
      position: absolute;
      inset: calc(var(--_container-offset) / -2);
      width: calc(100% + var(--_container-offset));
      height: calc(100% + var(--_container-offset));
      opacity: 0;

      .pending-effect-blur,
      .pending-effect-line {
        width: calc(100% - var(--_container-offset) + var(--_offset));
        height: calc(100% - var(--_container-offset) + var(--_offset));
        x: calc((var(--_container-offset) / 2) - (var(--_offset) / 2));
        y: calc((var(--_container-offset) / 2) - (var(--_offset) / 2));
        rx: var(--pending-effect-border-radius, 0.8rem);
        fill: transparent;
        stroke-dasharray: var(--pending-effect-line-length, 2rem)
          calc(5rem - var(--pending-effect-line-length, 2rem));
      }

      .pending-effect-line {
        stroke: var(--pending-effect-line-color, var(--theme-surface));
        stroke-width: var(--pending-effect-line-thickness, 0.1rem);
      }

      .pending-effect-blur {
        filter: blur(var(--pending-effect-blur-size, 0rem));
        stroke: var(--pending-effect-blur-color, var(--theme-surface));
        stroke-width: var(--pending-effect-blur-size, 0rem);
      }
    }

    &.icon-only .pending-effect-container {
      .pending-effect-blur,
      .pending-effect-line {
        rx: var(--pending-effect-border-radius-icon-only, 100vw);
      }
    }

    &.is-pending {
      pointer-events: none;
      cursor: wait;

      @media (prefers-reduced-motion: no-preference) {
        .pending-effect-container {
          opacity: 1;

          .pending-effect-blur,
          .pending-effect-line {
            animation: pending-effect-dash var(--pending-effect-animation-duration, 3000ms) infinite linear;
          }
        }
      }
    }
  }

  @keyframes pending-effect-dash {
    0% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -10rem;
    }
  }
}
</style>
