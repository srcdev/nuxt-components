# DisplayPrompt

## Overview

`DisplayPrompt` is an inline notification banner with a themed icon, title, optional content, and
an optional dismiss button. It collapses in-place via CSS grid animation rather than removing from
the DOM. Dismiss can be controlled locally (closes itself) or by a parent via `v-model`.

**Location**: `app/components/01.atoms/prompt/DisplayPrompt.vue`
**Types**: `~/types/components` — `DisplayPromptTheme`, `SemanticTheme`

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `SemanticTheme` | `"info"` | `"info" \| "success" \| "warning" \| "error"` |
| `dismissible` | `boolean` | `false` | Shows a close button. |
| `useAutoFocus` | `boolean` | `false` | Focuses the prompt root element on mount. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the inner wrapper (e.g. `"outlined"`). |
| `v-model` | `boolean` | `false` | Optional parent control — see dismiss behaviour below. |

## Slots

| Slot | Description |
|---|---|
| `#title` | **Required in practice.** Bold heading text. Always rendered (even when empty). |
| `#content` | Body text below the title. The `<p>` element is omitted when this slot is empty. |
| `#customDecoratorIcon` | Replaces the default theme icon. |
| `#customCloseIcon` | Replaces the default × close icon inside the dismiss button. |
| `#customTitle` | Screen-reader label for the dismiss button (default: `"Close this prompt"`). |

## Themes

| Theme | Default icon |
|---|---|
| `"info"` | `akar-icons:info` |
| `"success"` | `akar-icons:check` |
| `"warning"` | `akar-icons:circle-alert` |
| `"error"` | `akar-icons:circle-alert` |

`data-theme` is set on the inner wrapper, activating the CSS palette (`--theme-surface`,
`--theme-text`, `--theme-border`, `--theme-ring`, etc.).

## Dismiss behaviour

Two modes depending on whether `v-model` is bound:

| Scenario | What happens on close |
|---|---|
| No `v-model` (or `v-model="false"`) | Sets internal `componentOpen = false` → `.closed` class → collapses via CSS |
| `v-model="true"` | Emits `update:modelValue = false`; internal state unchanged — parent controls visibility |

The `.closed` class triggers a CSS grid row animation (`grid-template-rows: 1fr → 0fr`) with
`opacity: 0` and `pointer-events: none`.

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

## `styleClassPassthrough` modifiers

| Class | Effect |
|---|---|
| `"outlined"` | Adds `1px solid var(--theme-border)` border to the wrapper |

Apply via prop:

```vue
<DisplayPrompt :style-class-passthrough="['outlined']" theme="error">
  <template #title>Something went wrong.</template>
</DisplayPrompt>
```

## CSS token override

Scope overrides using your page or section wrapper class — no `:deep()` needed:

```css
.my-section .display-prompt-wrapper {
  --theme-surface: oklch(60% 0.18 140);
  border-radius: 0.8rem;
}
```

## Notes

- `DisplayPromptTheme` is an alias for `SemanticTheme` (`"info" | "success" | "warning" | "error"`).
- The root element always has `tabindex="0"` — it is focusable whether or not `dismissible` is set.
- `useAutoFocus` focuses the root element on mount (useful when injecting a prompt in response to a
  user action that has already moved focus elsewhere).
- The `#title` slot renders unconditionally — an empty title `<p>` will still appear. Always
  provide meaningful content in `#title`.
