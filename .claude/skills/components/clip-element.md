---
name: ClipElement
description: ClipElement scroll-driven clip-path reveal — props, slot API, tokens, when to use vs ScrollRevealFrame
type: reference
---

# ClipElement

## Overview

`ClipElement` clips its slot content in from the top edge as it scrolls into the viewport, using a
`window` scroll listener to drive a `clip-path: inset(...)` value on the content. As the element's
top position moves through the range `[0, maxClip]`, the clip inset shrinks from `maxClip` to `0`;
once the element scrolls above the viewport (`top < 0`), the inset grows again past `maxClip`,
re-clipping the content as it exits.

This is a JS/scroll-listener implementation, unlike `ScrollRevealFrame`/`ScrollRevealImage` which
use CSS Scroll-driven Animations with no listeners. Prefer `ScrollRevealFrame` for a general
parallax pan effect with no JS overhead — reach for `ClipElement` specifically when you want this
top-edge clip-in/clip-out behaviour rather than a pan.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxClip` | `number` | `100` | Scroll distance (px) over which the element clips in as it enters the viewport, and clips further out as it scrolls above it. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root `.clip-element-wrapper`. |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Content to clip. Rendered inside `.clipped-element`, which receives the computed `clip-path`. |

## Basic usage

```vue
<ClipElement :max-clip="150">
  <img src="/images/hero.jpg" alt="Hero" style="width: 100%; display: block;" />
</ClipElement>
```

## How it works

- A `scroll` listener (added on `onMounted`, client-only, `{ passive: true }`) reads
  `.clipped-element`'s `getBoundingClientRect().top` on every scroll event.
- `topPosition` between `0` and `maxClip`: clip inset = `maxClip - topPosition` (shrinks toward 0
  as the element scrolls up into place).
- `topPosition < 0` (element scrolled above the viewport): clip inset = `maxClip + abs(topPosition)`
  (grows past `maxClip`, re-clipping as it exits upward).
- `topPosition > maxClip` (element still below the visible clip range): clip inset stays `0`.
- The computed inset is written to a private `--_clip-path` custom property via inline `:style`,
  consumed by `.clipped-element { clip-path: var(--_clip-path); }`.

## CSS custom properties

`--_clip-path` is private and JS-driven — there is no public token API for this component. See
`CONSUMER-STYLING.md` for the class-passthrough override surface.

## Notes

- `.clip-element-wrapper` has `overflow: hidden` — content that needs to escape (dropdowns,
  tooltips) must be portalled outside.
- No `IntersectionObserver`; the scroll listener runs on every scroll event for the page's
  lifetime while the component is mounted. Avoid mounting many instances on one long page.
- Client-only: the initial clip check and the listener are both gated behind `import.meta.client`,
  so SSR renders the content unclipped until hydration.
