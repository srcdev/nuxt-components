---
name: ColumnFlowGrid
description: ColumnFlowGrid CSS multi-column (columns) text-flow layout — named dynamic slots (no count/data prop), itemMinWidth/gap/unit sizing, CSS token API. Not a true masonry — see MasonryGrid for that.
type: reference
---

# ColumnFlowGrid

## Overview

`ColumnFlowGrid` lays out slot content using CSS `columns` (the "multi-column" text-flow module —
the same mechanism newspaper-style text layouts use). Every slot is wrapped in a
`.column-flow-grid-item` div with `break-inside: avoid` so an item never splits across columns.

**Renamed from `MasonryGrid`** during this compliance pass — despite the old name, this component
doesn't do anything masonry-specific: it's CSS `columns` and nothing else, with items simply
flowing into whichever column is currently shortest **in DOM order**, not reordered for reading.
See **Which one do I want?** below.

## Which one do I want? (`ColumnFlowGrid` vs `MasonryGrid`)

| | Technique | DOM/reading order | Column heights | Resize behaviour |
|---|---|---|---|---|
| `ColumnFlowGrid` | CSS `columns` | Column-major (as authored) | Uneven, CSS-native column-fill | Instant, native — no JS |
| `MasonryGrid` | JS-measured, greedy shortest-column packing | Natural (as authored — no reorder needed) | Uneven, genuinely bin-packed | Animated (items slide into new positions) |

Use **`ColumnFlowGrid`** when you just want cheap CSS-only column flow and don't need real
masonry packing or a resize animation — nothing here is measured or JS-driven at all, so it's the
lighter option. Use **`MasonryGrid`** (`.claude/skills/components/masonry-grid.md`) for genuine
Pinterest-style packing (each item placed into whichever column is currently shortest) with
animated reflow on resize.

`MasonryGridOrdered` (a third, JS-measured sibling that predated this pair) has been retired — its
implementation was absorbed into `MasonryGrid` directly. See `masonry-grid.md`'s migration history
note for details.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | HTML element rendered as the root. |
| `itemMinWidth` | `number` | `300` | Minimum column width in pixels — drives `columns: auto <value>px`. |
| `gap` | `number` | `1.2` | Gap between columns/items, in `unit`. |
| `unit` | `string` | `"rem"` | CSS unit applied to `gap`. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slot API

Any named slot is accepted — there are no declared slot names, and **no count/data prop to keep
in sync**. The component iterates `$slots` and wraps each in a `.column-flow-grid-item`:

```vue
<ColumnFlowGrid>
  <template #item-1>...</template>
  <template #item-2>...</template>
  <template #item-3>...</template>
</ColumnFlowGrid>
```

Slot names can be anything (`item-1`/`item-2` is just a convention, matching `AutoGrid`).

## Basic usage

```vue
<ColumnFlowGrid :item-min-width="280" :gap="1.6">
  <template v-for="(photo, i) in photos" :key="photo.id" #[`item-${i}`]>
    <img :src="photo.src" :alt="photo.alt" />
  </template>
</ColumnFlowGrid>
```

## CSS Token Customization

| Token | Falls back to | Controls |
|---|---|---|
| `--column-flow-grid-item-border-colour` | `var(--theme-border)` | Outline colour around each item |
| `--column-flow-grid-item-padding` | `1.2rem` | Inner padding of each item |

Column width and gap are controlled via the `itemMinWidth`/`gap`/`unit` props, not CSS custom
properties, since they need JS-computed values rather than being purely CSS-driven. See
`CONSUMER-STYLING.md` in the component folder.

## Notes

- **Renamed from `MasonryGrid`** (2026-09-13) — see **Which one do I want?** above for why. If you
  have consumer code importing this as `MasonryGrid`, it needs updating to `ColumnFlowGrid`; the
  props and behaviour are otherwise unchanged. CSS classes/tokens were renamed to match
  (`masonry-grid-*` → `column-flow-grid-*`).
- **Column count is not fixed**: `columns: auto <itemMinWidth>` lets the browser decide how many
  columns fit — there's no `columnCount` prop. Use `itemMinWidth` to influence it.
- Item ordering is left-to-right by column-fill in `columns` layout (an item goes into the current
  shortest column), not top-to-bottom reading order — be aware of this if visual order matters for
  the specific content being laid out. This is the exact distinction `MasonryGrid` exists to solve.
