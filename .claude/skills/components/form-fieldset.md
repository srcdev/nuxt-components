# FormFieldset Component

## Overview

`FormFieldset` is the shared `<fieldset>` + `<legend>` wrapper for grouped form controls. It is
mostly an internal building block: `SingleCheckbox`, `MultipleCheckboxes` and
`MultipleRadiobuttons` all render it and pass their own props through. Reach for those components
first. Use `FormFieldset` directly only when building a new grouped control.

It removes the native fieldset border/margin/padding, styles the legend, and handles the group's
ARIA semantics.

---

## Props reference

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Fieldset `id`. |
| `:name` | `string` | (required) | Fieldset `name` (valid on `<fieldset>`, exposes it via `form.elements`). |
| `:legend` | `string` | `""` | Legend text. The legend renders when this or the `legend` slot is given. |
| `group-role` | `"group" \| "radiogroup"` | `"group"` | `"group"` renders no `role` attribute (a fieldset's native role is already `group`). `"radiogroup"` sets `role="radiogroup"`: use it for radio buttons only. |
| `:required` | `boolean` | `false` | Sets `aria-required="true"` **only** when `group-role="radiogroup"`. `aria-required` isn't allowed on `role="group"`, so checkbox groups get nothing; put "(required)" in the legend text instead. |
| `:field-has-error` | `boolean` | `false` | Sets `aria-invalid` on the fieldset. |
| `:data-testid` | `string` | `""` | Passed to the fieldset. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the fieldset, via `useStyleClassPassthrough` (reacts to prop changes). |

## Slots

| Slot | Notes |
|------|-------|
| `legend` | Replaces the legend text. Renders even without a `legend` prop. |
| `content` | The grouped controls, rendered in `.form-fieldset-content`. |

---

## Usage

```vue
<FormFieldset id="contact-preference" name="contactPreference" legend="How should we contact you?" group-role="radiogroup" required>
  <template #content>
    <!-- radio controls -->
  </template>
</FormFieldset>
```

---

## Styling

Full table in `app/components/05.forms/form-fieldset/CONSUMER-STYLING.md`. Public tokens: fieldset
`--form-fieldset-margin-block|margin-inline|padding-block|padding-inline|border|border-radius|outline|outline-offset`,
content `--form-fieldset-content-margin-block|margin-inline`, legend
`--form-fieldset-legend-color|font-size|font-weight|line-height|margin-block|margin-inline`. Error state hook:
`.form-fieldset[aria-invalid="true"]`.

---

## History

**Migrated 2026-09-26** (0/5 → full compliance):

- **Role bug fixed:** `role="radiogroup"` used to be hardcoded, so screen readers announced
  checkbox groups (`SingleCheckbox`, `MultipleCheckboxes`) as radio groups. New `groupRole` prop
  defaults to the native `group`; `MultipleRadiobuttons` passes `group-role="radiogroup"`.
- `aria-required` is now limited to `radiogroup`, where ARIA allows it.
- Legend slot now renders without a `legend` prop (it used to be gated on the prop).
- Removed a dead `has-description` legend class and `.form-fieldset-description` CSS: they
  referred to a `description` slot the template never rendered. The wrapping components render
  descriptions through `InputDescription` inside `content`.
- Removed the bare `.error` class (collision-prone, nothing styled it). Use `[aria-invalid="true"]`.
- `--form-fieldset-legend-color` had no fallback and no declaration in the layer; it now falls
  back to `inherit` (the previous effective behaviour). The legend's size, weight, line height and
  margin became public tokens with the old values as defaults.
- `styleClassPassthrough` changes after mount are now picked up (added the `watch`/reset).
