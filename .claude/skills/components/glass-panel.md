---
name: GlassPanel
description: GlassPanel props, slots, CSS token API, and theming override
type: reference
---

# GlassPanel

## Overview

`GlassPanel` is a semantic container with a frosted-glass look: translucent background,
blurred and saturated backdrop, border, drop shadow, and an angled highlight across the top-left.
Every visual value is a public token with a light-mode default built in.

It only reads as glass when layered over an image, gradient or textured background.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "article" \| "main" \| "header" \| "footer"` | `"div"` | Rendered element. `section`/`article` get `aria-labelledby` (see below). |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root, via `useStyleClassPassthrough` (reacts to prop changes). |

## Slots

| Slot | Slot props | Description |
|------|-----------|-------------|
| `default` | `headingId` | Panel content. Bind `headingId` onto the panel's heading when `tag` is `section` or `article`. |

## Accessibility

With `tag="section"` or `tag="article"`, the root gets `aria-labelledby` pointing at
`headingId` (via `useAriaLabelledById`). Bind it to a real heading or a dev-mode console warning
fires about the broken reference:

```vue
<GlassPanel tag="section">
  <template #default="{ headingId }">
    <h2 :id="headingId">Book a consultation</h2>
    ...
  </template>
</GlassPanel>
```

`div`, `main`, `header` and `footer` never get it.

## CSS token API

Full table with defaults in `app/components/01.atoms/glass-panel/CONSUMER-STYLING.md`.

| Token | What it controls |
|-------|-----------------|
| `--glass-panel-bg` | Background (keep it translucent) |
| `--glass-panel-border-width` / `--glass-panel-border-color` | Border |
| `--glass-panel-border-radius` | Corner radius |
| `--glass-panel-shadow` | `box-shadow` |
| `--glass-panel-backdrop-filter` | `backdrop-filter` (`none` to switch off frosting) |
| `--glass-panel-highlight` / `-highlight-angle` / `-highlight-stop` | The `::before` highlight gradient |

## Dark mode

There is no built-in dark glass. The defaults are light-mode values only (the library avoids
`light-dark()` for older iPad Safari support). Apps with dark pages set their own values; the
old dark defaults were:

```css
[data-color-scheme="dark"] {
  --glass-panel-bg: rgba(12, 12, 20, 0.45);
  --glass-panel-border-color: rgba(255, 255, 255, 0.07);
  --glass-panel-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  --glass-panel-highlight: rgba(255, 255, 255, 0.04);
}
```

cnv-hairdressing and luxury-locs both set their own values in
`app/assets/styles/setup/03.theming/_glass-panel.css`.

## Notes

- `overflow: hidden` is set on the root; portal anything that needs to escape (tooltips,
  dropdowns), and leave room for things drawn outside their box (e.g. PendingEffect borders).
- The root is `isolation: isolate` and the highlight is `z-index: -1`, so the highlight sits
  above the background but beneath the content. Before 2026-09-26 it painted over the content and
  washed out text in the top-left corner.
- Used by `ServiceDetail` for its booking card.

## History

**Migrated 2026-09-26** (1/5 → full compliance):

- Defaults moved from `03.theming/_default.css` (`light-dark()`, unsupported on older iPad Safari,
  where the panel lost its background/border/shadow/highlight) into the component as light-only
  fallbacks. Dark-mode defaults dropped; see above.
- Removed four `--_*` vars that were pure pass-throughs of the public tokens.
- Radius, border width, backdrop filter and highlight angle/stop became public tokens.
- Highlight moved behind the content (see Notes).
- `section`/`article` now labelled via `useAriaLabelledById`; `headingId` exposed as a slot prop.
- `styleClassPassthrough` changes after mount are picked up.
