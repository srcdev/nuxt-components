<template>
  <component :is="tag" class="glowing-border" :class="[variant, elementClasses]">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "p" | "span" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "ul" | "ol";
  variant?: "subtle" | "vivid" | "silver" | "steel" | "green";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  variant: "subtle",
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
  @property --_glow-deg {
    syntax: "<angle>";
    inherits: true;
    initial-value: -90deg;
  }

  @property --_clr-1 {
    syntax: "<color>";
    inherits: true;
    initial-value: red;
  }

  @property --_clr-2 {
    syntax: "<color>";
    inherits: true;
    initial-value: yellow;
  }

  @property --_clr-3 {
    syntax: "<color>";
    inherits: true;
    initial-value: green;
  }

  @property --_clr-4 {
    syntax: "<color>";
    inherits: true;
    initial-value: blue;
  }

  @property --_clr-5 {
    syntax: "<color>";
    inherits: true;
    initial-value: purple;
  }

  .glowing-border {
    &.vivid {
      --_clr-1: var(--glowing-border-vivid-color-1, #ff0000);
      --_clr-2: var(--glowing-border-vivid-color-2, #ffa500);
      --_clr-3: var(--glowing-border-vivid-color-3, #ffff00);
      --_clr-4: var(--glowing-border-vivid-color-4, #008000);
      --_clr-5: var(--glowing-border-vivid-color-5, #0000ff);
    }

    &.subtle {
      --_clr-1: var(--glowing-border-subtle-color-1, #ff9a9e);
      --_clr-2: var(--glowing-border-subtle-color-2, #fad0c4);
      --_clr-3: var(--glowing-border-subtle-color-3, #fad0c4);
      --_clr-4: var(--glowing-border-subtle-color-4, #fbc2eb);
      --_clr-5: var(--glowing-border-subtle-color-5, #a18cd1);
    }

    &.silver {
      --_clr-1: var(--glowing-border-silver-color-1, #d4d4d4);
      --_clr-2: var(--glowing-border-silver-color-2, #e4e4e4);
      --_clr-3: var(--glowing-border-silver-color-3, #f5f5f5);
      --_clr-4: var(--glowing-border-silver-color-4, #e4e4e4);
      --_clr-5: var(--glowing-border-silver-color-5, #d4d4d4);
    }

    &.steel {
      --_clr-1: var(--glowing-border-steel-color-1, #434343);
      --_clr-2: var(--glowing-border-steel-color-2, #5a5a5a);
      --_clr-3: var(--glowing-border-steel-color-3, #6e6e6e);
      --_clr-4: var(--glowing-border-steel-color-4, #5a5a5a);
      --_clr-5: var(--glowing-border-steel-color-5, #434343);
    }

    &.green {
      --_clr-1: var(--glowing-border-green-color-1, #00ff87);
      --_clr-2: var(--glowing-border-green-color-2, #39ff14);
      --_clr-3: var(--glowing-border-green-color-3, #00c853);
      --_clr-4: var(--glowing-border-green-color-4, #64dd17);
      --_clr-5: var(--glowing-border-green-color-5, #00e676);
    }

    --_gradient-glow: var(--_clr-1), var(--_clr-2), var(--_clr-3), var(--_clr-4), var(--_clr-5), var(--_clr-1);

    border: var(--glowing-border-width, 3px) solid transparent;
    border-radius: var(--glowing-border-radius, 30px);
    background:
      linear-gradient(var(--glowing-border-surface, canvas) 0 0) padding-box,
      conic-gradient(from var(--_glow-deg), var(--_gradient-glow)) border-box;

    animation: glow var(--glowing-border-animation-duration, 10s) infinite linear;

    overflow: hidden;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  @keyframes glow {
    100% {
      --_glow-deg: 270deg;
    }
  }
}
</style>
