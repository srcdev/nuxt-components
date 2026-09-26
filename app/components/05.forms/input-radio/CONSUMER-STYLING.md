# MultipleRadiobuttons — Consumer Styling Guide

`MultipleRadiobuttons` is a layout wrapper: a `FormFieldset` (`role="radiogroup"`) holding the
radio controls, an optional description and an error message. It only owns the spacing of the
items container. The radios' colours, borders and pill/button styling come from
`InputCheckboxRadio`/`InputCheckboxRadioButton` (`--input-checkbox-*` tokens, see
`../input-checkbox-radio/CONSUMER-STYLING.md`); the fieldset, legend, description and error have
their own guides (`form-fieldset`, `input-description`, `input-error`).

## Public token API

### Items container (`.multiple-radiobuttons-items`)

| Token | Default | Controls |
|---|---|---|
| `--multiple-radiobuttons-gap` | `1.2rem` | Gap between radio items |
| `--multiple-radiobuttons-margin-block-start` | `1.2rem` | Space between the legend/description and the items |

With `options-layout="equal-widths"` (the default), the column minimum width is measured at
runtime from the widest option label (`useMaxChildWidth`) plus the shared
`--input-checked-icon-gap` and `--input-checkbox-label-padding-inline` form tokens, so every
column matches the longest label. It has no token of its own; adjust those shared tokens if the
columns need more room.

No private tokens.

> **Changed 2026-09-27**: the gap and top margin were hardcoded; they're now tokens with the same
> defaults, matching `MultipleCheckboxes`.

---

## State hooks

| Attribute on `.multiple-radiobuttons-items` | When |
|---|---|
| `data-options-layout="equal-widths" \| "inline" \| "block"` | Always, mirrors `options-layout` |

The root `<fieldset>` carries `role="radiogroup"` and the fixed class
`multiple-radiobuttons-fieldset`.

> **Changed 2026-09-27**: the layout used to be a bare class (`.inline`, `.block`,
> `.equal-widths`). Generic names like `.block`/`.inline` collide with common consumer utility
> classes, so select on `[data-options-layout]` instead.

---

## Global theming

```css
:where(html) {
  --multiple-radiobuttons-gap: 0.8rem;
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

`:style-class-passthrough` (string or string array) adds classes to the root `<fieldset>`,
alongside `multiple-radiobuttons-fieldset`. It's read once at mount.
