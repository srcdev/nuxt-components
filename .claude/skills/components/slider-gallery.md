# SliderGallery

## Overview

`SliderGallery` (`03.organisms/image-galleries/slider-gallery`) is a full-screen image carousel:
a large slide with staggered text, a thumbnail strip that animates into place, prev/next arrows, a
progress bar, and optional auto-advance. It's `position: absolute; inset: 0` at `100svh × 100vw`,
so place it inside a positioned container sized for it (usually a full-viewport hero).

> **Changed 2026-09-28:** every inner class is now `slider-gallery-*` (was bare `.list`, `.item`,
> `.content`, `.title`, `.thumbnail`, `.arrows`, `.time` and so on, which collided with consumer CSS
> since the component renders inline). State classes are `.is-next`/`.is-prev`/`.is-prepended`/`.is-loaded`.
> The arrows lost their fixed `id="prev"`/`id="next"`. The dead "See more" `<button>` is now a link,
> rendered only for slides with an `href`. Auto-advance pauses on hover/focus and is off under
> reduced motion. Keyframes are prefixed `slider-gallery-*`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `v-model:gallery-data` | `IGalleryData[]` | required | Slides (see type below) |
| `autoRun` | `boolean` | `true` | Auto-advance. Paused while hovered or focused; never runs under `prefers-reduced-motion: reduce` |
| `autoRunInterval` | `number` | `7000` | ms between auto-advances |
| `animationDuration` | `number` | `3000` | ms a transition locks the controls (also drives the progress bar) |
| `ariaLabel` | `string` | `"Image gallery"` | Carousel region label |
| `loadingText` | `string` | `"Loading gallery..."` | Loading-state copy |
| `seeMoreText` | `string` | `"SEE MORE"` | Link text for slides with an `href` |
| `prevAriaLabel` / `nextAriaLabel` | `string` | `"Previous image"` / `"Next image"` | Arrow button labels |
| `prevIcon` / `nextIcon` | `string` | `ic:outline-keyboard-arrow-left/right` | Arrow icons |
| `textScrim` | `boolean` | `true` | Fades in a gradient behind the active slide's text (slides with no stylist, title, category, description or href get none): dark behind `textBrightness: "light"` slides, light behind `"dark"` ones. Adds `.has-text-scrim` to the root. Styled by `--slider-gallery-text-light-scrim` / `--slider-gallery-text-dark-scrim` |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Classes on the root. Reactive |

All copy props are there for localisation: pass translated strings.

## IGalleryData

```ts
import type { IGalleryData } from "srcdev-nuxt-components";

interface IGalleryData {
  src: string;
  alt: string;
  stylist?: string;      // small caps line above the title
  title?: string;
  category?: string;     // second large line
  description?: string;
  thumbnail?: { title: string; description: string };
  textBrightness: "light" | "dark"; // text colour over this image
  href?: string;         // renders a see-more link; omitted = no link
}
```

## Accessibility

- Root is `role="region"` + `aria-roledescription="carousel"` + `aria-label`.
- Arrow buttons have labels; ArrowLeft/ArrowRight work while focus is inside the gallery.
- The thumbnail strip is decorative duplicate content: `aria-hidden`, thumbnail images have empty `alt`.
- Loading block is `role="status"`; the progress bar is `aria-hidden`.
- Auto-advance meets WCAG 2.2.2 via pause-on-hover/focus, and is disabled under reduced motion (animations also collapse to near-instant there).

## Usage

```vue
<script setup lang="ts">
import type { IGalleryData } from "srcdev-nuxt-components";
const slides = ref<IGalleryData[]>([
  { src: "/images/work-1.jpg", alt: "Balayage on long curls", title: "Balayage", textBrightness: "light", href: "/work/balayage" },
]);
</script>

<template>
  <div class="hero" style="position: relative; height: 100svh;">
    <SliderGallery v-model:gallery-data="slides" aria-label="Recent work" />
  </div>
</template>
```

## Styling

Public tokens (`--slider-gallery-*`) cover height, z-index, accent (spinner and progress), text
colours, thumbnail size/border/radius/overlay, arrow row position (base, tablet, desktop), arrow size, colours, border, outline (resting, hover and focus) and CTA colours. Full reference:
`app/components/03.organisms/image-galleries/slider-gallery/CONSUMER-STYLING.md`.

## Notes

- Navigation moves real DOM nodes (append/prepend) rather than re-rendering, so don't key other
  logic off the rendered order of `.slider-gallery-item`.
- `z-index` defaults to `9999` (`--slider-gallery-z-index`) because it's a full-screen takeover.
