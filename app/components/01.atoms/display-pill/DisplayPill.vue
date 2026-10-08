<template>
  <component
    :is="tag"
    class="display-pill"
    :class="elementClasses"
    :type="tag === 'button' ? 'button' : undefined"
    :data-size="size"
    :data-variant="variant"
    :data-reversed="reversed || undefined"
    :data-icon-position="iconPosition()"
  >
    <span v-if="slots.icon" class="display-pill-icon">
      <slot name="icon"></slot>
    </span>
    <span v-if="hasText()" class="display-pill-label">
      <template v-if="hasLabel">{{ label }}</template>
      <slot v-else name="default"></slot>
    </span>
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

const hasLabel = computed(() => !!props.label?.trim());

// Functions, not computeds: slots aren't reactive, so a cached value goes stale when a slot is toggled.
const hasText = () => hasLabel.value || !!slots.default;

const iconPosition = () => {
  if (!slots.icon) return undefined;
  if (!hasText()) return "only";
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
    --_border-colour: var(--display-pill-border-colour, transparent);
    --_ring-colour: var(--display-pill-ring-colour, var(--_background));
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
      var(--_border-colour);
    /* 100vw always resolves to a full pill radius regardless of element size */
    border-radius: var(--display-pill-border-radius, 100vw);
    outline: var(--display-pill-outline, none);
    outline-offset: var(--display-pill-outline-offset, 0);
    /* box-shadow, not outline: outlines ignore border-radius before Safari 16.4. */
    box-shadow: 0 0 0 var(--display-pill-ring-width, 0) var(--_ring-colour);
    background-color: var(--_background);
    color: var(--_text-colour);
    font-family: inherit;
    font-size: var(--_font-size);
    font-weight: var(--display-pill-font-weight, 500);
    line-height: 1;
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

    &:empty {
      display: none;
    }

    &[data-reversed] {
      flex-direction: row-reverse;
    }

    .display-pill-icon {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      font-size: var(--_icon-size);
    }

    .display-pill-label {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: var(--display-pill-label-line-clamp, 1);
      line-clamp: var(--display-pill-label-line-clamp, 1);
      overflow: hidden;
      overflow-wrap: anywhere;
      min-inline-size: 0;
      /* Room for descenders and accents, which line-height: 1 would otherwise clip. */
      padding-block: 0.15em;
      margin-block: -0.15em;
    }

    &[data-size="sm"] {
      --_font-size: var(--display-pill-font-size-sm, 1rem);
      --_icon-size: var(--display-pill-icon-size-sm, 1.2rem);
    }

    &[data-size="lg"] {
      --_font-size: var(--display-pill-font-size-lg, 1.4rem);
      --_icon-size: var(--display-pill-icon-size-lg, 1.6rem);
    }

    /* Variant token, then the base token, then the variant's own default. */
    &[data-variant="primary"] {
      --_background: var(--display-pill-primary-background, var(--display-pill-background, var(--blue-01)));
      --_text-colour: var(--display-pill-primary-text-colour, var(--display-pill-text-colour, var(--blue-09)));
      --_border-colour: var(--display-pill-primary-border-colour, var(--display-pill-border-colour, transparent));
      --_ring-colour: var(--display-pill-primary-ring-colour, var(--display-pill-ring-colour, var(--_background)));
    }

    &[data-variant="success"] {
      --_background: var(--display-pill-success-background, var(--display-pill-background, var(--status-success-surface)));
      --_text-colour: var(--display-pill-success-text-colour, var(--display-pill-text-colour, var(--status-success-text)));
      --_border-colour: var(--display-pill-success-border-colour, var(--display-pill-border-colour, transparent));
      --_ring-colour: var(--display-pill-success-ring-colour, var(--display-pill-ring-colour, var(--_background)));
    }

    &[data-variant="warning"] {
      --_background: var(--display-pill-warning-background, var(--display-pill-background, var(--status-warning-surface)));
      --_text-colour: var(--display-pill-warning-text-colour, var(--display-pill-text-colour, var(--status-warning-text)));
      --_border-colour: var(--display-pill-warning-border-colour, var(--display-pill-border-colour, transparent));
      --_ring-colour: var(--display-pill-warning-ring-colour, var(--display-pill-ring-colour, var(--_background)));
    }

    &[data-variant="danger"] {
      --_background: var(--display-pill-danger-background, var(--display-pill-background, var(--status-danger-surface)));
      --_text-colour: var(--display-pill-danger-text-colour, var(--display-pill-text-colour, var(--status-danger-text)));
      --_border-colour: var(--display-pill-danger-border-colour, var(--display-pill-border-colour, transparent));
      --_ring-colour: var(--display-pill-danger-ring-colour, var(--display-pill-ring-colour, var(--_background)));
    }

    &[data-variant="neutral"] {
      --_background: var(--display-pill-neutral-background, var(--display-pill-background, var(--slate-08)));
      --_text-colour: var(--display-pill-neutral-text-colour, var(--display-pill-text-colour, var(--slate-03)));
      --_border-colour: var(--display-pill-neutral-border-colour, var(--display-pill-border-colour, transparent));
      --_ring-colour: var(--display-pill-neutral-ring-colour, var(--display-pill-ring-colour, var(--_background)));
    }
  }
}
</style>
