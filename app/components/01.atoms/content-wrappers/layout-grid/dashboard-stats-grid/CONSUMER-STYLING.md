# DashboardStatsGrid — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--dashboard-stats-grid-gap` | `1.2rem` | Gap between panels, in every row |
| `--dashboard-stats-grid-panel-padding` | `1.2rem` | Padding inside each panel |
| `--dashboard-stats-grid-border-width` | `0.1rem` | Panel border width |
| `--dashboard-stats-grid-border-colour` | `light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%))` | Panel border colour |
| `--dashboard-stats-grid-border-radius` | `1.2rem` | Panel corner radius |

```css
.my-page {
  --dashboard-stats-grid-gap: 1.6rem;
  --dashboard-stats-grid-border-colour: var(--theme-border);
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<DashboardStatsGrid style-class-passthrough="quarterly-stats">...</DashboardStatsGrid>
```

## Notes

- Layout shape (top-row split into a multi-panel cluster + 2 static panels, bottom-row panel
  strip) is structural, driven by fixed container-query breakpoints (`680px`, `1024px`) rather
  than tokens/props.
- `topRowSlot1ItemCount` (default `6`) and `bottomRowItemCount` (default `4`) control how many
  dynamic slots are rendered in the top-row cluster and bottom row, not layout shape.
- Responds to its own container width (`container-type: inline-size`), not the viewport.
