---
name: BannerVideo
description: BannerVideo full-width hero video banner — props, objectFit/objectPosition, responsive max-height, reduced-motion fallback, CSS tokens, consumer styling
type: reference
---

# BannerVideo

## Overview

`BannerVideo` renders a full-width banner section that plays a muted, looping mp4 video. A poster image is shown as fallback when:

- The video fails to load or play
- The user has `prefers-reduced-motion: reduce` set (handled entirely in CSS — no JS)

The banner is sized via `aspect-ratio` so it scales naturally, with `max-height` props capping height at each breakpoint. Both `objectFit` and `objectPosition` apply directly to the `<video>` element, which is a CSS replaced element and behaves exactly like `<img>`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Path to the mp4 video source. **Required.** |
| `poster` | `string` | — | Path to the fallback/poster image. **Required.** Used as the video poster attribute and as the visible fallback. |
| `alt` | `string` | `""` | Alt text for the fallback `NuxtImg`. |
| `imgWidth` | `number` | `1920` | Intrinsic width of the poster image — required for NuxtImg/IPX optimisation. |
| `imgHeight` | `number` | `1080` | Intrinsic height of the poster image — required for NuxtImg/IPX optimisation. |
| `tag` | `"section" \| "div" \| "header" \| "main" \| "article"` | `"section"` | HTML element rendered as the root. |
| `maxHeight` | `string` | `"56rem"` | Maximum height at desktop (≥64em / 1024px). |
| `maxHeightTablet` | `string` | `undefined` | Maximum height at tablet (48em–64em / 768px–1024px). Falls back to `maxHeight`. |
| `maxHeightMobile` | `string` | `undefined` | Maximum height on mobile (<48em / 768px). Falls back through tablet → desktop. |
| `aspectRatio` | `string` | `"21/9"` | CSS `aspect-ratio` of the container (e.g. `"16/9"`, `"21/9"`, `"4/3"`). |
| `objectFit` | `"cover" \| "contain" \| "fill" \| "none" \| "scale-down"` | `"cover"` | How the video and fallback image fill the banner frame. |
| `objectPosition` | `string` | `"50% 50%"` | Focal point within the video and fallback image — any valid CSS `object-position` value. |
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

### Standard 16/9 crop

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  alt="Studio interior"
  aspect-ratio="16/9"
/>
```

### Custom focal point

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  alt="Studio interior"
  object-position="50% 75%"
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

## objectPosition explained

`objectPosition` only produces a visible result when the video is **cropped** — i.e. when the container's aspect ratio differs from the video's native ratio, causing `object-fit: cover` to overflow.

- Default `aspectRatio: "21/9"` with a 16:9 video → always crops vertically → `objectPosition` Y value controls which vertical slice is shown.
- `aspectRatio: "16/9"` with a 16:9 video → no overflow → `objectPosition` has no visible effect.

| objectPosition | Effect with 21/9 container + 16:9 video |
|---|---|
| `"50% 0%"` | Top of the frame locked in view |
| `"50% 50%"` (default) | Centre of the frame |
| `"50% 100%"` | Bottom of the frame locked in view |
| `"0% 50%"` | Left-biased horizontal crop |

## imgWidth / imgHeight

Always match the intrinsic dimensions of the poster file. NuxtImg uses them to avoid the `w=1536` fallback (not in Vercel's allowed widths: 640, 750, 828, 1080, 1200, 1920, 2048, 3840).

| Image type | imgWidth | imgHeight |
|---|---|---|
| Landscape / banner (16:9) | `1920` | `1080` |
| Wide banner (12:5) | `1920` | `800` |
| Square | `800` | `800` |

## CSS custom properties

All set from props via inline `:style` on the root element. Override in a scoped style block for responsive or contextual control.

| Property | Default | Set by prop |
|---|---|---|
| `--_max-height` | `56rem` | `maxHeight` |
| `--_max-height-tablet` | *(unset)* | `maxHeightTablet` |
| `--_max-height-mobile` | *(unset)* | `maxHeightMobile` |
| `--_aspect-ratio` | `21/9` | `aspectRatio` |

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
| `.fallback` | The `<NuxtImg>` fallback element |
| `.video-failed` | Added to root when the video or source fires an error event |

When `.video-failed` is present, `.video` is hidden and `.fallback` is shown via CSS. The same swap happens at `@media (prefers-reduced-motion: reduce)` — no JS involved.

## Consumer styling

Use an unscoped style block scoped by a page or section wrapper class. No `:deep()` needed — the component's styles live in `@layer components` so page styles win automatically.

```vue
<style>
.my-page {
  .banner-video {
    /* Override max-height at a custom breakpoint */
    @media (width < 900px) {
      --_max-height: 36rem;
    }
  }
}
</style>
```

## Notes

- `loading="eager"` and `decoding="async"` are hardcoded on the fallback `NuxtImg` — it is above the fold by definition.
- The video has `autoplay muted loop playsinline` attributes. These are intentional and not configurable — this component is for ambient background video only, not user-controlled media.
- `prefers-reduced-motion` is handled in CSS (`.video { display: none }` + `.fallback { display: block }`), not via JS.
- Error detection covers both `@error` on `<video>` and `@error` on `<source>` for cross-browser reliability.
- Storybook: the `"none"` image provider is active, so `poster` paths pass through unchanged. Always provide explicit `img-width` and `img-height` to avoid the `w=1536` fallback in deployed Storybook.
