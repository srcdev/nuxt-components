---
name: AlertMaskedContent
description: AlertMaskedContent — AlertContentInner inside AlertMaskCore's SVG mask (accent border cut-out + translucent fill); the masked variant DisplayToast/DisplayPrompt swap in
type: reference
---

# AlertMaskedContent

## Overview

The "glass" sibling of `AlertContent`. Same icon/title/body/dismiss layout (the shared
`AlertContentInner`), but instead of an opaque surface it sits inside `AlertMaskCore`, which draws
an accent-coloured border as an SVG cut-out and a translucent fill, so the page behind shows
through.

Used internally by `DisplayToast` (`appearance.masked: true`) and `DisplayPrompt`
(`:masked="true"`). Use it directly when you want a standalone alert over imagery or a gradient.

**Location**: `app/components/02.molecules/alert-masked-content/AlertMaskedContent.vue`

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `SemanticTheme` | — | **Required.** Sets `data-theme` on the root; drives the accent colour and default icon. |
| `customIcon` | `string` | `undefined` | Icon name override (see `alert-content-inner.md` for the resolution chain). |
| `dismissible` | `boolean` | `false` | Shows the dismiss button. |
| `contentId` | `string` | `undefined` | `id` on `.alert-content-body`, for `aria-describedby` wiring. |
| `ariaLive` | `"polite" \| "assertive" \| "off"` | `undefined` | `aria-live` on `.alert-content-body`. |
| `maskConfig` | `AlertMaskConfig` | `undefined` | Merged over the defaults below; any field you set wins. |

Default mask config:

```ts
{
  borderColour: "var(--alert-masked-content-border-colour, var(--theme-accent))",
  backgroundColour: "var(--alert-masked-content-background, color-mix(in oklab, var(--theme-surface-subtle) 80%, transparent))",
  radiusLeft: 8, radiusRight: 4,
  borderLeft: 6, borderTop: 1, borderRight: 1, borderBottom: 1,
}
```

## Slots

Forwarded to `AlertContentInner`: `#icon`, `#title`, `#content`, `#dismissIcon`, `#dismissLabel`
(sr-only dismiss label, default `"Close"`; pass translated text here).

## Events

| Event | Payload | When |
|---|---|---|
| `dismiss` | — | The dismiss button is clicked. |

## Usage

```vue
<AlertMaskedContent theme="success" dismissible @dismiss="hide">
  <template #title>Saved</template>
  <template #content>Your changes have been saved.</template>
</AlertMaskedContent>
```

Colour via tokens (inherits from any ancestor you own):

```vue
<div style="--alert-masked-content-border-colour: white; --alert-masked-content-background: oklch(20% 0.05 260 / 0.6);">
  <AlertMaskedContent theme="info">...</AlertMaskedContent>
</div>
```

Geometry via `maskConfig`:

```vue
<AlertMaskedContent theme="info" :mask-config="{ radiusLeft: 16, radiusRight: 16, borderLeft: 2 }">...</AlertMaskedContent>
```

## Styling

See `CONSUMER-STYLING.md` next to the component. Public tokens:
`--alert-masked-content-border-colour`, `--alert-masked-content-background`. The root sets
`--alert-content-inner-background: transparent` on itself so the mask shows through.

## Notes

- Needs something behind it to read as a mask. On a plain page it's just a grey-ish box. The
  Storybook "Over Imagery" story compares it with `AlertContent` over photos and gradients.
- The default fill is `--theme-surface-subtle` at 80% (via `color-mix()`), the surface
  `--theme-text` is designed for, so contrast holds in light and dark mode. Changed 2026-09-27:
  it was `rgba(0, 0, 0, 0.3)`, which put dark light-mode text on a darkened backdrop.
- Changed 2026-09-27: colours are now overridable via the two public tokens (previously fixed
  literals, reachable only through `maskConfig`), and the transparent inner background uses
  `AlertContentInner`'s public `--alert-content-inner-background` instead of reaching into its
  private `--_alert-content-inner-bg`. `AlertMaskCore` now gives each instance a unique mask id,
  so several masked alerts on one page (e.g. stacked toasts) no longer all use the first one's shape.
