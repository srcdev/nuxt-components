# AutoGrid Component

## Overview

`AutoGrid` is a responsive auto-fit CSS grid wrapper. It renders whatever named slots the consumer provides, auto-fitting columns to a minimum of `300px` each (or stepping 250/300/350px by container width with `is-responsive`). Column count and gap are controlled via CSS custom properties, making layout adjustments a single-line style override rather than a prop change.

---

## Slot pattern

Pass any number of named slots — the component renders each one in document order inside the grid.

```vue
<AutoGrid>
  <template #item-1><StatCard label="Revenue" value="£24,500" /></template>
  <template #item-2><StatCard label="Clients" value="142" /></template>
  <template #item-3><StatCard label="Bookings" value="38" /></template>
</AutoGrid>
```

When filling from a data array, use a dynamic slot name in a `v-for`:

```vue
<AutoGrid>
  <template v-for="(item, i) in stats" #[`item-${i}`] :key="i">
    <StatCard :label="item.label" :value="item.value" />
  </template>
</AutoGrid>
```

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form)       | Type                                        | Default | Notes                                         |
| -------------------------- | ------------------------------------------- | ------- | --------------------------------------------- |
| `tag`                      | `"div" \| "section" \| "article" \| "main"` | `"div"` | Use a semantic tag for page landmark regions. |
| `is-responsive`            | `boolean`                                   | `false` | Adds `.is-responsive`: column minimum steps small → default → large via `@container` queries at 768px / 1024px. Needs a `container-type: inline-size` ancestor. |
| `:style-class-passthrough` | `string \| string[]`                        | `[]`    | Extra CSS classes on the root element.        |

---

## CSS custom properties

Set these on the grid itself (`style`, passthrough class) or on any ancestor you own; they inherit
in. Full reference: `app/components/01.atoms/grids/auto-grid/CONSUMER-STYLING.md`.

| Property                           | Default | Notes                                                                        |
| ---------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `--auto-grid-gap`                  | `1rem`  | Grid gap between items.                                                      |
| `--auto-grid-min-col-size-default` | `300px` | Minimum column width when `is-responsive` is off; the 768px+ step when on.   |
| `--auto-grid-min-col-size-small`   | `250px` | `is-responsive` only: minimum column width below 768px container width.     |
| `--auto-grid-min-col-size-large`   | `350px` | `is-responsive` only: minimum column width at 1024px+ container width.      |

There is no `--auto-grid-min-col-size` token (an earlier version of this doc listed one; it never
existed in the component). Use `--auto-grid-min-col-size-default`.

> Changed 2026-09-27: the tokens used to be declared on `.auto-grid` itself, so ancestor values
> never landed. Defaults are now `var()` fallbacks at the point of use.

### Fixed column count

Override `grid-template-columns` directly — there is no single token for this:

```vue
<AutoGrid style="grid-template-columns: repeat(3, 1fr); --auto-grid-gap: 2.4rem;">
  ...
</AutoGrid>
```

### Narrower minimum item width

```vue
<AutoGrid style="--auto-grid-min-col-size-default: 180px;">
  ...
</AutoGrid>
```

---

## Usage examples

### Stat cards (default auto-fit)

```vue
<AutoGrid>
  <template #revenue>
    <div class="stat-card">
      <span class="stat-card-label">Revenue</span>
      <span class="stat-card-value">£24,500</span>
    </div>
  </template>
  <template #clients>
    <div class="stat-card">
      <span class="stat-card-label">Clients</span>
      <span class="stat-card-value">142</span>
    </div>
  </template>
</AutoGrid>
```

### Semantic section with an accessible name

`AutoGrid` has no heading concept of its own — its slots are arbitrary named items, not a
header + body — so it does **not** auto-generate `aria-labelledby` the way `PageRow` or
`ServiceSummary` do (an earlier version of this component did attempt to, and it produced a
guaranteed broken ARIA reference, since there was never any way to bind a heading to it). If
`tag="section"` needs an accessible name, pass `aria-label` directly:

```vue
<AutoGrid tag="section" aria-label="Practice stats">
  <template #item-1><div>Item 1</div></template>
  <template #item-2><div>Item 2</div></template>
</AutoGrid>
```

### Data-driven grid

```vue
<script setup lang="ts">
const stats = [
  { id: "revenue", label: "Revenue", value: "£24,500" },
  { id: "clients", label: "Clients", value: "142" },
  { id: "bookings", label: "Bookings", value: "38" },
];
</script>

<template>
  <AutoGrid>
    <template v-for="stat in stats" #[stat.id] :key="stat.id">
      <div class="stat-card">
        <span class="stat-card-label">{{ stat.label }}</span>
        <span class="stat-card-value">{{ stat.value }}</span>
      </div>
    </template>
  </AutoGrid>
</template>
```

---

## Accessibility

- `AutoGrid` never sets `aria-labelledby` automatically, regardless of `tag` — it has no heading
  to point to. Pass `aria-label` (or wrap it in a `PageRow`/other component that does own a
  heading) if a landmark tag needs an accessible name.
- No ARIA attributes are added by default for any `tag` value.

See [component-aria-landmark.md](../component-aria-landmark.md) for the full landmark pattern.

---

## Local style override scaffold

```vue
<AutoGrid :style-class-passthrough="['my-auto-grid']">
  ...
</AutoGrid>

<style>
/* ─── AutoGrid local overrides ──────────────────────────────────────
   Use CSS custom properties for layout, not utility classes.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.my-auto-grid {
  --auto-grid-min-col-size-default: 200px;
  --auto-grid-gap: 2rem;
}
</style>
```

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Slot names can be anything — semantic (`#revenue`) or indexed (`#item-0`). Document order determines render order.
- `--auto-grid-min-col-size-default` controls the minimum column width; `auto-fit` fills as many columns as will fit.
- To fix the column count, override `grid-template-columns` directly (e.g. `style="grid-template-columns: repeat(3, 1fr)"`) — there is no single token for this.
