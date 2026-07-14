# PricingCard — Consumer Styling Guide

## Public token API

All `--pricing-card-*` tokens are the stable override surface. Set them at any scope (global, page,
or instance) without touching the component itself.

| Token | Default | Controls |
|---|---|---|
| `--pricing-card-border` | `1px solid var(--slate-03)` | Card border |
| `--pricing-card-border-radius` | `0.8rem` | Corner rounding |
| `--pricing-card-padding` | `2rem` | Internal padding |
| `--pricing-card-background` | `var(--slate-00)` | Card background colour |
| `--pricing-card-shadow` | `0 2px 8px oklch(...)` | Box shadow |
| `--pricing-card-gap` | `1.2rem` | Gap between elements (name, price, features, CTA) |
| `--pricing-card-highlight-border` | `2px solid var(--teal-06)` | Border when `isHighlighted` |
| `--pricing-card-highlight-shadow` | `0 8px 24px oklch(...)` | Shadow when highlighted |
| `--pricing-card-highlight-scale` | `1.05` | Scale transform when highlighted |
| `--pricing-card-badge-bg` | `var(--teal-06)` | "Most Popular" badge background |
| `--pricing-card-badge-text` | `var(--teal-00)` | Badge text colour |
| `--pricing-card-name-font-size` | `1.8rem` | Plan name heading size |
| `--pricing-card-name-color` | `#1a1a1a` | Plan name text colour |
| `--pricing-card-amount-font-size` | `3.2rem` | Price amount size |
| `--pricing-card-amount-color` | `#1a1a1a` | Price text colour |
| `--pricing-card-period-font-size` | `0.9rem` | Billing period ("one-time", "per month") size |
| `--pricing-card-period-color` | `#666` | Billing period text colour |
| `--pricing-card-description-color` | `#555` | Plan description text colour |
| `--pricing-card-feature-color` | `#333` | Feature list text colour |
| `--pricing-card-cta-bg` | `var(--theme-button-primary-surface)` | CTA button background |
| `--pricing-card-cta-bg-hover` | `var(--theme-button-primary-surface-hover)` | CTA button background on hover |
| `--pricing-card-cta-text` | `var(--theme-button-primary-text)` | CTA button text colour |
| `--pricing-card-cta-padding` | `1rem 1.6rem` | CTA button padding |
| `--pricing-card-cta-border-radius` | `0.4rem` | CTA button corner rounding |

---

## Global theming — app-level CSS file

Create `assets/styles/setup/07.components/pricing-card.css` in the consuming app and set tokens on
`:root`. These values apply to every `PricingCard` instance across the site.

```css
/* assets/styles/setup/07.components/pricing-card.css */
:root {
  --pricing-card-border-radius: 1rem;
  --pricing-card-padding: 2.4rem;
  --pricing-card-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  --pricing-card-gap: 1.6rem;
  --pricing-card-badge-bg: var(--brand-primary);
  --pricing-card-highlight-border: 2px solid var(--brand-primary);
  --pricing-card-highlight-shadow: 0 12px 32px rgb(0 0 0 / 15%);
  --pricing-card-cta-border-radius: 0.6rem;
}
```

---

## Per-instance overrides via inline styles

Override tokens directly on a single card instance:

```vue
<PricingCard
  planName="Enterprise"
  :price="999"
  style="
    --pricing-card-border-radius: 1.2rem;
    --pricing-card-highlight-shadow: 0 16px 48px rgb(0 0 0 / 20%);
  "
  @select="handleSelect"
/>
```

---

## Page-scoped overrides

When pricing cards appear in a specific page context, scope overrides under the page wrapper:

```css
/* In the consuming page's unscoped <style> block */
.pricing-page {
  .pricing-card {
    --pricing-card-border-radius: 1.2rem;
    --pricing-card-padding: 2.8rem;
    --pricing-card-gap: 1.8rem;

    &.is-highlighted {
      --pricing-card-highlight-scale: 1.08;
      --pricing-card-highlight-shadow: 0 20px 48px rgb(0 0 0 / 18%);
    }
  }
}
```

---

## Three-card comparison grid

When displaying multiple cards side-by-side (common in pricing pages), wrap in a grid container:

```vue
<div class="pricing-grid">
  <PricingCard v-for="plan in plans" :key="plan.id" v-bind="plan" @select="handleSelect" />
</div>
```

```css
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;

  .pricing-card {
    /* Optional per-card overrides */
  }

  /* Alternate: fixed 3-column layout */
  &.three-col {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Feature checkmark colour

The feature list checkmarks use `--teal-06` by default. Override globally or per-instance:

```css
.pricing-page {
  .pricing-card__feature::before {
    color: var(--brand-primary);
  }
}
```

Or inline:

```vue
<PricingCard
  v-bind="plan"
  style="--_feature-checkmark-color: var(--brand-accent);"
  @select="handleSelect"
/>
```

(Note: `--_feature-checkmark-color` is an internal token; consider requesting it as a public token if override is needed frequently.)
