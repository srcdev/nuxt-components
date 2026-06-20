# DisplayToast / DisplayToastProvider

## Overview

Two patterns are available depending on the use case:

| Pattern | Component | When to use |
|---|---|---|
| **Standalone** | `DisplayToast` | One-off toast tied to a specific UI action; no queueing needed |
| **App-wide queue** | `DisplayToastProvider` + `useToastQueue` | Multiple toasts across the app, stacking, queue management |

**Locations**:

- `app/components/01.atoms/toast/DisplayToast.vue`
- `app/components/01.atoms/toast/DisplayToastProvider.vue`
- `app/composables/useToastQueue.ts`
- `app/components/01.atoms/toast/molecules/DefaultToastContent.vue`

**Types**: `~/types/components` — `DisplayToastConfig`, `DisplayToastTheme`, `ToastQueueEntry`, `ToastQueueStatus`

---

## Pattern 1 — Standalone (`DisplayToast`)

Triggered via `v-model`. Each instance manages its own visibility and position.

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `v-model` | `boolean` | `false` | `true` shows; `false` hides. |
| `config` | `DisplayToastConfig` | see below | All sub-keys optional. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root element. |

### Config shape

```ts
interface DisplayToastConfig {
  appearance?: {
    theme?: SemanticTheme        // "info" | "success" | "warning" | "error" — default: "info"
    position?: "top" | "bottom"  // default: "top"
    alignment?: "left" | "center" | "right" // default: "right"
    fullWidth?: boolean          // default: false — overrides alignment
    masked?: boolean             // SVG glass border — semi-transparent background — default: false
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

### app.config defaults

`appearance` and `behavior` keys (not `content` — that's per-instance) can be set globally so
every toast in the app inherits the same defaults without repeating them in every `config` prop.

```ts
// Consumer's app.config.ts
export default defineAppConfig({
  srcdev: {
    displayToast: {
      appearance: { theme: "success", position: "bottom", alignment: "left" },
      behavior: { autoDismiss: true, duration: 4000 },
    },
  },
})
```

Resolution chain: **`config` prop → app.config → hardcoded fallback**.

### Slots

| Slot | Description |
|---|---|
| `default` | Replaces `DefaultToastContent` entirely. `has-theme`, `tabindex`, and `aria-describedby` are omitted — accessibility is the caller's responsibility. |
| `#customToastIcon` | Replaces the default theme icon. |
| `#title` | Replaces `config.content.title`. Do not provide both slot and config value. |
| `#description` | Replaces `config.content.description`. Do not provide both slot and config value. |

### Basic usage

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

### Notes

- `onBeforeRouteLeave` dismisses the toast on navigation. This emits a Vue Router warning in Vitest (no active route record) — harmless.
- `returnFocusTo` accepts an `HTMLElement` or a component instance with `$el`.
- The toast uses `<Teleport to="body">`. In tests, query `document.querySelector(".display-toast")` not `wrapper.find()`.

---

## Pattern 2 — App-wide queue (`DisplayToastProvider` + `useToastQueue`)

Place `DisplayToastProvider` once in the app layout. Trigger toasts from anywhere using `useToastQueue`. The provider promotes pending entries to visible up to `maxVisible`, manages timers, and handles stacked FLIP animations.

### Setup — layout

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <slot />
    <DisplayToastProvider position="top" alignment="right" :max-visible="1" />
  </div>
</template>
```

Only one `DisplayToastProvider` should be mounted at a time. It uses `<Teleport to="body">` so its placement in the layout tree does not affect visual output.

### `DisplayToastProvider` props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `position` | `"top" \| "bottom"` | `"top"` | Vertical screen edge |
| `alignment` | `"left" \| "center" \| "right"` | `"right"` | Horizontal alignment (ignored when `fullWidth`) |
| `fullWidth` | `boolean` | `false` | Toast spans the full viewport width |
| `maxVisible` | `number` | `1` | Max toasts visible simultaneously; rest queue as pending |

### `useToastQueue` API

```ts
const { show, dismiss, clear, queue } = useToastQueue()
```

| Method | Signature | Notes |
|---|---|---|
| `show(config)` | `(config: DisplayToastConfig) => string` | Adds a toast to the queue; returns its ID |
| `dismiss(id)` | `(id: string) => void` | Removes a specific toast by ID |
| `clear()` | `() => void` | Flushes all pending and visible toasts |
| `queue` | `Readonly<Ref<ToastQueueEntry[]>>` | Reactive read-only queue state |

The composable uses a **module-level singleton** — state is shared across all callers without Pinia. Safe for client-only ephemeral UI state.

> **Internal API**: `DisplayToastProvider` uses `useToastQueueProvider()` (a separate export from the same file) which additionally exposes `promote`. Do not call `useToastQueueProvider` from consuming app code — manually promoting without a timer puts the queue into an inconsistent state.

### Triggering toasts

```vue
<script setup lang="ts">
const { show } = useToastQueue()

const onSave = async () => {
  try {
    await save()
    show({
      appearance: { theme: 'success' },
      behavior: { autoDismiss: true, duration: 4000 },
      content: { title: 'Saved', description: 'Your changes have been saved.' },
    })
  } catch {
    show({
      appearance: { theme: 'error' },
      behavior: { autoDismiss: false },
      content: { title: 'Save failed', description: 'Check your connection and try again.' },
    })
  }
}
</script>
```

### Stacking (`maxVisible > 1`)

```vue
<DisplayToastProvider :max-visible="3" position="top" alignment="right" />
```

With `maxVisible: 3` and 5 toasts triggered:

- Toasts 1–3 are visible immediately
- Toasts 4–5 queue as `pending`
- When toast 1 is dismissed, toast 4 is promoted and animates in

Stacked dismissals use a FLIP animation — remaining toasts slide smoothly to fill the gap rather than snapping.

### Themes and ARIA

| Theme | ARIA role | aria-live |
|---|---|---|
| `"info"` | `status` | `polite` |
| `"success"` | `status` | `polite` |
| `"warning"` | `alert` | `assertive` |
| `"error"` | `alert` | `assertive` |

### CSS / styling

Override tokens via an unscoped style block scoped to a page or layout class:

```css
.my-page .display-toast-provider-item {
  --theme-surface: oklch(15% 0 0);
  --theme-text: oklch(95% 0 0);
}
```

### Masked variant

Setting `appearance.masked: true` swaps `AlertContent` for `AlertMaskedContent`, which uses an SVG-based border and a semi-transparent background (`rgba(0,0,0,0.3)`) so page content is faintly visible beneath the toast.

The SVG border shape matches the standard toast exactly (8px left radius, 4px right, 6px accent-colour left bar via `--theme-accent`). Override any dimension or colour via a `maskConfig` prop if using `AlertMaskedContent` standalone.

The inner content layout is handled by the shared `AlertContentInner` molecule — both variants reuse it. `AlertMaskedContent` overrides `--_alert-content-inner-bg: transparent` so the glass effect shows through.

### Provider notes

- `useToastQueue` state persists across route changes — no `onBeforeRouteLeave` cleanup needed.
- `crypto.randomUUID()` generates toast IDs (`toast-<uuid>`). IDs are returned by `show()` for targeted `dismiss(id)` calls.
- In tests, query via `document.querySelector(".display-toast-provider-item")` — the Teleport renders outside the component wrapper.
- The progress bar (`.display-toast-provider-progress`) is only rendered when `autoDismiss: true`.
- Dismissal can be triggered by: close button click, Escape key (when the toast item has focus), `dismiss(id)`, auto-dismiss timer, or `clear()`.
