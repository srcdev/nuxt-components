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
    min-height: var(--button-min-height);
    border-radius: var(--button-border-radius);
    font-family: var(--font-family);
    padding-inline: var(--button-padding-inline);
    padding-block: var(--button-padding-block);
    touch-action: manipulation;
    user-select: none;
    overflow: hidden;
    transition: all var(--control-transition-duration) var(--control-transition-ease);

    &.is-link {
      display: inline-grid;
    }

    /*
    * Theming
    * Every colour is a public --input-button-{variant}-{property} token, inline-fallback to
    * the shared theme slot (see theming-component-token-pattern.md for why: overriding one
    * variant here never touches the --theme-* slots other components read).
    *
    * Flat by default: border defaults to the variant's own surface colour (so the resting state
    * shows no visible edge) and outline defaults to fully transparent — outline is reserved for
    * the focus-visible ring, not used to reinforce the flat look. Hover darkens the surface via
    * color-mix (always darker, regardless of which direction the underlying theme ramp runs in
    * light vs dark mode — no more "hover looks lighter" surprises) and carries the border along
    * with it, still flat; outline stays transparent through hover too.
    * focus-visible is deliberately its own block, not grouped with :hover — it's the one state
    * that gets a real, separately-themeable a11y indicator, and its outline-width/-offset (set
    * below, in Shared States) give it a visible ring regardless of the border/outline being
    * invisible everywhere else.
    * --_surface is a private local (not a public token) — it exists purely so -hover/-border/-ring
    * can color-mix() off the SAME resolved value a consumer's --input-button-{variant}-surface
    * override produces, without every derived token repeating that fallback chain itself.
    **/
    &.primary {
      --_surface: var(--input-button-primary-surface, var(--theme-surface));
      --_surface-hover: var(--input-button-primary-surface-hover, color-mix(in oklab, var(--_surface) 85%, black));

      background-color: var(--_surface);
      color: var(--input-button-primary-text, var(--theme-on-surface));
      border: var(--button-border-width) solid var(--input-button-primary-border, var(--_surface));
      outline: var(--button-outline-width) solid var(--input-button-primary-ring, transparent);

      &:hover {
        background-color: var(--_surface-hover);
        border-color: var(--input-button-primary-border-hover, var(--_surface-hover));
        outline-color: var(--input-button-primary-ring-hover, transparent);
      }

      &:focus-visible {
        border-color: var(--input-button-primary-border-focus, var(--theme-border-focus));
        outline-color: var(--input-button-primary-ring-focus, var(--theme-ring));
      }
    }

    &.is-pending {
      /* Always the primary surface regardless of variant — pre-existing behaviour, not
         something this migration changes. */
      background-color: color-mix(
        in oklab,
        var(--input-button-primary-surface, var(--theme-surface)) 50%,
        transparent
      );
    }

    &.secondary {
      --_surface: var(--input-button-secondary-surface, var(--theme-surface-inverted));
      --_surface-hover: var(
        --input-button-secondary-surface-hover,
        color-mix(in oklab, var(--_surface) 85%, black)
      );

      background-color: var(--_surface);
      color: var(--input-button-secondary-text, var(--theme-text-inverted));
      border: var(--button-border-width) solid var(--input-button-secondary-border, var(--_surface));
      outline: var(--button-outline-width) solid var(--input-button-secondary-ring, transparent);

      &:hover {
        background-color: var(--_surface-hover);
        border-color: var(--input-button-secondary-border-hover, var(--_surface-hover));
        outline-color: var(--input-button-secondary-ring-hover, transparent);
      }

      &:focus-visible {
        border-color: var(--input-button-secondary-border-focus, var(--theme-border-focus));
        outline-color: var(--input-button-secondary-ring-focus, var(--theme-ring));
      }
    }

    &.tertiary {
      /* --_surface can resolve to literal transparent (dark mode default) — color-mix() still
         darkens correctly here: mixing transparent with black lowers the alpha channel rather
         than the lightness, so it reads as a faint dark tint over whatever's behind the button
         instead of a flat fill. Same formula, no special-casing needed. */
      --_surface: var(--input-button-tertiary-surface, light-dark(var(--slate-01), transparent));
      --_surface-hover: var(
        --input-button-tertiary-surface-hover,
        color-mix(in oklab, var(--_surface) 85%, black)
      );

      background-color: var(--_surface);
      color: var(--input-button-tertiary-text, var(--theme-text));
      border: var(--button-border-width) solid var(--input-button-tertiary-border, var(--_surface));
      outline: var(--button-outline-width) solid var(--input-button-tertiary-ring, transparent);
      text-decoration: underline;

      &:hover {
        background-color: var(--_surface-hover);
        border-color: var(--input-button-tertiary-border-hover, var(--_surface-hover));
        outline-color: var(--input-button-tertiary-ring-hover, transparent);
      }

      &:focus-visible {
        border-color: var(--input-button-tertiary-border-focus, var(--theme-border-focus));
        outline-color: var(--input-button-tertiary-ring-focus, var(--theme-ring));
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
