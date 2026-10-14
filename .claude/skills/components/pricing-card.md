# PricingCard Component

## Overview

`PricingCard` (`app/components/02.molecules/pricing-card/`) renders a pricing plan card: plan name,
price, billing period, description, feature list and a call-to-action button. `is-highlighted`
adds a "Most Popular" badge plus a scaled, emphasised border; `ribbon-text` adds a diagonal corner
ribbon. The CTA can be replaced through the `#cta` slot. Styling tokens:
`app/components/02.molecules/pricing-card/CONSUMER-STYLING.md`.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form)       | Type                                   | Default          | Notes |
| -------------------------- | -------------------------------------- | ---------------- | ----- |
| `tag`                      | `"div" \| "section" \| "article"`      | `"article"`      | Root element. Always labelled by the plan name heading (`aria-labelledby`). |
| `heading-tag`              | `"h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"`           | Heading level for the plan name; pick to fit the page outline. |
| `plan-name`                | `string`                               | (required)       | Plan name. |
| `:price`                   | `number`                               | (required)       | Whole numbers show as-is, fractional ones to two decimals (`9.5` → `9.50`). A non-finite value shows nothing. |
| `currency-symbol`          | `string`                               | `"$"`            | Literal prefix; no locale formatting. Pass `""` for none. |
| `billing-period`           | `string`                               | `"one-time"`     | Shown after the price; `""` hides it. |
| `description`              | `string`                               | `undefined`      | Short plan description. |
| `:features`                | `string[]`                             | `[]`             | Rendered as a checkmark list (checkmark hidden from screen readers). |
| `:is-highlighted`          | `boolean`                              | `false`          | Badge, highlight border/shadow, and `scale(1.05)`. |
| `badge-text`               | `string`                               | `"Most Popular"` | Badge copy; pass a translated string for i18n. |
| `cta-text`                 | `string`                               | `"Get started"`  | Default button label. |
| `:cta-disabled`            | `boolean`                              | `false`          | Sets the default button to `readonly`/`aria-disabled`. |
| `ribbon-text`              | `string`                               | `undefined`      | Corner ribbon copy; unset for no ribbon. Caps at two lines (`--pricing-card-ribbon-line-clamp`). |
| `:style-class-passthrough` | `string \| string[]`                   | `[]`             | Extra classes on the root. |

All visitor-facing copy (`badge-text`, `cta-text`, `billing-period`) is a prop, so pass strings from
your own i18n solution.

---

## Events

| Event    | Payload            | Notes |
| -------- | ------------------ | ----- |
| `select` | `planName: string` | Emitted when the default CTA is clicked, or when a `#cta` slot calls `onSelect`. |

---

## Slots

### `#features`

Replaces the default `<li>` list. Your content goes inside the component's `<ul>`, so render `<li>`
elements. `--pricing-card-feature-line-clamp` and the checkmark only apply to the built-in list.

```vue
<PricingCard plan-name="Pro" :price="99">
  <template #features>
    <li>Custom feature HTML here</li>
  </template>
</PricingCard>
```

### `#cta`

Replaces the default `InputButton`. Slot scope:

- `ctaText: string` — from `cta-text`
- `isDisabled: boolean` — from `cta-disabled`
- `planName: string`
- `onSelect: () => void` — emits `select`

```vue
<PricingCard plan-name="Pro" :price="99" @select="handleSelect">
  <template #cta="{ ctaText, isDisabled, onSelect }">
    <InputButton :button-text="ctaText" variant="secondary" :readonly="isDisabled" @click="onSelect" />
  </template>
</PricingCard>
```

---

## Styling

All `--pricing-card-*` tokens are listed in `CONSUMER-STYLING.md`. The common ones:

- `--pricing-card-padding`, `--pricing-card-border-radius`, `--pricing-card-background`
- `--pricing-card-highlight-border`, `--pricing-card-highlight-scale`
- `--pricing-card-name-line-clamp`, `--pricing-card-description-line-clamp`, `--pricing-card-feature-line-clamp` (default `none`)
- `--pricing-card-feature-icon-color` (checkmark colour)

The default CTA is styled with `InputButton`'s own tokens (`--input-button-primary-surface`, etc.),
set on the card or an ancestor. There are no `--pricing-card-cta-*` colour tokens: the old ones never
applied and were removed 2026-10-14. `--pricing-card-cta-align` still controls CTA alignment.

---

## Usage examples

### Single card

```vue
<PricingCard
  plan-name="Basic"
  :price="29.99"
  currency-symbol="£"
  billing-period="per month"
  description="Perfect for getting started"
  :features="['Feature 1', 'Feature 2', 'Feature 3']"
  @select="handleSelect"
/>
```

### Comparison grid

```vue
<div class="pricing-grid">
  <PricingCard
    v-for="plan in plans"
    :key="plan.id"
    :plan-name="plan.name"
    :price="plan.price"
    :is-highlighted="plan.id === 'pro'"
    :features="plan.features"
    heading-tag="h2"
    @select="handleSelect"
  />
</div>
```

```css
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 26rem), 1fr));
  gap: 2.4rem;
}
```

---

## Notes

- The highlight scale is a `transform`, so it doesn't change layout size. In a stacked single
  column set `--pricing-card-highlight-scale: 1`, or the highlighted card overhangs.
- The badge sits centred on the top border (`translate: 0 -50%`), so leave some space above the
  card (grid gap or padding).
- The plan name gets `--pricing-card-ribbon-clearance` (`6rem`) of right padding while a ribbon is
  shown, so long names don't run underneath it.
- Stories: `Molecules/Pricing Card`, including `Stress Test (Worst-Case Data)`.
