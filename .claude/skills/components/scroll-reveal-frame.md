---
name: ScrollRevealFrame
description: ScrollRevealFrame generic parallax clipping frame — props, slot API, public CSS tokens (prop or CSS), browser support, when to use vs ScrollRevealImage
type: reference
---

# ScrollRevealFrame

## Overview

`ScrollRevealFrame` is a generic clipping frame that pans its slot content vertically as it scrolls through the viewport — driven entirely by CSS Scroll-driven Animations. No scroll event listeners, no `requestAnimationFrame`, no `IntersectionObserver`.

Use `ScrollRevealFrame` when the content inside the frame is **anything other than a single `NuxtImg`** — a grid of images, a video, a card, arbitrary markup. For a single optimised image with focal-point control, use `ScrollRevealImage` instead (it wraps this component).

## How it works

- The `<figure class="scroll-reveal-frame">` root is a fixed-height clipping window (`overflow: hidden`) that registers a named `view-timeline`.
- The inner `.scroll-reveal-frame-content` wrapper is taller than the frame by the parallax offset and animates `translateY` as the frame scrolls through the viewport.
- Slot content fills that wrapper — anything inside pans as a unit.

Browser support (as of 2026): Chrome 115+, Edge 115+, Firefox 114+, Safari 17.2+. Older browsers fall back to a static cropped view.

## Props

The three sizing props have **no default**. When passed, each writes its public token inline on the root (so it wins over any CSS). When omitted, the token comes from CSS, falling back to the default shown.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frameHeight` | `string` | unset (CSS `540px`) | Height of the visible clipping frame. Any CSS length unit. Writes `--scroll-reveal-frame-height`. |
| `parallaxOffset` | `string` | unset (CSS `36rem`) | Distance the content travels vertically across the full scroll range. Writes `--scroll-reveal-frame-parallax-offset`. |
| `radius` | `string` | unset (CSS `0px`) | `border-radius` of the clipping frame. Writes `--scroll-reveal-frame-radius`. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root `<figure>`. |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Content to pan. It fills a `div.scroll-reveal-frame-content` that is taller than the frame by the parallax offset. |

## Basic usage — single image

```vue
<ScrollRevealFrame frame-height="540px" parallax-offset="36rem">
  <img
    src="/images/hero.jpg"
    alt="Hero"
    style="width: 100%; height: 100%; object-fit: cover; display: block;"
  />
</ScrollRevealFrame>
```

## Grid of images

Wrap each `<img>` / `<NuxtImg>` in a `<div>` cell — `object-fit` on an `<img>` that is a direct grid item still lets the intrinsic dimensions influence the cell size. The wrapper takes the grid sizing; the image fills it.

```vue
<ScrollRevealFrame frame-height="480px" parallax-offset="36rem">
  <div class="image-grid">
    <div class="image-grid__cell">
      <NuxtImg src="/images/a.jpg" alt="A" :width="800" :height="800" class="image-grid__img" />
    </div>
    <div class="image-grid__cell">
      <NuxtImg src="/images/b.jpg" alt="B" :width="800" :height="800" class="image-grid__img" />
    </div>
    <div class="image-grid__cell">
      <NuxtImg src="/images/c.jpg" alt="C" :width="800" :height="800" class="image-grid__img" />
    </div>
  </div>
</ScrollRevealFrame>
```

```css
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(1, 1fr); /* adjust for row count */
  gap: 4px;
  height: 100%;
}

.image-grid__cell {
  overflow: hidden;
  min-height: 0; /* prevent grid blowout from intrinsic image size */
}

.image-grid__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## Responsive frame height

Don't pass the prop; set the public token from CSS on an element you own:

```css
.my-page {
  --scroll-reveal-frame-height: 320px;

  @media (width >= 768px) {
    --scroll-reveal-frame-height: 540px;
  }
}
```

## CSS custom properties

Full detail in `CONSUMER-STYLING.md` next to the component.

| Property | Default | Set by prop (when passed) |
|----------|---------|-------------|
| `--scroll-reveal-frame-height` | `540px` | `frameHeight` |
| `--scroll-reveal-frame-parallax-offset` | `36rem` | `parallaxOffset` |
| `--scroll-reveal-frame-radius` | `0px` | `radius` |

## Choosing parallaxOffset

The animation spans the full time the frame is in the viewport. On a typical desktop (~900px viewport, 540px frame) the total scroll travel is ~1440px. A rule of thumb:

| Frame height | Recommended parallaxOffset |
|---|---|
| `320px` | `20rem–24rem` |
| `480px` | `28rem–36rem` |
| `540px` | `36rem` (default) |
| `70vh` | `48rem–60rem` |

Values below `20rem` tend to look static at normal scroll speeds.

## Notes

- `overflow: hidden` is on the root `<figure>` — content that needs to escape (dropdowns, tooltips) must be portalled outside.
- The named `view-timeline` (`--scroll-reveal-frame-timeline`) is scoped to the component. Multiple `ScrollRevealFrame` instances on the same page are independent.
- Reduced-motion: the animation is disabled and the content is sized to the frame (a static crop) via `@media (prefers-reduced-motion: reduce)`. Same for browsers without `animation-timeline`.
- Do not put `ScrollRevealFrame` inside a container with `overflow: hidden` or `overflow: clip` — this breaks the `view-timeline` scroll detection.
- 2026-09-27 migration: the private `--_frame-height`/`--_parallax-offset`/`--_radius` tokens became public `--scroll-reveal-frame-*` tokens, and the props lost their defaults. Before, the props always wrote the private tokens inline, so the CSS override this doc used to recommend could never apply. Classes renamed `.reveal-frame` → `.scroll-reveal-frame`, `.reveal-content` → `.scroll-reveal-frame-content`; keyframes `reveal-pan` → `scroll-reveal-frame-pan` (generic global names, collision-prone). `ScrollRevealImage`'s image class became `.scroll-reveal-image`.
