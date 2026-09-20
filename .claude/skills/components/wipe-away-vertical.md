---
name: WipeAwayVertical
description: WipeAwayVertical scroll-driven vertical wipe-away effect — props, dynamic slot API, CSS tokens, fallback behaviour
type: reference
---

# WipeAwayVertical

## Overview

`WipeAwayVertical` is a scroll-driven "wipe away" effect: a stack of sticky panels, each of
which wipes away (via a `clip-path` animation) to reveal the panel underneath as the user
scrolls past its paired tracking section. Built on CSS `animation-timeline: view()`, with a JS
`scroll`-event opacity crossfade as a fallback for browsers that don't support it.

## How it works

- The root renders a `.sticky-items-container` holding `itemCount` `.sticky-item` panels,
  stacked with descending `z-index` (item 0 on top).
- Alongside it, `itemCount` `.scrolling-section` elements act as scroll trackers — each one's
  entry into the viewport drives the wipe-out animation of its paired sticky item via a named
  `view-timeline`.
- The last sticky item never wipes away (`animation-timeline: none`) — it's the final state
  the stack settles on.
- Where `CSS.supports("animation-timeline: view()")` is `false`, the component falls back to a
  `scroll` listener that crossfades each sticky item's `opacity` based on whether its paired
  scrolling section is at the vertical midpoint of the viewport.
- `.sticky-items-container` is sized by `--wipe-away-vertical-height` (default `100vh`) — this
  is the visible height of the sticky panel stack, independent of the root element's own height
  (which should span the full scroll distance, e.g. `itemCount * 100vh`).
- An invisible `.trailing-buffer` spacer renders after the last scrolling section, sized by
  `--wipe-away-vertical-trailing-buffer` (default `50vh`) — a cushion so the sticky container has
  a moment to settle on the final panel before it un-sticks and scrolls away with the rest of
  the page. Don't remove this without verifying the final transition still completes cleanly.
- `.sticky-items-container` centers itself with `top: 50vh; transform: translateY(-50%);` — the
  `50vh` (not `50%`) is deliberate. For `position: sticky`, a percentage `top` resolves against
  the *containing block's* height, and here the containing block is the whole component, which
  is many viewport-heights tall by design (it holds every scroll-tracking section). `top: 50%`
  would compute to an enormous, unreachable offset instead of "50% down the viewport," producing
  broken, erratic sticky-engagement timing — this is exactly what caused the last two panels to
  appear to "lock together" and scroll away as one, discovered via the FivePanels story
  (2026-09-20). Don't reintroduce a percentage here; use viewport units (`vh`) for any offset
  meant to be relative to the viewport, and only the transform (which resolves against the
  element's own box) for the "correct my own height" half of the centering trick.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "main" \| "article" \| "aside"` | `"div"` | Root element tag. |
| `itemCount` | `number` | — (required) | Number of sticky/scrolling section pairs. Drives both the slot loop and the per-item `z-index`/`view-timeline` naming. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

Dynamic named slots, indexed `0` to `itemCount - 1`:

| Slot | Description |
|------|-------------|
| `stickyItem-{n}` | Content for sticky panel `n`. |
| `scrollingItem-{n}` | Content (or an empty spacer) for scroll-tracking section `n`. Typically an empty `100vh`-tall `div` — its height determines how much scroll distance the wipe covers. |

## Basic usage

```vue
<WipeAwayVertical :item-count="3" style="height: 300vh;">
  <template #stickyItem-0><PanelOne /></template>
  <template #stickyItem-1><PanelTwo /></template>
  <template #stickyItem-2><PanelThree /></template>

  <template #scrollingItem-0><div style="height: 100vh;"></div></template>
  <template #scrollingItem-1><div style="height: 100vh;"></div></template>
  <template #scrollingItem-2><div style="height: 100vh;"></div></template>
</WipeAwayVertical>
```

## CSS custom properties

| Property | Default | Applies to |
|----------|---------|------------|
| `--wipe-away-vertical-height` | `100vh` | `.sticky-items-container` height (the visible sticky panel stack) |
| `--wipe-away-vertical-border-radius` | `0.5rem` | `.sticky-item` corner radius |
| `--wipe-away-vertical-animation-duration` | `1s` | `wipe-out` keyframe duration (view-timeline-supporting browsers) |
| `--wipe-away-vertical-fallback-transition-duration` | `0.4s` | opacity crossfade duration (fallback browsers) |
| `--wipe-away-vertical-trailing-buffer` | `50vh` | height of the invisible spacer after the last scrolling section |

`--_wipe-away-vertical-calculated-inset` is a private, JS-computed token (the sticky container's
viewport inset) — not consumer-overridable.

## Notes

- Uses indexed dynamic slots (not the library's default named-dynamic-slot pattern) because
  `itemCount` also drives non-slot logic: per-item `z-index` and the `view-timeline-name`/
  `animation-timeline` CSS variable naming, not just the slot loop itself.
- Reduced motion: the wipe animation and fallback opacity transition are both disabled under
  `prefers-reduced-motion: reduce` — all panels render fully opaque with no clip/fade.
- No hardcoded consumer-facing text — this is a purely structural/animation wrapper around
  consumer-supplied slot content.
