# LayoutGridByCols Component

## Overview

`LayoutGridByCols` is a CSS grid layout wrapper that arranges content into a fixed number of equal-width columns. It uses **named dynamic slots** — the component renders whatever slots the consumer passes, in the order they appear. It collapses to a single column below a configurable breakpoint.

---

## Slot pattern

Pass any number of slots with any names. The component renders each one in document order inside the grid.

```vue
<LayoutGridByCols :column-count="3">
  <template #item-0><ServicesCard /></template>
  <template #item-1><ServicesCard /></template>
  <template #item-2><ServicesCard /></template>
</LayoutGridByCols>
```

When filling from a data array, use a dynamic slot name in a `v-for`:

```vue
<LayoutGridByCols :column-count="3">
  <template v-for="(item, i) in items" #[`item-${i}`] :key="i">
    <ServicesCard :data="item" />
  </template>
</LayoutGridByCols>
```

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:column-count`, `:single-col-below`, `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:column-count` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Number of equal-width columns above `single-col-below`. Minimum is 2. |
| `:gap` | `string` | `"1rem"` | Any valid CSS length or shorthand. |
| `:single-col-below` | `string` | `"768px"` | Container width below which the grid collapses to a single column. |
| `tag` | `"div" \| "section"` | `"div"` | Use `"section"` for semantic page regions. |
| `label` | `string` | `""` | Required when `tag="section"` — rendered as a visually-hidden `<p>` linked via `aria-labelledby`. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes on the root element. |

---

## Usage examples

### Two-column grid (default)

```vue
<LayoutGridByCols>
  <template #left>
    <p>Left cell</p>
  </template>
  <template #right>
    <p>Right cell</p>
  </template>
</LayoutGridByCols>
```

### Three-column card grid

```vue
<LayoutGridByCols :column-count="3" gap="2rem">
  <template #card-a><ServicesCard title="Card A" /></template>
  <template #card-b><ServicesCard title="Card B" /></template>
  <template #card-c><ServicesCard title="Card C" /></template>
</LayoutGridByCols>
```

### Section with accessible label

```vue
<LayoutGridByCols tag="section" label="Our team" :column-count="4" gap="1.6rem">
  <template #alice><TeamCard name="Alice" /></template>
  <template #bob><TeamCard name="Bob" /></template>
  <template #carol><TeamCard name="Carol" /></template>
  <template #dan><TeamCard name="Dan" /></template>
</LayoutGridByCols>
```

### Data-driven with v-for

```vue
<LayoutGridByCols :column-count="3">
  <template v-for="(item, i) in items" #[`item-${i}`] :key="i">
    <Card :data="item" />
  </template>
</LayoutGridByCols>
```

---

## Accessibility

- When `tag="section"`, the root element automatically receives `aria-labelledby` pointing to a visually-hidden `<p>` with the `label` value.
- Always provide a meaningful `label` when using `tag="section"`.
- When `tag="div"`, no label or ARIA attributes are added.

---

## Responsive behaviour

Uses **CSS container queries** (`container-type: inline-size`) — responds to its own container width, not the viewport.

- **Below `singleColBelow`**: single-column stacked layout.
- **At or above `singleColBelow`**: `columnCount`-column grid.

---

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. Delete the block if unused.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<LayoutGridByCols :style-class-passthrough="['my-grid']" :column-count="3">
  ...
</LayoutGridByCols>

<style>
/* ─── LayoutGridByCols local overrides ─────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.layout-grid-by-cols {
  &.my-grid {
    /* Colours */
    /* background: var(--brand-surface); */
  }
}
</style>
```

> **Note:** `gap` and `column-count` are prop-driven — use the props rather than CSS overrides for layout changes.

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- `column-count` is clamped to a minimum of 2 internally.
- `gap` accepts any CSS value including compound values like `"1rem 2rem"`.
- Slot names can be anything — semantic or indexed. Document order determines render order.
