# FormWrapper — Consumer Styling Guide

`FormWrapper` is the outer container around a whole form. It caps the form's width
(`narrow`/`medium`/`wide`) and adds space below it. Individual fields inside are wrapped in
`FormField`, which has its own width cap (see its CONSUMER-STYLING.md).

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--form-wrapper-max-width-narrow` | `400px` | Max width when `width="narrow"` (the default) |
| `--form-wrapper-max-width-medium` | `800px` | Max width when `width="medium"` |
| `--form-wrapper-max-width-wide` | `1200px` | Max width when `width="wide"` |
| `--form-wrapper-container-type` | `inline-size` | `container-type` of the wrapper. Set to `normal` to opt out of containment |
| `--form-wrapper-margin-block` | `0` | Block margin (space outside the wrapper, above and below) |
| `--form-wrapper-margin-inline` | `0` | Inline margin. Set to `auto` to centre the form in its container |
| `--form-wrapper-padding-block` | `0 2rem` | Space above and below the form (`padding-block` shorthand: start, end) |
| `--form-wrapper-padding-inline` | `0` | Inline padding |
| `--form-wrapper-border` | `0` | `border` shorthand, e.g. `1px solid var(--theme-border)` |
| `--form-wrapper-border-radius` | `0` | Corner radius |
| `--form-wrapper-outline` | `0` | `outline` shorthand |
| `--form-wrapper-outline-offset` | `0` | Outline offset |

Private token (not public API): `--_max-width`, which the `width` prop switches.

The wrapper also sets `margin-trim: block`, so the first and last children's outer block margins
are trimmed in browsers that support it (Safari today). Elsewhere it has no effect.

---

## Container queries

The wrapper is a size container named `form-wrapper` (`container: form-wrapper / inline-size`), so
anything inside the form can respond to the form's width rather than the viewport:

```css
@container form-wrapper (width > 60rem) {
  .my-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

`inline-size` containment means the wrapper's width no longer comes from its content. As a normal
block element it just fills its container (up to its max width), so nothing changes. But inside a
shrink-to-fit parent (e.g. a flex item with no set width, or `width: fit-content`) it collapses to
zero width. Give it an explicit width there, or set `--form-wrapper-container-type: normal`.

---

## State hooks

| Attribute | When |
|---|---|
| `data-width="narrow" \| "medium" \| "wide"` | Always, mirrors the `width` prop |

> **Changed 2026-09-26**: width used to be a bare class (`.narrow`, `.medium`, `.wide`). Update
> any `.form-wrapper.medium` selector to `.form-wrapper[data-width="medium"]`. Plain
> `.form-wrapper` selectors are unaffected.

Don't reuse the `form-wrapper` class on your own `<form>` inside a `FormWrapper`. The component's
styles would apply to both elements, doubling the bottom padding.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --form-wrapper-max-width-medium: 72rem;
  --form-wrapper-margin-inline: auto;
}
```

---

## Scoped overrides

```css
.contact-page {
  .form-wrapper {
    --form-wrapper-padding-block: 1.6rem 0;
  }
}
```

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the root `.form-wrapper` element.
