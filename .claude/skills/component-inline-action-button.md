# Inline Action Button in a Custom Input Wrapper

## Overview

When a component needs an action button visually attached to an input-like wrapper (e.g. copy-to-clipboard, search-submit), use `InputButton variant="inline"` rather than a raw `<button>`. The `inline` variant applies no built-in styles intentionally — the parent component's CSS provides all context. This keeps the button consistent with the rest of the input system (focus rings, hover tokens, transition timing) without duplicating the button style system.

## Pattern

```vue
<template>
  <div class="my-wrapper" :class="{ 'some-state': isActive }">
    <input class="my-field" ... />
    <InputButton
      type="button"
      variant="inline"
      class="my-action-button"
      :button-text="label"
      :aria-label="label"
      @click="handleAction"
    >
      <template v-if="slots.icon" #left>
        <slot name="icon"></slot>
      </template>
    </InputButton>
  </div>
</template>
```

`aria-label` is not a declared prop on InputButton — it falls through to the root element via Vue's default `inheritAttrs: true`.

## CSS

Target `.my-action-button.input-button` inside the wrapper to override InputButton's defaults. Use theme tokens — not private `--_` tokens — for colours that already have theme equivalents:

```css
@layer components {
  .my-wrapper {
    display: flex;
    align-items: stretch;
    border: var(--form-element-border-width) solid var(--theme-input-border);
    border-radius: var(--form-input-border-radius);
    background-color: var(--theme-input-surface);

    .my-action-button.input-button {
      border-radius: 0;
      border-inline-start: var(--form-element-border-width) solid var(--theme-input-border);
      padding-inline: var(--input-padding-inline);
      min-width: var(--input-min-height);
      background-color: var(--theme-button-secondary-surface);
      color: var(--theme-button-secondary-text);

      &:hover {
        background-color: var(--theme-button-primary-surface);
        color: var(--theme-button-primary-text);
      }

      &:focus-visible {
        outline: var(--form-element-outline-width-focus) solid var(--theme-input-outline-focus);
        outline-offset: -4px;
      }
    }

    /* Use private tokens only for new semantic states with no theme equivalent */
    &.some-state {
      --_state-surface: var(--green-01);
      --_state-text: var(--green-08);

      .my-action-button.input-button {
        background-color: var(--_state-surface);
        color: var(--_state-text);
      }
    }
  }
}
```

## What `variant="inline"` still brings

`inline` adds no colours, but the base `.input-button` rule and its inner `.button-text` still
apply. Override what the wrapper doesn't want, on the `.my-action-button.input-button` selector:

- `box-sizing: content-box`: set `border-box` if the button has a `max-inline-size: 100%` or sits
  in a wrapping flex row, or padding pushes it past its container.
- `min-height: var(--button-min-height)`: set `auto` to size from your own padding.
- `grid-auto-flow: column` layout, `overflow: hidden` and a `transition: all` (replace it with
  your own `transition` list).
- `.button-text` takes `font-size: var(--button-font-size)` and
  `text-transform: var(--button-text-transform)`: set `font-size: inherit; text-transform: none`
  on `& .button-text` to keep the wrapper's type. It already wraps unbroken text
  (`overflow-wrap: anywhere`, with `white-space` from `--input-button-text-white-space`).
- The label is the `buttonText` string prop; there's no label slot. A wrapper that had label
  slots on a raw `<button>` turns them into string props when it switches (a breaking change).

`InputButton` always renders `data-theme` (default `"default"`). That value has no hue rule of
its own, so the button keeps the parent's `data-theme` palette and `--theme-*` reads inside it
still follow the wrapper's theme. Don't pass a theme just to keep it in step.

## Temporary "done" states (copied, saved)

When the button briefly blocks repeat clicks after it succeeds, use `InputButton`'s `readonly` prop
(`aria-disabled` plus a click guard), not `disabled`: disabling the focused button drops keyboard
focus. Keep `disabled` for a genuinely unavailable control. If the button has an `aria-label`, a
changed visible label ("Copied!") isn't announced, because the aria-label wins; add a visually hidden
`role="status"` span carrying the message. `InputCopy` does both (2026-10-15).

## Real examples

- `InputPasswordField`: `app/components/05.forms/input-text/InputPasswordField.vue` (show/hide toggle attached to the input)
- `CookieConsentBanner`: `app/components/02.molecules/cookie-consent-banner/CookieConsentBanner.vue`
  (standalone Accept/Reject actions, not attached to an input)
