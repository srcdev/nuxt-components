<template>
  <component
    :is="tag"
    class="display-pill"
    :class="[size, variant, { 'is-reversed': reversed }, elementClasses]"
    :type="tag === 'button' ? 'button' : undefined"
    :data-icon-position="iconPosition()"
  >
    <span v-if="slots.icon" class="display-pill-icon">
      <slot name="icon"></slot>
    </span>
    <span v-if="label" class="display-pill-label">{{ label }}</span>
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

const slots = useSlots();

// A function, not a computed: slots aren't reactive, so a cached value goes stale when a slot is toggled.
const iconPosition = () => {
  if (!slots.icon) return undefined;
  if (!props.label && !slots.default) return "only";
  return props.reversed ? "end" : "start";
};

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .display-pill {
    --_background: var(--display-pill-background, var(--slate-01));
    --_text-colour: var(--display-pill-text-colour, var(--slate-09));
    --_font-size: var(--display-pill-font-size, 1.2rem);
    --_icon-size: var(--display-pill-icon-size, 1.4rem);

    /* Spacing scales with the icon size, so each size only sets font and icon size. */
    --_padding-inline: var(
      --display-pill-padding-inline,
      calc(var(--_icon-size) * var(--display-pill-padding-inline-ratio, 0.7))
    );
    --_padding-inline-icon: var(
      --display-pill-padding-inline-icon,
      calc(var(--_icon-size) * var(--display-pill-padding-inline-icon-ratio, 0.4))
    );
    --_padding-block: var(
      --display-pill-padding-block,
      calc(var(--_icon-size) * var(--display-pill-padding-block-ratio, 0.3))
    );

    display: inline-flex;
    align-items: center;
    gap: var(--display-pill-gap, calc(var(--_icon-size) * var(--display-pill-gap-ratio, 0.35)));
    padding-block: var(--_padding-block);
    padding-inline: var(--_padding-inline);

    /* Icons carry their own whitespace, so the icon side gets less padding. */
    &[data-icon-position="start"] {
      padding-inline: var(--_padding-inline-icon) var(--_padding-inline);
    }

    &[data-icon-position="end"] {
      padding-inline: var(--_padding-inline) var(--_padding-inline-icon);
    }

    &[data-icon-position="only"] {
      padding-inline: var(--_padding-inline-icon);
    }

    border: var(--display-pill-border-width, 0.1rem) var(--display-pill-border-style, solid)
      var(--display-pill-border-colour, transparent);
    /* 100vw always resolves to a full pill radius regardless of element size */
    border-radius: var(--display-pill-border-radius, 100vw);
    outline: var(--display-pill-outline, none);
    outline-offset: var(--display-pill-outline-offset, 0);
    background-color: var(--_background);
    color: var(--_text-colour);
    font-family: inherit;
    font-size: var(--_font-size);
    font-weight: var(--display-pill-font-weight, 500);
    line-height: 1;
    white-space: nowrap;
    width: fit-content;
    max-inline-size: 100%;
    cursor: default;
    user-select: none;

    &:is(button, a) {
      cursor: pointer;

      &:focus-visible {
        outline: 0.2rem solid var(--display-pill-focus-ring, var(--theme-border-focus));
        outline-offset: 0.2rem;
      }
    }

    &.is-reversed {
      flex-direction: row-reverse;
    }

    .display-pill-icon {
      display: inline-flex;
      align-items: center;
      font-size: var(--_icon-size);
    }

    .display-pill-label {
      display: block;
      min-inline-size: 0;
      overflow-x: clip;
      text-overflow: ellipsis;
    }

    &.sm {
      --_font-size: var(--display-pill-font-size-sm, 1rem);
      --_icon-size: var(--display-pill-icon-size-sm, 1.2rem);
    }

    &.lg {
      --_font-size: var(--display-pill-font-size-lg, 1.4rem);
      --_icon-size: var(--display-pill-icon-size-lg, 1.6rem);
    }

    /* Variant token, then the base token, then the variant's own default. */
    &.primary {
      --_background: var(--display-pill-primary-background, var(--display-pill-background, var(--blue-01)));
      --_text-colour: var(--display-pill-primary-text-colour, var(--display-pill-text-colour, var(--blue-09)));
    }

    &.success {
      --_background: var(--display-pill-success-background, var(--display-pill-background, var(--status-success-surface)));
      --_text-colour: var(--display-pill-success-text-colour, var(--display-pill-text-colour, var(--status-success-text)));
    }

    &.warning {
      --_background: var(--display-pill-warning-background, var(--display-pill-background, var(--status-warning-surface)));
      --_text-colour: var(--display-pill-warning-text-colour, var(--display-pill-text-colour, var(--status-warning-text)));
    }

    &.danger {
      --_background: var(--display-pill-danger-background, var(--display-pill-background, var(--status-danger-surface)));
      --_text-colour: var(--display-pill-danger-text-colour, var(--display-pill-text-colour, var(--status-danger-text)));
    }

    &.neutral {
      --_background: var(--display-pill-neutral-background, var(--display-pill-background, var(--slate-08)));
      --_text-colour: var(--display-pill-neutral-text-colour, var(--display-pill-text-colour, var(--slate-03)));
    }
  }
}
</style>
