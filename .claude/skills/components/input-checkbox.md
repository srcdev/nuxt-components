# MultipleCheckboxes / SingleCheckbox Components

## Overview

The `input-checkbox` folder holds two ready-to-use checkbox fields. Each renders a `FormFieldset`
(with `<legend>`), an optional description, the checkbox control(s), and an `InputError` message,
with `aria-describedby` wired up via `useAriaDescribedById`.

- **MultipleCheckboxes**: a group of checkboxes built from a data list (`v-model:field-data`).
  The model is an array of the checked items' values. Each option renders as either a pill/button
  (`InputCheckboxRadioButton`, `:is-button="true"`) or a plain labelled checkbox
  (`InputCheckboxRadioWithLabel`, the default).
- **SingleCheckbox**: one labelled checkbox (e.g. "I agree to the terms"). The model toggles
  between `trueValue` and `falseValue`.

For a group where only one option can be chosen, use `MultipleRadiobuttons` (`input-radio`)
instead.

---

## MultipleCheckboxes

> **Hyphenation rule**: always write camelCase props hyphenated in templates: `:field-has-error`, `:is-button`, `:options-layout`.

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | Shared `name` on every checkbox; also used to build each checkbox `id` (`${name}-${item.value}`) and the error/description ids. |
| `legend` | `string` | (required) | Fieldset `<legend>` text. |
| `:error-message` | `string \| object` | (required) | Shown by `InputError` when `fieldHasError` is true. Pass `""` when there's no error. An array renders as a list. |
| `:field-has-error` | `boolean` | `false` | Shows the error, sets `aria-invalid` on the fieldset and points each checkbox's `aria-describedby` at the error. |
| `:required` | `boolean` | `false` | No ARIA output: `aria-required` isn't valid on a checkbox group (`role="group"`), so it was dropped from the fieldset 2026-09-26. Signal "required" in the legend text instead (e.g. "Interests (required)"). Native `required` is deliberately **not** put on the individual checkboxes, since that would force every box to be ticked. Validate "at least N selected" in the consuming app. |
| `:is-button` | `boolean` | `false` | Pill/button presentation (`InputCheckboxRadioButton`) instead of labelled checkboxes. |
| `:is-pill` | `boolean` | `false` | With `is-button`, fully rounded pills. |
| `:options-layout` | `OptionsLayout` | `"equal-widths"` | `"equal-widths"` (auto-fit grid, columns sized to the longest label), `"inline"` (wrapping row) or `"block"` (column). |
| `:direction` | `"row" \| "row-reverse"` | `"row"` | Button presentation only: icon/label order. |
| `:display-as-disc` | `boolean` | `false` | Round checkbox symbol. |
| `:theme` | `FormUiTheme` | `"default"` | Forwarded to each control. |
| `:input-variant` | `InputUiVariant` | `"normal"` | Forwarded to each control and the error message. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root `<fieldset>`. Read once at mount. |
| `data-testid` | `string` | `"multiple-checkboxes"` | On the root `<fieldset>`. |
| `label` | `string` | `""` | **Ignored.** Kept only so existing call sites that pass it don't break; it has never rendered. Use `legend` or the description slots. |

### v-models

- `v-model`: `(string | number | boolean)[]`, **required**. Bind an array (start with `[]`); checked values are added and removed from it.
- `v-model:field-data`: `IFormMultipleOptions` (`{ data: IOptionsConfig[]; total; skip; limit }`), **required**. Each `data` item's `value` is the checkbox value and `label` its text.

### Slots

| Slot | Notes |
|---|---|
| `descriptionText` / `descriptionHtml` | Description under the legend (via `InputDescription`). |
| `checkedIcon` | Replaces the checked-state icon in every control. |
| `itemIcon` | Button presentation only: the trailing decorator icon (default `material-symbols:add-2`). |

### Example

```vue
<MultipleCheckboxes
  v-model="state.services"
  v-model:field-data="servicesData"
  name="services"
  legend="Services of interest"
  :error-message="errors.services"
  :field-has-error="!!errors.services"
  options-layout="inline"
  :is-button="true"
/>
```

---

## SingleCheckbox

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | Checkbox `name`; also used for the error/description ids. |
| `legend` | `string` | (required) | Fieldset `<legend>` text. |
| `label` | `string` | `""` | Text next to the checkbox. Replaced by the `labelContent` slot when given. |
| `:error-message` | `string \| object` | (required) | Pass `""` when there's no error. |
| `:field-has-error` | `boolean` | `false` | Shows the error, sets `aria-invalid` on the fieldset and the checkbox's `aria-describedby`. |
| `:required` | `boolean` | `false` | Native `required` on the checkbox. (The fieldset no longer gets `aria-required`, see above.) |
| `:true-value` / `:false-value` | `string \| number \| boolean` | `true` / `false` | Model values for checked/unchecked. |
| `:options-layout` | `OptionsLayout` | `"equal-widths"` | Class on the items container. |
| `:theme` | `FormUiTheme` | `"default"` | |
| `:input-variant` | `InputUiVariant` | `"normal"` | |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root `<fieldset>`. Read once at mount. |
| `data-testid` | `string` | `"single-checkbox"` | On the root `<fieldset>`. |

### v-model

- `v-model`: `string | number | boolean`, **required**. Toggles between `trueValue` and `falseValue`. Works with `@update:model-value` for save-on-change settings toggles.

### Slots

`descriptionText` / `descriptionHtml`, `checkedIcon`, and `labelContent` (rich label, e.g. a
terms link).

### Example

```vue
<SingleCheckbox
  v-model="state.terms"
  name="terms"
  legend="Terms and conditions"
  label="I agree to the terms"
  :required="true"
  :error-message="errors.terms"
  :field-has-error="!!errors.terms"
/>
```

---

## CSS token API

See [CONSUMER-STYLING.md](../../../app/components/05.forms/input-checkbox/CONSUMER-STYLING.md).
These components own only the items-container spacing (`--multiple-checkboxes-gap`,
`--multiple-checkboxes-margin-block-start`, `--single-checkbox-gap`,
`--single-checkbox-margin-block-start`, `--single-checkbox-column-min-width`). The checkbox
controls' own colours are the `--input-checkbox-*` tokens in `input-checkbox-radio`.

---

## Migration notes (2026-09-25)

Brought to full compliance. Behaviour changes a consumer could notice:

- **MultipleCheckboxes no longer puts native `required` on every checkbox.** Previously each box
  got `required`, so a form without `novalidate` would refuse to submit until every option was
  ticked. `InputCheckboxRadioWithLabel`/`InputCheckboxRadioButton` now forward `multipleOptions`
  to `InputCheckboxRadioCore` (they declared it but dropped it), and `MultipleCheckboxes` passes
  `true`.
- **SingleCheckbox `styleClassPassthrough` now lands on the root `<fieldset>`**, matching
  `MultipleCheckboxes`. It was being applied to the error message.
- **SingleCheckbox default `data-testid` is now `"single-checkbox"`** (was a copy-paste
  `"multiple-radio-buttons"`).
- Removed never-used props: `placeholder`, `multipleOptions`, `equalCols` (MultipleCheckboxes);
  `multipleOptions`, `equalCols` (SingleCheckbox). MultipleCheckboxes' `label` became optional
  and stays ignored.
- Removed SingleCheckbox's dead `watchEffect` that tried to add `mbs-12` to the error message (it
  never reached the DOM, since `InputError` reads its classes once at mount).
- Both `v-model`s (and `v-model:field-data`) are now `defineModel({ required: true })`.
- Items-container spacing is now overridable via the public tokens above (defaults unchanged).

Fixed 2026-09-26 (FormFieldset migration): the shared `FormFieldset` used to hardcode
`role="radiogroup"`, so screen readers announced checkbox groups as radio groups. It now defaults
to the native fieldset `group` role; only `MultipleRadiobuttons` opts into `radiogroup`.
