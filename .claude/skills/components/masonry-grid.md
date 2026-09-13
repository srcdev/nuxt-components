---
name: MasonryGrid
description: MasonryGrid — real measured-height masonry layout (greedy shortest-column packing, animated resize), named dynamic slots, itemMinWidth/gap/fixedWidth/justify, CSS token API
type: reference
---

# MasonryGrid

## Overview

`MasonryGrid` is a genuine masonry layout: each item is measured (its real rendered height) and
placed into whichever column is currently shortest — a greedy bin-pack, the same technique
Pinterest-style layouts use. This is different from (and better than) laying items out with CSS
`columns`, which just fills one column's accumulated height before starting the next and has no
awareness of "shortest column."

Because placement follows natural DOM order directly (item 1 gets measured and placed first, then
item 2, etc.), there's no reordering trick needed to keep visual and reading order in sync — DOM
order *is* the packing order, so a screen reader or `Tab` key always encounters items 1, 2, 3...
in the order they were authored, regardless of which column each one's height ends up landing it
in visually.

**History**: this component absorbed the implementation from `MasonryGridOrdered` (now retired —
see **Migration history** below), replacing a CSS-`columns`-based reorder trick this component
used previously (see `git log` / `ColumnFlowGrid`'s history for that era).

## When to use this vs. `ColumnFlowGrid`

- Use **`ColumnFlowGrid`** (`.claude/skills/components/column-flow-grid.md`) when you don't need
  true masonry packing or animated reflow — a lighter CSS `columns`-only layout, no JS
  measurement, no resize animation.
- Use **`MasonryGrid`** when you want genuine Pinterest-style packing with items animating into
  new positions on resize.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | HTML element rendered as the root. |
| `itemMinWidth` | `number` | `300` | Minimum tile width in pixels — also the fixed tile width when `fixedWidth` is set. |
| `gap` | `number` | `12` | Gap between tiles in pixels. |
| `fixedWidth` | `boolean` | `false` | Keep every tile at exactly `itemMinWidth` instead of stretching to fill each column. |
| `justify` | `"left" \| "center" \| "right"` | `"left"` | How the block of tiles aligns within the wrapper — only visible when `fixedWidth` is set (tiles otherwise stretch to fill the full width, so there's nothing to align). |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slot API

Any named slot is accepted — there are no declared slot names, and **no count/data prop to keep
in sync**. Give slots in whatever order you want them read/tabbed through:

```vue
<MasonryGrid>
  <template #item-1>...</template>
  <template #item-2>...</template>
  <template #item-3>...</template>
</MasonryGrid>
```

## Basic usage

```vue
<MasonryGrid :item-min-width="280" :gap="16">
  <template v-for="(photo, i) in photos" :key="photo.id" #[`item-${i}`]>
    <img :src="photo.src" :alt="photo.alt" />
  </template>
</MasonryGrid>
```

### Fixed-width, centered

```vue
<MasonryGrid :fixed-width="true" justify="center" :item-min-width="240">
  <template v-for="(card, i) in cards" :key="card.id" #[`item-${i}`]>
    <Card v-bind="card" />
  </template>
</MasonryGrid>
```

## CSS Token Customization

| Token | Falls back to | Controls |
|---|---|---|
| `--masonry-grid-item-border-colour` | `var(--theme-border)` | Outline colour around each item |
| `--masonry-grid-item-padding` | `1.2rem` | Inner padding of each item |
| `--masonry-grid-transition-duration` | `0.3s` | How long an item takes to slide into its new position on resize |

Column width, gap, fixed-width mode, and alignment are controlled via props, not CSS custom
properties, since column count and item positions are computed in JS from measured pixel values.
See `CONSUMER-STYLING.md` in the component folder.

## Accessibility

- The resize/reflow animation (`--masonry-grid-transition-duration`) is wrapped in
  `@media (prefers-reduced-motion: no-preference)` — a visitor with reduced motion enabled sees
  items snap to their new position with no transition.
- DOM/tab order always matches slot authoring order (see Overview) — no additional ARIA is needed
  to communicate item order.

## Notes

- **How positioning works**: on mount and on every measured resize, each item is read (`item.
  offsetHeight`) in DOM order and placed at the top of whichever column currently has the least
  accumulated height, via inline `--_position-top`/`--_position-left`/`--_element-width` custom
  properties the component sets directly (not part of the public token API — these are internal
  positioning state, not a styling surface). Column steps are computed in real pixels
  (`itemWidth + gap`) rather than equal percentage slots of the container — a percentage slot only
  matches the item's actual width when the item stretches to fill it (the default, non-`fixedWidth`
  case); with `fixedWidth`, `justify`'s left/center/right offset is also computed here in JS
  (`(wrapperWidth - totalContentWidth) / 2` for `center`, etc.), not via CSS `justify-content` —
  that property has no effect on children once `position: absolute` takes them out of grid flow,
  so it doesn't work here regardless of how it's set.
- **Single-column fallback**: below the width needed for a second `itemMinWidth` column plus gap,
  items render in normal CSS Grid flow (no absolute positioning) at a single, always-full-width
  column (`grid-template-columns: 1fr`, ignoring `itemMinWidth` entirely) — there's nothing to
  pack with only one column, so it always just fills the container rather than applying
  `itemMinWidth`'s floor. `itemMinWidth` starts governing column width only once there's an actual
  multi-column choice to make (two columns up).
- **Column count is a JS estimate**: `Math.floor(measuredWidth / (itemMinWidth + gap))`. This
  drives an underlying CSS Grid (`grid-template-columns`, with `768px`/`1024px`/`1280px` container
  query breakpoints) as a no-JS-yet initial layout, which JS then overrides with absolute
  positioning once it has real measurements — so there's no flash of unstyled/overlapping content
  before the first `updateGrid()` run.
- **Images without explicit dimensions** will change height after they load, but nothing currently
  re-triggers a re-pack when that happens (only container resize does) — a known limitation
  inherited from the original implementation. Set explicit `width`/`height` on images inside slots
  to avoid this, or file a follow-up if it becomes a real problem.
- **Migration history**: this component's algorithm was ported from `MasonryGridOrdered`
  (`app/components/masonry-grid-ordered/MasonryGridOrdered.vue`), which is now retired along with
  its `MasonryGridOrderedGridExperiment` sibling (an abandoned, more fragile alternative that
  inferred CSS Grid's own auto-placement via `index % columnCount` rather than genuine shortest-
  column packing — never used it). The port modernized typed props (dropped the unused
  `mobilePreferredColCount` prop, and the CSS-string-with-validator `justify` prop became a real
  union type), promoted CSS custom properties to a proper public token API, added
  `prefers-reduced-motion` handling (missing before), and removed a redundant second
  `useResizeObserver` call that duplicated the one `useElementSize` already sets up internally. It
  also replaced `MasonryGrid`'s own previous CSS-`columns`-based reorder-trick implementation,
  which is now `ColumnFlowGrid` (`.claude/skills/components/column-flow-grid.md`). No known
  consumer app was using any of the old APIs/names.
- **Found after the port, via manual testing**: the original's `--_position-left` used equal
  percentage slots (`minIndex * (100 / columnCount)%`) for every mode. That's fine when items
  stretch to fill their slot, but with `fixedWidth` the item is narrower than its slot, so the
  unused slot space showed up as a much bigger gap than the `gap` prop actually specified — it
  visually looked like `justify-content: space-between`. Also, the CSS `justify-content` the port
  initially added (see above) turned out to be entirely dead: it has no effect on children once
  `position: absolute` removes them from grid flow, so `justify` never did anything either.
  Fixed by computing both column steps and the `justify` offset in real pixels in JS (see **How
  positioning works** above) instead of relying on CSS for either.
- **Found after that, testing narrow/mobile viewports**: the single-column CSS fallback template
  was `minmax(itemMinWidth, 1fr)`, same as every other breakpoint — on a container narrower than
  `itemMinWidth`, that floor fought the container instead of just filling it, producing a
  non-full-width, misaligned single column. Fixed by making the single-column template a plain
  `1fr` unconditionally (see **Single-column fallback** above) — `itemMinWidth` never had a
  multi-column decision to inform in that case anyway.
