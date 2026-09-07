---
name: ClippedPanel
description: ClippedPanel fixed-size notched/cutout shape panel — props, variants, CSS tokens
type: reference
---

# ClippedPanel

## Overview

`ClippedPanel` renders its slot content inside a panel clipped to one of three fixed-size
notched shapes via `clip-path: path(...)`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "p" \| "span" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "main" \| "nav" \| "ul" \| "ol"` | `"div"` | Root element tag. |
| `variant` | `"square" \| "rectangle" \| "circle-cutout"` | `"square"` | Which fixed-size shape to clip to. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Variants

| Variant | Fixed size | Shape |
|---|---|---|
| `square` | 200×200px | Rounded square with a small pull-tab notch cut into the top edge. |
| `rectangle` | 300×200px | Same pull-tab notch shape, wider. |
| `circle-cutout` | 200×200px | Rounded square with a 50px-radius circular notch bitten out of the top-right corner. |

Each shape's `clip-path: path(...)` uses literal pixel coordinates matched to its fixed width —
see CONSUMER-STYLING.md for why these can't be resized via CSS.

## Basic usage

```vue
<ClippedPanel variant="square">
  <p>Panel content</p>
</ClippedPanel>

<ClippedPanel variant="circle-cutout" tag="section">
  <p>Panel content</p>
</ClippedPanel>
```

## CSS custom properties

| Property | Default | Controls |
|----------|---------|----------|
| `--clipped-panel-background-colour` | `light-dark(hsl(0, 0%, 96%), hsl(0, 0%, 12%))` | Panel background |
| `--clipped-panel-outline-colour` | `light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%))` | Outline colour and text/icon colour |
| `--clipped-panel-outline-width` | `1px` | Outline width |

## Notes

- `aspect-ratio: 1` is set on the shared `.clipped-panel` base class, so height tracks whatever
  `width` the active variant sets.
- Shape geometry (corner radii, notch size, overall dimensions) is fixed per variant — CSS custom
  properties can't be interpolated into a `path()` string. A new size/shape needs a new variant
  with its own `path()`, not a token override.
- 2026-09-07 migration: the previous `circle-cutout` variant shipped with an invalid, empty
  `clip-path: path("M Z")` that rendered no clip at all. It now has a real shape (described
  above). The unused `--_max-x-position`/`--_curve-radius` custom properties on `rectangle` were
  also removed — they were declared but never actually referenced by the hardcoded path string,
  so they did nothing.
