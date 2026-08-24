# ServiceSummary — Consumer Styling Guide

## Public token API

All `--service-summary-*` tokens are the stable override surface. Set them globally in a
theme file, scoped to a page wrapper, or per-instance via `styleClassPassthrough`.

### Layout & sizing

| Token | Default | Controls |
|---|---|---|
| `--service-summary-grid-gap` | `2rem` | Gap between image and content columns below the 768px container breakpoint |
| `--service-summary-grid-gap-desktop` | `3rem` | Gap between columns at the 768px container breakpoint and above |
| `--service-summary-height-mobile` | `auto` | Height of the whole `.service-summary` row below the 768px container breakpoint. `auto` (the default) lets the row size to its content — the image sizes itself via `--service-summary-image-aspect-ratio` and the text column sizes to its own content. Set a fixed length to force both columns to share a common row height instead (the image then crops via `object-fit: cover` to fill it, and `alignment` positions the text within the leftover space) |
| `--service-summary-height-tablet` | `auto` (falls back to `--service-summary-height-mobile`) | Row height from the 768px container breakpoint |
| `--service-summary-height-desktop` | `auto` (falls back to `--service-summary-height-tablet`, then `-mobile`) | Row height from the 1024px container breakpoint |
| `--service-summary-image-aspect-ratio` | `1 / 1` | Aspect ratio of `.service-summary__image-wrapper` when its height isn't otherwise forced by a `--service-summary-height-*` override (i.e. the default, row-height-auto case) — has no visible effect once a row height override makes both dimensions definite |
| `--service-summary-image-padding-block-mobile` | `0` | Padding-block (top/bottom) inset around the image, inside `.service-summary__image-wrapper`, below the 768px container breakpoint — creates a visible frame/border effect since the image itself sizes to the wrapper's content box, not the padding box |
| `--service-summary-image-padding-block-tablet` | `0` (falls back to `-mobile`) | Padding-block from the 768px container breakpoint |
| `--service-summary-image-padding-block-desktop` | `0` (falls back to `-tablet`, then `-mobile`) | Padding-block from the 1024px container breakpoint |
| `--service-summary-image-padding-inline-mobile` | `0` | Padding-inline (left/right) inset around the image below the 768px container breakpoint |
| `--service-summary-image-padding-inline-tablet` | `0` (falls back to `-mobile`) | Padding-inline from the 768px container breakpoint |
| `--service-summary-image-padding-inline-desktop` | `0` (falls back to `-tablet`, then `-mobile`) | Padding-inline from the 1024px container breakpoint |
| `--service-summary-image-border-radius` | `0.8rem` | Corner rounding on the service image |
| `--service-summary-pills-gap` | `0.8rem` | Gap between the duration and price pills |
| `--service-summary-pills-margin-block-end` | `2rem` | Space below the pill row |

All breakpoints above (row height, image padding, and the two-column grid switch) are
**container queries** against `.service-summary`'s own inline size (`container-name:
service-summary`), not the viewport — this keeps the layout responsive to the space
`ServiceSummary` actually has, which matters when it sits next to a persistent side nav that a
viewport-based `@media` query can't see.

Below the 768px breakpoint the grid is a single stacked column (image above text), so a
`--service-summary-height-mobile` override sets a height for the *whole stack*, not just the
image — usually left `auto` on mobile and only set from `--service-summary-height-tablet` up,
where the layout is genuinely two columns side by side.

### Pill colours

The duration/price pills are `DisplayPill` instances — `ServiceSummary` maps its own tokens onto
`DisplayPill`'s `--theme-pill-*` custom properties scoped to `.service-summary__pills`:

| Token | Default | Controls |
|---|---|---|
| `--service-summary-pill-bg` | `transparent` | Background of the price/duration pills |
| `--service-summary-pill-colour` | `currentColor` | Text colour of the pills |
| `--service-summary-pill-border-colour` | `currentColor` | Border colour of the pills |

For anything not covered by these (e.g. pill size, font weight), target `--theme-pill-*` directly
under `.service-summary__pills` — see [display-pill.md](../../../../../.claude/skills/components/display-pill.md).

---

## Global theming — recommended approach

Create `assets/styles/setup/07.components/service-summary.css` in the consuming app and
set tokens on `:root`. This applies to every `ServiceSummary` across the site.

```css
/* assets/styles/setup/07.components/service-summary.css */
:root {
  --service-summary-grid-gap: 2.4rem;
  --service-summary-grid-gap-desktop: 4rem;
  --service-summary-image-border-radius: 1.2rem;
}
```

---

## Page-scoped overrides

Override tokens for a specific section by scoping them under the page or layout wrapper.
No `:deep()` is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.our-services-page {
  .service-summary {
    --service-summary-pill-border-colour: var(--brand-accent);
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct
visual style, pass a modifier class:

```vue
<ServiceSummary :style-class-passthrough="['highlight-service']" :service-data="service" />
```

```css
.service-summary.highlight-service {
  --service-summary-image-border-radius: 2rem;
}
```

---

## Notes

- `--service-summary-grid-gap-desktop` only applies at `768px` and above — the breakpoint
  itself is not a token, since changing it would affect the grid's `minmax()` column sizing
  too, not just spacing. The same 768px/1024px breakpoints are shared with the row-height
  tokens above.
- The row-height tokens live on `.service-summary` itself (the whole row), not on
  `.service-summary__image-wrapper` — `.service-summary__grid` and
  `.service-summary__image-wrapper` both inherit it via `height: 100%`, so overriding the row
  height also gives `alignment` real leftover space to position the text column within.
- `ServiceSummary` is summary-only — it has no "full mode". For a complete single-service page
  (process, ideal-for list, FAQs, booking CTA), use
  [ServiceDetail](../../../../../.claude/skills/components/service-detail.md) instead.
