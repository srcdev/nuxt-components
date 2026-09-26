# FormFieldset — Consumer Styling Guide

`FormFieldset` is the `<fieldset>` + `<legend>` wrapper that `SingleCheckbox`,
`MultipleCheckboxes` and `MultipleRadiobuttons` render around their controls. It resets the
native fieldset chrome (no border, margin or padding) and styles the legend.

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--form-fieldset-margin-block` | `0` | Fieldset block margin |
| `--form-fieldset-margin-inline` | `0` | Fieldset inline margin |
| `--form-fieldset-padding-block` | `0` | Fieldset block padding |
| `--form-fieldset-padding-inline` | `0` | Fieldset inline padding |
| `--form-fieldset-border` | `0` | Fieldset `border` shorthand, e.g. `1px solid var(--theme-border)` |
| `--form-fieldset-border-radius` | `0` | Fieldset corner radius |
| `--form-fieldset-outline` | `0` | Fieldset `outline` shorthand |
| `--form-fieldset-outline-offset` | `0` | Fieldset outline offset |
| `--form-fieldset-content-margin-block` | `0` | Block margin of the `.form-fieldset-content` wrapper |
| `--form-fieldset-content-margin-inline` | `0` | Inline margin of the `.form-fieldset-content` wrapper |
| `--form-fieldset-legend-color` | `inherit` | Legend text colour |
| `--form-fieldset-legend-font-size` | `var(--step-5)` | Legend font size |
| `--form-fieldset-legend-font-weight` | `normal` | Legend font weight |
| `--form-fieldset-legend-line-height` | `1.5` | Legend line height |
| `--form-fieldset-legend-margin-block` | `0.8rem` | Space above and below the legend |
| `--form-fieldset-legend-margin-inline` | `0` | Legend inline margin |

`--form-fieldset-legend-color` previously had no fallback and wasn't declared anywhere in the
layer, so it silently resolved to the inherited colour. The `inherit` fallback keeps that
behaviour; setting the token now works as expected.

---

## State hooks

| Selector | When |
|---|---|
| `.form-fieldset[aria-invalid="true"]` | `field-has-error` is `true` |
| `.form-fieldset[role="radiogroup"]` | Rendered by `MultipleRadiobuttons` (`group-role="radiogroup"`) |

> **Changed 2026-09-26**: the fieldset no longer adds a bare `.error` class in the error state.
> Target `[aria-invalid="true"]` instead.

The wrapping components add their own class too (`.single-checkbox-fieldset`,
`.multiple-checkboxes-fieldset`, `.multiple-radiobuttons-fieldset`), so you can scope overrides
to one kind of group.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --form-fieldset-legend-font-size: var(--step-3);
  --form-fieldset-legend-font-weight: 600;
}
```

---

## Scoped overrides

```css
.contact-page {
  .multiple-checkboxes-fieldset {
    --form-fieldset-legend-color: var(--slate-09);
  }

  .form-fieldset[aria-invalid="true"] {
    --form-fieldset-legend-color: var(--red-07);
  }
}
```

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the `<fieldset>`.
