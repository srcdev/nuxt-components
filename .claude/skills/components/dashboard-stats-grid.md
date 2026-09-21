# DashboardStatsGrid Component

## Overview

`DashboardStatsGrid` (renamed from `LayoutGridB`) is a dashboard layout combining a multi-panel
top row (a cluster of small stat/summary panels plus two static side panels) with a strip of
panels in the bottom row. Item counts in the two dynamic clusters are prop-driven; the two static
top-row slots and overall shape are fixed.

---

## Slot pattern

- `top-row-slot1-{n}-content` — dynamic, `n` from `1` to `topRowSlot1ItemCount`
- `top-row-slot-2` — static
- `top-row-slot-3` — static
- `bottom-row-{n}-content` — dynamic, `n` from `1` to `bottomRowItemCount`

```vue
<DashboardStatsGrid :top-row-slot1-item-count="3" :bottom-row-item-count="2">
  <template #top-row-slot1-1-content><StatCard label="Uptime" value="98.5%" /></template>
  <template #top-row-slot1-2-content><StatCard label="Users" value="1,247" /></template>
  <template #top-row-slot1-3-content><StatCard label="Latency" value="342ms" /></template>

  <template #top-row-slot-2><FeaturedPanel /></template>
  <template #top-row-slot-3><InfoPanel /></template>

  <template #bottom-row-1-content><FeaturePanel /></template>
  <template #bottom-row-2-content><FeaturePanel /></template>
</DashboardStatsGrid>
```

---

## Props reference

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:top-row-slot1-item-count` | `number` | `6` | Number of dynamic panels rendered in the top-row cluster (`top-row-slot1-{n}-content`). |
| `:bottom-row-item-count` | `number` | `4` | Number of dynamic panels rendered in the bottom row (`bottom-row-{n}-content`). |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes on the root element. |

---

## Responsive behaviour

Uses **CSS container queries** (`container-type: inline-size`) — responds to its own container
width, not the viewport.

- **Top row, below 1024px**: `slot1` cluster, `slot2`, `slot3` stack vertically.
- **Top row, ≥1024px**: two-column layout — `slot1` cluster + `slot3` on the left
  (`minmax(46rem, 33%)` on the right for `slot2`), with `slot2` spanning both rows on the right.
- **`slot1` cluster, below 680px**: 2 columns.
- **`slot1` cluster, ≥680px**: 3 columns.
- **Bottom row**: always a fixed 2-column grid regardless of container width.

This shape is structural — there is no prop to reconfigure it.

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/01.atoms/content-wrappers/layout-grid/dashboard-stats-grid/CONSUMER-STYLING.md).

| Token | Default | Controls |
|---|---|---|
| `--dashboard-stats-grid-gap` | `1.2rem` | Gap between panels, in every row |
| `--dashboard-stats-grid-panel-padding` | `1.2rem` | Padding inside each panel |
| `--dashboard-stats-grid-border-width` | `0.1rem` | Panel border width |
| `--dashboard-stats-grid-border-colour` | `light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%))` | Panel border colour |
| `--dashboard-stats-grid-border-radius` | `1.2rem` | Panel corner radius |

---

## Local style override scaffold

```vue
<DashboardStatsGrid :style-class-passthrough="['my-grid']">
  ...
</DashboardStatsGrid>

<style>
.dashboard-stats-grid {
  &.my-grid {
    --dashboard-stats-grid-gap: 1.6rem;
  }
}
</style>
```

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Renamed from `LayoutGridB` during the 2026-09-21 compliance migration; previously lived
  unplaced at `app/components/layout-grids/LayoutGridB.vue` with options-style props. Its old
  `--_color` custom property was dead code (declared, never consumed) and was removed rather than
  promoted; `--_gap`/`--_border-color` had no public fallback and are now
  `--dashboard-stats-grid-gap`/`--dashboard-stats-grid-border-colour`.
