# InputNumber — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-number-*, {default})` — set the `--input-number-*` name
to override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

This shape mirrors `InputTextCore`'s token set (see its own CONSUMER-STYLING.md) — `InputNumber`
is a native `<input type="number">` sibling to the text-based `InputTextAsNumberWithLabel` variant,
and both are meant to look and behave the same way. Border colour also doubles as the divider
colour between the input and an embedded left/right `InputButton` — there's no separate divider
token, same as `InputTextCore`.

| Token | Falls back to | Controls |
|---|---|---|
| `--input-number-surface` | `var(--theme-input-surface)` | Wrapper, input, and embedded-button background |
| `--input-number-surface-hover` | `var(--theme-input-surface-hover)` | Embedded left/right button background on hover |
| `--input-number-border` | `var(--theme-border)` | Border/divider colour (`normal`/`underlined` variant border, and the divider between the input and an embedded button) |
| `--input-number-border-hover` | `var(--theme-border-focus)` | Wrapper outline colour on mouse hover over the input or either step button (`normal` variant only) |
| `--input-number-border-focus` | `var(--theme-border-focus)` | Wrapper outline colour on `:focus-visible` (`normal` variant), and the embedded button's own `:focus-visible` outline |
| `--input-number-text-color` | `var(--theme-input-text-color-normal)` | Input text colour |
| `--input-number-placeholder-color` | `var(--theme-input-placeholder)` | Placeholder text colour |

Geometry (`--input-padding-block`, `--input-padding-inline`, `--input-min-height`,
`--form-input-border-radius`, `--input-font-size`, etc.) is shared across every `05.forms`
component and untouched by this — see `theming-form-geometry-tokens.md`.

Private (not public API): `--_surface`, `--_border` and `--_border-focus` (each resolved once and
read in several places) and `--_min-width` (the input's minimum width, worked out from `min`, `max`
and `step` and capped at `12em`).

---

## State hooks

| Attribute | On | When |
|---|---|---|
| `data-input-variant="normal" \| "outlined" \| "underlined"` | `.input-number-wrapper`, `.input-number-field` | Always, mirrors `input-variant` |
| `data-theme` | `.input-number-wrapper`, `.input-number-field` | Always, mirrors `theme` |
| `data-invalid` | `.input-number-wrapper`, `.input-number-field` | `field-has-error` |
| `data-has-left-slot` / `data-has-right-slot` | `.input-number-wrapper` | The `left` / `right` slot is filled |

Inner elements: `.input-number-slot` (both slot holders), `.input-number-slot-left`,
`.input-number-slot-right`, `.input-number-container`, `.input-number` (the native input),
`.input-number-label` (the Field's `InputLabel`).

> **Changed 2026-10-16**: state used to be bare classes, which collide with common consumer CSS
> (an unlayered `.error` or `.normal` rule would restyle the field). Select on the attributes
> above instead:
>
> - `.input-number-wrapper.normal` / `.underlined` → `[data-input-variant="…"]`
> - `.input-number-wrapper.has-left-slot` / `.has-right-slot` → `[data-has-left-slot]` /
>   `[data-has-right-slot]`
> - `.slot.left-slot` / `.slot.right-slot` → `.input-number-slot-left` / `.input-number-slot-right`
> - `.input-number-field.error` → `[data-invalid]`; its `.normal`/`.underlined` and `theme-*`
>   classes → `[data-input-variant]` / `[data-theme]`
>
> Also: long label, description and error copy now wraps (`overflow-wrap: anywhere` on
> `.input-number-field`), and the control's minimum width is capped at `12em` so a long `min`/`max`
> can't push it past a phone screen.

---

## Input variant

`:input-variant="'normal' | 'outlined' | 'underlined'"` (default `"normal"`) — same prop as
`InputTextCore`. Only `normal` (bordered box, with hover/focus outline) and `underlined`
(bottom-border only) have CSS today; `outlined` has no styling in `InputTextCore` either, so passing it renders with no border/outline at all — a
pre-existing gap in the type, not something specific to `InputNumber`. Declared for prop-shape
consistency with the rest of `05.forms`.

---

## Global theming

```css
:where(html) {
  --input-number-surface: var(--rose-09);
  --input-number-border: var(--rose-05);
}
```

Only declare the tokens you want to change — everything else keeps inheriting the shared
`--theme-input-*`/`--theme-*` tokens.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

```vue
<InputNumber id="quantity" name="quantity" :min="1" :max="10" style="--input-number-border: var(--gold-04);" />
```


---

## Class passthrough

`InputNumber`'s `:style-class-passthrough` lands on the native `<input class="input-number">`.
`InputNumberField`'s lands on its root `.input-number-field` only.

> **Changed 2026-10-16**: `InputNumberField` also forwarded its passthrough classes to the inner
> input, so a class meant for the field matched two elements. If you styled the input through the
> Field's passthrough, select `.your-class .input-number` instead.
