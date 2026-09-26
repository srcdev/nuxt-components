# FormField Component

## Overview

`FormField` is a layout-only wrapper for a single form control inside a form. It caps the
field's width (`narrow`/`medium`/`wide`), centres it with `margin-inline: auto`, optionally insets
it from its container edges with a gutter, and applies the shared vertical field spacing
(`--field-margin-block`). It renders no label, input or error text itself: put an `*Field`
component (`InputTextWithLabel`, `InputNumberField`, `InputSelectWithLabel`, ...) in its default
slot.

Typical use inside `FormWrapper` / a pattern form: `<FormField width="wide" :has-gutter="false">`
around each control, so the form's own container controls the width.

---

## Props reference

> **Hyphenation rule**: write camelCase props hyphenated in templates: `:has-gutter`, `:field-has-error`, `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `width` | `"narrow" \| "medium" \| "wide"` | `"narrow"` | Max width: 400px / 800px / 1200px by default (each a public token). Rendered as `data-width` on the root. |
| `:has-gutter` | `boolean` | `true` | Insets the field by `--form-field-gutter-width` (1.6rem) on each side. Rendered as `data-has-gutter`. Pass `false` when the parent already handles inline padding. |
| `:field-has-error` | `boolean` | `false` | Adds `data-invalid` to the root. This is load-bearing, not just a hook: the global theming stylesheets (`_error.css`, `_theme-slots.css`, `theme-ramp.css`) treat `[data-invalid]` like `[data-theme="error"]` and re-evaluate the `--theme-*` ramp there, so every descendant control inherits the red error theme. Must stay a data attribute, not a class. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root `.form-field`, via `useStyleClassPassthrough` (reacts to prop changes). |

## Slots

| Slot | Notes |
|------|-------|
| `default` | The form control. Rendered inside `.form-field-inner`. |

---

## Usage

```vue
<FormField width="wide" :has-gutter="false" :field-has-error="!!errors.email">
  <InputTextWithLabel
    v-model="state.email"
    name="email"
    label="Email"
    :error-message="errors.email"
    :field-has-error="!!errors.email"
  />
</FormField>
```

---

## Styling

Full token table in `app/components/05.forms/form-field/CONSUMER-STYLING.md`. Public tokens:
`--form-field-max-width-narrow|medium|wide`, `--form-field-gutter-width`,
`--form-field-margin-block`, `--form-field-background-color`, `--form-field-border-radius`.
Target state via `.form-field[data-width="wide"]`, `.form-field[data-has-gutter]`,
`.form-field[data-invalid]`.

---

## History

**Migrated 2026-09-26** (0/5 → full compliance):

- Width and gutter modifiers moved from bare classes (`.narrow`, `.medium`, `.wide`, `.has-gutter`)
  to `data-width` / `data-has-gutter`. The bare names collide with common consumer utility
  classes (same bug class as pitfall #16). No layer consumer targeted the old classes.
- `data-invalid` now renders as `""` / absent, matching every other `05.forms` component (was
  `"true"` / absent). `[data-invalid]` selectors are unaffected.
- Removed a dead `&:has(.underline)` rule: no component renders `.underline` (inputs use
  `.underlined`), and the token it set (`--theme-form-input-bg-underlined`) was never declared.
  Use `--form-field-background-color` scoped to `.form-field:has(.underlined)` if you want that effect.
- Removed zero-width debug `outline` declarations and the duplicated background/radius on
  `.form-field-inner` (it sat exactly on top of the root with the same values).
- Private-only `--_background-color` / `--_border-radius` / `--_max-width` values promoted to
  public tokens; `--_max-width` and `--_gutter-width` remain private as state-swapped intermediates.
- `styleClassPassthrough` widened from `string` to `string | string[]` and wired through
  `useStyleClassPassthrough`.
