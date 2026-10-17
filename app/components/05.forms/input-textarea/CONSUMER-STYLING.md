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
| `--input-textarea-border` | `var(--theme-border)` | Border colour (`normal`/`underlined` variant border) |
| `--input-textarea-border-hover` | the resolved border | 1px wrapper outline colour on mouse hover (`normal` only) |
| `--input-textarea-shadow` | `var(--form-element-shadow-colour, var(--colour-theme-2))` | Resting shadow ring outside the border (`normal` only). Width is the global `--form-element-shadow-width` (`0.2rem`; `0` removes it) |
| `--input-textarea-border-focus` | `var(--theme-border-focus)` | Wrapper outline colour on `:focus-visible` (`normal` only) |
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

Geometry (`--form-textarea-padding-block`, `--form-textarea-padding-inline`, `--input-font-size`,
`--input-textarea-line-height`, `--input-padding-inline`, etc.) is shared across every `05.forms`
component and untouched by this — see `theming-form-geometry-tokens.md`.

Private (not public API): `--_border`, resolved once and read by both border variants.

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
| `data-has-left-slot` / `data-has-right-slot` | `.input-textarea-wrapper` | The `left` / `right` slot is filled |

Inner elements: `.input-textarea` (the native textarea), `.input-textarea-slot` (both slot
holders), `.input-textarea-slot-left`, `.input-textarea-slot-right`, `.input-textarea-label` (the
Field's `InputLabel`), `.input-text-description` (the Field's `InputDescription`, shared with the
other Field components).

`outlined` has no CSS of its own: the control renders with no border or outline. In the Field it
moves the description after the control and error.

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
