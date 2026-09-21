---
name: CarouselFlip
description: CarouselFlip FLIP-animated multi-item carousel — named dynamic slots (per data id), swipe/keyboard/marker navigation, button layout variants, CSS tokens, consumer styling
type: reference
---

# CarouselFlip

## Overview

`CarouselFlip` is a multi-item carousel that reorders its items via the FLIP animation technique
(First-Last-Invert-Play) on navigation, rather than a simple track-translate. Items are named
dynamic slots keyed by `carouselDataIds`. It supports swipe, arrow-key, marker-click, and
prev/next-button navigation, and four `buttonLayout` variants for positioning the prev/next
buttons relative to the marker controls.

Has live production usage on instepreflexology — check before making a breaking change to its
default rendered output.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `carouselDataIds` | `string[]` | `[]` | Slot names, in display order. One item renders per id. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes on the root element. |
| `transitionSpeed` | `number` | `200` | Transition duration in ms. |
| `allowCarouselOverflow` | `boolean` | `false` | Allows items to overflow the item track horizontally instead of clipping. |
| `useFlipAnimation` | `boolean` | `false` | Changes the initial item offset used in the FLIP reorder calculation. |
| `useSpringEffect` | `boolean` | `false` | Uses `var(--spring-easing)` as the transition timing function instead of `ease`. |
| `buttonLayout` | `"sides" \| "controls-flanking" \| "controls-grouped-right" \| "overlay"` | `"sides"` | Where the prev/next buttons sit relative to the carousel/controls. |
| `showControls` | `boolean` | `true` | Shows/hides the marker (dot) controls bar. Prev/next buttons remain regardless. |
| `ariaLabel` | `string` | `"Image carousel"` | `aria-label` on the root region — override for localisation. |
| `itemsAriaLabel` | `string` | `"Carousel items"` | `aria-label` on the item group — override for localisation. |
| `previousLabel` | `string` | `"Go to previous item"` | Prev button `aria-label` — override for localisation. |
| `nextLabel` | `string` | `"Go to next item"` | Next button `aria-label` — override for localisation. |
| `jumpToItemLabel` | `string` | `"Jump to item"` | Marker button `aria-label` prefix — the 1-based index is appended (`"Jump to item 3"`). |
| `itemPositionAnnouncement` | `(current: number, total: number) => string` | `` (current, total) => `Item ${current} of ${total}` `` | Builds the screen-reader live-region text on navigation — override for localisation or a different phrasing. |
| `prevIcon` | `string` | `"ic:outline-keyboard-arrow-left"` | Iconify name for the previous button icon. Ignored if the `prev-icon` slot is used. |
| `nextIcon` | `string` | `"ic:outline-keyboard-arrow-right"` | Iconify name for the next button icon. Ignored if the `next-icon` slot is used. |

## Slots

One dynamically-named slot per `carouselDataIds` entry, named after that id:

```vue
<CarouselFlip :carousel-data-ids="['slide-1', 'slide-2', 'slide-3']">
  <template #slide-1><img src="/a.jpg" alt="A" /></template>
  <template #slide-2><img src="/b.jpg" alt="B" /></template>
  <template #slide-3><img src="/c.jpg" alt="C" /></template>
</CarouselFlip>
```

`prev-icon`/`next-icon` replace the prev/next button icon entirely — use these instead of
`prevIcon`/`nextIcon` when an Iconify name isn't enough (custom SVG, a different icon set):

```vue
<CarouselFlip :carousel-data-ids="ids">
  <template #prev-icon><MyCustomArrowLeft /></template>
  <template #next-icon><MyCustomArrowRight /></template>
  ...
</CarouselFlip>
```

## Navigation

- **Swipe** (touch): left swipe → next, right swipe → previous.
- **Keyboard**: `ArrowLeft`/`ArrowRight` on either the item track or the controls bar (both are
  `tabindex="0"`).
- **Marker click**: jumps directly to that item.
- **Prev/next buttons**: always rendered, regardless of `showControls`.
- All navigation wraps around at the ends.

## `buttonLayout` variants

- `"sides"` (default): prev/next buttons flank the item track (CSS grid areas `prev`/`next`).
- `"controls-flanking"`: prev/next buttons sit in the row below, flanking the marker controls.
- `"controls-grouped-right"`: markers centred, prev/next buttons grouped to the right of them.
- `"overlay"`: markers float over the bottom edge of the item track instead of occupying their
  own grid row.

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/03.organisms/image-galleries/carousel-flip/CONSUMER-STYLING.md).

| Token | Default | Controls |
|---|---|---|
| `--carousel-flip-gap` | `1rem` | Gap between items inside the item track |
| `--carousel-flip-layout-gap` | `1rem` | Grid gap between the prev/carousel/next/controls areas |
| `--carousel-flip-display-max-width` | `80rem` | Max width of the item track and the controls bar |
| `--carousel-flip-item-max-width` | `80rem` | Max width of a single item, before subtracting the edge-preview width |
| `--carousel-flip-edge-preview-width` | `4rem` | How much of the neighbouring items peek in at each edge |
| `--carousel-flip-marker-gap` | `1rem` | Gap between marker (dot) buttons |
| `--carousel-flip-marker-active-colour` | `light-dark(var(--slate-10), var(--slate-00))` | Active marker background colour |
| `--carousel-flip-button-background-colour` | `light-dark(white, var(--slate-08))` | Prev/next button background colour |
| `--carousel-flip-button-border-width` | `0.1rem` | Prev/next button border width |
| `--carousel-flip-button-border-colour` | `light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%))` | Prev/next button border colour |
| `--carousel-flip-button-border-radius` | `100vw` | Prev/next button corner radius |
| `--carousel-flip-button-padding` | `0.8rem` | Prev/next button padding |
| `--carousel-flip-button-icon-size` | `2.4rem` | Prev/next button icon glyph size |
| `--carousel-flip-buttons-gap` | `1rem` | Gap between prev/next buttons in the `controls-grouped-right` layout |
| `--carousel-flip-overlay-controls-offset` | `1rem` | Distance of the controls bar from the bottom edge in the `overlay` layout |
| `--carousel-flip-focus-outline-width` | `0.2rem` | Marker button focus-visible outline width |
| `--carousel-flip-focus-outline-colour` | `var(--theme-ring)` | Marker button focus-visible outline colour |
| `--carousel-flip-focus-outline-offset` | `0.2rem` | Marker button focus-visible outline offset |

## Accessibility

- Reduced motion: both the CSS transform transition and the JS-driven FLIP reorder transition
  are skipped when `prefers-reduced-motion: reduce` is set — items still reorder, just instantly.
- Marker buttons previously had `outline: 1px solid transparent`, which suppressed the focus ring
  with no replacement. Fixed 2026-09-21 — they now get a visible `:focus-visible` outline via
  `--carousel-flip-focus-outline-*`.
- All interactive controls have accessible names via the label props above.

## Notes

- Migrated from `app/components/carousels/CarouselFlip.vue` (unplaced, legacy location) to
  `03.organisms/image-galleries/carousel-flip/` on 2026-09-21, alongside `SliderGallery`.
- Sibling components `CarouselBasic` and `CarouselInfinite` were deleted in the same migration —
  they had no consumer usage anywhere and were never fully built out (no tests/story/skill for
  `CarouselInfinite`; `CarouselBasic`'s active-marker colour was hardcoded to plain `red`).
- **Bug fixed 2026-09-21**: `--carousel-flip-display-max-width`/`--carousel-flip-item-max-width`/
  `--carousel-flip-edge-preview-width` were previously referenced as `--_carousel-display-max-width`
  /`--_carousel-container-max-inline-size`/`--_carousel-item-edge-preview-width` — private custom
  properties that were never declared anywhere, with no fallback. Per CSS spec this makes the
  whole declaration invalid at computed-value time, so the item edge-preview offset and the
  width caps were silently never applying in production. Now declared as real public tokens with
  real defaults (`80rem`/`80rem`/`4rem`) — this is a visible change to the live carousel on
  instepreflexology, done deliberately after confirming with the maintainer.
- Removed dead commented-out code in `itemWidthOffsetStr`'s computed (an unreachable
  `if (props.allowCarouselOverflow)` branch, entirely commented out, that duplicated the live
  branch's logic).
