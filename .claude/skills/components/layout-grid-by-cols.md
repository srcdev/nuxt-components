# LayoutGridByCols Component

## Overview

`LayoutGridByCols` is a CSS grid layout wrapper that arranges content into a fixed number of equal-width columns. It uses **named dynamic slots** — the component renders whatever slots the consumer passes, in the order they appear. It collapses to a single column when the grid is narrower than a configurable threshold.

For columns that auto-fit by a minimum width instead of a fixed count, use `AutoGrid`.

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

The three layout props have **no default**. When passed, each writes its public token inline on the root (so it beats CSS). When omitted, the token comes from CSS, falling back to the default shown.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:column-count` | `2 \| 3 \| 4 \| 5 \| 6` | unset (CSS `2`) | Equal columns above the threshold. Clamped to a minimum of 2. Writes `--layout-grid-by-cols-column-count`. |
| `gap` | `string` | unset (CSS `1rem`) | Row and column gap, a **single** CSS length. Writes `--layout-grid-by-cols-gap`. |
| `single-col-below` | `string` | unset (CSS `768px`) | Grid width below which it becomes one column. `"0px"` never collapses. Writes `--layout-grid-by-cols-single-col-below`. |
| `tag` | `"div" \| "section"` | `"div"` | Use `"section"` for semantic page regions. |
| `label` | `string` | `""` | Accessible name when `tag="section"`, rendered as a visually hidden `<p>` linked via `aria-labelledby`. |
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

### Column count from CSS (responsive)

Leave `column-count` off and set the token:

```vue
<LayoutGridByCols style-class-passthrough="team-grid">...</LayoutGridByCols>
```

```css
.team-grid {
  --layout-grid-by-cols-column-count: 2;

  @media (width >= 1024px) {
    --layout-grid-by-cols-column-count: 4;
  }
}
```

---

## Accessibility

- When `tag="section"` and `label` is set, the root gets `aria-labelledby` pointing to a visually hidden `<p>` with the label.
- A `section` without a `label` gets no `aria-labelledby` and no hidden text; `useAriaLabelledById` logs a dev console warning. Always pass a meaningful `label` with `tag="section"`.
- When `tag="div"`, no label or ARIA attributes are added.

---

## Responsive behaviour

The collapse compares the **grid's own width** (not the viewport) with the threshold, like a container query, but without one: it's a `repeat(auto-fill, minmax(...))` calculation, which is what lets the threshold be a CSS token. See `CONSUMER-STYLING.md` for the sizing model and full token list.

- **Narrower than `singleColBelow`**: single column.
- **At or wider**: `columnCount` equal columns.

---

## Styling

Tokens: `--layout-grid-by-cols-column-count`, `-single-col-below`, `-gap`, `-row-gap`, `-column-gap`. Classes: `.layout-grid-by-cols`, `.layout-grid-by-cols-inner`. Full detail in `CONSUMER-STYLING.md` next to the component; overrides follow [component-local-style-override.md](../component-local-style-override.md).

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Slot names can be anything — semantic or indexed. Document order determines render order.
- 2026-09-27 migration: `singleColBelow` never worked before (the breakpoint was a hardcoded `768px` container query); it does now. `gap`/`columnCount` moved from `v-bind()` to public tokens, and the layout props lost their defaults (defaults now live in CSS). A `section` without a `label` used to read the placeholder "If tag='section' then a label is required" to screen readers; it now renders nothing and relies on the composable's dev warning. `gap` must be a single length (compound values were claimed before but break the column calculation). Inner class `.layout-grid-inner` → `.layout-grid-by-cols-inner`; root no longer a `layoutGrid` size container. No consumer app used the component at the time.
