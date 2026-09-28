# SliderGallery — Consumer Styling Guide

## Public token API

### Frame

| Token | Default | Controls |
|---|---|---|
| `--slider-gallery-height` | `100svh` | Gallery height (width is always `100vw`) |
| `--slider-gallery-z-index` | `9999` | Stacking order (full-screen takeover) |
| `--slider-gallery-accent` | `#f1683a` | Loading spinner and progress bar colour |
| `--slider-gallery-loading-background` | `var(--page-bg)` | Loading overlay background |
| `--slider-gallery-loading-colour` | `var(--colour-text-default)` | Loading overlay text |

### Slide text

| Token | Default | Controls |
|---|---|---|
| `--slider-gallery-text-light` | `#fff` | Text colour for `textBrightness: "light"` slides |
| `--slider-gallery-text-dark` | `#000` | Text colour for `textBrightness: "dark"` slides |
| `--slider-gallery-text-light-scrim` | `linear-gradient(to right, rgb(0 0 0 / 0.6), transparent 70%)` | Scrim behind `"light"` text (any `background` value) |
| `--slider-gallery-text-dark-scrim` | `linear-gradient(to right, rgb(255 255 255 / 0.6), transparent 70%)` | Scrim behind `"dark"` text |
| `--slider-gallery-title-font-size` | `5em` | Title and topic size |
| `--slider-gallery-title-font-size-narrow` | `30px` | Title size below 678px container width |
| `--slider-gallery-cta-background` | `#99999975` | See-more link background |
| `--slider-gallery-cta-border-colour` | `#fff` | See-more link border |
| `--slider-gallery-cta-colour` | `#fff` | See-more link text |

### Thumbnails

| Token | Default | Controls |
|---|---|---|
| `--slider-gallery-thumbnail-width` | `100px` | Thumbnail width below 1024px |
| `--slider-gallery-thumbnail-height` | `165px` | Thumbnail height below 1024px |
| `--slider-gallery-thumbnail-width-wide` | `150px` | Thumbnail width at 1024px+ |
| `--slider-gallery-thumbnail-height-wide` | `220px` | Thumbnail height at 1024px+ |
| `--slider-gallery-thumbnail-gap` | `20px` | Gap between thumbnails |
| `--slider-gallery-thumbnail-border` | `1px solid transparent` | Thumbnail border |
| `--slider-gallery-thumbnail-outline` | `1px solid transparent` | Thumbnail outline |
| `--slider-gallery-thumbnail-outline-offset` | `0rem` | Gap between thumbnail and its outline |
| `--slider-gallery-thumbnail-border-hover` | the resting border | Thumbnail border on hover |
| `--slider-gallery-thumbnail-outline-hover` | the resting outline | Thumbnail outline on hover |
| `--slider-gallery-thumbnail-outline-offset-hover` | the resting offset | Outline gap on hover |
| `--slider-gallery-thumbnail-border-radius` | `20px` | Thumbnail rounding |
| `--slider-gallery-thumbnail-overlay` | `#0004` | Tint over thumbnail images |

### Arrows

The row position tokens cascade upwards: `-desktop` falls back to `-tablet`, which falls back to the
base token, so set only the sizes that differ.

| Token | Default | Controls |
|---|---|---|
| `--slider-gallery-arrows-top` | `80%` | Row position from the top of the gallery |
| `--slider-gallery-arrows-right` | `52%` | Row position from the right of the gallery |
| `--slider-gallery-arrows-width` | `300px` | Row width |
| `--slider-gallery-arrows-max-width` | `30%` | Row maximum width |
| `--slider-gallery-arrows-{top,right,width,max-width}-tablet` | the base token | Same, at 768px+ container width |
| `--slider-gallery-arrows-{top,right,width,max-width}-desktop` | the tablet token | Same, at 1024px+ container width |
| `--slider-gallery-arrow-gap` | `20px` | Space between the two buttons |
| `--slider-gallery-arrow-size` | `40px` | Button width/height |
| `--slider-gallery-arrow-icon-size` | `24px` | Icon width/height |
| `--slider-gallery-arrow-border-radius` | `50%` | Button rounding |
| `--slider-gallery-arrow-background` | `#eee4` | Button background |
| `--slider-gallery-arrow-colour` | `#fff` | Icon colour |
| `--slider-gallery-arrow-border-width` | `0.2rem` | Button border width |
| `--slider-gallery-arrow-border-colour` | `white` | Button border colour |
| `--slider-gallery-arrow-outline-width` | `0.1rem` | Button outline width |
| `--slider-gallery-arrow-outline-colour` | `transparent` | Button outline colour |
| `--slider-gallery-arrow-transition-duration` | `0.5s` | Hover transition length |
| `--slider-gallery-arrow-background-hover` | `#fff` | Hover background |
| `--slider-gallery-arrow-colour-hover` | `#000` | Hover icon colour |
| `--slider-gallery-arrow-border-width-hover` | resting border width | Hover border width |
| `--slider-gallery-arrow-border-colour-hover` | resting border colour | Hover border colour |
| `--slider-gallery-arrow-outline-width-hover` | resting outline width | Hover outline width |
| `--slider-gallery-arrow-outline-colour-hover` | resting outline colour | Hover outline colour |
| `--slider-gallery-arrow-outline-width-focus` | `2px` | Focus ring width |
| `--slider-gallery-arrow-outline-colour-focus` | `var(--theme-ring, currentColor)` | Focus ring colour |
| `--slider-gallery-arrow-outline-offset-focus` | `2px` | Focus ring gap |

Private (not public API): `--_animation-duration` (from the `animationDuration` prop), `--_accent`,
`--_thumbnail-width`, `--_thumbnail-height` (the resolved, breakpoint-switched sizes) and
`--_arrow-border-*`/`--_arrow-outline-*` (resting values the hover tokens fall back to) and
`--_arrows-top`/`-right`/`-width`/`-max-width` (the resolved, breakpoint-switched row position).

> Changed 2026-09-28: the thumbnail sizing/border/radius overrides used to be private names
> (`--_thumbnailMobileWidth`, `--_thumbnailBorderRadius`, etc.) with no public token; colours were
> hardcoded. The arrow icon is now sized by `--slider-gallery-arrow-icon-size` (width/height), separately from the button, and the `--_translate-x` icon nudge was removed. The wide thumbnail size now also applies to the image
> animating into the thumbnail strip, not just the strip itself.

---

## State hooks

| Hook | When |
|---|---|
| `.slider-gallery.is-next` / `.is-prev` | A transition is running (controls are disabled) |
| `.slider-gallery-item.is-prepended` | The item just moved to the front during a prev transition |
| `.slider-gallery-loading.is-loaded`, `.slider-gallery-content.is-loaded` | First image loaded |
| `.slider-gallery-item-content.light` / `.dark` | The slide's `textBrightness` |
| `.slider-gallery-list .slider-gallery-item[data-text-brightness]` | Same, on the main slide (drives the scrim) |
| `.slider-gallery-list .slider-gallery-item[data-has-text]` | The slide has overlay text (only these get the scrim) |
| `.slider-gallery.has-text-scrim` | `textScrim` is on |

Inner classes: `.slider-gallery-loading`, `.slider-gallery-spinner`, `.slider-gallery-content`,
`.slider-gallery-list`, `.slider-gallery-item`, `.slider-gallery-item-content`,
`.slider-gallery-author`, `.slider-gallery-title`, `.slider-gallery-topic`,
`.slider-gallery-description`, `.slider-gallery-actions`, `.slider-gallery-cta`,
`.slider-gallery-thumbnails`, `.slider-gallery-thumbnail-overlay`, `.slider-gallery-arrows`,
`.slider-gallery-prev`, `.slider-gallery-next`, `.slider-gallery-arrow-icon`,
`.slider-gallery-progress`.

> Changed 2026-09-28: all renamed from bare generic names (`.list`, `.item`, `.content`, `.title`,
> `.thumbnail`, `.arrows`, `.time`, `.loading-state`, `.galleryLoaded`, `.next`, `.prev`...).

---

## Motion

Under `prefers-reduced-motion: reduce` auto-advance is off and every animation/transition inside
the gallery collapses to 1ms, so manual navigation still works but jumps rather than animates.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.slider-gallery`. Reactive after mount.
