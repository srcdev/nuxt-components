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

No consumer app uses it as of 2026-10-21 (an earlier note said one did; a scan found none).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `carouselDataIds` | `string[]` | `[]` | Slot names, in display order. One item renders per id. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes on the root element. |
| `transitionSpeed` | `number` | `200` | Transition duration in ms. |
| `allowCarouselOverflow` | `boolean` | `false` | Allows items to overflow the item track horizontally instead of clipping. |
| `useFlipAnimation` | `boolean` | `false` | Changes the initial item offset used in the FLIP reorder calculation. |
| `useSpringEffect` | `boolean` | `false` | Uses `var(--spring-easing)` as the transition timing function instead of `ease`. |
| `buttonLayout` | `"sides" \| "controls-flanking" \| "controls-grouped-right" \| "overlay" \| "track-edges"` | `"sides"` | Where the prev/next buttons sit relative to the carousel/controls. |
| `showControls` | `boolean` | `true` | Shows/hides the marker (dot) controls bar. Prev/next buttons remain regardless. |
| `ariaLabel` | `string` | `"Image carousel"` | `aria-label` on the root region — override for localisation. |
| `itemsAriaLabel` | `string` | `"Carousel items"` | `aria-label` on the item group — override for localisation. |
| `previousLabel` | `string` | `"Go to previous item"` | Prev button accessible name (its visually hidden text) — override for localisation. |
| `nextLabel` | `string` | `"Go to next item"` | Next button accessible name (its visually hidden text) — override for localisation. |
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
- **Keyboard**: `ArrowLeft`/`ArrowRight` while the item track (`tabindex="0"`) or a marker has
  focus. The controls bar itself is no longer a tab stop (it was `tabindex="0"` with no name until
  2026-10-21).
- **Marker click**: jumps directly to that item.
- **Prev/next buttons**: `InputButton variant="inline"` with an `iconOnly` slot; rendered regardless
  of `showControls`, but only when there are at least two items (the markers too).
- All navigation wraps around at the ends.

## `buttonLayout` variants

- `"sides"` (default): prev/next buttons flank the item track (CSS grid areas `prev`/`next`).
- `"controls-flanking"`: prev/next buttons sit in the row below, flanking the marker controls.
- `"controls-grouped-right"`: markers centred, prev/next buttons grouped to the right of them.
- `"overlay"`: markers float over the bottom edge of the item track instead of occupying their
  own grid row.
- `"track-edges"` (added 2026-10-21): prev/next overlay the ends of the visible track, inset by
  `--carousel-flip-button-edge-inset` (default: the edge-preview width plus `0.8rem`), so they sit
  on the active frame. Use it with `allowCarouselOverflow`, where `"sides"` leaves the buttons at
  the component box's edges, over the neighbouring items that peek out past it.

Placement tokens (added 2026-10-21): `--carousel-flip-button-align` (`start`/`center`/`end`,
vertical) and `--carousel-flip-button-inline-offset` (`sides` and `controls-flanking`: pushes each
button outward, negative pulls it inward; mirrors in RTL via `:dir(rtl)`). For the viewport edges
of a centred carousel of known width: `calc((100vw - <that width>) / 2 - 1.6rem)`. A percentage
won't work, since `translate` percentages resolve against the button.

## CSS token API

Full table, state hooks and class names: [CONSUMER-STYLING.md](../../app/components/03.organisms/image-galleries/carousel-flip/CONSUMER-STYLING.md).
Tokens are `--carousel-flip-*`: gaps and max widths, edge preview, marker gap and active colour,
prev/next button colours, border, radius, padding and icon size/colour, and the focus outline.
Colours default from `--theme-surface`, `--theme-surface-subtle`, `--theme-border`,
`--theme-text` and `--theme-ring`.

## Data handling

- `itemCount` follows `carouselDataIds` after mount (it was frozen at the mount-time length until
  2026-10-21, so adding items left the markers and announcement stale). When the list changes, the
  layout is rebuilt and the active item resets to the first if it was removed.
- An empty `carouselDataIds` renders an empty track. Until 2026-10-21 it sent `reorderItems` into
  an infinite loop on mount and froze the tab.
- Items are keyed on index + id, so a repeated id still renders (both items show that slot).
- Item content wraps (`min-inline-size: 0`, `overflow-wrap: anywhere`), the centre grid column is
  `minmax(0, 1fr)`, and the markers wrap onto more rows. The `StressTest` story covers all of these.

## Accessibility

- Reduced motion: both the CSS transform transition and the JS-driven FLIP reorder transition
  are skipped when `prefers-reduced-motion: reduce` is set — items still reorder, just instantly.
- Marker buttons previously had `outline: 1px solid transparent`, which suppressed the focus ring
  with no replacement. Fixed 2026-09-21 — they now get a visible `:focus-visible` outline via
  `--carousel-flip-focus-outline-*`.
- All interactive controls have accessible names via the label props above.

## Notes

- 2026-10-21 migration: prefixed every structural class and moved state classes to `data-*`
  attributes (see CONSUMER-STYLING.md), prev/next became `InputButton`, theme-token colour defaults,
  `transitionSpeed` and the class passthrough became reactive, `aria-current` is omitted (not
  `"false"`) on inactive items, and the spec lost a dead `#imports` mock of
  `useStyleClassPassthrough` that never applied.

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
  real defaults (`80rem`/`80rem`/`4rem`) — this is a visible change to the live carousel in
  a consumer app, done deliberately after confirming with the maintainer.
- Removed dead commented-out code in `itemWidthOffsetStr`'s computed (an unreachable
  `if (props.allowCarouselOverflow)` branch, entirely commented out, that duplicated the live
  branch's logic).
