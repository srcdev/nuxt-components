# InputText — Consumer Styling Guide

> **Renamed 2026-10-16**: `InputTextCore` → `InputText`, `InputTextWithLabel` →
> `InputTextField`, `InputPasswordWithLabel` → `InputPasswordField`,
> `InputTextAsNumberWithLabel` → `InputTextAsNumberField`. Class changes are listed under "State
> hooks" below.

## Public token API

Every colour token below is `var(--input-text-*, {default})` — set the `--input-text-*` name to
override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

| Token | Default | Controls |
|---|---|---|
| `--input-text-surface` | `var(--theme-input-surface)` | Wrapper background, and slot `InputButton` background |
| `--input-text-surface-focus` | the resolved surface | Wrapper and slot button background while the input or a slot button has `:focus-visible` (`normal`/`outlined`) |
| `--input-text-surface-hover` | `var(--theme-input-surface-hover)` | Slot `InputButton` background on hover |
| `--input-text-border` | `var(--theme-border)` | Border colour (all variants, resting), and the stepper's button dividers |
| `--input-text-border-hover` | the resolved border | 1px outline colour on hover (`normal`/`outlined`) |
| `--input-text-shadow` | `var(--form-element-shadow-colour, var(--colour-theme-2))` | Resting shadow ring outside the border (`normal`/`outlined`). Width is the global `--form-element-shadow-width` (`0.2rem`; `0` removes it) |
| `--input-text-border-focus` | `var(--theme-border-focus)` | Outline colour on `:focus-visible` (`normal`/`outlined`), and a slot button's own focus outline |
| `--input-text-color` | `var(--theme-input-text-color-normal)` | Input text and slot button colour, and autofilled text (global rule) |
| `--input-text-placeholder-color` | `var(--theme-input-placeholder)` | Placeholder text colour |

### Outlined label (`InputTextField`, `InputPasswordField`)

| Token | Default | Controls |
|---|---|---|
| `--input-text-outlined-label-space` | `2rem` | Space reserved inside the top of the box for the floated label |
| `--input-text-outlined-label-rest-offset` | centred in the box | How far down the resting label sits |
| `--input-text-outlined-label-rest-indent` | `var(--input-padding-inline)` | How much further in the resting label sits than the floated one; it slides left as it floats |
| `--input-text-outlined-label-inset-block` | `0.4rem` | How far down the floated label sits |
| `--input-text-outlined-label-font-size` | `var(--step-5)` | Resting label size |
| `--input-text-outlined-label-scale` | `0.85` | Floated label size, as a scale of the resting size (keep the result at `--step-4` or above) |
| `--input-text-outlined-label-color` | `inherit` | Label colour at rest |
| `--input-text-outlined-label-color-floated` | the resting label colour | Label colour once floated |
| `--input-text-outlined-label-font-weight-floated` | `bold` | Label weight once floated |

Geometry (`--input-padding-*`, `--input-min-height`, `--input-font-size`, `--input-icon-slot-gap`,
`--form-element-*`, etc.) is shared across every `05.forms` component and untouched by this —
see `theming-form-geometry-tokens.md`.

Private (not public API): `--_surface`, `--_border` and `--_border-focus`, each resolved once and
read in several places (`--_surface` swaps to the focus surface on `:focus-visible`), and
`--_outlined-label-space`, read by both the label and the wrapper.

---

> **Changed 2026-10-17**: bordered controls carry a light shadow ring (`box-shadow`, theme step 2,
> so red when invalid), and hover draws a 1px outline in the border colour with no offset, over the
> ring's inner edge. Hover used to draw a 2px outline at a 2px offset in the focus colour. Focus is
> unchanged and sits just outside the ring.

## State hooks

| Attribute | On | When |
|---|---|---|
| `data-input-variant="normal" \| "outlined" \| "underlined"` | `.input-text-wrapper`, each Field root | Always, mirrors `input-variant` |
| `data-theme` | `.input-text-wrapper`, each Field root | Always, mirrors `theme` |
| `data-invalid` | `.input-text-wrapper`, each Field root | `field-has-error` |
| `data-dirty` | `.input-text-wrapper`, each Field root | The Field has seen a non-empty value |
| `data-active` | `.input-text-wrapper`, each Field root | The input has focus |
| `data-filled` | `.input-text-field` | The value is non-empty (unlike `data-dirty`, it clears when the field is emptied) |
| `data-readonly` | `.input-text-wrapper` | `readonly` |
| `data-inputmode` | `.input-text-wrapper` | Always, mirrors `inputmode` |
| `data-has-left-slot` / `data-has-right-slot` | `.input-text-wrapper` | The `left` / `right` slot is filled |

Field roots: `.input-text-field` (`InputTextField`, and `InputPasswordField`, which adds
`.input-password-field`), `.input-text-as-number-field` (`InputTextAsNumberField`).

Inner elements: `.input-text` (the native input), `.input-text-slot` (both slot holders),
`.input-text-slot-left`, `.input-text-slot-right`, `.input-text-label` (the Fields' `InputLabel`),
`.input-text-description` (the Fields' `InputDescription`), `.input-password-field-icon` (the
password toggle's icon).

`outlined` draws the same bordered box as `normal` on the control, without the wrapper's
start padding (kept when there's a `left` slot), so the text and label start one
`--input-padding-inline` in from the border. In `InputTextField` (and so
`InputPasswordField`) the label sits inside the box: at rest it's level with where the value
goes and the input is transparent, so a placeholder or date mask never shows under it. The root's
`data-active`, `data-filled` or `data-invalid`, a filled `left` slot, or browser autofill
floats it to the top corner (scaled and bold) and shows the input. The label stays on one line
with an ellipsis, and stops short of a `right` slot. The description moves after the input and
error. `InputTextAsNumberField` keeps its label above the box.

> **Changed 2026-11-23**: `outlined` used to render the control with no border at all and the
> label above it. It now has the floating label described above.
>
> Also 2026-11-23: `--input-font-size` was redeclared as `var(--step-0)`, a step that doesn't
> exist, so text, number, select and textarea inputs inherited the body size (`--step-4`,
> 13.5 to 15.6px). The stray line is gone and the `1.6rem` default applies, so inputs render
> slightly larger, and iOS no longer zooms the page when a field takes focus.

> **Changed 2026-10-16**: state used to be bare classes, which collide with common consumer CSS
> (an unlayered `.error` or `.normal` rule would restyle the field). Select on the attributes
> above instead:
>
> - `.input-text-wrapper.normal` / `.underlined` / `.outlined` → `[data-input-variant="…"]`
> - `.input-text-wrapper.dirty` / `.active` / `.error` → `[data-dirty]` / `[data-active]` /
>   `[data-invalid]`; `.has-left-slot` / `.has-right-slot` → `[data-has-left-slot]` /
>   `[data-has-right-slot]`
> - `.slot.left-slot` / `.slot.right-slot` → `.input-text-slot-left` / `.input-text-slot-right`
> - `.input-text-core` → `.input-text` (it also no longer carries `dirty`/`active` classes)
> - `.input-text-with-label` → `.input-text-field`, now the Field's root (it used to sit inside
>   an unclassed `<div>`); its variant/`dirty`/`active` classes → the attributes above
> - `InputTextAsNumberField`'s root was `.input-text-with-label.input-text-as-number`; it's now
>   `.input-text-as-number-field`, and the input no longer gets `.input-text-as-number`
> - the password toggle icon's `.icon` → `.input-password-field-icon`
>
> Also: label, description and error copy wraps (`overflow-wrap: anywhere` on each Field root),
> and the input can shrink below its intrinsic width (`min-inline-size: 0`), so a field no longer
> overflows a narrow column.

---

## Global theming

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

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat**: `InputText`'s own passthrough lands on the `<input>`, which has no descendants, so
tokens set through it only reach the input itself (text and placeholder colour). Set the others on
a Field root or an ancestor.

### One instance

```vue
<InputTextField
  v-model="email"
  name="email"
  type="email"
  label="Email"
  error-message=""
  style="--input-text-border-focus: var(--gold-04);"
/>
```

---

## Class passthrough

`InputText`'s `:style-class-passthrough` lands on the native `<input class="input-text">`. Each
Field's lands on its own root only.

> **Changed 2026-10-16**: `InputTextField` and `InputTextAsNumberField` applied their passthrough
> classes to both their root and the inner input. If you styled the input that way, select
> `.your-class .input-text` instead.
