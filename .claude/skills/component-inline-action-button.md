# Inline Action Button in a Custom Input Wrapper

## Overview

When a component needs an action button visually attached to an input-like wrapper (e.g. copy-to-clipboard, search-submit), use `InputButtonCore variant="inline"` rather than a raw `<button>`. The `inline` variant applies no built-in styles intentionally — the parent component's CSS provides all context. This keeps the button consistent with the rest of the input system (focus rings, hover tokens, transition timing) without duplicating the button style system.

## Pattern

```vue
<template>
  <div class="my-wrapper" :class="{ 'some-state': isActive }">
    <input class="my-field" ... />
    <InputButtonCore
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
    </InputButtonCore>
  </div>
</template>
```

`aria-label` is not a declared prop on InputButtonCore — it falls through to the root element via Vue's default `inheritAttrs: true`.

## CSS

Target `.my-action-button.input-button-core` inside the wrapper to override InputButtonCore's defaults. Use theme tokens — not private `--_` tokens — for colours that already have theme equivalents:

```css
@layer components {
  .my-wrapper {
    display: flex;
    align-items: stretch;
    border: var(--form-element-border-width) solid var(--theme-input-border);
    border-radius: var(--form-input-border-radius);
    background-color: var(--theme-input-surface);

    .my-action-button.input-button-core {
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
      --_state-surface: light-dark(var(--green-01), var(--green-09));
      --_state-text: light-dark(var(--green-08), var(--green-01));

      .my-action-button.input-button-core {
        background-color: var(--_state-surface);
        color: var(--_state-text);
      }
    }
  }
}
```

## Real example

`InputCopyCore` — `app/components/forms/input-copy/InputCopyCore.vue`
