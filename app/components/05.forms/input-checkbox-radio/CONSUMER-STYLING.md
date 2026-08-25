# InputCheckboxRadioCore / InputCheckboxRadioButton — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-checkbox-*, {default})` — set the `--input-checkbox-*`
name to override just this component; leave it unset and it inherits the shared `--theme-*` slot
(or `--theme-checkbox-symbol-surface`/`--theme-input-surface` family) every other themed component
also falls back to. See `theming-component-token-pattern.md` for why this two-tier shape exists.

Defaults are unchanged from before this migration — this is a token-rename pass (giving each
property its own override point), not a redesign, unlike `InputButtonCore`'s flat/darker-hover
treatment. Geometry (`--input-checked-element-size`, `--form-element-*`, etc.) is separate and
untouched — see `theming-form-geometry-tokens.md`.

### The control itself (`InputCheckboxRadioCore` — the square/circle)

| Token | Falls back to | Controls |
|---|---|---|
| `--input-checkbox-surface` | `var(--theme-checkbox-symbol-surface)` | Background |
| `--input-checkbox-border` | `var(--theme-border)` | Border colour |
| `--input-checkbox-border-focus` | `var(--theme-border-focus)` | Outline colour on `:focus-visible` (non-button style only — see note) |
| `--input-checkbox-icon-color` | `var(--theme-text)` | Checked-state icon colour |

> The `:focus-visible` outline only applies to the plain checkbox/radio style
> (`:not(.button)`) — `InputCheckboxRadioButton`'s pill/button style has its own focus treatment,
> below, via `:has(.input-checkbox-radio-core:focus-visible)` on the outer label.

### The pill/button style (`InputCheckboxRadioButton` — e.g. a "Services of interest" option list)

| Token | Falls back to | Controls |
|---|---|---|
| `--input-checkbox-button-surface` | `var(--theme-input-surface)` | Background (resting) |
| `--input-checkbox-button-border` | `var(--theme-border)` | Border colour (resting and hover — unchanged between the two by default) |
| `--input-checkbox-button-surface-hover` | `var(--theme-input-surface-hover)` | Background on hover |
| `--input-checkbox-button-ring-hover` | `var(--theme-ring)` | Outline colour on hover |
| `--input-checkbox-button-surface-focus` | `var(--theme-surface-subtle)` | Background when the inner control has `:focus-visible` |
| `--input-checkbox-button-ring-focus` | `var(--theme-border-focus)` | Outline colour when the inner control has `:focus-visible` |
| `--input-checkbox-button-label-color` | `var(--colour-text-default)` | Option label text colour |
| `--input-checkbox-button-icon-color` | `var(--theme-text)` | Trailing decorator icon colour (the `+` in the corner) |

---

## Global theming — app-level CSS file

```css
:where(html) {
  --input-checkbox-button-surface: var(--rose-09);
  --input-checkbox-button-surface-hover: var(--rose-08);
  --input-checkbox-button-ring-focus: var(--rose-04);
}
```

Only declare the tokens you want to change — everything else keeps inheriting the shared
`--theme-*`/`--theme-input-*` tokens.

---

## Per-instance overrides

```vue
<InputCheckboxRadioButton
  id="balayage"
  type="checkbox"
  name="services"
  label="Balayage"
  style="--input-checkbox-button-surface-hover: var(--gold-08);"
/>
```
