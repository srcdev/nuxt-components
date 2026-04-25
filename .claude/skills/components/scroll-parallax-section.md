---
name: ScrollParallaxSection
description: ScrollParallaxSection JS-driven parallax background section — props, CSS height token, slot usage, parallaxStrength guide, reduced-motion, vs ScrollRevealFrame
type: reference
---

# ScrollParallaxSection

## Overview

`ScrollParallaxSection` is a full-width section with a parallax background image driven by `requestAnimationFrame` and `IntersectionObserver`. The background image bleeds beyond the container bounds and is translated vertically as the component scrolls through the viewport.

Use this component for **full-width decorative background sections** — hero banners, dividers, and atmospheric breaks between content. For arbitrary slot content that itself needs to pan (grids of images, video), use `ScrollRevealFrame` instead.

### How it works

- The root element is a fixed-height container with `overflow: hidden`.
- `.scroll-parallax-section__bg` is positioned absolutely with a negative inset (derived from `parallaxStrength`) so the image bleeds beyond the frame top and bottom, ensuring full coverage at all scroll positions.
- On scroll/resize, a `requestAnimationFrame` callback reads `getBoundingClientRect()` and sets `translateY` on the background element.
- An `IntersectionObserver` pauses the RAF loop when the component is offscreen, reducing CPU usage.
- The background layer uses `will-change: transform` for GPU compositing.

### Difference from ScrollRevealFrame / ScrollRevealImage

| | `ScrollParallaxSection` | `ScrollRevealFrame` / `ScrollRevealImage` |
|---|---|---|
| Mechanism | JS (RAF + IntersectionObserver) | CSS Scroll-driven Animations |
| Browser support | All modern + older browsers | Chrome 115+, Firefox 114+, Safari 17.2+ |
| Content | Background image only (slot above) | Slot content pans as a unit |
| Use case | Full-width decorative background sections | Clipping frames with panning image/content |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "article" \| "aside"` | `"div"` | HTML element rendered as the container. Use `"section"` for landmark regions. |
| `backgroundImage` | `string` | — | **Required.** Path or URL of the background image. Passed via CSS `background-image`. |
| `parallaxStrength` | `number` | `1` | Multiplier for the parallax movement and image bleed. `0` = no movement, `1` = standard, `2` = very dramatic. See the guide below. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Content placed above the parallax background at `z-index: 1`. |

## CSS custom properties

Height is controlled entirely via CSS — there is no `height` prop.

| Property | Default | Description |
|----------|---------|-------------|
| `--scroll-parallax-section-height` | `25svh` | Height of the visible section. Set on the component or a parent wrapper. |

## Basic usage

```vue
<ScrollParallaxSection background-image="/images/banners/banner-mid-brown.webp" />
```

## With slot content

Slot content is layered at `z-index: 1` above the parallax background. Use flexbox or grid on the root element (via `styleClassPassthrough` or an inline style) to position it.

```vue
<ScrollParallaxSection
  background-image="/images/banners/banner-ginger.webp"
  :parallax-strength="0.8"
  tag="section"
  style="
    --scroll-parallax-section-height: 40svh;
    display: flex;
    align-items: center;
    justify-content: center;
  "
>
  <h2 style="color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">Section heading</h2>
</ScrollParallaxSection>
```

## Custom height via CSS override

Override the height in a scoped stylesheet — useful for responsive breakpoints.

```css
.my-page {
  .scroll-parallax-section {
    --scroll-parallax-section-height: 20svh;

    @media (width >= 768px) {
      --scroll-parallax-section-height: 35svh;
    }

    @media (width >= 1200px) {
      --scroll-parallax-section-height: 25svh;
    }
  }
}
```

## Choosing parallaxStrength

`parallaxStrength` controls two things simultaneously:

1. **Movement** — how far the background travels per pixel of scroll.
2. **Image bleed** — the negative inset applied to `.scroll-parallax-section__bg`. The inset is calculated as `ceil(parallaxStrength × 100)%`, ensuring the image always fills the frame even at extremes of the scroll position.

| `parallaxStrength` | Character | Inset |
|---|---|---|
| `0` | No movement (static background) | `0%` |
| `0.3–0.5` | Subtle — good for text-heavy sections | `30–50%` |
| `1` (default) | Standard parallax feel | `100%` |
| `1.5–2` | Dramatic — large image travel | `150–200%` |

Values above `2` are rarely useful and increase layout memory cost.

## Reduced motion

The component does not yet implement a `prefers-reduced-motion` media query. If your consuming app needs to respect user motion preferences, disable the parallax effect by setting `parallaxStrength` to `0` and watching the CSS media feature:

```vue
<script setup lang="ts">
const prefersReducedMotion = ref(false);

onMounted(() => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = mq.matches;
  mq.addEventListener("change", (e) => {
    prefersReducedMotion.value = e.matches;
  });
});
</script>

<template>
  <ScrollParallaxSection
    background-image="/images/banner.webp"
    :parallax-strength="prefersReducedMotion ? 0 : 1"
  />
</template>
```

## Notes

- `backgroundImage` is passed through `v-bind()` as a CSS `background-image` value. The image is not processed by `@nuxt/image` — use a path under `public/` or a full URL.
- `overflow: hidden` is on the root element. Content that needs to escape (dropdowns, tooltips) must be portalled outside.
- The background layer uses `background-position: center` and `background-size: cover`. The focal point cannot be changed per-prop — override `background-position` in CSS if needed.
- Multiple `ScrollParallaxSection` instances on the same page each run independent observers and RAF loops. They pause individually when offscreen.
- Do not nest `ScrollParallaxSection` inside a container with CSS `transform` — this creates a new stacking context and breaks the `getBoundingClientRect` viewport calculation.
