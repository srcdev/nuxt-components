---
name: MasonryGrid
description: MasonryGrid CSS-columns masonry layout — named dynamic slots (no count/data prop), itemMinWidth/gap/unit sizing, CSS token API
type: reference
---

# MasonryGrid

## Overview

`MasonryGrid` lays out slot content using CSS `columns` (a true masonry flow — items pack into
the shortest available column rather than a strict row-by-row grid). Every slot is wrapped in a
`.masonry-grid-item` div with `break-inside: avoid` so an item never splits across columns.

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
in sync**. The component iterates `$slots` and wraps each in a `.masonry-grid-item`:

```vue
<MasonryGrid>
  <template #item-1>...</template>
  <template #item-2>...</template>
  <template #item-3>...</template>
</MasonryGrid>
```

Slot names can be anything (`item-1`/`item-2` is just a convention, matching `AutoGrid`).

## Basic usage

```vue
<MasonryGrid :item-min-width="280" :gap="1.6">
  <template v-for="(photo, i) in photos" :key="photo.id" #[`item-${i}`]>
    <img :src="photo.src" :alt="photo.alt" />
  </template>
</MasonryGrid>
```

## CSS Token Customization

| Token | Falls back to | Controls |
|---|---|---|
| `--masonry-grid-item-border-colour` | `var(--theme-border)` | Outline colour around each item |
| `--masonry-grid-item-padding` | `1.2rem` | Inner padding of each item |

Column width and gap are controlled via the `itemMinWidth`/`gap`/`unit` props, not CSS custom
properties, since they need JS-computed values rather than being purely CSS-driven. See
`CONSUMER-STYLING.md` in the component folder.

## Notes

- **Breaking API change (this migration)**: earlier versions took a `gridData` object prop (an
  object keyed by item id, iterated with `v-for="item in gridData"` and `<slot :name="item.id">`)
  that duplicated what the slots already expressed. It's been replaced with plain named dynamic
  slots — `itemCount`/`gridData` were only ever used to generate the slot loop, which is exactly
  the case `.claude/skills/component-dynamic-slots.md` says to use named dynamic slots for (see
  `AutoGrid`/`GridStack`, the other two components in `01.atoms/grids/`, for the same pattern). No
  known consumer app was using the old prop shape at the time of this change — check before
  upgrading a consumer still on the old API.
- **Column count is not fixed**: `columns: auto <itemMinWidth>` lets the browser decide how many
  columns fit — there's no `columnCount` prop. Use `itemMinWidth` to influence it.
- Masonry ordering is left-to-right by column-fill in `columns` layout (an item goes into the
  current shortest column), not strictly top-to-bottom reading order — be aware of this if visual
  order matters for the specific content being laid out.
