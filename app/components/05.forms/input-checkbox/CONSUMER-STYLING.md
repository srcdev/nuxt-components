# MultipleCheckboxes / SingleCheckbox — Consumer Styling Guide

## Public token API

These two components are layout wrappers: a `FormFieldset` holding one or more checkbox controls
plus an error message. They only own the spacing of the items container. The checkbox controls'
colours, borders and pill/button styling come from `InputCheckboxRadioCore`/
`InputCheckboxRadioButton`. See `../input-checkbox-radio/CONSUMER-STYLING.md` for those
(`--input-checkbox-*` tokens).

### MultipleCheckboxes (`.multiple-checkboxes-items`)

| Token | Default | Controls |
|---|---|---|
| `--multiple-checkboxes-gap` | `1.2rem` | Gap between checkbox items |
| `--multiple-checkboxes-margin-block-start` | `1.2rem` | Space between the legend/description and the items |

With `options-layout="equal-widths"` (the default), the column minimum width is measured at
runtime from the widest option label (`useMaxChildWidth`) plus the shared
`--input-checked-icon-gap` and `--input-checkbox-label-padding-inline` form tokens, so every
column matches the longest label. It has no token of its own; adjust those shared tokens if the
columns need more room.

### SingleCheckbox (`.single-checkbox-items`)

| Token | Default | Controls |
|---|---|---|
| `--single-checkbox-gap` | `1.2rem` | Gap inside the items container |
| `--single-checkbox-margin-block-start` | `1.2rem` | Space between the legend/description and the checkbox |
| `--single-checkbox-column-min-width` | `100px` | Grid column minimum width with `options-layout="equal-widths"` |

---

## Global theming: app-level CSS file

```css
:where(html) {
  --multiple-checkboxes-gap: 0.8rem;
  --single-checkbox-margin-block-start: 0.6rem;
}
```

---

## Per-instance overrides

Both components apply `styleClassPassthrough` to their root `<fieldset>`, alongside a fixed
`multiple-checkboxes-fieldset` / `single-checkbox-fieldset` class. Scope overrides with either:

```vue
<MultipleCheckboxes
  v-model="state.services"
  v-model:field-data="servicesData"
  name="services"
  legend="Services of interest"
  error-message=""
  :style-class-passthrough="['services-field']"
/>
```

```css
.services-field {
  --multiple-checkboxes-gap: 0.6rem;
}
```

Or set a token inline:

```vue
<SingleCheckbox v-model="state.terms" name="terms" legend="Terms" error-message="" style="--single-checkbox-margin-block-start: 0;" />
```
