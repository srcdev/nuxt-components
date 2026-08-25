# InputNumberCore — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-number-*, {default})` — set the `--input-number-*` name
to override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

| Token | Falls back to | Controls |
|---|---|---|
| `--input-number-surface` | `var(--theme-input-surface)` | Wrapper and input background |
| `--input-number-border` | `var(--theme-border)` | Border colour |
| `--input-number-text-color` | `var(--theme-input-text-color-normal)` | Input text colour |
| `--input-number-divider-color` | `var(--theme-input-surface-hover)` | Divider between the input and an embedded left/right `InputButtonCore` |

Geometry (`--form-textarea-padding-*`, `--input-font-size`, `--input-element-line-height`, etc.)
is shared across every `05.forms` component and untouched by this — see
`theming-form-geometry-tokens.md`.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --input-number-surface: var(--rose-09);
  --input-number-border: var(--rose-05);
}
```

Only declare the tokens you want to change — everything else keeps inheriting the shared
`--theme-input-*`/`--theme-*` tokens.

---

## Per-instance overrides

```vue
<InputNumberCore id="quantity" name="quantity" :min="1" :max="10" style="--input-number-border: var(--gold-04);" />
```
