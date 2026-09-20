---
name: WipeAwayVertical
description: WipeAwayVertical scroll-driven vertical wipe-away effect — props, dynamic slot API, CSS grid overlay mechanics, CSS tokens
type: reference
---

# WipeAwayVertical

## Overview

`WipeAwayVertical` is a scroll-driven "wipe away" effect: a stack of sticky panels, each of
which wipes away (via a `clip-path` animation) to reveal the panel underneath as the user
scrolls past its paired tracking section. Pure CSS — built on `animation-timeline: view()`, a
single-column CSS grid overlay, and no JavaScript scroll listeners or measurement at all.

## How it works

- The root is a single-column CSS grid. `.sticky-items-container` spans every row as an overlay
  (`grid-row: 1 / -1`), holding `itemCount` `.sticky-item` panels stacked with descending
  `z-index` (item 0 on top).
- Each real `.scrolling-section` gets its own explicit grid row and acts as a scroll tracker —
  its entry into the viewport drives the wipe-out animation of its paired sticky item via a
  named `view-timeline`. Only `itemCount - 1` sections are rendered: the **last** sticky item
  has nothing left to reveal, so it has no wipe animation (`animation-timeline: none`) and no
  scrolling section of its own.
- A `.leading-buffer` (fixed `100vh`) renders before the first scrolling section, so section 0
  isn't already partway through its `entry` timeline range at page load, whatever content
  precedes the component.
- A `.trailing-buffer`, sized by `--wipe-away-vertical-trailing-buffer` (default `20vh`), renders
  after the last real scrolling section — just enough room for the sticky container to release
  cleanly once the final panel is fully revealed.
- `.sticky-items-container` is sized by `--wipe-away-vertical-height` (default `100vh`) and
  centers itself with `top: calc((100vh - var(--wipe-away-vertical-height, 100vh)) / 2)` — a
  plain `calc()`, deliberately **not** a `transform: translateY()`. `position: sticky`'s
  stick/release threshold is computed from the element's *untransformed* layout position, so a
  transform-based visual shift releases the sticky panel early by the transformed amount,
  leaving a gap after the last panel. `.scrolling-section`'s `view-timeline-inset` uses the same
  `calc()` so the entry/exit range lines up with the same visual offset. (An earlier version
  used `top: 50%` — also wrong, since a percentage `top` on `position: sticky` resolves against
  the containing block's height, not the viewport, and this component's containing block is
  deliberately many viewport-heights tall.)
- Where `@supports not (animation-timeline: view())`, the grid/sticky/animation machinery is
  dropped entirely: the root becomes `display: block`, the leading/trailing buffers and
  scrolling sections are hidden, and the sticky items render as plain stacked panels in normal
  document flow. No JS fallback, no opacity crossfade — just a flat, static stack.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "main" \| "article" \| "aside"` | `"div"` | Root element tag. |
| `itemCount` | `number` | — (required) | Number of sticky panels. Drives the sticky-item slot loop, `itemCount - 1` scrolling sections, per-item `z-index`, and `view-timeline` naming. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

Dynamic named slots:

| Slot | Description |
|------|-------------|
| `stickyItem-{n}` | Content for sticky panel `n`, indexed `0` to `itemCount - 1`. |
| `scrollingItem-{n}` | Content (or an empty spacer) for scroll-tracking section `n`, indexed `0` to `itemCount - 2` only — the last panel has no scrolling section of its own. Typically an empty `100vh`-tall `div`; its height determines how much scroll distance that panel's wipe covers. |

## Basic usage

```vue
<WipeAwayVertical :item-count="3">
  <template #stickyItem-0><PanelOne /></template>
  <template #stickyItem-1><PanelTwo /></template>
  <template #stickyItem-2><PanelThree /></template>

  <template #scrollingItem-0><div style="height: 100vh;"></div></template>
  <template #scrollingItem-1><div style="height: 100vh;"></div></template>
</WipeAwayVertical>
```

Leave the root's own `height` unset — it's a grid that sizes itself from its children (leading
buffer + scrolling sections + trailing buffer). Setting an explicit height undersizes the root
relative to its real content and releases the sticky panel mid-wipe.

## CSS custom properties

| Property | Default | Applies to |
|----------|---------|------------|
| `--wipe-away-vertical-height` | `100vh` | `.sticky-items-container` height (the visible sticky panel stack) |
| `--wipe-away-vertical-border-radius` | `0.5rem` | `.sticky-item` corner radius |
| `--wipe-away-vertical-animation-duration` | `1s` | `wipe-out` keyframe duration (view-timeline-supporting browsers) |
| `--wipe-away-vertical-trailing-buffer` | `20vh` | height of the release cushion after the last real scrolling section |

## Notes

- Uses indexed dynamic slots (not the library's default named-dynamic-slot pattern) because
  `itemCount` also drives non-slot logic: per-item `z-index`, grid rows, and the
  `view-timeline-name`/`animation-timeline` CSS variable naming, not just the slot loop itself.
- Reduced motion: the wipe animation is disabled under `prefers-reduced-motion: reduce`
  (`animation: none; clip-path: none;`) — all panels render fully visible with no clip.
- No hardcoded consumer-facing text — this is a purely structural/animation wrapper around
  consumer-supplied slot content.
