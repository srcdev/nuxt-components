# InputTextareaCore — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-textarea-*, {default})` — set the `--input-textarea-*`
name to override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

This shape mirrors `InputTextCore`'s token set (see its own CONSUMER-STYLING.md).

| Token | Falls back to | Controls |
|---|---|---|
| `--input-textarea-surface` | `var(--theme-input-surface)` | Wrapper background |
| `--input-textarea-border` | `var(--theme-border)` | Border colour (`normal`/`underlined` variant border) |
| `--input-textarea-border-hover` | `var(--theme-border-focus)` | Wrapper outline colour on mouse hover (`normal` variant only) |
| `--input-textarea-border-focus` | `var(--theme-border-focus)` | Wrapper outline colour on `:focus-visible` (`normal` variant only) |
| `--input-textarea-text-color` | `var(--theme-input-text-color-normal)` | Textarea text colour |
| `--input-textarea-placeholder-color` | `var(--theme-input-placeholder)` | Placeholder text colour |

Geometry (`--form-textarea-padding-block`, `--form-textarea-padding-inline`, `--input-font-size`,
`--input-textarea-line-height`, `--input-padding-inline`, etc.) is shared across every `05.forms`
component and untouched by this — see `theming-form-geometry-tokens.md`.

---

## Input variant

`:input-variant="'normal' | 'outlined' | 'underlined'"` (default `"normal"`) — same prop as
`InputTextCore`. Only `normal` (bordered box, with hover/focus outline) and `underlined`
(bottom-border only) have CSS today; `outlined` has no styling in `InputTextCore` either (no
`&.outlined` rule exists there), so passing it renders with no border/outline at all — a
pre-existing gap in the type, not specific to `InputTextareaCore`.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --input-textarea-surface: var(--rose-09);
  --input-textarea-border: var(--rose-05);
}
```

Only declare the tokens you want to change — everything else keeps inheriting the shared
`--theme-input-*`/`--theme-*` tokens.

---

## Per-instance overrides

```vue
<InputTextareaCore id="message" name="message" style="--input-textarea-border: var(--gold-04);" />
```
