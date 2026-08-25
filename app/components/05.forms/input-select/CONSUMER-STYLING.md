# InputSelectCore — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-select-*, {default})` — set the `--input-select-*` name
to override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

(Before 2026-08-25 this component used a private `--_input-select-*` naming scheme presented as a
"local override path" — that's gone. A private, underscore-prefixed custom property was never a
real override point; renaming it public with a real fallback is the actual fix, not a second
documented path to reach for.)

| Token | Falls back to | Controls |
|---|---|---|
| `--input-select-surface` | `var(--theme-input-surface)` | Wrapper/select background |
| `--input-select-surface-hover` | `var(--theme-input-surface-hover)` | Option row background on hover |
| `--input-select-border` | `var(--theme-border)` | Border colour (`.normal`/`.underlined`/open picker, resting) |
| `--input-select-border-hover` | `var(--theme-border-focus)` | Outline colour on hover (mouse) |
| `--input-select-border-focus` | `var(--theme-border-focus)` | Outline colour on `:focus-visible` (keyboard/assistive) |

Geometry (`--input-padding-*`, `--input-min-height`, `--input-select-option-min-height`,
`--form-element-*`, etc.) is shared across every `05.forms` component and untouched by this — see
`theming-form-geometry-tokens.md`.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --input-select-surface: var(--rose-09);
  --input-select-border: var(--rose-05);
  --input-select-border-focus: var(--rose-03);
}
```

Only declare the tokens you want to change — everything else keeps inheriting the shared
`--theme-input-*`/`--theme-*` tokens.

---

## Per-instance overrides

```vue
<InputSelectCore id="country" name="country" style="--input-select-border-focus: var(--gold-04);" />
```
