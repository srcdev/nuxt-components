---
name: ScrollRevealImage
description: ScrollRevealImage single-image parallax reveal — props, focalX usage, CSS tokens, browser support, when to use vs ScrollRevealFrame
type: reference
---

# ScrollRevealImage

## Overview

`ScrollRevealImage` is a convenience wrapper around `ScrollRevealFrame` for the common case of a single optimised image. It adds `NuxtImg` (with intrinsic dimension props for Vercel/IPX optimisation) and a `focalX` prop to pin the horizontal crop axis as the image pans vertically.

For arbitrary slot content — a grid of images, video, markup — use `ScrollRevealFrame` directly.

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `src` | `string` | — | Image source path. **Required.** |
| `alt` | `string` | `""` | Alt text for the image. |
| `imgWidth` | `number` | `1920` | Intrinsic width of the source image — required for NuxtImg optimisation. |
| `imgHeight` | `number` | `1080` | Intrinsic height of the source image — required for NuxtImg optimisation. |
| `frameHeight` | `string` | unset (CSS default `540px`) | Height of the visible clipping frame. Any CSS length unit. Leave unset to control it from CSS via `--scroll-reveal-frame-height`. |
| `parallaxOffset` | `string` | unset (CSS default `36rem`) | Distance the image travels vertically across the full scroll range. Leave unset to control it via `--scroll-reveal-frame-parallax-offset`. |
| `focalX` | `string` | `"50%"` | Horizontal focal point — CSS `object-position` x-axis value. Controls which horizontal slice stays in view. |
| `radius` | `string` | unset (CSS default `0px`) | `border-radius` of the clipping frame. Leave unset to control it via `--scroll-reveal-frame-radius`. |
| `loading` | `"lazy" \| "eager"` | `"lazy"` | Image loading strategy. Use `"eager"` if this is the LCP image (e.g. partially in view on load). |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root `<figure>`. |

## Basic usage

```vue
<ScrollRevealImage
  src="/images/hero.jpg"
  alt="Hair portrait"
  :img-width="1280"
  :img-height="1920"
/>
```

## Common variants

### Short banner frame

```vue
<ScrollRevealImage
  src="/images/banner.webp"
  alt="Banner"
  :img-width="1920"
  :img-height="800"
  frame-height="320px"
  parallax-offset="24rem"
/>
```

### Rounded corners

```vue
<ScrollRevealImage
  src="/images/hero.jpg"
  alt="Portrait"
  :img-width="1280"
  :img-height="1920"
  frame-height="480px"
  radius="2.4rem"
/>
```

### Horizontal focal point

```vue
<ScrollRevealImage
  src="/images/hero.jpg"
  alt="Portrait"
  :img-width="1280"
  :img-height="1920"
  focal-x="75%"
/>
```

### Tall frame — maximum travel

```vue
<ScrollRevealImage
  src="/images/hero.jpg"
  alt="Portrait"
  :img-width="1280"
  :img-height="1920"
  frame-height="70vh"
  parallax-offset="60rem"
/>
```

## focalX explained

The vertical position of the image is driven by the scroll animation (`translateY`). `focalX` controls the **horizontal** crop so the subject stays centred when the frame is narrower than the image.

| Value | Crops toward |
| ----- | ----------- |
| `"0%"` or `"left"` | Left edge |
| `"50%"` (default) | Centre |
| `"75%"` | Right of centre — useful for a subject offset to the right |
| `"100%"` or `"right"` | Right edge |

Internally, `focalX` sets `object-position: <focalX> 0%` on the `<img>`. The `Y` is always `0%` because the animation handles vertical travel.

## imgWidth / imgHeight

Always provide these to match the intrinsic dimensions of the source file. NuxtImg uses them to:

- Generate the correct `srcset` via the IPX pipeline
- Avoid the `w=1536` fallback (not in Vercel's allowed widths: 640, 750, 828, 1080, 1200, 1920, 2048, 3840)

Common pairs:

| Image type | imgWidth | imgHeight |
| ---------- | -------- | --------- |
| Portrait (3:4) | `1280` | `1920` |
| Landscape / banner (16:9) | `1920` | `1080` |
| Wide banner (12:5) | `1920` | `800` |
| Square | `800` | `800` |

## Responsive frame height

Don't pass `frame-height`, and set the frame's public token from CSS on an ancestor you own (a prop,
when passed, is written inline and always wins):

```css
.my-page {
  --scroll-reveal-frame-height: 320px;

  @media (width >= 768px) {
    --scroll-reveal-frame-height: 480px;
  }

  @media (width >= 1024px) {
    --scroll-reveal-frame-height: 540px;
  }
}
```

> **Changed 2026-09-27**: this section used to recommend overriding `--_frame-height` on
> `.reveal-frame`. That never worked, because this component always passed a default `frameHeight`
> down and the frame always wrote it inline. The frame-sizing props now default to unset.

## CSS custom properties

Frame tokens come from `ScrollRevealFrame` (see its `CONSUMER-STYLING.md`); each prop writes its
token inline only when passed.

| Property | Default | Set by prop |
| -------- | ------- | ----------- |
| `--scroll-reveal-frame-height` | `540px` | `frameHeight` |
| `--scroll-reveal-frame-parallax-offset` | `36rem` | `parallaxOffset` |
| `--scroll-reveal-frame-radius` | `0px` | `radius` |
| `--_focal-x` | `50%` | `focalX` (always written inline) |

Classes: root `.scroll-reveal-frame`, wrapper `.scroll-reveal-frame-content`, image
`.scroll-reveal-image` (renamed 2026-09-27 from `.reveal-frame`/`.reveal-content`/`.reveal-image`).

## Choosing parallaxOffset

See `scroll-reveal-frame.md` for the full guide. For portrait images the default `36rem` is a reliable starting point. Landscape/banner images in shorter frames work better with `20rem–24rem`.

## Notes

- The root `<figure>` has `margin: 0` set in the component — browser default `<figure>` margins are neutralised at source.
- `decoding="async"` is always set on the `<img>`. Use `:loading="'eager'"` if this component is the LCP image (e.g. a hero partially in view on load) — the default `"lazy"` is correct for below-fold usage.
- Do not place inside a container with `overflow: hidden` or `overflow: clip` — breaks the `view-timeline` scroll detection inherited from `ScrollRevealFrame`.
- Reduced-motion: animation is disabled and the image falls back to a static crop centred at `object-position: <focalX> 50%`.
- Storybook: the `"none"` image provider is active (`nuxt.config.ts`), so `src` paths pass through unchanged. Always provide explicit `img-width` and `img-height` props to avoid the `w=1536` fallback in deployed Storybook.
