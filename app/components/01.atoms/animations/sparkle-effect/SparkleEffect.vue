<template>
  <component
    :is="tag"
    class="sparkle-effect"
    :class="elementClasses"
    :style="rootStyle"
    :data-continuous="continuous ? '' : undefined"
  >
    <slot></slot>
    <span class="sparkle-effect-sparks" aria-hidden="true">
      <span v-for="(spark, index) in sparks" :key="index" class="sparkle-effect-spark" :style="spark"></span>
    </span>
  </component>
</template>

<script setup lang="ts">
interface Props {
  count?: number;
  radius?: string;
  continuous?: boolean;
  tag?: "span" | "div";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  count: 5,
  radius: undefined,
  continuous: false,
  tag: "span",
  styleClassPassthrough: () => [],
});

const DEFAULT_COUNT = 5;
const MAX_COUNT = 12;

const SPARK_PRESETS = [
  { lightness: "80%", hue: 0, scale: 1, x: 0, y: 3, offset: 80, speed: 1 },
  { lightness: "80%", hue: 50, scale: 0.85, x: 0, y: -3, offset: 60, speed: 1 },
  { lightness: "70%", hue: 20, scale: 1.15, x: 0, y: -1, offset: 70, speed: 0.85 },
  { lightness: "80%", hue: -20, scale: 0.7, x: -2, y: 5, offset: 75, speed: 1.2 },
  { lightness: "80%", hue: -200, scale: 1, x: 0, y: 0, offset: 70, speed: 1 },
] as const;

const sparkCount = computed(() =>
  Number.isFinite(props.count) ? Math.min(MAX_COUNT, Math.max(1, Math.floor(props.count))) : DEFAULT_COUNT
);

const sparks = computed(() =>
  Array.from({ length: sparkCount.value }, (_, index) => {
    const preset = SPARK_PRESETS[index % SPARK_PRESETS.length]!;
    const cycle = Math.floor(index / SPARK_PRESETS.length);
    const mirror = cycle % 2 === 1 ? -1 : 1;
    return {
      "--_sparkle-effect-spark-colour": `oklch(from var(--_sparkle-effect-colour) ${preset.lightness} c calc(h + ${preset.hue + cycle * 35}))`,
      "--_sparkle-effect-spark-scale": `${preset.scale}`,
      "--_sparkle-effect-spark-translate": `${preset.x * mirror}rem ${preset.y * mirror}rem`,
      "--_sparkle-effect-spark-offset": `${(preset.offset + cycle * 13) % 100}%`,
      "--_sparkle-effect-spark-speed": `${preset.speed + cycle * 0.1}`,
    };
  })
);

const rootStyle = computed(() => (props.radius ? { "--sparkle-effect-radius": props.radius } : undefined));

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
  .sparkle-effect {
    --_sparkle-effect-colour: var(--sparkle-effect-colour, var(--theme-border));

    position: relative;
    display: inline-grid;
    isolation: isolate;
    border-radius: var(--sparkle-effect-radius, 100vw);

    &:is(div) {
      display: grid;
    }

    &::before {
      content: "";
      position: absolute;
      inset: -2px;
      z-index: -1;
      border-radius: inherit;
      background-color: var(--_sparkle-effect-colour);
      filter: blur(var(--sparkle-effect-glow-blur, 1.2rem));
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s;
    }

    & > .sparkle-effect-sparks {
      display: none;
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;

      & > .sparkle-effect-spark {
        --_sparkle-effect-spark-timing: calc(
          var(--sparkle-effect-duration, 1.5s) * var(--_sparkle-effect-spark-speed, 1)
        );

        position: absolute;
        offset-path: border-box;
        offset-rotate: 0deg;
        inline-size: calc(var(--sparkle-effect-size, 0.7rem) * var(--_sparkle-effect-spark-scale, 1));
        aspect-ratio: 1 / 3;
        border-radius: 50%;
        background-color: var(--_sparkle-effect-colour);
        filter: blur(var(--sparkle-effect-blur, 1px));
        opacity: 0;

        @supports (color: oklch(from red l c h)) {
          background-color: var(--_sparkle-effect-spark-colour, var(--_sparkle-effect-colour));
        }

        &::before,
        &::after {
          content: "";
          position: absolute;
          inline-size: inherit;
          aspect-ratio: inherit;
          border-radius: inherit;
          background-color: inherit;
          translate: -50%;
        }

        &::before {
          rotate: 55deg;
        }

        &::after {
          rotate: -55deg;
        }
      }
    }

    &:is(:hover, :has(:focus-visible)):not(:has(> :disabled, > [aria-disabled="true"])) {
      &::before {
        opacity: var(--sparkle-effect-glow-opacity, 0.5);
      }

      & > .sparkle-effect-sparks > .sparkle-effect-spark {
        offset-distance: var(--_sparkle-effect-spark-offset, 70%);
        translate: var(--_sparkle-effect-spark-translate, 0 0);
        transition:
          translate var(--_sparkle-effect-spark-timing),
          offset-distance var(--_sparkle-effect-spark-timing);
        animation: sparkle-effect-life calc(var(--_sparkle-effect-spark-timing) * 0.85) both;
      }

      &[data-continuous] > .sparkle-effect-sparks > .sparkle-effect-spark {
        transition: none;
        animation: sparkle-effect-travel var(--_sparkle-effect-spark-timing) infinite;
      }
    }
  }

  @supports (offset-path: border-box) {
    @media (prefers-reduced-motion: no-preference) {
      .sparkle-effect > .sparkle-effect-sparks {
        display: block;
      }
    }
  }

  @keyframes sparkle-effect-life {
    0% {
      opacity: 0;
    }

    20%,
    70% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes sparkle-effect-travel {
    0% {
      offset-distance: 0%;
      translate: 0 0;
      opacity: 0;
    }

    20%,
    60% {
      opacity: 1;
    }

    85%,
    100% {
      offset-distance: var(--_sparkle-effect-spark-offset, 70%);
      translate: var(--_sparkle-effect-spark-translate, 0 0);
      opacity: 0;
    }
  }
}
</style>
