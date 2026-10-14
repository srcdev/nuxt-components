# PricingCard — Consumer Styling Guide

## Public token API

All `--pricing-card-*` tokens are the stable override surface. Set them at any scope (global, page,
or instance) without touching the component itself.

> Changed 2026-10-14: colour defaults now come from the `--theme-*` slots (card background
> `--theme-surface-subtle`, text `--theme-text`, badge `--theme-surface`/`--theme-on-surface`,
> highlight border `--theme-border`, checkmark `--theme-accent`) instead of fixed `--slate-*`,
> `--teal-*` and hex values. The badge (`0.75rem` → `1.2rem`) and billing period (`0.9rem` →
> `1.4rem`) font sizes were too small at this library's 10px rem base and were raised. The five
> `--pricing-card-cta-*` colour/shape tokens were removed: their rule used `:deep()` in an unscoped
> style block, which browsers drop, so they never applied. Style the CTA with `InputButton`'s own
> tokens instead (see **CTA button** below).

### Card

| Token | Default | Controls |
|---|---|---|
| `--pricing-card-background` | `var(--theme-surface-subtle)` | Card background colour |
| `--pricing-card-border` | `1px solid var(--slate-03)` | Card border |
| `--pricing-card-border-radius` | `0.8rem` | Corner rounding |
| `--pricing-card-padding` | `2rem` | Internal padding |
| `--pricing-card-shadow` | `0 2px 8px oklch(...)` | Box shadow |
| `--pricing-card-gap` | `1.2rem` | Gap between name, price, description, features and CTA |
| `--pricing-card-transition-duration` | `300ms` | Transform/shadow/border transition (skipped under `prefers-reduced-motion: reduce`) |

### Highlight and badge (`is-highlighted`)

| Token | Default | Controls |
|---|---|---|
| `--pricing-card-highlight-border` | `2px solid var(--theme-border)` | Border when highlighted |
| `--pricing-card-highlight-shadow` | `0 8px 24px oklch(...)` | Shadow when highlighted |
| `--pricing-card-highlight-scale` | `1.05` | Scale transform when highlighted; set `1` in a single-column layout so it doesn't overhang |
| `--pricing-card-badge-bg` | `var(--theme-surface)` | Badge background |
| `--pricing-card-badge-text` | `var(--theme-on-surface)` | Badge text colour |
| `--pricing-card-badge-font-size` | `1.2rem` | Badge text size |

### Ribbon (`ribbon-text`)

| Token | Default | Controls |
|---|---|---|
| `--pricing-card-ribbon-bg` | `var(--red-06)` | Ribbon background |
| `--pricing-card-ribbon-text` | `var(--red-00, white)` | Ribbon text colour |
| `--pricing-card-ribbon-size` | `20rem` | Width/height of the ribbon's clipping box: how far it reaches from the top-right corner |
| `--pricing-card-ribbon-line-clamp` | `2` | Max ribbon lines, with an ellipsis on the last. `1` is single-line ellipsis |
| `--pricing-card-ribbon-clearance` | `6rem` | Right padding on the plan name while a ribbon is shown, so the name doesn't run under it |

### Text

| Token | Default | Controls |
|---|---|---|
| `--pricing-card-name-font-size` | `1.8rem` | Plan name size |
| `--pricing-card-name-color` | `var(--theme-text)` | Plan name colour |
| `--pricing-card-name-line-clamp` | `none` | Max plan name lines. `1` is single-line ellipsis, `none` shows everything |
| `--pricing-card-amount-font-size` | `3.2rem` | Price size |
| `--pricing-card-amount-color` | `var(--theme-text)` | Price colour |
| `--pricing-card-period-font-size` | `1.4rem` | Billing period size |
| `--pricing-card-period-color` | `var(--theme-text)` | Billing period colour |
| `--pricing-card-description-color` | `var(--theme-text)` | Description colour |
| `--pricing-card-description-line-clamp` | `none` | Max description lines |
| `--pricing-card-feature-color` | `var(--theme-text)` | Feature text colour |
| `--pricing-card-feature-icon-color` | `var(--theme-accent)` | Feature checkmark colour |
| `--pricing-card-feature-line-clamp` | `none` | Max lines per feature (built-in feature list only; `#features` slot content is your own markup) |

### CTA

| Token | Default | Controls |
|---|---|---|
| `--pricing-card-cta-align` | `flex-start` | CTA wrapper `align-self`: `stretch`, `center` or `flex-end` |

Private tokens (not public API): `--_ribbon-size`, the resolved `--pricing-card-ribbon-size` read
by both the clip box and the ribbon.

---

## State hooks

| Hook | Meaning |
|---|---|
| `.is-highlighted` | `is-highlighted` is set: badge shown, highlight border/shadow/scale applied |
| `.has-ribbon` | `ribbon-text` is set: the plan name gets `--pricing-card-ribbon-clearance` |

Inner elements: `.pricing-card__badge`, `.pricing-card__ribbon-clip`, `.pricing-card__ribbon`,
`.pricing-card__name`, `.pricing-card__price`, `.pricing-card__amount`, `.pricing-card__period`,
`.pricing-card__description`, `.pricing-card__features`, `.pricing-card__feature`,
`.pricing-card__cta`.

---

## CTA button

The default CTA is a primary `InputButton`. Its tokens inherit, so set them on the card (or any
ancestor) to restyle it:

```css
.pricing-page .pricing-card {
  --input-button-primary-surface: var(--brand-primary);
  --input-button-primary-surface-hover: var(--brand-primary-dark);
  --input-button-primary-text: white;
}
```

Shape (`--button-border-radius`, `--button-padding-inline`, `--button-padding-block`) comes from the
global button tokens and can be set the same way. For a different variant or extra controls, replace
the button with the `#cta` slot.

---

## Global theming

```css
:where(html) {
  --pricing-card-border-radius: 1.2rem;
  --pricing-card-padding: 2.4rem;
  --pricing-card-badge-bg: var(--brand-primary);
  --pricing-card-highlight-border: 2px solid var(--brand-primary);
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the card root (the `article`/`section`/`div`), so a class
passed there is a direct hook for both tokens and selectors.

---

## Notes

- The price is `currency-symbol` + the number, with fractional prices shown to two decimals
  (`9.5` → `9.50`). There is no locale-aware formatting.
- The highlight scale is a `transform`, so it doesn't change layout size; in a stacked
  single-column layout the scaled card can overhang its column. Set
  `--pricing-card-highlight-scale: 1` there.
