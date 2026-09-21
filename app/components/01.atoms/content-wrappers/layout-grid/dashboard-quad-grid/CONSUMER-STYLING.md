# DashboardQuadGrid — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--dashboard-quad-grid-gap` | `2rem` | Gap between the four slot panels |
| `--dashboard-quad-grid-padding` | `2rem` | Padding inside each slot panel |
| `--dashboard-quad-grid-outline-width` | `0.1rem` | Slot panel outline width |
| `--dashboard-quad-grid-outline-colour` | `light-dark(black, white)` | Slot panel outline colour |
| `--dashboard-quad-grid-border-radius` | `0.5rem` | Slot panel corner radius |

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
