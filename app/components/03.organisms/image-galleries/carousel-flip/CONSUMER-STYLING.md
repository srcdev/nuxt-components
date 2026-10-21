# CarouselFlip — Consumer Styling Guide

## Public token API

> Changed 2026-10-21: colour defaults come from `--theme-*` tokens (were `white`,
> `hsl(0, 29%, 3%)` and `--slate-10`), `--carousel-flip-button-icon-colour` is new, and the
> `--carousel-flip-focus-outline-*` tokens now style the prev/next buttons as well as the markers.

### Layout

| Token | Default | Controls |
|---|---|---|
| `--carousel-flip-gap` | `1rem` | Gap between items inside the item track |
| `--carousel-flip-layout-gap` | `1rem` | Grid gap between the prev/carousel/next/controls areas |
| `--carousel-flip-display-max-width` | `80rem` | Max width of the item track and the controls bar |
| `--carousel-flip-item-max-width` | `80rem` | Max width of a single item, before subtracting the edge-preview width |
| `--carousel-flip-edge-preview-width` | `4rem` | How much of the neighbouring items peek in at each edge |
| `--carousel-flip-overlay-controls-offset` | `1rem` | Distance of the controls bar from the bottom edge in the `overlay` layout |

### Markers

| Token | Default | Controls |
|---|---|---|
| `--carousel-flip-marker-gap` | `1rem` | Gap between marker (dot) buttons, in both directions (the markers wrap) |
| `--carousel-flip-marker-active-colour` | `var(--theme-surface)` | Active marker background colour |

The markers otherwise keep the browser's button styling: size and shape them on
`.carousel-flip-marker` (see the story's `carousel-flip-demo` styles for an example).

### Prev/next buttons

| Token | Default | Controls |
|---|---|---|
| `--carousel-flip-button-icon-colour` | `var(--theme-text)` | Icon colour |
| `--carousel-flip-button-background-colour` | `var(--theme-surface-subtle)` | Background colour |
| `--carousel-flip-button-border-width` | `0.1rem` | Border width |
| `--carousel-flip-button-border-colour` | `var(--theme-border)` | Border colour |
| `--carousel-flip-button-border-radius` | `100vw` | Corner radius |
| `--carousel-flip-button-padding` | `0.8rem` | Padding |
| `--carousel-flip-button-icon-size` | `2.4rem` | Icon glyph size |
| `--carousel-flip-buttons-gap` | `1rem` | Gap between the buttons in the `controls-grouped-right` layout |
| `--carousel-flip-button-align` | `center` | Vertical alignment of each button in its row: `start`, `center` or `end` (every layout except `controls-grouped-right`, where the buttons sit in the controls row) |
| `--carousel-flip-button-inline-offset` | `0px` | `sides` and `controls-flanking` only: pushes each button outward from its default spot (negative pulls it inward over the track). Mirrors in right-to-left |
| `--carousel-flip-button-edge-inset` | `calc(var(--carousel-flip-edge-preview-width, 4rem) + 0.8rem)` | `track-edges` only: distance of each button from the visible track's end, so the default clears the edge preview |

The buttons are `InputButton` with `variant="inline"`, which adds no colours of its own; these
tokens style them.

**Placement.** In `sides` the buttons sit at the outer edges of the component's own box, so with
`allowCarouselOverflow` on they can land over the neighbouring items that peek out past it. Use
`buttonLayout="track-edges"` to keep them on the active frame, or the offset token to move them.
To reach the viewport edges from a centred carousel of known width, set
`--carousel-flip-button-inline-offset: calc((100vw - <that width>) / 2 - 1.6rem)`. A percentage
doesn't work there (on `translate` it resolves against the button), `vw` includes the scrollbar,
and an offset past the viewport can cause horizontal scrolling.

> Added 2026-10-21: the three placement tokens and the `track-edges` layout.

### Focus

| Token | Default | Controls |
|---|---|---|
| `--carousel-flip-focus-outline-width` | `0.2rem` | `:focus-visible` outline width on markers and prev/next buttons |
| `--carousel-flip-focus-outline-colour` | `var(--theme-ring)` | `:focus-visible` outline colour |
| `--carousel-flip-focus-outline-offset` | `0.2rem` | `:focus-visible` outline offset |

Private (not public API): `--_carousel-item-track-gap`, read from `--carousel-flip-gap`, and
`--_carousel-flip-button-direction` (`1`, or `-1` under `:dir(rtl)`).

## State hooks

| Hook | Meaning |
|---|---|
| `.carousel-flip[data-button-layout="…"]` | The `buttonLayout` prop |
| `.carousel-flip[data-mounted]` | Setup finished; the root fades from `opacity: 0` to `1` |
| `.carousel-flip-track[data-allow-overflow]` | `allowCarouselOverflow` is on |
| `.carousel-flip-item[aria-current="true"]` | The active item |
| `.carousel-flip-item[data-loaded]` | The user has navigated at least once; items get their CSS transition |
| `.carousel-flip-marker[data-active]` | The active marker (also `aria-current="true"`) |

Inner elements: `.carousel-flip-track`, `.carousel-flip-item`, `.carousel-flip-controls`,
`.carousel-flip-markers` (the `<ul>`), `.carousel-flip-markers-item`, `.carousel-flip-marker`,
`.carousel-flip-buttons`, `.carousel-flip-button` (with `.carousel-flip-button-prev` /
`.carousel-flip-button-next`), `.carousel-flip-button-icon`.

> Changed 2026-10-21: these were `.item-container`, `.item`, `.controls-container`,
> `.markers-container`/`.markers-list`, `.markers-item`, `.btn-marker`, `.buttons-container`,
> `.btn-action`/`.btn-prev`/`.btn-next` and `.arrows-icon`, with state classes `.mounted`,
> `.allow-overflow`, `.loaded` and `.active`. The markers lost their extra wrapper div.

The controls bar and the prev/next buttons only render when there are at least two items.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

## Class passthrough

`style-class-passthrough` adds classes to the root `<section>`. Reactive: changing the prop
replaces the previous classes (until 2026-10-21 later changes were ignored).

## Notes

- `--carousel-flip-display-max-width`/`--carousel-flip-item-max-width` previously had no declared
  value anywhere in the component (referenced via `var()` with no fallback), so the edge-preview
  offset and max-width caps never applied. Fixed 2026-09-21; see the component's skill doc.
- `useFlipAnimation`/`useSpringEffect`/`transitionSpeed` control animation behaviour via props,
  not tokens.
