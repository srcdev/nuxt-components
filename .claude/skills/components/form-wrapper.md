# FormWrapper Component

## Overview

`FormWrapper` is the outer container for a whole form. It caps the form's width
(`narrow`/`medium`/`wide`) and adds bottom padding. Put your own `<form>` element inside it, and
wrap each control in `FormField`. `FormField` has its own width cap, and the usual pattern is
`<FormField width="wide" :has-gutter="false">` so each field fills the `FormWrapper`.

It is a named size container (`@container form-wrapper (...)`) so the form's children can use
container queries against the form's width. See CONSUMER-STYLING.md for the shrink-to-fit caveat.

It is not centred by default (unlike `FormField`). Set `--form-wrapper-margin-inline: auto` to
centre it.

---

## Props reference

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `width` | `"narrow" \| "medium" \| "wide"` | `"narrow"` | Max width: 400px / 800px / 1200px by default (each a public token). Rendered as `data-width`. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root `.form-wrapper`, via `useStyleClassPassthrough` (reacts to prop changes). |

## Slots

| Slot | Notes |
|------|-------|
| `default` | The form. |

---

## Usage

```vue
<FormWrapper width="medium">
  <form @submit.prevent="submitForm">
    <FormField width="wide" :has-gutter="false">
      <InputTextWithLabel ... />
    </FormField>
  </form>
</FormWrapper>
```

Don't also give the inner `<form>` a `form-wrapper` class (an old nuxt-forms habit): the
component's styles then apply twice.

---

## Styling

Full table in `app/components/05.forms/form-wrapper/CONSUMER-STYLING.md`. Public tokens:
`--form-wrapper-max-width-narrow|medium|wide`, `--form-wrapper-margin-block|margin-inline`, `--form-wrapper-container-type`,
`--form-wrapper-padding-block|padding-inline`, `--form-wrapper-border|border-radius|outline|outline-offset`. Target width via
`.form-wrapper[data-width="medium"]`.

---

## History

**Migrated 2026-09-26** (0/5 → full compliance):

- Width modifier moved from bare classes (`.narrow`, `.medium`, `.wide`) to `data-width`, the
  same fix as `FormField` (the bare names collide with consumer utility classes). The only known
  consumer, guidemyhair, only targets plain `.form-wrapper`, which still works.
- Removed a zero-width debug `outline`.
- Hardcoded max widths and `padding-bottom: 2rem` (now `--form-wrapper-padding-block: 0 2rem`) became public tokens, with the old values as
  defaults. Added margin-block, margin-inline, padding-inline, border, border-radius, outline and outline-offset tokens defaulting to `0`, so nothing changes visually.
- Added `styleClassPassthrough`.
- Made the wrapper a named inline-size container (`form-wrapper`) for child container queries;
  `--form-wrapper-container-type: normal` opts out.
