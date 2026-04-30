# CSS Animation Utilities

## Overview

Scroll-driven animation utility classes bundled with the layer. Apply a class to any element to get a CSS-only, scroll-linked animation — no JavaScript required. All utilities use the [CSS Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) spec (`animation-timeline: view()`).

**Browser support**: Chrome 115+, Firefox 110+, Safari 18+. No polyfill exists — use `@supports` for graceful degradation where needed.

All utilities are wrapped in `@media (prefers-reduced-motion: no-preference)` — animations are automatically disabled for users who prefer reduced motion.

## Available classes

### `.animation-scroller-x`

Scales and fades items relative to their position in a **horizontal scroll container** (carousel, horizontal list). Items at the edges are small and faint; items at the centre are full size and opaque.

```css
animation-timeline: view(x);
```

| Position | `opacity` | `scale` |
|---|---|---|
| Edges (0 %, 100 %) | 0.25 | 0.5 |
| Centre (35 %–65 %) | 1 | 1 |

#### Usage

```html
<!-- Scrollable container — overflow-x must be auto or scroll -->
<div class="carousel-track" style="overflow-x: auto; display: flex;">
  <div class="animation-scroller-x">Item 1</div>
  <div class="animation-scroller-x">Item 2</div>
  <div class="animation-scroller-x">Item 3</div>
</div>
```

The animation is driven by the element's position inside its nearest scrollport on the x-axis. Add `.animation-scroller-x` to each **child** — not the container.

---

### `.entry-zoom-reveal`

Fades and zooms an element in as it scrolls into the vertical viewport (bottom 30 % inset to top 5 %).

```html
<div class="entry-zoom-reveal">Content revealed on scroll</div>
```

- `fill: both` — element stays hidden before entry, visible after exit

---

### `.entry-slide-in`

Slides an element up from 200 px below as it scrolls into view.

```html
<div class="entry-slide-in">Slides up on scroll</div>
```

---

### `.entry-exit-blur`

Blurs an element as it enters and exits the vertical viewport; sharp in the centre (45 %–55 %).

```html
<div class="entry-exit-blur">Sharp in view, blurred at edges</div>
```

---

### `.auto-rotate`

Rotates an element 0 → 360 ° as it scrolls through the vertical viewport.

```html
<div class="auto-rotate">
  <img src="/logo.svg" alt="" />
</div>
```

## Notes

- All classes use `animation-timeline: view()` (vertical) **except** `.animation-scroller-x` which uses `view(x)`.
- The `scroller` keyframe name used by `.animation-scroller-x` is global — avoid re-declaring `@keyframes scroller` in your own CSS.
- Utility classes are included automatically when you extend the layer — no explicit import needed in your app.
