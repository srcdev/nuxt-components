# FormField — Consumer Styling Guide

`FormField` is a layout wrapper for one form control (typically an `*Field` component such as
`InputTextWithLabel` or `InputNumberField`). It caps the field's width, centres it, optionally
insets it from its container's edges with a gutter, and applies vertical spacing between fields.

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--form-field-max-width-narrow` | `400px` | Max width when `width="narrow"` (the default) |
| `--form-field-max-width-medium` | `800px` | Max width when `width="medium"` |
| `--form-field-max-width-wide` | `1200px` | Max width when `width="wide"` |
| `--form-field-gutter-width` | `1.6rem` | Inline inset on each side when `has-gutter` is on (the default) |
| `--form-field-margin-block` | `var(--field-margin-block)` (`0 1.6rem`) | Vertical spacing around the field |
| `--form-field-background-color` | `transparent` | Wrapper background |
| `--form-field-border-radius` | `0.4rem` | Wrapper corner radius (only visible once a background is set) |

`--field-margin-block` is the shared form-layout token from
`assets/styles/setup/04.elements/forms/01.field-layout-container-level.css`; overriding it
changes the spacing of every `FormField` at once, `--form-field-margin-block` changes only the
ones in scope.

Private tokens (not public API): `--_max-width` (swapped by the `width` prop) and
`--_gutter-width` (swapped by `has-gutter`).

---

## State hooks

The root `.form-field` element carries these attributes, which are safe to target in consumer CSS:

| Attribute | When |
|---|---|
| `data-width="narrow" \| "medium" \| "wide"` | Always, mirrors the `width` prop |
| `data-has-gutter` | `has-gutter` is `true` |
| `data-invalid` | `field-has-error` is `true`. Also switches every descendant to the red error theme, via the global `:where([data-invalid])` theming rules |

> **Changed 2026-09-26**: width/gutter used to be bare classes (`.narrow`, `.medium`, `.wide`,
> `.has-gutter`) and `data-invalid` rendered as `"true"`. Update any `.form-field.wide` selector to
> `.form-field[data-width="wide"]`; `[data-invalid]` selectors keep working.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --form-field-max-width-narrow: 48rem;
  --form-field-gutter-width: 2.4rem;
}
```

---

## Per-instance overrides

```vue
<FormField width="wide" style="--form-field-background-color: var(--slate-01);">
  <InputTextWithLabel ... />
</FormField>
```

Or scoped by a page/section wrapper class:

```css
.contact-page {
  .form-field {
    --form-field-margin-block: 0 2.4rem;
  }

  .form-field[data-invalid] {
    --form-field-background-color: var(--red-01);
  }
}
```

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the root `.form-field` element.
