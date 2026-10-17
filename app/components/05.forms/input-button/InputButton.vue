<template>
  <component
    :is="tag"
    :type="!isLink ? props.type : undefined"
    :href="isLink ? props.href : undefined"
    :readonly="!isLink ? props.readonly : undefined"
    :aria-disabled="!isLink && props.readonly ? 'true' : undefined"
    data-testid="input-button"
    :data-theme="theme"
    :data-variant="variant"
    :data-pill="isPill ? '' : undefined"
    :data-pending="isPending ? '' : undefined"
    :data-pending-effect="hasPendingEffect ? '' : undefined"
    :data-link="isLink ? '' : undefined"
    :data-icon-only="hasIconOnlySlot() ? '' : undefined"
    class="input-button"
    :class="elementClasses"
    @click.capture="guardReadonly"
  >
    <PendingEffect v-if="hasPendingEffect" :theme="theme" />

    <span v-if="hasLeftSlot()" class="input-button-icon" data-slot="left">
      <slot name="left"></slot>
    </span>
    <span class="input-button-text" :class="{ 'sr-only': hasIconOnlySlot() }">{{ buttonText }}</span>
    <span v-if="hasRightSlot()" class="input-button-icon" data-slot="right">
      <slot name="right"></slot>
    </span>
    <span v-if="hasIconOnlySlot()" class="input-button-icon" data-slot="icon-only">
      <slot name="iconOnly"></slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import type { InputTypesButton, FormUiTheme, InputButtonVariant } from "~/types/forms/types.forms";
interface Props {
  type?: InputTypesButton;
  href?: string;
  /**
   * Force a real browser navigation instead of client-side routing, even for a same-origin
   * href starting with "/". Needed for hrefs that aren't Vue Router pages — e.g. a Nitro
   * server route like "/api/auth/github" — since NuxtLink otherwise treats any leading-"/"
   * href as an internal route and does a client-side router.push, which fails silently
   * (no matching route) instead of hitting the server.
   */
  external?: boolean;
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
  external: false,
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
const isInternalLink = computed(
  () => isLink.value && props.href && props.href.startsWith("/") && !props.external
);
const tag = computed(() => {
  if (isInternalLink.value) return NuxtLink;
  if (isLink.value) return "a";
  return "button";
});

const hasLeftSlot = () => Boolean(slots.left && !slots.iconOnly);
const hasRightSlot = () => Boolean(slots.right && !slots.iconOnly);
const hasIconOnlySlot = () => Boolean(slots.iconOnly);

const guardReadonly = (event: MouseEvent) => {
  if (!props.readonly) return;
  event.preventDefault();
  event.stopImmediatePropagation();
};

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .input-button {
    /* all: unset; */

    display: grid;
    grid-auto-flow: column;
    gap: var(--button-icon-gap);
    justify-content: center;
    align-items: center;
    box-sizing: content-box;
    min-height: var(--button-min-height);
    border-radius: var(--button-border-radius);
    font-family: var(--font-family);
    padding-inline: var(--button-padding-inline);
    padding-block: var(--button-padding-block);
    touch-action: manipulation;
    user-select: none;
    overflow: hidden;
    transition: all var(--control-transition-duration) var(--control-transition-ease);

    &[data-link] {
      display: inline-grid;
    }

    &[data-pending-effect] {
      overflow: visible;
    }

    /* Primary is filled, secondary outlined, tertiary text-only; inline has no colours (wrappers style it).
       Primary and secondary carry a light shadow ring; hover draws the outline over its inner edge. */
    &[data-variant="primary"] {
      --_surface: var(--input-button-primary-surface, var(--theme-surface));
      --_surface-hover: var(--input-button-primary-surface-hover, color-mix(in oklab, var(--_surface) 85%, black));
      --_primary-border-hover: var(--input-button-primary-border-hover, var(--_surface-hover));

      background-color: var(--_surface);
      color: var(--input-button-primary-text, var(--theme-on-surface));
      border: var(--button-border-width) solid var(--input-button-primary-border, var(--_surface));
      outline: var(--button-outline-width) solid var(--input-button-primary-ring, transparent);
      box-shadow: 0 0 0 var(--input-button-shadow-width, var(--form-element-shadow-width))
        var(--input-button-primary-shadow, var(--form-element-shadow-colour, var(--colour-theme-2)));

      &:hover {
        background-color: var(--_surface-hover);
        border-color: var(--_primary-border-hover);
        outline-color: var(--input-button-primary-ring-hover, var(--_primary-border-hover));
      }

      &:focus-visible {
        border-color: var(--input-button-primary-border-focus, var(--theme-border-focus));
        outline-color: var(--input-button-primary-ring-focus, var(--theme-ring));
      }
    }

    &[data-pending] {
      background-color: color-mix(
        in oklab,
        var(--input-button-primary-surface, var(--theme-surface)) 50%,
        transparent
      );
    }

    &[data-variant="secondary"] {
      --_secondary-border: var(--input-button-secondary-border, var(--theme-surface));
      --_secondary-border-hover: var(--input-button-secondary-border-hover, var(--_secondary-border));

      background-color: var(--input-button-secondary-surface, transparent);
      color: var(--input-button-secondary-text, var(--theme-surface));
      border: var(--button-border-width) solid var(--_secondary-border);
      outline: var(--button-outline-width) solid var(--input-button-secondary-ring, transparent);
      box-shadow: 0 0 0 var(--input-button-shadow-width, var(--form-element-shadow-width))
        var(--input-button-secondary-shadow, var(--form-element-shadow-colour, var(--colour-theme-2)));

      &:hover {
        background-color: var(--input-button-secondary-surface-hover, var(--theme-surface-subtle));
        border-color: var(--_secondary-border-hover);
        outline-color: var(--input-button-secondary-ring-hover, var(--_secondary-border-hover));
      }

      &:focus-visible {
        border-color: var(--input-button-secondary-border-focus, var(--theme-border-focus));
        outline-color: var(--input-button-secondary-ring-focus, var(--theme-ring));
      }
    }

    &[data-variant="tertiary"] {
      background-color: var(--input-button-tertiary-surface, transparent);
      color: var(--input-button-tertiary-text, var(--theme-surface));
      border: var(--button-border-width) solid var(--input-button-tertiary-border, transparent);
      outline: var(--button-outline-width) solid var(--input-button-tertiary-ring, transparent);

      &:hover {
        background-color: var(--input-button-tertiary-surface-hover, var(--theme-surface-subtle));
        border-color: var(--input-button-tertiary-border-hover, transparent);
        outline-color: var(--input-button-tertiary-ring-hover, transparent);
      }

      &:focus-visible {
        border-color: var(--input-button-tertiary-border-focus, var(--theme-border-focus));
        outline-color: var(--input-button-tertiary-ring-focus, var(--theme-ring));
      }
    }

    /* Trial (2026-09-27): primary text picks black or white from its own surface. Remove to revert. */
    @supports (color: contrast-color(red)) {
      &[data-variant="primary"] {
        color: var(--input-button-primary-text, contrast-color(var(--_surface)));

        &:hover {
          color: var(--input-button-primary-text, contrast-color(var(--_surface-hover)));
        }
      }
    }

    &[data-variant="primary"],
    &[data-variant="secondary"],
    &[data-variant="tertiary"] {
      &[data-pill] {
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

    & .input-button-text {
      display: inline-block;
      min-inline-size: 0;
      white-space: var(--input-button-text-white-space, normal);
      overflow-wrap: anywhere;
      font-size: var(--button-font-size);
      line-height: var(--button-line-height);
      font-weight: var(--button-font-weight);
      text-transform: var(--button-text-transform);
    }

    & .input-button-icon {
      display: flex;

      & .icon {
        display: inline-block;
        font-size: var(--input-icon-size);
      }
    }

    &[data-icon-only] {
      aspect-ratio: 1;
      border-radius: var(--button-border-radius-icon-only);
      margin: 0;
      padding: 0;

      & .input-button-icon {
        margin: 1.2rem;
      }
    }
  }
}
</style>
