# ServicesCard — Consumer Styling Guide

## Public token API

Every token below is consumed directly at its point of use (`var(--services-card-gap, 1rem)`,
etc.). The only private token is `--_scrim-colour`, which resolves
`--services-card-image-details-scrim-colour` once so the scrim and the text colour read the same value. Set the token globally in
a theme file, scoped to a page wrapper, or per-instance via `styleClassPassthrough` — no
`:deep()` needed, component styles are unscoped.

### Interaction states (whole-card-clickable only)

Only visible when the card is in whole-card-clickable mode (see the component skill doc) —
i.e. `is-clickable` is on the root — since these all default to `transparent`/`0` and only
`.is-clickable` has a `:hover`/`:focus-visible` rule at all.

| Token | Default | Controls |
|---|---|---|
| `--services-card-border-radius` | `0` | Root corner radius — also clips `.services-card-image-wrapper` (root has `overflow: hidden`), so set `--services-card-image-border-radius` to match if you want the image's own corners rounded consistently with a rounded root |
| `--services-card-border-width` | `1px` | Border thickness |
| `--services-card-border-colour` | `transparent` | Resting (non-hover) border colour |
| `--services-card-border-colour-hover` | resting border colour | Border colour on `:hover`/`:focus-visible` — defaults to whatever `--services-card-border-colour` resolves to, so setting only the resting colour keeps the border visible on hover instead of it vanishing |
| `--services-card-outline-width` | `2px` | Outline thickness |
| `--services-card-outline-colour` | `transparent` | Resting (non-hover) outline colour |
| `--services-card-outline-colour-hover` | resting outline colour | Outline colour on `:hover`/`:focus-visible` |
| `--services-card-outline-colour-focus` | hover outline colour, else `var(--theme-ring, currentColor)` | Keyboard focus ring colour. Never transparent by default, so the whole-card link always shows focus |
| `--services-card-outline-offset` | `0px` | Resting outline offset |
| `--services-card-outline-offset-hover` | resting outline offset | Outline offset on `:hover`/`:focus-visible` — e.g. set to a larger value than the resting offset for an outline that grows outward on hover |
| `--services-card-background-color-hover` | resting background colour | Background on `:hover`/`:focus-visible` |
| `--services-card-transform-hover` | `none` | Transform on `:hover`/`:focus-visible`, e.g. `translateY(-0.4rem)` for a lift. Transitions with the other states; skipped under `prefers-reduced-motion: reduce` |

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
| `--services-card-background-color` | `transparent` | Card background |
| `--services-card-padding-block` | `0` | Padding on the card root (block axis) |
| `--services-card-padding-inline` | `0` | Padding on the card root (inline axis). Leave at `0` for a flush image, and pad `--details-wrapper-padding-*` instead |
| `--services-card-image-aspect-ratio` | `3/4` | Image aspect ratio |
| `--services-card-image-border-radius` | `8px` | Image corner radius |
| `--services-card-image-padding-block` | `0 0` | Padding inside the image wrapper (block axis) |
| `--services-card-image-padding-inline` | `0 0` | Padding inside the image wrapper (inline axis) |
| `--services-card-image-zoom-transform` | `scale(1.05)` | Transform applied to the image while the pointer is over the image. Set `none` to turn the zoom off (not `scale(0)`, which hides the image). Turning it off suits a whole-card link with its own hover effect (`--services-card-transform-hover`, border/background hover tokens): otherwise moving from the card body onto the image starts a second, separate effect |
| `--services-card-details-gap` | `1rem` | Gap between eyebrow/title/description/footer |
| `--services-card-details-padding-block` | `0` | Padding inside the details wrapper (block axis) |
| `--services-card-details-padding-inline` | `0` | Padding inside the details wrapper (inline axis) |
| `--services-card-eyebrow-padding-block` | `0.8rem 0` | Padding above/below the eyebrow |
| `--services-card-title-padding-block` | `2rem 1rem` | Padding above/below the title |
| `--services-card-description-padding-block` | `0 0` | Padding on the description text |
| `--services-card-description-text-colour` | `inherit` | Description paragraph colour |
| `--services-card-description-line-height` | `1.4` | Description line height |
| `--services-card-description-font-weight` | `inherit` | Description font weight |
| `--services-card-description-line-clamp` | `none` | Max lines of the description, with an ellipsis on the last. `1` is single-line ellipsis, `none` shows everything |
| `--services-card-meta-padding-block` | `1.6rem 0` | Padding above/below the meta row's divider line |
| `--services-card-meta-border-colour` | `var(--theme-border)` | Meta row's top divider colour |
| `--services-card-meta-text-colour` | `inherit` | Duration/price text colour |
| `--services-card-meta-duration-text-colour` | meta text colour | Duration colour only |
| `--services-card-meta-price-text-colour` | meta text colour | Price colour only, e.g. brighter than the duration |
| `--services-card-meta-duration-font-weight` | `500` | Duration font weight |
| `--services-card-meta-price-font-weight` | `700` | Price font weight |
| `--services-card-meta-letter-spacing` | `inherit` | Letter-spacing on the meta row |
| `--services-card-meta-font-size` | `1.4rem` | Duration/price text size |
| `--services-card-meta-text-transform` | `uppercase` | Text transform on the duration/price meta row |
| `--services-card-meta-gap` | `1rem` | Gap between the duration and price (and between rows when long values wrap) |
| `--services-card-footer-padding-block` | `0` | Padding on the `.services-card-footer` wrapper (meta row + actions slot) |
| `--services-card-footer-gap` | `1rem` | Gap between the meta row and the actions slot inside `.services-card-footer` |

### Titles over the image (`titlesWithinImageWrapper`)

| Token | Default | Controls |
|---|---|---|
| `--services-card-image-details-scrim-colour` | `#000` | Colour of the gradient scrim behind the title/eyebrow. Use an opaque colour: the default scrim fades it with `color-mix()`, and the text colour is derived from it |
| `--services-card-image-details-scrim` | `linear-gradient(to top, <scrim colour at 75%>, transparent 70%)` | The whole scrim `background` value — replace it for a different shape or direction, or set `none` to remove it |
| `--services-card-image-details-text-colour` | `contrast-color(<scrim colour>)`, `#fff` without support | Title/eyebrow text colour. Where `contrast-color()` is supported it picks black or white against the scrim colour, so a light scrim gets dark text automatically |
| `--services-card-image-details-eyebrow-colour` | `inherit` | Eyebrow colour. The eyebrow's gradient fill is turned off over the image so it can't clash with the photo |
| `--services-card-image-details-gap` | `0.5rem` | Gap between eyebrow and title |
| `--services-card-image-details-eyebrow-padding-block` / `-inline` | `0` / `2.2rem` | Eyebrow padding |
| `--services-card-image-details-title-padding-block` / `-inline` | `1.2rem 2.2rem` / `2.2rem` | Title padding |

`contrast-color()` only reads the scrim colour, not the photo. If you remove the scrim, set `--services-card-image-details-text-colour` yourself to suit the images.

```css
/* assets/styles/setup/07.components/services-card.css */
:root {
  --services-card-gap: 1.4rem;
  --services-card-description-line-clamp: 3;
  --services-card-meta-text-transform: none;
}
```

---

## State hooks

| Hook | When |
|---|---|
| `.services-card.is-clickable` | Whole-card link mode: `href` set and no `actions` slot (root renders as `<a>` or `NuxtLink`) |

Inner classes: `.services-card-image-wrapper`, `.services-card-image`, `.services-card-image-details`
(titles over the image), `.services-card-details`, `.services-card-description`, `.services-card-footer`,
`.services-card-meta`, `.services-card-meta-duration`, `.services-card-meta-price`. The eyebrow and
title are `EyebrowText` (`.eyebrow-text`) and `HeroText` (`.hero-text`), so their own tokens
(`--eyebrow-text-*`, `--hero-text-*`) inherit down into the card.

Empty `subtitle`, `title` or `shortDescription` render no element at all, and the image overlay is
left out when both titles are empty.

> Changed 2026-10-06: every inner class and card-specific token is now prefixed `services-card-`.
> Old to new: `.image-wrapper` → `.services-card-image-wrapper`, `.image` → `.services-card-image`,
> `.image-wrapper-details` → `.services-card-image-details`, `.details-wrapper` → `.services-card-details`,
> `.description` / `.footer` / `.meta` / `.meta-duration` / `.meta-price` → `.services-card-*`;
> `--image-wrapper-details-*` → `--services-card-image-details-*` (with `-eyebrow-text-colour` → `-eyebrow-colour`,
> `-eyebrow-text-padding-*` → `-eyebrow-padding-*`, `-hero-text-padding-*` → `-title-padding-*`),
> `--image-wrapper-border-image-zoom-transform` → `--services-card-image-zoom-transform`,
> `--image-wrapper-*` → `--services-card-image-*`, `--details-wrapper-grid-gap` → `--services-card-details-gap`,
> `--details-wrapper-padding-*` → `--services-card-details-padding-*`,
> `--eyebrow-text-padding-block` → `--services-card-eyebrow-padding-block`,
> `--hero-text-padding-block` → `--services-card-title-padding-block`, `--description-*` / `--meta-*` →
> `--services-card-description-*` / `--services-card-meta-*`, `--footer-wrapper-grid-gap` →
> `--services-card-footer-gap`, `--footer-padding-block` → `--services-card-footer-padding-block`.
> Also: the description line clamp defaults to `none` (was `100`), the description colour defaults
> to `inherit` (its old fallback, `--colour-text-secondary`, was never defined, so nothing changes
> visually), the outline hover tokens fall back to the resting outline values, and keyboard focus now
> shows a ring by default (`--services-card-outline-colour-focus`; it was transparent).

---

## Text content — props/slots, not CSS

Duration and price text come from `serviceData.duration`/`serviceData.price` by default, or
`durationText`/`priceText` props, or the `duration`/`price` scoped slots (for icons or other
custom markup) — there is nothing to override in CSS for the text itself, only its styling via
the tokens above. See the component skill doc for slot/prop usage examples.

---

## Footer bottom-alignment (row-of-cards use)

`.services-card-footer` (the meta row + `actions` slot, grouped together) gets `margin-block-start: auto`
and the root uses `grid-template-rows: auto 1fr`, so when `ServicesCardGrid`'s default
`align-items: stretch` makes a card taller than its own content (to match a taller sibling in
the same row), the extra height goes to `.services-card-footer`'s top margin instead of leaving whitespace
below the actions slot. This keeps the meta row and actions/button aligned across a row of
cards regardless of each card's description length, without needing CSS subgrid.

`.services-card`, `.services-card-image-wrapper`, `.services-card-details`, and `.services-card-footer` all set
`min-inline-size: 0`. Without it, an unbreakable child — most commonly a long `actions` slot
button label, since `InputButton`'s `.button-text` is `white-space: nowrap` with no
ellipsis — forces its content's min-content width up through the flex/grid chain and widens
that one card's grid column in `ServicesCardGrid` wider than its siblings. If a card/column
ever looks wider than the rest with content cut off at the edge, check for a long unbreakable
string in a slot before assuming it's an image sizing issue — the image is just riding along
on the widened column, not the cause.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct look:

```vue
<ServicesCard :style-class-passthrough="['featured-service']" :service-data="service" />
```

```css
.services-card.featured-service {
  --services-card-gap: 1.6rem;
  --services-card-meta-border-colour: var(--color-accent);
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.services-card`. Reactive after mount.

---

## Notes

- `--services-card-details-gap` (details-wrapper's own children) and `--services-card-footer-gap`
  (the meta row ↔ actions slot gap inside `.services-card-footer`) are separate tokens — overriding one does
  not affect the other.
- Root element tag, `href`/`external` (whole-card-clickable), `eyebrowConfig`, and `heroConfig`
  are props, not CSS — see the component skill doc.
