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
| `--slider-gallery-thumbnail-border-radius` | `20px` | Thumbnail rounding |
| `--slider-gallery-thumbnail-overlay` | `#0004` | Tint over thumbnail images |

### Arrows

| Token | Default | Controls |
|---|---|---|
| `--slider-gallery-arrow-size` | `40px` | Button and icon size |
| `--slider-gallery-arrow-background` | `#eee4` | Button background |
| `--slider-gallery-arrow-colour` | `#fff` | Icon colour |
| `--slider-gallery-arrow-border-colour` | `white` | Button border |
| `--slider-gallery-arrow-background-hover` | `#fff` | Hover background |
| `--slider-gallery-arrow-colour-hover` | `#000` | Hover icon colour |

Private (not public API): `--_animation-duration` (from the `animationDuration` prop), `--_accent`,
`--_thumbnail-width`, `--_thumbnail-height` (the resolved, breakpoint-switched sizes) and
`--_translate-x` (arrow icon nudge).

> Changed 2026-09-28: the thumbnail sizing/border/radius overrides used to be private names
> (`--_thumbnailMobileWidth`, `--_thumbnailBorderRadius`, etc.) with no public token; colours were
> hardcoded. Icon sizing now uses `font-size`. The wide thumbnail size now also applies to the image
> animating into the thumbnail strip, not just the strip itself.

---

## State hooks

| Hook | When |
|---|---|
| `.slider-gallery.is-next` / `.is-prev` | A transition is running (controls are disabled) |
| `.slider-gallery-item.is-prepended` | The item just moved to the front during a prev transition |
| `.slider-gallery-loading.is-loaded`, `.slider-gallery-content.is-loaded` | First image loaded |
| `.slider-gallery-item-content.light` / `.dark` | The slide's `textBrightness` |

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
