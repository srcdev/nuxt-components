# DashboardQuadGrid — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--dashboard-quad-grid-gap` | `2rem` | Gap between the four slot panels |
| `--dashboard-quad-grid-padding` | `2rem` | Padding inside each slot panel |
| `--dashboard-quad-grid-outline-width` | `0.1rem` | Slot panel outline width |
| `--dashboard-quad-grid-outline-colour` | `black` | Slot panel outline colour |
| `--dashboard-quad-grid-outline-offset` | `0` | Slot panel outline offset |
| `--dashboard-quad-grid-border-width` | `0` | Slot panel border width (off by default — the panel edge is drawn by the outline) |
| `--dashboard-quad-grid-border-colour` | `black` | Slot panel border colour, only visible once `--dashboard-quad-grid-border-width` is set |
| `--dashboard-quad-grid-border-radius` | `0.5rem` | Slot panel corner radius |
| `--dashboard-quad-grid-rule-width` | `0.1rem` | Width of the grid gap rule line (CSS Gap Decorations — see Notes) |
| `--dashboard-quad-grid-rule-colour` | `transparent` | Colour of the grid gap rule line, invisible by default |
| `--dashboard-quad-grid-rule-inset` | `0` | Inset of the grid gap rule line from the panel edges |

```css
.my-page {
  --dashboard-quad-grid-gap: 1.6rem;
  --dashboard-quad-grid-outline-colour: var(--theme-border);
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<DashboardQuadGrid style-class-passthrough="promo-quad-grid">...</DashboardQuadGrid>
```

## Notes

- The four-panel layout (mobile stack → tablet 2×3 → desktop 3×2 with slot1 spanning vertically)
  is structural, driven by fixed container-query breakpoints (`768px`, `1060px`) rather than
  tokens/props — this is a fixed dashboard shape, not a general-purpose grid. Use
  `LayoutGridByCols`/`LayoutGridByWidth` instead if you need an arbitrary column count.
- Responds to its own container width (`container-type: inline-size`), not the viewport.
- Also declares a `rule`/`rule-break`/`rule-inset` gap-decoration line between grid cells (the
  CSS Gap Decorations spec) via `--dashboard-quad-grid-rule-*` tokens. Browser support is limited
  as of 2026, so it's transparent by default and safe to ignore — set
  `--dashboard-quad-grid-rule-colour` to opt in where supported.
