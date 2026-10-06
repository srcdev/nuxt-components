
> **Changed 2026-09-27**: the background and text-colour tokens never applied before. The pills use
> `variant="neutral"`, and `DisplayPill`'s neutral rule only read its own neutral tokens, so they rendered
> as dark slate pills with light text (only the border token worked). `DisplayPill` variants now fall
> back to the base `--display-pill-*` tokens, so these defaults (transparent, `currentColor`) take effect.
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
| `--service-summary-column-min-width` | `246px` | Minimum width of each column in the two-column layout (from the 768px container breakpoint), capped at the container width |
| `--service-summary-body-line-clamp` | `none` | Max lines of the `whatIsIt` summary text, with an ellipsis on the last. `1` is single-line ellipsis, `none` shows everything |

Long unbroken text wraps in every field. A pill longer than its column is capped at the column width
and ends in an ellipsis (that is `DisplayPill` behaviour).

> Changed 2026-10-06: added `--service-summary-column-min-width` (was a fixed `246px`) and
> `--service-summary-body-line-clamp`; columns can no longer be widened by unbroken text.

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
`DisplayPill`'s `--display-pill-*` custom properties scoped to `.service-summary__pills`:

| Token | Default | Controls |
|---|---|---|
| `--service-summary-pill-bg` | `transparent` | Background of the price/duration pills |
| `--service-summary-pill-colour` | `currentColor` | Text colour of the pills |
| `--service-summary-pill-border-colour` | `currentColor` | Border colour of the pills |

For anything not covered by these (e.g. pill size, font weight), target `--display-pill-*` directly
under `.service-summary__pills` — see [display-pill.md](../../../../../.claude/skills/components/display-pill.md).

---

## State hooks

| Hook | When |
|---|---|
| `.service-summary__grid--reverse` | `reverse` is set: the image column moves after the text column from the 768px container breakpoint |
| `.service-summary__info-wrapper--align-start` / `-center` / `-end` | The `alignment` prop |

Inner classes: `.service-summary__grid`, `.service-summary__image-wrapper`, `.service-summary__image`,
`.service-summary__info-wrapper`, `.service-summary__pills`. The eyebrow, title and pills are
`EyebrowText`, `HeroText` and `DisplayPill`; the summary text is a `p.page-body-normal`.

Empty `subtitle`, `title`, `whatIsIt`, `duration` or `price` render no element (and no pill row when
both pill values are empty). With no title, a landmark `tag` gets no `aria-labelledby`.

---

## Global theming

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

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** don't set `--display-pill-background`, `--display-pill-text-colour` or `--display-pill-border-colour` on an
ancestor to restyle the pills: `ServiceSummary` re-declares them on `.service-summary__pills`, so an
ancestor value never lands. Use the `--service-summary-pill-*` tokens, or set other
`--display-pill-*` tokens on `.service-summary__pills` itself (see **Pill colours** above).

### Page or section

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

### One instance

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

## Class passthrough

`style-class-passthrough` adds classes to the root `.service-summary`. Reactive after mount.

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

