---
name: BannerVideo
description: BannerVideo full-width hero video banner — props, verticalPosition/horizontalPosition, responsive max-height, reduced-motion fallback, CSS tokens, consumer styling
type: reference
---

# BannerVideo

## Overview

`BannerVideo` renders a full-width banner section that plays a muted, looping mp4 video. A poster image is shown as fallback when the user has `prefers-reduced-motion: reduce` set — handled entirely in CSS, no JS.

The banner is sized via `aspect-ratio` so it scales naturally, with `max-height` props capping height at each breakpoint.

### Autoplay mechanism

The video uses `autoplay muted loop playsinline preload="auto"` attributes on the `<video>` element with the src in a `<source>` child. A `:key="src"` on the video element forces Vue to remount it on src changes. `@loadeddata` and `@canplay` events call `tryPlay()`, and a `watch(() => props.src, ..., { immediate: true, flush: 'post' })` calls `kickOffLoad()` (which calls `v.load()` then `tryPlay()`) on mount and src change. `onActivated` handles keep-alive re-activation.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Path to the mp4 video source. **Required.** |
| `poster` | `string` | — | Path to the fallback/poster image. **Required.** Used as the video `poster` attribute and as the `prefers-reduced-motion` fallback. |
| `alt` | `string` | `""` | Alt text for the fallback `NuxtImg`. |
| `imgWidth` | `number` | `1920` | Intrinsic width of the poster image — required for NuxtImg/IPX optimisation. |
| `imgHeight` | `number` | `1080` | Intrinsic height of the poster image — required for NuxtImg/IPX optimisation. |
| `tag` | `"section" \| "div" \| "header" \| "main" \| "article"` | `"section"` | HTML element rendered as the root. |
| `maxHeight` | `string` | `"56rem"` | Maximum height at desktop (≥64em / 1024px). |
| `maxHeightTablet` | `string` | `undefined` | Maximum height at tablet (48em–64em). Falls back to `maxHeight`. |
| `maxHeightMobile` | `string` | `undefined` | Maximum height on mobile (<48em). Falls back through tablet → desktop. |
| `aspectRatio` | `string` | `"21/9"` | CSS `aspect-ratio` of the container (e.g. `"16/9"`, `"21/9"`, `"4/3"`). |
| `objectFit` | `"cover" \| "contain" \| "fill" \| "none" \| "scale-down"` | `"cover"` | How the video and fallback image fill the banner frame. |
| `verticalPosition` | `"start" \| "center" \| "end"` | `"center"` | Vertical crop position. Maps to `align-self` on the video element and `object-position` Y on the fallback image. |
| `horizontalPosition` | `"start" \| "center" \| "end"` | `"center"` | Horizontal crop position. Maps to `object-position` X on the fallback image. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Basic usage

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  alt="Studio interior"
/>
```

## Common variants

### Responsive max-height per breakpoint

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  alt="Studio interior"
  max-height="56rem"
  max-height-tablet="40rem"
  max-height-mobile="24rem"
/>
```

### Tall viewport-filling banner

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  alt="Studio interior"
  max-height="100vh"
  aspect-ratio="16/9"
/>
```

### Custom focal point

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  alt="Studio interior"
  vertical-position="end"
  horizontal-position="center"
/>
```

### Full bleed with no block margin

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  alt="Studio interior"
  :style-class-passthrough="['full-bleed', 'mbe-0']"
/>
```

## Positioning explained

The video element uses `height: auto; min-height: 100%` so it overflows the container naturally when aspect ratios differ. `overflow: hidden` on the root clips it. `verticalPosition` maps to `align-self` on the video (shifting which portion of the overflow is visible) and to `object-position` Y on the fallback image.

`horizontalPosition` only affects the fallback image via `object-position` X — the video fills full width so horizontal alignment is a no-op on the video element itself.

| verticalPosition | align-self | object-position Y |
|---|---|---|
| `"start"` | `start` | `top` |
| `"center"` (default) | `center` | `center` |
| `"end"` | `end` | `bottom` |

| horizontalPosition | object-position X |
|---|---|
| `"start"` | `left` |
| `"center"` (default) | `center` |
| `"end"` | `right` |

## imgWidth / imgHeight

Always match the intrinsic dimensions of the poster file. NuxtImg uses them to avoid the `w=1536` fallback (not in Vercel's allowed widths: 640, 750, 828, 1080, 1200, 1920, 2048, 3840).

| Image type | imgWidth | imgHeight |
|---|---|---|
| Landscape / banner (16:9) | `1920` | `1080` |
| Wide banner (12:5) | `1920` | `800` |
| Square | `800` | `800` |

## CSS custom properties

All set from props via inline `:style` on the root element.

| Property | Default | Set by prop |
|---|---|---|
| `--_max-height` | `56rem` | `maxHeight` |
| `--_max-height-tablet` | *(unset)* | `maxHeightTablet` |
| `--_max-height-mobile` | *(unset)* | `maxHeightMobile` |
| `--_aspect-ratio` | `21/9` | `aspectRatio` |
| `--_align-self` | `center` | `verticalPosition` |
| `--_justify-self` | `center` | `horizontalPosition` |

**Responsive override example:**

```css
.my-page {
  .banner-video {
    --_max-height: 56rem;

    @media (width < 1024px) {
      --_max-height: 40rem;
    }

    @media (width < 768px) {
      --_max-height: 24rem;
    }
  }
}
```

## CSS classes

| Class | Applied when |
|---|---|
| `.banner-video` | Always — the root element |
| `.video` | The `<video>` element |
| `.fallback` | The `<NuxtImg>` fallback — hidden by default, shown via `prefers-reduced-motion` CSS |

## Consumer styling

Use an unscoped style block scoped by a page or section wrapper class. No `:deep()` needed — the component's styles live in `@layer components` so page styles win automatically.

```vue
<style>
.my-page {
  .banner-video {
    @media (width < 900px) {
      --_max-height: 36rem;
    }
  }
}
</style>
```

## Notes

- `loading="eager"` and `decoding="async"` are hardcoded on the fallback `NuxtImg` — it is above the fold by definition.
- The video has `autoplay muted loop playsinline preload="auto"` — intentional and not configurable. This component is for ambient background video only, not user-controlled media.
- `prefers-reduced-motion` is handled in CSS (`.video { display: none }` + `.fallback { display: block }`), not via JS.
- Storybook: the `"none"` image provider is active, so `poster` paths pass through unchanged. Always provide explicit `img-width` and `img-height` to avoid the `w=1536` fallback in deployed Storybook.
