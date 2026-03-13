# PageHeroHighlights Component

## Overview

`PageHeroHighlights` is a page-level layout template that creates a "hero + highlights strip" grid. It has:

- A **header zone** — full edge-to-edge background, content drives the row height
- A **highlights strip** — straddles the header/content boundary (overlaps both), sits above via `z-index`
- A **content zone** — background fills behind the highlights strip, actual content sits below it

The layout uses a 4-row CSS Grid with `subgrid` — no `translate`, negative margins, or absolute positioning.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "main"` | `"div"` | Root element tag |
| `highlightsEqualWidths` | `boolean` | `false` | Equal-width grid columns for highlight items |
| `highlightsJustify` | `"start" \| "center" \| "end" \| "space-between" \| "space-around"` | `"start"` | Alignment of highlight items along the main axis |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root element |

## Slots

| Slot | Slot props | Purpose |
|------|-----------|---------|
| `header` | `{ headingId: string }` | Header zone — text, title, subtitle |
| `highlights` | — | Highlight cards in the strip |
| `content` | — | Page body content below the strip |

## Basic usage

```vue
<PageHeroHighlights>
  <template #header>
    <p class="page-heading-1">Dashboard</p>
    <p class="page-body-normal">Overview of your account activity.</p>
  </template>

  <template #highlights>
    <div class="card">Total Revenue: £24,500</div>
    <div class="card">Active Users: 1,284</div>
    <div class="card">Open Tasks: 37</div>
  </template>

  <template #content>
    <p class="page-heading-2">Recent Activity</p>
  </template>
</PageHeroHighlights>
```

## With aria-labelledby (section tag)

When `tag="section"`, `aria-labelledby` is set automatically. Wire the heading id via the scoped slot prop:

```vue
<PageHeroHighlights tag="section">
  <template #header="{ headingId }">
    <h1 :id="headingId" class="page-heading-1">Dashboard</h1>
  </template>
  ...
</PageHeroHighlights>
```

See [component-aria-landmark.md](../component-aria-landmark.md) for the full pattern.

## Equal-width highlights

By default, highlight items size to their content (`flex-wrap`). Pass `:highlights-equal-widths="true"` to switch to a grid where all items share equal column widths:

```vue
<PageHeroHighlights :highlights-equal-widths="true">
  ...
</PageHeroHighlights>
```

## Background colour theming

The header and content zones expose CSS custom properties — set them inline via `:style` or in a scoped stylesheet:

```vue
<PageHeroHighlights :style="{ '--phl-header-bg': '#1a1a2e', '--phl-content-bg': '#f5f5f5' }">
```

| Custom property | Zone |
|----------------|------|
| `--phl-header-bg` | Header background |
| `--phl-content-bg` | Content/highlights background |

## Grid structure (reference)

```
col:  [gutter] [centre] [gutter]
row1: header content (height driven by slot)
row2: highlights top half  ← highlights spans rows 2–3, z-index: 1
row3: highlights bottom half
row4: page content (never underflows highlights)
```

`.header` spans cols 1–3, rows 1–2 (edge-to-edge bg).
`.content` spans cols 1–3, rows 3–4 (bg fills behind highlights; `.content-inner` is placed in row 4 only).

## Layout pitfall: do not use `grid-template-rows: subgrid` inside `.highlights`

The `.highlights` element spans rows 2–3 of the parent grid (the "straddle"). If you add an inner grid to `.highlights` (e.g. to extend `equal-widths` behaviour) and include `grid-template-rows: subgrid`, auto-placed items will only occupy row 1 of the subgrid (= parent row 2). Parent row 3 collapses to 0-height, destroying the straddle effect — `.content` appears immediately below the highlights instead of overlapping it.

```css
/* ❌ — breaks the straddle when items are auto-placed by column flow */
&.equal-widths {
  display: grid;
  grid-template-rows: subgrid; /* row 3 collapses */
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
}

/* ✅ — single implicit row; items stretch to fill combined height of rows 2–3 */
&.equal-widths {
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
}
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- Lives in `app/components/04.templates/page-hero-highlights/`.
- Storybook title: `"Templates/PageHeroHighlights"`.
