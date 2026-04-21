---
name: ScrollRevealFrame
description: ScrollRevealFrame generic parallax clipping frame — props, slot API, CSS tokens, browser support, when to use vs ScrollRevealImage
type: reference
---

# ScrollRevealFrame

## Overview

`ScrollRevealFrame` is a generic clipping frame that pans its slot content vertically as it scrolls through the viewport — driven entirely by CSS Scroll-driven Animations. No scroll event listeners, no `requestAnimationFrame`, no `IntersectionObserver`.

Use `ScrollRevealFrame` when the content inside the frame is **anything other than a single `NuxtImg`** — a grid of images, a video, a card, arbitrary markup. For a single optimised image with focal-point control, use `ScrollRevealImage` instead (it wraps this component).

## How it works

- The `<figure>` root is a fixed-height clipping window (`overflow: hidden`) that registers a named `view-timeline`.
- The inner `.reveal-content` wrapper is taller than the frame by `parallaxOffset` and animates `translateY` as the frame scrolls through the viewport.
- Slot content fills that wrapper — anything inside pans as a unit.

Browser support (as of 2026): Chrome 115+, Edge 115+, Firefox 114+, Safari 17.2+. Older browsers fall back to a static cropped view.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frameHeight` | `string` | `"540px"` | Height of the visible clipping frame. Any CSS length unit (`px`, `vh`, `rem`). |
| `parallaxOffset` | `string` | `"36rem"` | Distance the content travels vertically across the full scroll range. Larger = more dramatic reveal. |
| `radius` | `string` | `"0px"` | `border-radius` applied to the clipping frame. Slot content stays contained within the rounded shape. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root `<figure>`. |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Content to pan. It fills a `div.reveal-content` that is taller than the frame by `parallaxOffset`. |

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

The `frameHeight` prop sets `--_frame-height` as an inline style. To vary it responsively, override the CSS custom property in a scoped style block:

```css
.my-page {
  .reveal-frame {
    --_frame-height: 320px;

    @media (width >= 768px) {
      --_frame-height: 540px;
    }
  }
}
```

## CSS custom properties

These are set from props via inline `:style` but can be overridden in CSS for responsive or contextual control.

| Property | Default | Set by prop |
|----------|---------|-------------|
| `--_frame-height` | `540px` | `frameHeight` |
| `--_parallax-offset` | `36rem` | `parallaxOffset` |
| `--_radius` | `0px` | `radius` |

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
- The named `view-timeline` (`--reveal-frame-timeline`) is scoped to the component. Multiple `ScrollRevealFrame` instances on the same page are independent.
- Reduced-motion: the animation is disabled and the content falls back to a static centred crop via `@media (prefers-reduced-motion: reduce)`.
- Do not put `ScrollRevealFrame` inside a container with `overflow: hidden` or `overflow: clip` — this breaks the `view-timeline` scroll detection.
