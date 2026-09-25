# InputNumber — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-number-*, {default})` — set the `--input-number-*` name
to override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

This shape mirrors `InputTextCore`'s token set (see its own CONSUMER-STYLING.md) — `InputNumber`
is a native `<input type="number">` sibling to the text-based `InputTextAsNumberWithLabel` variant,
and both are meant to look and behave the same way. Border colour also doubles as the divider
colour between the input and an embedded left/right `InputButtonCore` — there's no separate divider
token, same as `InputTextCore`.

| Token | Falls back to | Controls |
|---|---|---|
| `--input-number-surface` | `var(--theme-input-surface)` | Wrapper, input, and embedded-button background |
| `--input-number-surface-hover` | `var(--theme-input-surface-hover)` | Embedded left/right button background on hover |
| `--input-number-border` | `var(--theme-border)` | Border/divider colour (`normal`/`underlined` variant border, and the divider between the input and an embedded button) |
| `--input-number-border-hover` | `var(--theme-border-focus)` | Wrapper outline colour on mouse hover (`normal` variant only) |
| `--input-number-border-focus` | `var(--theme-border-focus)` | Wrapper outline colour on `:focus-visible` (`normal` variant), and the embedded button's own `:focus-visible` outline |
| `--input-number-text-color` | `var(--theme-input-text-color-normal)` | Input text colour |
| `--input-number-placeholder-color` | `var(--theme-input-placeholder)` | Placeholder text colour |

Geometry (`--input-padding-block`, `--input-padding-inline`, `--input-min-height`,
`--form-input-border-radius`, `--input-font-size`, etc.) is shared across every `05.forms`
component and untouched by this — see `theming-form-geometry-tokens.md`.

---

## Input variant

`:input-variant="'normal' | 'outlined' | 'underlined'"` (default `"normal"`) — same prop as
`InputTextCore`. Only `normal` (bordered box, with hover/focus outline) and `underlined`
(bottom-border only) have CSS today; `outlined` has no styling in `InputTextCore` either (no
`&.outlined` rule exists there), so passing it renders with no border/outline at all — a
pre-existing gap in the type, not something specific to `InputNumber`. Declared for prop-shape
consistency with the rest of `05.forms`.

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
<InputNumber id="quantity" name="quantity" :min="1" :max="10" style="--input-number-border: var(--gold-04);" />
```
