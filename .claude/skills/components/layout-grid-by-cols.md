# LayoutGridByCols Component

## Overview

`LayoutGridByCols` is a CSS grid layout wrapper that arranges content into a fixed number of equal-width columns. The number of items is controlled by the `itemCount` prop — content is filled via **dynamic named slots** (`item-0`, `item-1`, etc.). It collapses to a single column below a configurable breakpoint.

This is a **parent/layout component**. It does not drive its slots from data — slots must be manually declared in the consuming template, one per grid cell.

---

## Dynamic slot pattern

`LayoutGridByCols` generates slots based on `itemCount`. For `itemCount="3"` the following slots exist:

| Slot | Purpose |
|------|---------|
| `#item-0` | Content of the first grid cell |
| `#item-1` | Content of the second grid cell |
| `#item-2` | Content of the third grid cell |

**Rules:**
- Slots are always **zero-indexed**: first cell = `item-0`, last cell = `item-{itemCount - 1}`.
- Always set `itemCount` to match the exact number of `#item-*` slots you provide — mismatches will render empty grid cells.
- Slots are **not data-driven**. Each `<template #item-N>` must be written out manually in the parent template.
- Slot content can be any component or markup — there are no restrictions on what goes inside.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names in hyphenated form in templates: `:item-count`, `:column-count`, `:single-col-below`, `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:item-count` | `number` | — | **Required.** Controls how many grid cells are rendered and which slots exist. |
| `:column-count` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Number of equal-width columns at widths above `single-col-below`. Minimum is 2. |
| `:gap` | `string` | `"1rem"` | Any valid CSS length or shorthand — gap between grid cells. |
| `:single-col-below` | `string` | `"768px"` | Container width below which the grid collapses to a single column. |
| `tag` | `"div" \| "section"` | `"div"` | Semantic element for the root. Use `"section"` for thematic page regions. |
| `label` | `string` | `""` | Accessible label for the section. **Required when `tag="section"`** — rendered as a visually-hidden `<p>` linked via `aria-labelledby`. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root element. |

---

## Usage examples

### Two-column grid (default)

```vue
<LayoutGridByCols :item-count="2">
  <template #item-0>
    <p>Left cell content</p>
  </template>
  <template #item-1>
    <p>Right cell content</p>
  </template>
</LayoutGridByCols>
```

### Three-column card grid

```vue
<LayoutGridByCols :item-count="3" :column-count="3" gap="2rem">
  <template #item-0>
    <ServicesCard :title="'Card A'" />
  </template>
  <template #item-1>
    <ServicesCard :title="'Card B'" />
  </template>
  <template #item-2>
    <ServicesCard :title="'Card C'" />
  </template>
</LayoutGridByCols>
```

### Section with accessible label

```vue
<LayoutGridByCols
  tag="section"
  label="Our team"
  :item-count="4"
  :column-count="4"
  gap="1.6rem"
>
  <template #item-0><TeamCard name="Alice" /></template>
  <template #item-1><TeamCard name="Bob" /></template>
  <template #item-2><TeamCard name="Carol" /></template>
  <template #item-3><TeamCard name="Dan" /></template>
</LayoutGridByCols>
```

### Custom breakpoint

```vue
<LayoutGridByCols :item-count="3" :column-count="3" single-col-below="600px">
  <template #item-0><p>Stacks earlier on narrow screens</p></template>
  <template #item-1><p>Cell 2</p></template>
  <template #item-2><p>Cell 3</p></template>
</LayoutGridByCols>
```

---

## Accessibility

- When `tag="section"`, the root element automatically receives `aria-labelledby` pointing to a visually-hidden `<p>` with the `label` prop value.
- If `tag="section"` is used without a `label` prop, a fallback message `"If tag='section' then a label is required"` is rendered — always provide a meaningful label.
- When `tag="div"`, no label or ARIA attributes are added.

---

## Responsive behaviour

The component uses **CSS container queries** (`container-type: inline-size`) rather than viewport media queries. This means it responds to the width of its own container, not the viewport. Behaviour is consistent whether nested inside a narrow `LayoutRow` or a full-width section.

- **Below `singleColBelow`**: single-column stacked layout.
- **At or above `singleColBelow`**: `columnCount`-column grid.

---

## How to use this skill

When a developer asks to use `LayoutGridByCols`:

1. **Ask how many cells** are needed — this sets both `itemCount` and `columnCount`.
2. **Ask what goes in each cell** — the slots are not data-driven; each must be written individually.
3. **Ask about `tag`** — `"section"` for semantic page regions (and prompt for a `label`), `"div"` for layout-only use.
4. **Ask about `gap`** and whether the default `768px` breakpoint suits the design.
5. **Write out each `#item-N` slot manually** — never generate them in a `v-for` loop in the parent template.

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Slot names are **zero-indexed** — `#item-0` not `#item-1`.
- `column-count` is clamped to a minimum of `2` internally — passing `1` has no effect.
- `gap` accepts any CSS value including compound values like `"1rem 2rem"` (row-gap column-gap).
- The inner grid div `.layout-grid-inner` has `container-type: inline-size` — child components can use CSS container queries relative to the cell width.
- **Prop hyphenation**: ESLint (`vue/attribute-hyphenation`) requires camelCase props to be written in hyphenated form in templates. Always use `:item-count`, `:column-count`, `:single-col-below`, `:style-class-passthrough` — never the camelCase equivalents.
- **Linting workflow**: If there are ESLint auto-fixable issues in a file you've just edited, ask the developer to save the file and let the IDE auto-fix run before attempting any manual corrections.
