# InputSelect — Consumer Styling Guide

> **Renamed 2026-10-16**: `InputSelectCore` → `InputSelect`, `InputSelectWithLabel` →
> `InputSelectField`. Class changes are listed under "State hooks" below.

## Public token API

Every colour token below is `var(--input-select-*, {default})` — set the `--input-select-*` name
to override just this component; leave it unset and it inherits the shared `--theme-input-*`/
`--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

### Control

| Token | Default | Controls |
|---|---|---|
| `--input-select-surface` | `var(--theme-input-surface)` | Wrapper/select background |
| `--input-select-text-color` | `var(--theme-input-text-color-normal)` | Select text colour (added 2026-10-16; it inherited the page colour before) |
| `--input-select-border` | `var(--theme-border)` | Border colour (`normal`/`underlined` variants and the open picker, resting) |
| `--input-select-border-hover` | the resolved border (`normal`), `var(--theme-border-focus)` (`underlined`) | Outline colour on hover (mouse): 1px with no offset on `normal`, 2px at a 2px offset on `underlined` |
| `--input-select-shadow` | `var(--form-element-shadow-colour, var(--colour-theme-2))` | Resting shadow ring outside the border (`normal` only). Width is the global `--form-element-shadow-width` (`0.2rem`; `0` removes it) |
| `--input-select-border-focus` | `var(--theme-border-focus)` | Outline colour on `:focus-visible` (keyboard/assistive), and the open picker's outline |

### Options

| Token | Default | Controls |
|---|---|---|
| `--input-select-surface-hover` | `var(--theme-input-surface-hover)` | Option row background on hover |
| `--input-select-option-gap` | `1.5rem` | Gap between an option's icon and its label |
| `--input-select-option-icon-size` | `1.5rem` | Option icon width and height |

Geometry (`--input-padding-*`, `--input-min-height`, `--input-select-option-min-height`,
`--form-element-*`, etc.) is shared across every `05.forms` component and untouched by this — see
`theming-form-geometry-tokens.md`.

Private (not public API): `--_border` and `--_border-focus`, each resolved once and read in several
places.

Option rows (`--input-select-surface-hover`, the gap and the icon) and the open picker's border are
only styled where the browser supports `appearance: base-select`. Elsewhere the native dropdown
shows and ignores them.

---

> **Changed 2026-10-17**: bordered controls carry a light shadow ring (`box-shadow`, theme step 2,
> so red when invalid), and hover draws a 1px outline in the border colour with no offset, over the
> ring's inner edge. Hover used to draw a 2px outline at a 2px offset in the focus colour. Focus is
> unchanged and sits just outside the ring.

## State hooks

| Attribute | On | When |
|---|---|---|
| `data-input-variant="normal" \| "outlined" \| "underlined"` | `.input-select-wrapper`, `.input-select-field` | Always, mirrors `input-variant` |
| `data-theme` | `.input-select-wrapper`, `.input-select-field` | Always. The Field's own is the `theme` prop; the inner wrapper's switches to `error` while `field-has-error` is set |
| `data-invalid` | `.input-select-wrapper`, `.input-select-field` | `field-has-error` |
| `data-dirty` | `.input-select-wrapper` | The value has changed (the `is-dirty` model) |
| `data-active` | `.input-select-wrapper` | The select has focus (the `is-active` model) |

Inner elements: `.input-select` (the native select), `.input-select-option` (each option),
`.input-select-option-placeholder` (the placeholder option), `.input-select-option-icon`,
`.input-select-label` (the Field's `InputLabel`), `.input-text-description` (the Field's
`InputDescription`, shared with the other Field components).

`outlined` has no CSS of its own: the control renders with no border or outline. In the Field it
moves the description after the control and error.

> **Changed 2026-10-16**: state used to be bare classes, which collide with common consumer CSS
> (an unlayered `.error` or `.normal` rule would restyle the field). Select on the attributes
> above instead:
>
> - `.input-select-wrapper.normal` / `.underlined` / `.outlined` → `[data-input-variant="…"]`
> - `.input-select-wrapper.dirty` / `.active` / `.error` → `[data-dirty]` / `[data-active]` /
>   `[data-invalid]`
> - `.input-select-core` → `.input-select`; `.input-select-core-option` → `.input-select-option`;
>   `option.placeholder` → `.input-select-option-placeholder`;
>   `.input-select-core-option-decorator-icon` → `.input-select-option-icon`
> - `.input-select-with-label` → `.input-select-field`, which is now the root (it used to sit
>   inside an unclassed `<div>`); its `.error`, variant, `dirty` and `active` classes are gone, use
>   `[data-invalid]` / `[data-input-variant]`, or the inner wrapper's attributes
> - the Field's default `data-testid` is `input-select-field` (was `input-select-with-label`)
>
> Also: long label, description and error copy now wraps (`overflow-wrap: anywhere` on
> `.input-select-field`), and long option labels wrap in the open picker.

---

## Global theming

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

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

```vue
<InputSelectField
  v-model="country"
  v-model:field-data="countries"
  name="country"
  label="Country"
  :error-message="errors.country"
  style="--input-select-border-focus: var(--gold-04);"
/>
```

---

## Class passthrough

`InputSelect`'s `:style-class-passthrough` lands on the native `<select class="input-select">`.
`InputSelectField`'s lands on its root `.input-select-field` only.

> **Changed 2026-10-16**: `InputSelectWithLabel` forwarded its passthrough classes to the inner
> select instead of its own root. If you styled the select through the Field's passthrough, select
> `.your-class .input-select` instead.
