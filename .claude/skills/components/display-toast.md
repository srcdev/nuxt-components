# DisplayToast

## Overview

`DisplayToast` is a notification toast that teleports to `<body>` and is triggered via `v-model`.
It supports four semantic themes, configurable position/alignment, auto-dismiss with a progress bar,
and optional custom slot content. The inner content is rendered by `DefaultToastContent` unless a
default slot is provided.

**Location**: `app/components/01.atoms/toast/DisplayToast.vue`
**Inner molecule**: `app/components/01.atoms/toast/molecules/DefaultToastContent.vue`
**Types**: `~/types/components` — `DisplayToastConfig`, `DisplayToastTheme`, `SemanticTheme`

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `v-model` | `boolean` | `false` | Setting to `true` shows the toast; setting back to `false` hides it. |
| `config` | `DisplayToastConfig` | see below | Full config object — all sub-keys are optional. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the toast root element. |

### config shape

```ts
interface DisplayToastConfig {
  appearance?: {
    theme?: SemanticTheme        // "info" | "success" | "warning" | "error" — default: "info"
    position?: "top" | "bottom"  // default: "top"
    alignment?: "left" | "center" | "right" // default: "right"
    fullWidth?: boolean          // default: false — overrides alignment
  }
  behavior?: {
    autoDismiss?: boolean        // default: true
    duration?: number            // ms before auto-dismiss — default: 5000
    revealDuration?: number      // animation duration ms — default: 550
    returnFocusTo?: HTMLElement | ComponentPublicInstance | null
  }
  content?: {
    text?: string                // simple message (used when no title/description)
    title?: string               // bold title line
    description?: string         // smaller description line
    customIcon?: string          // icon name override (e.g. "akar-icons:check-box")
  }
}
```

## Slots

| Slot | Description |
|---|---|
| `default` | Replaces `DefaultToastContent` entirely — use for fully custom toast bodies. `has-theme` class and accessibility attributes are omitted when this slot is used. |
| `#customToastIcon` | Replaces the default theme icon. Only forwarded to `DefaultToastContent` when provided. |
| `#title` | Replaces the `config.content.title` text. Only forwarded when provided — do not provide both slot and `config.content.title`. |
| `#description` | Replaces the `config.content.description` text. Only forwarded when provided. |

> **Slot forwarding note**: `#title`, `#description`, and `#customToastIcon` are conditionally
> forwarded to `DefaultToastContent`. If you provide the slot, `DefaultToastContent` uses the slot;
> if not, it falls back to the `config.content.*` value. Never provide both — the slot wins.

## Themes and ARIA

Theme drives both colour and ARIA behaviour:

| Theme | ARIA role | aria-live |
|---|---|---|
| `"info"` | `status` | `polite` |
| `"success"` | `status` | `polite` |
| `"warning"` | `alert` | `assertive` |
| `"error"` | `alert` | `assertive` |

The `data-theme` attribute on the root element activates the CSS palette via the project's
theming system (`--theme-surface`, `--theme-text`, `--theme-border`, etc.).

## Basic usage — simple text

```vue
<script setup lang="ts">
const toastVisible = ref(false)
</script>

<template>
  <button @click="toastVisible = true">Save</button>

  <DisplayToast
    v-model="toastVisible"
    :config="{
      appearance: { theme: 'success' },
      behavior: { autoDismiss: true, duration: 4000 },
      content: { text: 'Changes saved.' },
    }"
  />
</template>
```

## Title + description

```vue
<DisplayToast
  v-model="toastVisible"
  :config="{
    appearance: { theme: 'error', position: 'top', alignment: 'right' },
    behavior: { autoDismiss: false },
    content: {
      title: 'Save failed',
      description: 'Check your connection and try again.',
    },
  }"
/>
```

## Custom slot content

When the `default` slot is used, `has-theme`, `tabindex`, and `aria-describedby` are removed —
full accessibility is the caller's responsibility.

```vue
<DisplayToast v-model="toastVisible">
  <div class="my-toast-body">
    <p>Custom content here</p>
  </div>
</DisplayToast>
```

## Position and alignment

| Config | Result |
|---|---|
| `position: "top"`, `alignment: "right"` | Top-right (default) |
| `position: "bottom"`, `alignment: "center"` | Bottom-centre |
| `fullWidth: true` | Spans full viewport width; alignment is ignored |

On screens narrower than 600 px the toast always spans the full inline width regardless of `alignment`.

## Progress bar

When `autoDismiss: true` a thin progress bar animates across the bottom of the toast over
`duration` ms. It is removed when `autoDismiss: false`.

## CSS

The toast uses `--theme-*` semantic slots from the theming system. Direct token overrides via
`styleClassPassthrough`:

```vue
<DisplayToast style-class-passthrough="my-toast" ... />
```

```css
.my-toast.display-toast {
  --theme-surface: oklch(60% 0.15 140);
}
```

## Notes

- The component uses `<Teleport to="body">` — the toast DOM is always a direct child of
  `<body>`, not inside the mounting component's subtree. In tests, use
  `document.querySelector(".display-toast")` not `wrapper.find()`.
- `onBeforeRouteLeave` dismisses the toast on navigation. This emits a Vue Router warning in
  Vitest environments (no active route record) — it is harmless and can be ignored.
- `returnFocusTo` accepts either an `HTMLElement` or a component instance with `$el`.
- Type: `DisplayToastTheme` is an alias for `SemanticTheme` (`"info" | "success" | "warning" | "error"`).
