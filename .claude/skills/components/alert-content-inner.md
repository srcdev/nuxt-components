# AlertContentInner

## Overview

Internal molecule used by `AlertContent` and `AlertMaskedContent`, which are in turn used by
`DisplayToast` and `DisplayPrompt`. Renders the icon, title/body text, and optional dismiss button.
Because it sits below multiple consumer components, icon customisation here applies everywhere.

**Location**: `app/components/02.molecules/alert-content/AlertContentInner.vue`

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `SemanticTheme` | — | **Required.** Drives the default icon and `data-theme` (set by parent `AlertContent`). |
| `customIcon` | `string` | `undefined` | Icon name override passed down from the toast/prompt `config.content.customIcon`. |
| `dismissible` | `boolean` | `false` | Shows the dismiss button when `true`. |
| `contentId` | `string` | `undefined` | Sets `id` on `.alert-content-body` for `aria-describedby` wiring. |
| `ariaLive` | `"polite" \| "assertive" \| "off"` | `undefined` | Sets `aria-live` on `.alert-content-body`. |

## app.config defaults

Icon names — both per-theme and the dismiss button — are configurable globally via `app.config`.
One change here covers every toast, prompt, and any other component built on `AlertContentInner`.

```ts
// Consumer's app.config.ts
export default defineAppConfig({
  srcdev: {
    alertContent: {
      icons: {
        info: "heroicons:information-circle",
        success: "heroicons:check-circle",
        warning: "heroicons:exclamation-triangle",
        error: "heroicons:x-circle",
      },
      dismissIcon: "heroicons:x-mark",
    },
  },
})
```

Resolution chain: **`customIcon` prop → app.config icons → hardcoded fallback**.

The `dismissIcon` slot (`#dismissIcon` on `AlertContent`) always wins over app.config if provided.

## Slots

| Slot | Description |
|---|---|
| `#icon` | Replaces the entire icon region. |
| `#title` | Title line inside `.alert-content-body`. |
| `#content` | Body text inside `.alert-content-body`. |
| `#dismissIcon` | Replaces the dismiss button icon. |
| `#dismissLabel` | SR-only label for the dismiss button (default: `"Close"`). |

## Notes

- Do not use `AlertContentInner` directly in pages — use `AlertContent` or `AlertMaskedContent` instead.
- `AlertMaskedContent` wraps `AlertContentInner` with a different background treatment (SVG glass border).
