# PricingCard Component

## Overview

`PricingCard` renders a SaaS-style pricing plan card with plan name, price, description, feature list, and call-to-action button. Supports "Most Popular" highlight state with optional badge. Features are highly customizable via CSS token overrides, and the CTA button can be customized via the `#cta` slot for custom variants and themes.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form)       | Type                          | Default      | Notes                                                              |
| -------------------------- | ----------------------------- | ------------ | ------------------------------------------------------------------ |
| `tag`                      | `"div" \| "section" \| "article"` | `"article"` | Root element tag for semantic HTML.                               |
| `:plan-name`               | `string`                      | (required)   | Plan/tier name (e.g., "Basic", "Professional", "Enterprise").     |
| `:price`                   | `number`                      | (required)   | Price amount (e.g., `99`, `4.99`). Currency symbol added in template. |
| `:billing-period`          | `string`                      | `"one-time"` | Billing frequency text (e.g., "monthly", "yearly").              |
| `:description`             | `string`                      | (optional)   | Short plan description.                                            |
| `:features`                | `string[]`                    | `[]`         | Array of feature strings. Rendered with checkmark icons.          |
| `:is-highlighted`          | `boolean`                     | `false`      | Highlight state; applies "Most Popular" badge, border, shadow, and scale. |
| `:cta-text`                | `string`                      | `"Get started"` | Button label text.                                              |
| `:cta-disabled`            | `boolean`                     | `false`      | Disables the CTA button.                                          |
| `:style-class-passthrough` | `string \| string[]`          | `[]`         | Extra CSS classes applied to the card root.                       |

---

## Events

| Event  | Payload    | Notes                                    |
| ------ | ---------- | ---------------------------------------- |
| `select` | `planName: string` | Emitted when the CTA button is clicked. |

---

## Slots

### Default slot (features)

Override the default feature list rendering. Receives no slot scope.

```vue
<PricingCard plan-name="Pro" :price="99">
  <template #features>
    <li>Custom feature HTML here</li>
  </template>
</PricingCard>
```

### #cta slot

Customize the CTA button. Default renders `InputButtonCore` with theme support.

**Slot scope:**
- `ctaText: string` — button label from `:cta-text` prop
- `isDisabled: boolean` — button disabled state from `:cta-disabled` prop
- `planName: string` — plan name for context
- `onSelect: () => void` — callback to trigger `select` event

```vue
<PricingCard plan-name="Pro" :price="99" @select="handleSelect">
  <template #cta="{ ctaText, isDisabled, onSelect }">
    <InputButtonCore
      :button-text="ctaText"
      variant="secondary"
      theme="custom"
      :readonly="isDisabled"
      @click="onSelect"
    />
  </template>
</PricingCard>
```

---

## CSS Token Customization

All `--pricing-card-*` tokens can be overridden at global, page, or instance scope. See `CONSUMER-STYLING.md` in the component directory for full token documentation and examples.

**Common tokens:**
- `--pricing-card-padding` — card internal spacing
- `--pricing-card-border-radius` — card corners
- `--pricing-card-cta-bg` — button background
- `--pricing-card-highlight-border` — highlighted card border
- `--pricing-card-name-color` — plan name text color

---

## Usage Examples

### Single card with default button

```vue
<PricingCard
  plan-name="Basic"
  :price="29.99"
  billing-period="monthly"
  description="Perfect for getting started"
  :features="['Feature 1', 'Feature 2', 'Feature 3']"
  cta-text="Get started"
  @select="handleSelect"
/>
```

### Highlighted "Most Popular" card

```vue
<PricingCard
  plan-name="Professional"
  :price="79.99"
  billing-period="monthly"
  :is-highlighted="true"
  :features="['All Basic features', 'Priority support', 'Advanced analytics']"
  @select="handleSelect"
/>
```

### Card with custom button variant

```vue
<PricingCard
  plan-name="Enterprise"
  :price="199.99"
  billing-period="monthly"
  description="Everything you need"
  :features="['Unlimited access', 'Dedicated support', 'Custom integrations']"
  @select="handleSelect"
>
  <template #cta="{ ctaText, isDisabled, onSelect }">
    <InputButtonCore
      :button-text="ctaText"
      variant="primary"
      :readonly="isDisabled"
      @click="onSelect"
    />
  </template>
</PricingCard>
```

### Three-column grid with token customization

```vue
<div class="pricing-grid">
  <PricingCard
    v-for="plan in plans"
    :key="plan.id"
    :plan-name="plan.name"
    :price="plan.price"
    :is-highlighted="plan.id === 'pro'"
    :features="plan.features"
    @select="handleSelect"
    style="--pricing-card-padding: 2.5rem; --pricing-card-cta-bg: var(--brand-primary)"
  />
</div>
```

---

## Notes

- Feature checkmarks are always rendered with a teal checkmark (`✓`). Customize the color via `--teal-06` or component tokens.
- The `#cta` slot is preferred over CSS-only button customization when you need variant or theme changes.
- Highlighted cards apply a 1.05x scale transform — consider z-index when nesting in flex/grid layouts.
