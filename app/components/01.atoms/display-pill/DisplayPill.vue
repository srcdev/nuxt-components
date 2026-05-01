<template>
  <component
    :is="tag"
    class="display-pill"
    :class="[size, variant, { 'is-reversed': reversed }, elementClasses]"
  >
    <slot name="icon"></slot>
    <span v-if="label" class="pill-label">{{ label }}</span>
    <slot v-else name="default"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "span" | "div" | "button" | "a";
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "neutral";
  reversed?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "span",
  label: undefined,
  size: "md",
  variant: "default",
  reversed: false,
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
  .display-pill {
    --_bg: var(--theme-pill-bg, var(--slate-01));
    --_color: var(--theme-pill-color, var(--slate-09));
    --_border-color: var(--theme-pill-border-color, transparent);
    --_border-width: var(--theme-pill-border-width, 1px);
    --_border-style: var(--theme-pill-border-style, solid);
    /* 100vw always resolves to the correct pill radius regardless of element size */
    --_border-radius: var(--theme-pill-border-radius, 100vw);
    --_outline: var(--theme-pill-outline, none);
    --_outline-offset: var(--theme-pill-outline-offset, 0px);
    --_gap: var(--theme-pill-gap, 0.5rem);
    --_font-size: var(--theme-pill-font-size, 1.2rem);
    --_font-weight: var(--theme-pill-font-weight, 500);
    --_padding-x: var(--theme-pill-padding-x, 1rem);
    --_padding-y: var(--theme-pill-padding-y, 0.4rem);
    --_icon-size: var(--theme-pill-icon-size, 1.4rem);

    display: inline-flex;
    align-items: center;
    gap: var(--_gap);
    padding: var(--_padding-y) var(--_padding-x);
    border-radius: var(--_border-radius);
    border: var(--_border-width) var(--_border-style) var(--_border-color);
    outline: var(--_outline);
    outline-offset: var(--_outline-offset);
    background-color: var(--_bg);
    color: var(--_color);
    font-size: var(--_font-size);
    font-weight: var(--_font-weight);
    line-height: 1;
    white-space: nowrap;
    width: fit-content;
    cursor: default;
    user-select: none;

    &:is(button, a) {
      cursor: pointer;
    }

    &.is-reversed {
      flex-direction: row-reverse;
    }

    .pill-label {
      display: inline-flex;
      align-items: center;
    }

    /* Sizes */
    &.sm {
      --_font-size: var(--theme-pill-font-size-sm, 1rem);
      --_padding-x: var(--theme-pill-padding-x-sm, 0.8rem);
      --_padding-y: var(--theme-pill-padding-y-sm, 0.3rem);
      --_icon-size: var(--theme-pill-icon-size-sm, 1.2rem);
    }

    &.lg {
      --_font-size: var(--theme-pill-font-size-lg, 1.4rem);
      --_padding-x: var(--theme-pill-padding-x-lg, 1.2rem);
      --_padding-y: var(--theme-pill-padding-y-lg, 0.6rem);
      --_icon-size: var(--theme-pill-icon-size-lg, 1.6rem);
    }

    /* Variants */
    &.primary {
      --_bg: var(--theme-pill-primary-bg, var(--blue-01));
      --_color: var(--theme-pill-primary-color, var(--blue-09));
    }

    &.success {
      --_bg: var(--theme-pill-success-bg, var(--green-01));
      --_color: var(--theme-pill-success-color, var(--green-10));
    }

    &.warning {
      --_bg: var(--theme-pill-warning-bg, var(--yellow-08, #fef9c3));
      --_color: var(--theme-pill-warning-color, var(--yellow-03, #a16207));
    }

    &.danger {
      --_bg: var(--theme-pill-danger-bg, var(--red-01));
      --_color: var(--theme-pill-danger-color, var(--red-10));
    }

    &.neutral {
      --_bg: var(--theme-pill-neutral-bg, var(--slate-08));
      --_color: var(--theme-pill-neutral-color, var(--slate-03));
    }
  }
}
</style>
