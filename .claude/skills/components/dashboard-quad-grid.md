# DashboardQuadGrid Component

## Overview

`DashboardQuadGrid` (renamed from `LayoutGridA`) is a fixed 4-panel dashboard layout. Unlike
`LayoutGridByCols`/`LayoutGridByWidth`, it does not take a column-count prop — it has four
**named** slots (`slot1`–`slot4`) with a fixed responsive arrangement that changes shape (not
just column count) across breakpoints, designed for dashboard-style layouts (one primary panel
plus three supporting panels).

---

## Slot pattern

Exactly four fixed slot names — `slot1`, `slot2`, `slot3`, `slot4`. Not dynamic; each is a named
slot with a specific position in the layout at each breakpoint.

```vue
<DashboardQuadGrid>
  <template #slot1><ArticleCard /></template>
  <template #slot2><StatsPanel /></template>
  <template #slot3><QuickActions /></template>
  <template #slot4><ActivityFeed /></template>
</DashboardQuadGrid>
```

---

## Props reference

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes on the root element. |

---

## Responsive behaviour

Uses **CSS container queries** (`container-type: inline-size`) on the wrapper — responds to its
own container width, not the viewport.

- **Below 768px**: all four slots stack vertically in order (slot1 → slot2 → slot3 → slot4).
- **768px–1059px**: 2-column, 3-row grid. `slot1` and `slot2` each span the full width (rows 1
  and 2); `slot3`/`slot4` sit side by side in row 3.
- **≥1060px**: 3-column, 2-row grid. `slot1` spans vertically down the left column; `slot2` spans
  horizontally across the top-right; `slot3`/`slot4` sit in the bottom-right.

This shape is structural — there is no prop to reconfigure it. If you need an arbitrary
column count instead, use `LayoutGridByCols`/`LayoutGridByWidth`.

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/01.atoms/content-wrappers/layout-grid/dashboard-quad-grid/CONSUMER-STYLING.md).

| Token | Default | Controls |
|---|---|---|
| `--dashboard-quad-grid-gap` | `2rem` | Gap between the four slot panels |
| `--dashboard-quad-grid-padding` | `2rem` | Padding inside each slot panel |
| `--dashboard-quad-grid-outline-width` | `0.1rem` | Slot panel outline width |
| `--dashboard-quad-grid-outline-colour` | `light-dark(black, white)` | Slot panel outline colour |
| `--dashboard-quad-grid-border-radius` | `0.5rem` | Slot panel corner radius |

---

## Local style override scaffold

```vue
<DashboardQuadGrid :style-class-passthrough="['my-grid']">
  ...
</DashboardQuadGrid>

<style>
.dashboard-quad-grid-wrapper {
  &.my-grid {
    --dashboard-quad-grid-gap: 1.6rem;
  }
}
</style>
```

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Renamed from `LayoutGridA` during the 2026-09-21 compliance migration; previously lived
  unplaced at `app/components/layout-grids/LayoutGridA.vue` with options-style props and no
  public CSS tokens (its geometry values were hardcoded px literals).
- For a generic, arbitrary-column-count grid, use `LayoutGridByCols`/`LayoutGridByWidth` instead
  — this component's 4-slot shape is fixed and specifically dashboard-oriented.
