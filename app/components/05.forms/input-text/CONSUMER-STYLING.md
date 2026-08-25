# InputTextCore — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-text-*, {default})` — set the `--input-text-*` name to
override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

(Before 2026-08-25 this component used a private `--_input-text-*` naming scheme presented as a
"local override path" — that's gone. A private, underscore-prefixed custom property was never a
real override point; renaming it public with a real fallback is the actual fix, not a second
documented path to reach for.)

| Token | Falls back to | Controls |
|---|---|---|
| `--input-text-surface` | `var(--theme-input-surface)` | Wrapper background |
| `--input-text-surface-hover` | `var(--theme-input-surface-hover)` | Background of an embedded `InputButtonCore` slot on hover |
| `--input-text-border` | `var(--theme-border)` | Border colour (`.normal`/`.underlined`, resting) |
| `--input-text-border-hover` | `var(--theme-border-focus)` | Outline colour on hover (mouse) |
| `--input-text-border-focus` | `var(--theme-border-focus)` | Outline colour on `:focus-visible` (keyboard/assistive) |
| `--input-text-color` | `var(--theme-input-text-color-normal)` | Input text colour |
| `--input-text-placeholder-color` | `var(--theme-input-placeholder)` | Placeholder text colour |

Geometry (`--input-padding-*`, `--input-min-height`, `--input-font-size`,
`--form-element-*`, etc.) is shared across every `05.forms` component and untouched by this —
see `theming-form-geometry-tokens.md`.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --input-text-surface: var(--rose-09);
  --input-text-border: var(--rose-05);
  --input-text-border-focus: var(--rose-03);
}
```

Only declare the tokens you want to change — everything else keeps inheriting the shared
`--theme-input-*`/`--theme-*` tokens.

---

## Per-instance overrides

```vue
<InputTextCore id="email" name="email" style="--input-text-border-focus: var(--gold-04);" />
```
