# ServicesCard — Consumer Styling Guide

## Public token API

Every token below is consumed directly at its point of use (`var(--services-card-gap, 1rem)`,
etc.) — there is no `--_`-prefixed private indirection layer, since none of these values are
reused across multiple declarations or computed from something else. Set the token globally in
a theme file, scoped to a page wrapper, or per-instance via `styleClassPassthrough` — no
`:deep()` needed, component styles are unscoped.

### Interaction states (whole-card-clickable only)

Only visible when the card is in whole-card-clickable mode (see the component skill doc) —
i.e. `is-clickable` is on the root — since these all default to `transparent`/`0` and only
`.is-clickable` has a `:hover`/`:focus-visible` rule at all.

| Token | Default | Controls |
|---|---|---|
| `--services-card-border-radius` | `0` | Root corner radius — also clips `.image-wrapper` (root has `overflow: hidden`), so set `--image-wrapper-border-radius` to match if you want the image's own corners rounded consistently with a rounded root |
| `--services-card-border-width` | `1px` | Border thickness |
| `--services-card-border-colour` | `transparent` | Resting (non-hover) border colour |
| `--services-card-border-colour-hover` | resting border colour | Border colour on `:hover`/`:focus-visible` — defaults to whatever `--services-card-border-colour` resolves to, so setting only the resting colour keeps the border visible on hover instead of it vanishing |
| `--services-card-outline-width` | `2px` | Outline thickness |
| `--services-card-outline-colour` | `transparent` | Resting (non-hover) outline colour |
| `--services-card-outline-colour-hover` | `transparent` | Outline colour on `:hover`/`:focus-visible` |
| `--services-card-outline-offset` | `0px` | Resting outline offset |
| `--services-card-outline-offset-hover` | `0px` | Outline offset on `:hover`/`:focus-visible` — e.g. set to a larger value than the resting offset for an outline that grows outward on hover |

```css
/* A card that gets a visible border + outline ring when it's a whole-card link */
.services-card {
  --services-card-border-colour: var(--theme-border);
  --services-card-outline-colour-hover: var(--theme-border-focus);
  --services-card-outline-offset-hover: 4px;
}
```

### Layout & sizing

| Token | Default | Controls |
|---|---|---|
| `--services-card-gap` | `1rem` | Gap between the image row and the details row |
| `--image-wrapper-aspect-ratio` | `3/4` | Image aspect ratio |
| `--image-wrapper-border-radius` | `8px` | Image corner radius |
| `--image-wrapper-padding-block` | `0 0` | Padding inside the image wrapper (block axis) |
| `--image-wrapper-padding-inline` | `0 0` | Padding inside the image wrapper (inline axis) |
| `--image-wrapper-border-image-zoom-transform` | `scale(1.05)` | Transform applied to the image on hover |
| `--details-wrapper-grid-gap` | `1rem` | Gap between eyebrow/title/description/footer |
| `--details-wrapper-padding-block` | `0` | Padding inside the details wrapper (block axis) |
| `--details-wrapper-padding-inline` | `0` | Padding inside the details wrapper (inline axis) |
| `--eyebrow-text-padding-block` | `0.8rem 0` | Padding above/below the eyebrow |
| `--hero-text-padding-block` | `2rem 1rem` | Padding above/below the title |
| `--description-padding-block` | `0 0` | Padding on the description text |
| `--description-text-colour` | `var(--colour-text-secondary)` | Description paragraph colour |
| `--description-line-height` | `1.4` | Description line height |
| `--description-line-clamp` | `100` | Number of lines the description clamps to — default is effectively unclamped; set e.g. `3` to clamp |
| `--meta-padding-block` | `1.6rem 0` | Padding above/below the meta row's divider line |
| `--meta-border-colour` | `var(--theme-border)` | Meta row's top divider colour |
| `--meta-text-colour` | `inherit` | Duration/price text colour |
| `--meta-font-size` | `1.4rem` | Duration/price text size |
| `--meta-text-transform` | `uppercase` | Text transform on the duration/price meta row |
| `--footer-padding-block` | `0` | Padding on the `.footer` wrapper (meta row + actions slot) |
| `--footer-wrapper-grid-gap` | `1rem` | Gap between the meta row and the actions slot inside `.footer` |

```css
/* assets/styles/setup/07.components/services-card.css */
:root {
  --services-card-gap: 1.4rem;
  --description-line-clamp: 3;
  --meta-text-transform: none;
}
```

---

## Text content — props/slots, not CSS

Duration and price text come from `serviceData.duration`/`serviceData.price` by default, or
`durationText`/`priceText` props, or the `duration`/`price` scoped slots (for icons or other
custom markup) — there is nothing to override in CSS for the text itself, only its styling via
the tokens above. See the component skill doc for slot/prop usage examples.

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct look:

```vue
<ServicesCard :style-class-passthrough="['featured-service']" :service-data="service" />
```

```css
.services-card.featured-service {
  --services-card-gap: 1.6rem;
  --meta-border-colour: var(--color-accent);
}
```

---

## Footer bottom-alignment (row-of-cards use)

`.footer` (the meta row + `actions` slot, grouped together) gets `margin-block-start: auto`
and the root uses `grid-template-rows: auto 1fr`, so when `ServicesCardGrid`'s default
`align-items: stretch` makes a card taller than its own content (to match a taller sibling in
the same row), the extra height goes to `.footer`'s top margin instead of leaving whitespace
below the actions slot. This keeps the meta row and actions/button aligned across a row of
cards regardless of each card's description length, without needing CSS subgrid.

`.services-card`, `.image-wrapper`, `.details-wrapper`, and `.footer` all set
`min-inline-size: 0`. Without it, an unbreakable child — most commonly a long `actions` slot
button label, since `InputButtonCore`'s `.button-text` is `white-space: nowrap` with no
ellipsis — forces its content's min-content width up through the flex/grid chain and widens
that one card's grid column in `ServicesCardGrid` wider than its siblings. If a card/column
ever looks wider than the rest with content cut off at the edge, check for a long unbreakable
string in a slot before assuming it's an image sizing issue — the image is just riding along
on the widened column, not the cause.

---

## Notes

- `--details-wrapper-grid-gap` (details-wrapper's own children) and `--footer-wrapper-grid-gap`
  (the meta row ↔ actions slot gap inside `.footer`) are separate tokens — overriding one does
  not affect the other.
- `.meta`'s internal gap (between the duration and price text) is a fixed `1rem`, not a token.
- Root element tag, `href`/`external` (whole-card-clickable), `eyebrowConfig`, and `heroConfig`
  are props, not CSS — see the component skill doc.
