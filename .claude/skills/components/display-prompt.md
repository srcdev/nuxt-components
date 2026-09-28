# DisplayPrompt

> **Changed 2026-09-28:** root class `.display-prompt-core` → `.display-prompt` (and `data-test-id` `display-prompt-core-{theme}` → `display-prompt-{theme}`). The documented `outlined` passthrough modifier never had any CSS behind it and was removed from this doc.

## Overview

`DisplayPrompt` is an inline notification banner with a themed icon, title, optional content, and
an optional dismiss button. It collapses in-place via CSS grid animation rather than removing from
the DOM. Dismiss can be controlled locally (closes itself) or by a parent via `v-model`.

**Location**: `app/components/02.molecules/prompt/DisplayPrompt.vue`
**Types**: `~/types/components` — `DisplayPromptTheme`, `SemanticTheme`

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `SemanticTheme` | `"info"` | `"info" \| "success" \| "warning" \| "error"` |
| `dismissible` | `boolean` | `false` | Shows a close button. |
| `useAutoFocus` | `boolean` | `false` | Focuses the prompt root element on mount. |
| `masked` | `boolean` | `false` | SVG glass border — swaps `AlertContent` for `AlertMaskedContent`. |
| `closeLabel` | `string` | `"Close this prompt"` | Screen-reader label for the dismiss button. Also settable via `app.config`; the `#customTitle` slot still overrides it. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the inner `.display-prompt-wrapper` (not the root). Reactive after mount. |
| `v-model` | `boolean` | `false` | Optional parent control — see dismiss behaviour below. |

## Slots

| Slot | Description |
|---|---|
| `#title` | **Required in practice.** Bold heading text. Always rendered (even when empty). |
| `#content` | Body text below the title. The `<p>` element is omitted when this slot is empty. |
| `#customDecoratorIcon` | Replaces the default theme icon. |
| `#customCloseIcon` | Replaces the default × close icon inside the dismiss button. |
| `#customTitle` | Screen-reader label for the dismiss button (defaults to the `closeLabel` prop). |

## Themes

| Theme | Default icon |
|---|---|
| `"info"` | `akar-icons:info` |
| `"success"` | `akar-icons:check` |
| `"warning"` | `akar-icons:circle-alert` |
| `"error"` | `akar-icons:circle-alert` |

`data-theme` is set on `.display-prompt-wrapper`, activating the CSS palette (`--theme-accent`,
`--theme-text`, `--theme-border`, `--theme-ring`, etc.). The wrapper's left-edge accent uses
`--theme-accent` (step 5/4) — not `--theme-surface` — so it stays visually distinct from buttons.

## Dismiss behaviour

Two modes depending on whether `v-model` is bound:

| Scenario | What happens on close |
|---|---|
| No `v-model` (or `v-model="false"`) | Sets internal `componentOpen = false` → `.closed` class → collapses via CSS |
| `v-model="true"` | Emits `update:modelValue = false`; internal state unchanged — parent controls visibility |

The `.closed` class triggers a CSS grid row animation (`grid-template-rows: 1fr → 0fr`) with
`opacity: 0` and `pointer-events: none`, and the root becomes `inert` so the dismiss button leaves the
tab order and the accessibility tree. The transition is off under `prefers-reduced-motion: reduce`;
its duration is `--display-prompt-transition-duration` (`200ms`).

## app.config defaults

All props except `styleClassPassthrough` can be set globally so every prompt in the app inherits
the same defaults without repeating them at each usage site.

```ts
// Consumer's app.config.ts
export default defineAppConfig({
  srcdev: {
    displayPrompt: {
      theme: "info",
      dismissible: true,
      masked: false,
      useAutoFocus: false,
      closeLabel: "Fermer",
    },
  },
})
```

Resolution chain: **explicit prop → app.config → hardcoded fallback**.

## Basic usage

```vue
<DisplayPrompt theme="info">
  <template #title>Your session will expire soon.</template>
  <template #content>Save your work to avoid losing changes.</template>
</DisplayPrompt>
```

## Dismissible prompt

```vue
<DisplayPrompt theme="warning" :dismissible="true">
  <template #title>Action required</template>
  <template #content>Please verify your email address.</template>
</DisplayPrompt>
```

## Parent-controlled dismiss (v-model)

Use when the parent needs to react to dismiss (e.g. save state, conditionally re-show):

```vue
<script setup lang="ts">
const showPrompt = ref(true)
</script>

<template>
  <DisplayPrompt
    v-model="showPrompt"
    theme="success"
    :dismissible="true"
  >
    <template #title>Profile updated.</template>
  </DisplayPrompt>
</template>
```

## CSS token override

Scope overrides using your page or section wrapper class — no `:deep()` needed:

```css
.my-section .display-prompt-wrapper {
  --theme-accent: oklch(60% 0.18 140); /* left-edge accent strip */
  border-radius: 0.8rem;
}
```

## Masked variant

Setting `:masked="true"` swaps `AlertContent` for `AlertMaskedContent`, giving the prompt an SVG-based
border and a semi-transparent background so content behind it is faintly visible. The inner layout is
identical — all the same slots apply. Place the prompt over a coloured or image background for the
glass effect to be visible.

```vue
<DisplayPrompt theme="info" :masked="true">
  <template #title>Glass prompt</template>
  <template #content>Semi-transparent, backed by AlertMaskedContent.</template>
</DisplayPrompt>
```

## Notes

- `DisplayPromptTheme` is an alias for `SemanticTheme` (`"info" | "success" | "warning" | "error"`).
- The root gets `tabindex="-1"` only when `useAutoFocus` is on, so it can take programmatic focus without joining the tab order (it used to be `tabindex="0"` always).
- `useAutoFocus` focuses the root element on mount (useful when injecting a prompt in response to a
  user action that has already moved focus elsewhere).
- The `#title` slot renders unconditionally — an empty title `<p>` will still appear. Always
  provide meaningful content in `#title`.
