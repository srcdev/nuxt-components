# Breadcrumb — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--breadcrumb-font-size` | `1.3rem` | Font size of the whole trail |
| `--breadcrumb-gap` | `0.8rem` | Gap between an item's label and its separator, and between items |
| `--breadcrumb-text-transform` | `uppercase` | Text transform of the whole trail |
| `--breadcrumb-letter-spacing` | `0.05em` | Letter spacing of the whole trail |
| `--breadcrumb-colour` | `currentColor` | Colour of links, separators, and non-current labels |
| `--breadcrumb-colour-current` | `currentColor` | Colour of the current-page item (the one without a `to`) |
| `--breadcrumb-link-decoration-hover` | `underline` | `text-decoration` on link hover/focus |

```css
.breadcrumb {
  --breadcrumb-colour: white;
  --breadcrumb-colour-current: var(--colour-text-accent);
}
```

## Text content — props, not CSS

`items` and `separator` are props. There is no hardcoded copy to override in CSS.

## Notes

- An item renders as a `NuxtLink` when it has a `to`, otherwise as `<span aria-current="page">` —
  omit `to` on whichever item represents the current page (usually the last one).
- The separator (`aria-hidden="true"`) is only rendered between items, never after the last one.
- `--breadcrumb-colour` is what `ServiceDetail` overrides internally (to `white` by default) so
  the breadcrumb reads over its hero image — see `ServiceDetail`'s `CONSUMER-STYLING.md`.
