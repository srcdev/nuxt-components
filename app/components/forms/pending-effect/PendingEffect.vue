<template>
  <svg class="pending-container" :class="[elementClasses]" :data-theme="theme">
    <rect pathLength="100" stroke-linecap="round" class="pending-blur" />
    <rect pathLength="100" stroke-linecap="round" class="pending-line" />
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

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.pending-effect {
  --pending-line-color: var(--theme-button-primary-border);
  --pending-line-thickness: 0.1rem;
  --pending-line-length: 2rem;
  --pending-blur-color: var(--theme-button-primary-border);
  --pending-blur-size: 0rem; /* 0.3rem */
  --pending-offset: 1rem;
  --animation-speed: 3000ms;
  /* do not change, used for calculations */
  --container-offset: 10rem;
  position: relative;

  .pending-container {
    pointer-events: none;
    position: absolute;
    inset: calc(var(--container-offset) / -2);
    width: calc(100% + var(--container-offset));
    height: calc(100% + var(--container-offset));
    opacity: 0;

    .pending-blur,
    .pending-line {
      width: calc(100% - var(--container-offset) + var(--pending-offset));
      height: calc(100% - var(--container-offset) + var(--pending-offset));
      x: calc((var(--container-offset) / 2) + calc(var(--pending-offset) / -2));
      y: calc((var(--container-offset) / 2) + calc(var(--pending-offset) / -2));
      rx: 0.8rem;
      fill: transparent;
      stroke: black;
      stroke-width: 0.5rem;
      stroke-dasharray: var(--pending-line-length) calc(5rem - var(--pending-line-length));
    }

    .pending-line {
      stroke: var(--pending-line-color);
      stroke-width: var(--pending-line-thickness);
    }

    .pending-blur {
      filter: blur(var(--pending-blur-size));
      stroke: var(--pending-blur-color);
      stroke-width: var(--pending-blur-size);
    }
  }

  &:is(.icon-only) {
    .pending-container {
      .pending-blur,
      .pending-line {
        rx: 100vw;
      }
    }
  }

  &:is(.is-pending) {
    pointer-events: none;
    cursor: wait;

    @media (prefers-reduced-motion: no-preference) {
      animation: stroke-dashoffset var(--animation-speed) infinite linear;

      .pending-container {
        opacity: 1;
      }
    }
  }
}

@keyframes stroke-dashoffset {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -10rem;
  }
}
</style>
