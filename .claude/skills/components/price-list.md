# PriceList Component

## Overview

`PriceList` (`app/components/02.molecules/price-list/`) renders a service/menu-style price list:
one or more columns, each with a heading (optional icon) and a `<dl>` of description/price rows.
Columns stack below `48em` and sit two-up above it. Not a SaaS plan comparison, use `PricingCard`
for that.

---

## Props reference

> **Hyphenation rule**: write camelCase props hyphenated in templates (`:price-list-data`).

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `:price-list-data` | `PriceListData[]` | (required) | One entry per column |
| `heading-tag` | `"h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h2"` | Heading level for column titles; match the page outline |
| `from-label` | `string` | `"from"` | Text before a price whose item has `from: true`. Pass a translated string for i18n |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root; reactive |

### Data shape

Importable: `import type { PriceListData, PriceItem } from "srcdev-nuxt-components"`
(source: `app/types/components/price-list.d.ts`).

```ts
interface PriceItem {
  description: string;
  price: string;   // pre-formatted, e.g. "£45"
  from?: boolean;  // prefix with fromLabel
}

interface PriceListData {
  headingtext: string;   // note: lower-case "t"
  headingIcon?: string;  // Iconify name, e.g. "lucide:sparkles"
  items: PriceItem[];
}
```

No slots, no events.

---

## Semantics

- Column titles are `HeroText` headings at `heading-tag`. Prices are plain `<span>`s inside `<dd>`,
  not headings (before 2026-09-27 each price was an `<h2>`, which flooded the heading outline).
- Rows are `<div>`-wrapped `<dt>`/`<dd>` pairs, valid inside `<dl>`.

---

## Styling

All tokens are `--price-list-*`; full table in `CONSUMER-STYLING.md` next to the component.
Common ones: `--price-list-divider-colour`, `--price-list-divider-opacity`,
`--price-list-price-font-size`, `--price-list-heading-margin-block-end`.

---

## Usage

```vue
<PriceList :price-list-data="priceListData" :style-class-passthrough="['mbe-20']" />
```

Nested under an existing `h2` section heading:

```vue
<PriceList :price-list-data="priceListData" heading-tag="h3" from-label="ab" />
```
