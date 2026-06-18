<template>
  <component
    :is="tag"
    :type="!isLink ? props.type : undefined"
    :href="isLink ? props.href : undefined"
    :readonly="!isLink ? props.readonly : undefined"
    :aria-disabled="!isLink ? props.readonly : undefined"
    data-testid="input-button-core"
    :data-theme="theme"
    class="input-button-core"
    :class="buttonClasses"
  >
    <PendingEffect v-if="hasPendingEffect" :theme="theme" />

    <span v-if="hasLeftSlot" class="btn-icon left">
      <slot name="left"></slot>
    </span>
    <span class="button-text" :class="[{ 'sr-only': hasIconOnlySlot }]">{{ buttonText }}</span>
    <span v-if="hasRightSlot" class="btn-icon right">
      <slot name="right"></slot>
    </span>
    <span v-if="hasIconOnlySlot" class="btn-icon icon-only">
      <slot name="iconOnly"></slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import type { InputTypesButton, FormUiTheme, InputButtonVariant } from "~/types/forms/types.forms";
interface Props {
  type?: InputTypesButton;
  href?: string;
  theme?: FormUiTheme;
  variant?: InputButtonVariant;
  isPill?: boolean;
  buttonText?: string;
  isPending?: boolean;
  hasPendingEffect?: boolean;
  readonly?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  href: undefined,
  theme: "default",
  variant: "primary",
  isPill: false,
  buttonText: "",
  isPending: false,
  hasPendingEffect: false,
  readonly: false,
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const NuxtLink = resolveComponent("NuxtLink");

// If href is undefined tag is button, else it's a link
const isLink = computed(() => Boolean(props.href));
const isInternalLink = computed(() => isLink.value && props.href && props.href.startsWith("/"));
const tag = computed(() => {
  if (isInternalLink.value) return NuxtLink;
  if (isLink.value) return "a";
  return "button";
});

// Cache slot computations for better performance
const hasLeftSlot = computed(() => Boolean(slots.left && !slots.iconOnly));
const hasRightSlot = computed(() => Boolean(slots.right && !slots.iconOnly));
const hasIconOnlySlot = computed(() => Boolean(slots.iconOnly));

// Combine all button classes into a single computed
const buttonClasses = computed(() => [
  props.variant,
  elementClasses.value,
  { "icon-only": hasIconOnlySlot.value },
  { "pending-effect": props.hasPendingEffect },
  { "is-pending": props.isPending },
  { pill: props.isPill },
  { "is-link": isLink.value },
]);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .input-button-core {
    /* all: unset; */

    display: grid;
    grid-auto-flow: column;
    gap: var(--button-icon-gap);
    justify-content: center;
    align-items: center;
    box-sizing: content-box;
    border-radius: var(--button-border-radius);
    font-family: var(--font-family);
    padding-inline: var(--button-padding-inline);
    padding-block: var(--button-padding-block);
    touch-action: manipulation;
    overflow: hidden;
    transition: all var(--control-transition-duration) var(--control-transition-ease);

    &.is-link {
      display: inline-grid;
    }

    /*
    * Theming
    **/
    background-color: var(--theme-surface);
    color: var(--theme-on-surface);
    border: var(--button-border-width) solid var(--theme-border);
    outline: var(--button-outline-width) solid var(--theme-ring);

    &:hover,
    &:focus-visible {
      background-color: var(--theme-surface-hover);
      color: var(--theme-text);
      border-color: var(--theme-border-focus);
      outline-color: var(--theme-ring);
    }

    &.is-pending {
      background-color: color-mix(in oklab, var(--theme-surface) 50%, transparent);
    }

    /*
    * Variants
    **/
    &.primary-X {
      background-color: var(--theme-surface);
      color: var(--theme-on-surface);
      border: var(--button-border-width) solid var(--theme-surface);
      outline: var(--button-outline-width) solid var(--theme-ring);

      &:hover,
      &:focus-visible {
        background-color: var(--theme-surface-hover);
        color: var(--theme-text);
        border-color: var(--theme-surface);
        outline-color: var(--theme-surface);
      }

      &.is-pending {
        background-color: color-mix(in oklab, var(--theme-surface) 50%, transparent);
      }
    }

    &.secondary-X {
      background-color: transparent;
      border: var(--button-border-width) solid var(--theme-surface);
      color: var(--theme-text);
      outline: var(--button-outline-width) solid var(--theme-ring);

      &:hover,
      &:focus-visible {
        background-color: var(--theme-surface);
        color: var(--theme-on-surface);
        border-color: var(--theme-surface);
        outline-color: var(--theme-surface);
      }
    }

    &.tertiary {
      background-color: light-dark(var(--slate-01), transparent);
      border: var(--button-border-width) solid transparent;
      color: var(--theme-text);
      text-decoration: underline;
      outline: var(--button-outline-width) solid transparent;

      &:hover,
      &:focus-visible {
        border-color: var(--theme-surface);
        outline-color: var(--theme-surface);
      }
    }

    &.primary,
    &.secondary,
    &.tertiary {
      &.pill {
        border-radius: 100vw;
      }
    }

    /*
  * Shared States
  **/
    &:hover {
      cursor: pointer;
    }

    &:focus-visible {
      outline-width: var(--button-focus-ring-width);
      outline-offset: var(--button-focus-ring-offset);
    }

    &[readonly] {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .button-text {
      display: inline-block;
      white-space: nowrap;
      font-size: var(--button-font-size);
      line-height: var(--button-line-height);
      font-weight: var(--button-font-weight);
      text-transform: var(--button-text-transform);
    }

    .btn-icon {
      display: flex;

      .icon {
        aspect-ratio: 1;
        display: inline-block;
        height: var(--input-icon-size);
        width: var(--input-icon-size);
      }
    }

    &.icon-only {
      aspect-ratio: 1;
      border-radius: var(--button-border-radius-icon-only);
      margin: 0;
      padding: 0;

      .btn-icon {
        margin: 1.2rem;
      }
    }
  }
}
</style>
