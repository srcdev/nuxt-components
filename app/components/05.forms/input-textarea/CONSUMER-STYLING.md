# InputTextarea — Consumer Styling Guide

> **Renamed 2026-10-16**: `InputTextareaCore` → `InputTextarea`, `InputTextareaWithLabel` →
> `InputTextareaField`. Class changes are listed under "State hooks" below.

## Public token API

Every colour token below is `var(--input-textarea-*, {default})` — set the `--input-textarea-*`
name to override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

This shape mirrors `InputText`'s token set (see its own CONSUMER-STYLING.md).

### Colour

| Token | Default | Controls |
|---|---|---|
| `--input-textarea-surface` | `var(--theme-input-surface)` | Wrapper background |
| `--input-textarea-surface-focus` | the resolved surface | Wrapper background while the textarea has `:focus-visible` (`normal`/`outlined`) |
| `--input-textarea-border` | `var(--theme-border)` | Border colour (all variants) |
| `--input-textarea-border-hover` | the resolved border | 1px wrapper outline colour on mouse hover (`normal`/`outlined`) |
| `--input-textarea-shadow` | `var(--form-element-shadow-colour, var(--colour-theme-2))` | Resting shadow ring outside the border (`normal` only; `outlined` uses the outline below). Width is the global `--form-element-shadow-width` (`0.2rem`; `0` removes it) |
| `--input-textarea-border-focus` | `var(--theme-border-focus)` | Wrapper outline colour on `:focus-visible` (`normal`/`outlined`) |
| `--input-textarea-text-color` | `var(--theme-input-text-color-normal)` | Textarea text colour |
| `--input-textarea-placeholder-color` | `var(--theme-input-placeholder)` | Placeholder text colour |

### Size

| Token | Default | Controls |
|---|---|---|
| `--input-textarea-min-height` | `6lh` | Minimum height (six lines) |
| `--input-textarea-max-height` | `none` | Maximum height before the textarea scrolls. It grows with its content up to here where `field-sizing: content` is supported |
| `--input-textarea-slot-gap` | `1.2rem` | Gap between the left/right slots and the textarea |
| `--input-textarea-slot-align` | `center` | Vertical position of the left/right slots against the textarea (`align-self`: `start`, `center`, `end`) |
| `--input-textarea-slot-padding-block` | `0` | Space above and below each slot, so a `start`- or `end`-aligned slot doesn't sit against the field's edge |

### Outlined label (`InputTextareaField`)

| Token | Default | Controls |
|---|---|---|
| `--input-textarea-outlined-outline` | `var(--input-textarea-shadow, …)` | Resting outline colour on the `outlined` box, which has no shadow ring; theme step 2 by default, so red when invalid. Hover switches it to the border colour and focus to the focus colour, so with the 1px border it reads as a 2px border |
| `--input-textarea-outlined-outline-width` | `0.1rem` | Outline width on the `outlined` box in every state (`normal` focus uses the global `--form-element-outline-width-focus`) |
| `--input-textarea-outlined-outline-offset` | `0` | Outline offset on the `outlined` box in every state, so it sits flush with the border behind the pill |
| `--input-textarea-outlined-label-font-size` | `var(--input-font-size)` | Resting label size |
| `--input-textarea-outlined-label-scale` | `0.85` | Floated label size, as a scale of the resting size (keep the result at `--step-4` or above) |
| `--input-textarea-outlined-label-padding-inline` | `0.9rem` | Space either side of the label text inside the pill |
| `--input-textarea-outlined-label-padding-block` | `0.2rem` | Space above and below the label text inside the pill |
| `--input-textarea-outlined-label-inset-inline` | `calc(var(--form-input-border-radius) + 0.2rem)` | Floated pill's start edge, measured from the box edge, so it clears the corner radius. At rest the label still lines up with the value and slides to this position as it floats |
| `--input-textarea-outlined-label-line-height` | `1.25` | Label line height; with the font size and padding it sets the pill's height |
| `--input-textarea-outlined-label-border-radius` | `999px` | Pill corner radius |
| `--input-textarea-outlined-label-surface` | `var(--input-textarea-surface, …)` | Pill background once floated |
| `--input-textarea-outlined-label-border` | `var(--input-textarea-border, …)` | Pill border once floated. The pill's outline follows the box's: `--input-textarea-outlined-outline` at rest, the border-hover colour on hover and `--input-textarea-border-focus` on focus, so the two read as one edge |
| `--input-textarea-outlined-label-color` | `inherit` | Label colour at rest |
| `--input-textarea-outlined-label-color-floated` | the resting label colour | Label colour once floated |
| `--input-textarea-outlined-label-font-weight-floated` | `normal` | Label weight once floated |

The resting label is level with the first line of text; the floated pill is centred on the top border, and the Field
reserves half its height above the box so it never overlaps what sits above. Both positions are
derived from the geometry tokens, so they follow `--input-min-height`, `--input-font-size` and
`--form-element-border-width`.

Geometry (`--form-textarea-padding-block`, `--form-textarea-padding-inline`, `--input-font-size`,
`--input-textarea-line-height`, `--input-padding-inline`, etc.) is shared across every `05.forms`
component and untouched by this — see `theming-form-geometry-tokens.md`.

Private (not public API): `--_border`, resolved once and read by every border variant; `--_surface`,
swapped to the focus surface on `:focus-visible`; and
the Field's `--_outlined-label-font-size`, `--_outlined-label-scale`,
`--_outlined-label-padding-inline`, `--_outlined-label-padding-block`, `--_outlined-label-inset-inline`, `--_outlined-label-line-height`, `--_outlined-label-border-width`, `--_outlined-label-outline-width` (both divided by the scale so the scaled pill still draws 1px lines) and `--_outlined-label-block-size`, each read by the label's
size, padding and both positions.

---

> **Changed 2026-10-17**: bordered controls carry a light shadow ring (`box-shadow`, theme step 2,
> so red when invalid), and hover draws a 1px outline in the border colour with no offset, over the
> ring's inner edge. Hover used to draw a 2px outline at a 2px offset in the focus colour. Focus is
> unchanged and sits just outside the ring.

## State hooks

| Attribute | On | When |
|---|---|---|
| `data-input-variant="normal" \| "outlined" \| "underlined"` | `.input-textarea-wrapper`, `.input-textarea-field` | Always, mirrors `input-variant` |
| `data-theme` | `.input-textarea-wrapper`, `.input-textarea-field` | Always, mirrors `theme` |
| `data-invalid` | `.input-textarea-wrapper`, `.input-textarea-field` | `field-has-error` |
| `data-dirty` | `.input-textarea-wrapper`, `.input-textarea-field` | The Field has seen a non-empty value |
| `data-active` | `.input-textarea-wrapper`, `.input-textarea-field` | The textarea has focus |
| `data-filled` | `.input-textarea-field` | The value is non-empty (unlike `data-dirty`, it clears when the field is emptied) |
| `data-has-left-slot` / `data-has-right-slot` | `.input-textarea-wrapper` | The `left` / `right` slot is filled |

Inner elements: `.input-textarea` (the native textarea), `.input-textarea-slot` (both slot
holders), `.input-textarea-slot-left`, `.input-textarea-slot-right`, `.input-textarea-label` (the
Field's `InputLabel`), `.input-text-description` (the Field's `InputDescription`, shared with the
other Field components).

`outlined` draws the same bordered box as `normal` on the control, without the wrapper's start
padding (kept when there's a `left` slot). In the Field the label sits inside the box, level with
the first line of text, and the textarea is transparent until the root's `data-active`,
`data-filled` or `data-invalid` (or a filled `left` slot) floats the label onto the top border as
a pill (scaled, with its own border and background). The pill's border and outline fade in only as the label reaches the top border (the last 40%
of the move) and fade out at once when it drops back, so they never show inside the field. Its
background does the opposite (opaque at once, fading only after the label has left the border),
so the field's border line never shows through the label text. The label stays on one line with an ellipsis. The
description moves after the control and error.

> **Changed 2026-11-23**: `outlined` used to render the control with no border at all and the
> label above it. It now has the floating label described above.

> **Changed 2026-10-16**: state used to be bare classes, which collide with common consumer CSS
> (an unlayered `.error` or `.normal` rule would restyle the field). Select on the attributes
> above instead:
>
> - `.input-textarea-wrapper.normal` / `.underlined` / `.outlined` → `[data-input-variant="…"]`
> - `.input-textarea-wrapper.dirty` / `.active` / `.error` → `[data-dirty]` / `[data-active]` /
>   `[data-invalid]`; `.has-left-slot` / `.has-right-slot` → `[data-has-left-slot]` /
>   `[data-has-right-slot]`
> - `.slot.left-slot` / `.slot.right-slot` → `.input-textarea-slot-left` /
>   `.input-textarea-slot-right`
> - `.input-textarea-core` → `.input-textarea` (no longer carries `dirty`/`active` classes)
> - `.input-textarea-with-label` → `.input-textarea-field`, now the Field's root (it used to sit
>   inside an unclassed `<div>`); its variant/`dirty`/`active` classes → the attributes above
>
> Also: the textarea keeps typed line breaks and wraps long unbroken strings (`white-space:
> pre-wrap`, `overflow-wrap: anywhere`), and the Field wraps long label, description and error
> copy.

---

## Global theming

```css
:where(html) {
  --input-textarea-surface: var(--rose-09);
  --input-textarea-border: var(--rose-05);
  --input-textarea-max-height: 20lh;
}
```

Only declare the tokens you want to change — everything else keeps inheriting the shared
`--theme-input-*`/`--theme-*` tokens.

---

## Recipe: slot icon on the first line

Top-align the slots and pad them by the textarea's own block padding, so an icon lines up with the
first line of text instead of the middle of a tall field:

```css
.contact-form {
  --input-textarea-slot-align: start;
  --input-textarea-slot-padding-block: var(--form-textarea-padding-block);
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat**: `InputTextarea`'s own passthrough lands on the `<textarea>`, which has no descendants,
so tokens set through it only reach the textarea itself (text, placeholder colour and the height
tokens). Set the others on the Field root or an ancestor.

### One instance

```vue
<InputTextareaField
  v-model="message"
  name="message"
  label="Message"
  error-message=""
  style="--input-textarea-border: var(--gold-04);"
/>
```

---

## Class passthrough

`InputTextarea`'s `:style-class-passthrough` lands on the native
`<textarea class="input-textarea">`. `InputTextareaField`'s lands on its root
`.input-textarea-field` only.

> **Changed 2026-10-16**: `InputTextareaWithLabel` applied its passthrough classes to both its
> root and the inner textarea. If you styled the textarea that way, select
> `.your-class .input-textarea` instead.
