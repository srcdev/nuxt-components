# InputCheckboxRadio / InputCheckboxRadioField / InputCheckboxRadioButton — Consumer Styling Guide

Three components share this folder and its tokens:

- `InputCheckboxRadio`: the bare control (the square or circle over a hidden native input).
- `InputCheckboxRadioField`: the control plus a text label, used by `SingleCheckbox` and the
  non-button mode of `MultipleCheckboxes`/`MultipleRadiobuttons`.
- `InputCheckboxRadioButton`: the whole option drawn as a button or pill (`is-button` mode of
  those group components).

> **Renamed 2026-09-27**: `InputCheckboxRadioCore` → `InputCheckboxRadio`,
> `InputCheckboxRadioWithLabel` → `InputCheckboxRadioField`. Classes changed with them, see
> **State hooks**. Token names are unchanged.

## Public token API

Colour tokens fall back to the shared `--theme-*` slots, so overriding one only affects these
components. See `theming-component-token-pattern.md` for the two-tier shape. Geometry tokens
(`--input-checked-element-size`, `--form-element-*`, etc.) are shared by every form control and
declared in `04.elements/forms/03.generic-input-geometry.css`; see `theming-form-geometry-tokens.md`.

### The control (`InputCheckboxRadio`, `.input-checkbox-radio`)

| Token | Default | Controls |
|---|---|---|
| `--input-checkbox-surface` | `var(--theme-checkbox-symbol-surface)` | Background |
| `--input-checkbox-border` | `var(--theme-border)` | Border colour |
| `--input-checkbox-border-focus` | `var(--theme-border-focus)` | Outline colour on `:focus-visible` (not in button mode, the button draws its own) |
| `--input-checkbox-icon-color` | `var(--theme-text)` | Checked icon colour |
| `--input-checkbox-transition-duration` | `var(--theme-form-transition-duration)` (`0.2s`) | Border/background and icon fade transitions, all three components |

Shared geometry it reads: `--input-checked-element-size` (box size, `3rem`),
`--input-checked-icon-size` (checked icon `font-size`, `2.6rem`), `--form-input-border-radius`
(checkbox corners), `--form-element-outline-width*`/`--form-element-outline-offset-focus`.

### The labelled field (`InputCheckboxRadioField`, `.input-checkbox-radio-field`)

| Token | Default | Controls |
|---|---|---|
| `--input-checkbox-label-color` | `inherit` | Label text colour |
| `--input-checkbox-label-padding-block` | shared geometry, `0.8rem` | Label block padding |
| `--input-checkbox-label-padding-inline` | shared geometry, `1.2rem` | Label inline padding |

Also reads `--input-checked-icon-gap` (control to label gap) and `--input-min-height`.

### The button style (`InputCheckboxRadioButton`, `.input-checkbox-radio-button`)

| Token | Default | Controls |
|---|---|---|
| `--input-checkbox-button-surface` | `var(--theme-input-surface)` | Background (resting) |
| `--input-checkbox-button-border` | `var(--theme-border)` | Border colour |
| `--input-checkbox-button-surface-hover` | `var(--theme-input-surface-hover)` | Background on hover |
| `--input-checkbox-button-ring-hover` | `var(--theme-ring)` | Outline colour on hover |
| `--input-checkbox-button-surface-focus` | `var(--theme-surface-subtle)` | Background when the inner control has `:focus-visible` |
| `--input-checkbox-button-ring-focus` | `var(--theme-border-focus)` | Outline colour when the inner control has `:focus-visible` |
| `--input-checkbox-button-label-color` | `var(--theme-text)` | Option label colour |
| `--input-checkbox-button-icon-color` | `var(--theme-text)` | Trailing decorator icon colour |
| `--input-checkbox-button-border-radius` | `0.4rem` | Corner radius |
| `--input-checkbox-button-border-radius-pill` | `100vw` | Corner radius with `is-pill` |
| `--input-checkbox-button-gap` | `1rem` | Gap between control, label and icon |
| `--input-checkbox-button-padding-block` | `0.4rem` | Block padding |
| `--input-checkbox-button-padding-inline` | `1.2rem` | Inline padding |
| `--input-checkbox-button-label-padding-block` | `0.8rem` | Label block padding |
| `--input-checkbox-button-label-padding-inline` | `0.8rem` | Label inline padding |

Also reads `--input-checkbox-decorator-icon-size` (decorator icon `font-size`, `2rem`) and
`--input-font-size` (label).

Private (not public API): `--_transition-duration` (the control's resolved duration, shared by two
transitions), `--_icon-size` (the button shrinks the inner control's checked icon through it) and
`--_white-space` (the button label's wrapping, swapped by `data-options-layout="inline"`).

> **Changed 2026-09-27**:
>
> - The button's radius, gap and paddings were hardcoded; they're now tokens with the same defaults.
> - `--input-checkbox-button-label-color` fell back to `--colour-text-default`; it now falls back
>   to `--theme-text` like every other text colour here.
> - `--input-checkbox-decorator-icon-size` and the button's shrunken checked icon were applied as
>   `width`/`height`, which `@nuxt/icon` silently overrides (pitfall #24). They're now `font-size`,
>   so both tokens take effect for the first time: the `+` renders at `2rem` and the checked icon
>   inside a button at `--input-checked-icon-size` minus `0.8rem`.
> - `--input-checkbox-label-color` is new (was unstyled, so `inherit`).

---

## State hooks

| Attribute | On | When |
|---|---|---|
| `data-type="checkbox" \| "radio"` | `.input-checkbox-radio` | Always |
| `data-input-variant="normal" \| "outlined" \| "underlined"` | `.input-checkbox-radio` | Always (`underlined` squares off a checkbox) |
| `data-theme` | `.input-checkbox-radio`, `.input-checkbox-radio-button` | Always, mirrors `theme` |
| `data-button` | `.input-checkbox-radio` | Rendered inside `InputCheckboxRadioButton` |
| `data-display-as-disc` | `.input-checkbox-radio` | `display-as-disc` (rounds a checkbox, button mode only) |
| `data-invalid` | all three roots | The field has an error |
| `data-pill` | `.input-checkbox-radio-button` | `is-pill` |
| `data-direction="row" \| "row-reverse"` | `.input-checkbox-radio-button` | Always, mirrors `direction` |
| `data-options-layout` | `.input-checkbox-radio-button` | Always, mirrors `options-layout` (`inline` stops the label wrapping) |

Inner elements: `.input-checkbox-radio-icon-slot` (holds the `checkedIcon` slot or the default
`.input-checkbox-radio-icon`), `.input-checkbox-radio-input` (the hidden native input),
`.input-checkbox-radio-field-label`, `.input-checkbox-radio-button-label`,
`.input-checkbox-radio-button-icon`.

> **Changed 2026-09-27**: state used to be bare classes (`.checkbox`, `.radio`, `.button`,
> `.display-as-disc`, `.normal`/`.underlined` on the control; `.error`, `.inline`, `.is-pill` on
> the label/button), which collide with common consumer CSS (an unlayered `.error` or `.button`
> rule would restyle these). Select on the attributes above. Class renames:
> `.input-checkbox-radio-wrapper` → `.input-checkbox-radio`, `.input-checkbox-radio-core` →
> `.input-checkbox-radio-input`, `.input-checked-icon-slot`/`-checked` →
> `.input-checkbox-radio-icon-slot`/`.input-checkbox-radio-icon`, `.input-checkbox-radio-with-label`
> → `.input-checkbox-radio-field`, `.input-checkbox-radio-label` → `.input-checkbox-radio-field-label`,
> `.input-checkbox-radio-options-button[-label]` → `.input-checkbox-radio-button[-label]`,
> `.decorator-icon` → `.input-checkbox-radio-button-icon`.

---

## Global theming

```css
:where(html) {
  --input-checkbox-button-surface: var(--rose-09);
  --input-checkbox-button-surface-hover: var(--rose-08);
  --input-checkbox-button-ring-focus: var(--rose-04);
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat**: `MultipleCheckboxes`, `MultipleRadiobuttons` and `SingleCheckbox` don't forward
`style-class-passthrough` to these components (theirs lands on the fieldset), so set tokens on
the group's own passthrough class or a wrapper you own.

---

## Class passthrough

Each component's `:style-class-passthrough` (string or string array) adds classes to its own root:
`.input-checkbox-radio` for the control, the `<label>` for the Field and the Button. Reachable only
when you use them directly; the group components don't forward it.
