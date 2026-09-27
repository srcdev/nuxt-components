# PriceList — Consumer Styling Guide

`PriceList` renders one or more columns of priced items (a salon/service menu). Each column is a
`HeroText` heading followed by a `<dl>` of description/price rows separated by dividers. Columns
stack on narrow viewports and sit two-up from `48em`.

## Public token API

### Layout

| Token | Default | Controls |
|---|---|---|
| `--price-list-column-gap` | `2.4rem` | Gap between columns (and between stacked columns on mobile) |

### Column heading

| Token | Default | Controls |
|---|---|---|
| `--price-list-heading-font-size` | `var(--hero-text-subheading)` | Heading size |
| `--price-list-heading-font-weight` | `600` | Heading weight |
| `--price-list-heading-colour` | `inherit` | Heading text colour |
| `--price-list-heading-margin-block-end` | `1.8rem` | Space between heading and the first row |
| `--price-list-heading-icon-gap` | `1rem` | Space after the optional `headingIcon` |

The heading is a `HeroText`, so `--hero-text-font-family` also applies to it.

### Rows

| Token | Default | Controls |
|---|---|---|
| `--price-list-row-gap` | `1.2rem` | Gap between description and price |
| `--price-list-row-padding-block` | `1.4rem` | Vertical padding per row (last row has none below) |
| `--price-list-divider-width` | `1px` | Divider thickness |
| `--price-list-divider-colour` | `currentColor` | Divider colour |
| `--price-list-divider-opacity` | `0.15` | Divider opacity (0 to 1), mixed into the colour |
| `--price-list-description-font-size` | `1.4rem` | Item description size |
| `--price-list-description-colour` | `inherit` | Item description colour |

### Price

| Token | Default | Controls |
|---|---|---|
| `--price-list-price-font-family` | `var(--hero-text-font-family, "Playfair Display")` | Price amount font |
| `--price-list-price-font-size` | `var(--hero-text-label)` | Price amount size |
| `--price-list-price-colour` | `inherit` | Price amount colour |
| `--price-list-from-font-size` | `1.4rem` | "from" label size |
| `--price-list-from-colour` | `inherit` | "from" label colour |
| `--price-list-from-gap` | `0.5ch` | Space between "from" and the amount |

There are no private `--_` tokens.

> **Changed 2026-09-27**: `--price-list-divider-color` is now `--price-list-divider-colour`
> (repo spelling convention). `--price-list-price-font-size` used to be dead for the amount itself
> (the nested `HeroText` overrode it) and now sizes the amount; the "from" label has its own
> `--price-list-from-font-size`. `--price-list-heading-font-size` was declared but never applied;
> it now works. The amount is no longer an `<h2>` per row, and "from" now sits inline before it
> rather than on its own line.

---

## State hooks

No `data-*` attributes. Inner element classes, safe to target:

| Class | Element |
|---|---|
| `.price-list` | Root grid |
| `.price-list__column` | One column |
| `.price-list__heading` | Column heading (`HeroText`, tag from `heading-tag`) |
| `.price-list__list` | The `<dl>` |
| `.price-list__row` | One description/price pair |
| `.price-list__description` | `<dt>` |
| `.price-list__price` | `<dd>`, holds the "from" label and amount |
| `.price-list__from` | "from" label (only when `item.from` is true) |
| `.price-list__amount` | Price amount |

The two-column breakpoint (`48em`) is a media query and can't be tokenised; override
`grid-template-columns` on `.price-list` if you need a different split.

---

## Global theming

```css
:where(html) {
  --price-list-divider-colour: var(--theme-border);
  --price-list-divider-opacity: 1;
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

`:style-class-passthrough` (string or string array) adds classes to the root `.price-list` element.
Reactive: changing the prop replaces the previous classes.
