# AutoGrid Component

## Overview

`AutoGrid` is a responsive auto-fit CSS grid wrapper. It renders whatever named slots the consumer provides, auto-fitting columns to a minimum of `250px` each. Column count and gap are controlled via CSS custom properties, making layout adjustments a single-line style override rather than a prop change.

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
| `:style-class-passthrough` | `string \| string[]`                        | `[]`    | Extra CSS classes on the root element.        |

---

## CSS custom properties

Override these via `style` attribute or a `styleClassPassthrough` class in a consuming `<style>` block.

| Property                  | Default  | Notes                                                                                    |
| ------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `--auto-grid-min-col-size` | `250px` | Minimum column width; browser auto-fits as many columns as will fit.                    |
| `--auto-grid-gap`          | `1rem`  | Grid gap between items.                                                                  |

### Fixed column count

Override `grid-template-columns` directly — there is no single token for this:

```vue
<AutoGrid style="grid-template-columns: repeat(3, 1fr); --auto-grid-gap: 2.4rem;">
  ...
</AutoGrid>
```

### Narrower minimum item width

```vue
<AutoGrid style="--auto-grid-min-col-size: 180px;">
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

### Semantic section with auto aria-labelledby

```vue
<AutoGrid tag="section">
  <!-- aria-labelledby is wired automatically via useAriaLabelledById -->
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

- When `tag` is `section`, `article`, or `main`, `aria-labelledby` is automatically set via `useAriaLabelledById`, pointing to a generated heading ID.
- When `tag="div"`, no ARIA attributes are added.
- Ensure a heading element with the matching ID is present inside the grid when using semantic tags.

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
.auto-grid {
  &.my-auto-grid {
    --auto-grid-min-col-size: 200px;
    --auto-grid-gap: 2rem;
  }
}
</style>
```

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Slot names can be anything — semantic (`#revenue`) or indexed (`#item-0`). Document order determines render order.
- `--auto-grid-min-col-size` controls the minimum column width; `auto-fit` fills as many columns as will fit.
- To fix the column count, override `grid-template-columns` directly (e.g. `style="grid-template-columns: repeat(3, 1fr)"`) — there is no single token for this.
