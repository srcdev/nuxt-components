# ProfileSection — Consumer Styling Guide

## Public token API

### Grid and picture

| Token | Default | Controls |
|---|---|---|
| `--profile-section-gap` | `2rem` | Gap between picture and info, single column (component under 768px wide) |
| `--profile-section-gap-wide` | `4rem` | Gap between picture and info columns (component 768px wide or more) |
| `--profile-section-picture-width` | `38.4rem` | Maximum picture column width in the two-column layout. The column can shrink below it |
| `--profile-section-picture-aspect-ratio` | `3 / 4` | Picture frame aspect ratio |
| `--profile-section-picture-border-radius` | `0.8rem` | Picture frame corner rounding |
| `--profile-section-info-block-gap` | `1.5rem` | Space after each `profile-info-N` block |
| `--profile-section-links-gap` | `1rem` | Gap between items in the `profileLinks` slot |
| `--profile-section-info-text-colour` | `inherit` | Text colour of the info column (blocks and links) |

### Info block highlights

| Token | Default | Controls |
|---|---|---|
| `--profile-section-highlight-colour` | `var(--colour-text-accent)` | `.highlight` inside a `.location` element |
| `--profile-section-link-colour` | `var(--colour-link-default)` | `.highlight` inside a `.services` element |
| `--profile-section-link-colour-hover` | `var(--colour-link-hover)` | The same, on hover |
| `--profile-section-highlight-font-weight` | `600` | Weight of both highlight kinds (also sets the `wght` variation axis) |

The defaults read the global `--colour-*` tokens, so setting those on an ancestor still works.

### Header in picture

These only apply when `header-placement` is `picture-bottom` or `picture-top`. The scrim fades
upward from the bottom edge for `picture-bottom` and downward from the top edge for `picture-top`.

| Token | Default | Controls |
|---|---|---|
| `--profile-section-picture-header-scrim-colour` | `#000` | Colour the scrim starts from at the frame's edge |
| `--profile-section-picture-header-scrim-opacity` | `75%` | Opacity of the scrim colour at its start |
| `--profile-section-picture-header-scrim-solid-stop` | `0%` | How far into the header the scrim stays at full strength before it starts to fade (e.g. `55%` keeps it solid behind the text) |
| `--profile-section-picture-header-scrim-target-colour` | `transparent` | Colour the scrim fades into at the header's inner edge. Set it to roughly the photo's colour there (often translucent) so the fade blends into the image instead of leaving a grey band or a visible edge |
| `--profile-section-picture-header-scrim` | gradient from the scrim colour | The whole scrim `background`; set `none` to remove it |
| `--profile-section-picture-header-text-colour` | `contrast-color(<scrim colour>)`, `#fff` without support | Eyebrow and heading text colour |
| `--profile-section-picture-header-eyebrow-colour` | `inherit` | Eyebrow colour only |
| `--profile-section-picture-header-padding` | `2.4rem` | Padding around the header inside the picture |
| `--profile-section-picture-header-gap` | `0.4rem` | Gap between eyebrow and heading |

Matching the photo is a judgement call per image: pick the target colour from the part of the photo
the fade ends on, and add end padding (`--profile-section-picture-header-padding`, e.g.
`3.2rem 3.2rem 6.4rem` for `picture-top`) so the fade sits past the text. The header only rounds the
corners on the frame's edge, so an opaque target colour doesn't show rounded inner corners.
Browsers without `color-mix()` (before Safari 16.2) start the scrim from 75% black whatever the scrim
colour and opacity; the solid stop and target colour still apply.

`contrast-color()` only reads the scrim colour, not the photo. If you remove the scrim, set
`--profile-section-picture-header-text-colour` yourself to suit the image. The eyebrow's own
`--eyebrow-text-bg-img` is set to `none` inside the picture.

> Changed 2026-10-14: new `header-placement` prop and its tokens, and `--profile-section-info-text-colour`. The scrim
> gained opacity, solid-stop and target-colour tokens. The image is now absolutely positioned
> inside the frame (no visual change), so a header in the frame can grow it past its aspect ratio.
>
> Changed 2026-10-14: the highlight colours read the global `--colour-*` tokens directly; they now
> go through the `--profile-section-*` tokens above, with the same defaults. `384px` and `8px`
> became the same values in rem.
>
> Changed 2026-09-27: all of these were hardcoded values; they're now tokens with the same
> defaults.

Private tokens (not public API): `--_scrim-colour`, the resolved scrim colour used by the gradient
and `contrast-color()`, `--_scrim-direction` (`to top` or `to bottom`, set by the placement), and
`--_scrim-start-colour`, `--_scrim-solid-stop` and `--_scrim-target-colour`, which compose the
gradient from the tokens above.

---

## State hooks

Inner classes: `.profile-section-header` (only rendered when the `eyebrowText` or `heroText` slot
is given; it moves inside `.profile-section-picture`, before the image, when `header-placement` is
`picture-bottom` or `picture-top`), `.profile-section-inner` (the grid), `.profile-section-picture` (frame),
`.profile-section-image` (the `NuxtImg`), `.profile-section-info`,
`.profile-section-info-content`, `.profile-section-info-block` (one per `profile-info-N` slot
given), `.profile-section-links`.

`data-header-placement` on the root: `above`, `picture-bottom` or `picture-top`.

Content hooks inside info blocks: a `.highlight` inside an element with class `location` or
`services` gets the highlight or link colour above.

> Changed 2026-09-27: renamed from `.picture`, `.profile-picture`, `.profile-info`,
> `.profile-info-content`, `.profile-info-block` and `.profile-links`. `.picture` in particular
> collided with any consumer class of the same name.

---

## Layout

The root is a size container named `profile-section` (`container: profile-section / inline-size`).
The grid switches to two columns when **the component itself** is 768px wide or more, not the
viewport, so it stays stacked in a narrow column or sidebar. Because it's an inline-size container,
its width can't come from its content: in a flex row or other shrink-to-fit context, give it a
width (`flex: 1`, `width: 100%`) or it collapses.

Both grid columns are `minmax(0, …)`, so long unbroken text wraps (the root sets
`overflow-wrap: anywhere`) instead of widening the grid. Profile links wrap onto more lines.

To target the two-column layout in your own CSS, query the same container:

```css
.my-page .profile-section-inner {
  @container profile-section (min-width: 768px) {
    align-items: center;
  }
}
```

> Changed 2026-10-14: the breakpoint was a viewport `@media (min-width: 768px)` query. A
> `@media (min-width: 768px)` override of `.profile-section-inner`'s `grid-template-columns` now
> applies at a different point from the component's own switch. Remove it and set
> `--profile-section-picture-width` instead (`minmax(0, 320px) 1fr` is
> `--profile-section-picture-width: 32rem`, since the column is now `minmax(0, …)` by default).

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root element. Reactive after mount.

---

## Notes

There are no line-clamp tokens. All text comes through slots, so it is your own markup: clamp it
there, for example with `-webkit-line-clamp` on your own paragraph class.
