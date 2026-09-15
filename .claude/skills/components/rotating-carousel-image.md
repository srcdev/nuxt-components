---
name: RotatingCarouselImage
description: RotatingCarouselImage 3D rotating image carousel — scroll-parallax tilt, props, accessibility controls, CSS tokens, consumer styling
type: reference
---

# RotatingCarouselImage

## Overview

`RotatingCarouselImage` renders a set of images arranged in a circle and continuously rotated with
a CSS animation, tilted in 3D via `perspective`/`rotateX`. By default (`useParallaxEffect: true`)
the tilt follows scroll position instead of a fixed value — the carousel leans more as it enters
and leaves the viewport centre. The rotation pauses automatically on keyboard focus and when the
user has `prefers-reduced-motion` set, and can optionally expose a visible pause/play button.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `CarouselImageData[]` (`{ src: string; alt: string }[]`) | `[]` | Images to render around the rotation. |
| `tag` | `"div" \| "p" \| "span" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "main" \| "nav" \| "ul" \| "ol"` | `"div"` | Root element tag. |
| `rotateX` | `number` | `0` | Static X-axis tilt in degrees. Only applied while `useParallaxEffect` is `false`. |
| `perspective` | `number` | `1000` | CSS perspective distance in pixels. |
| `translateZ` | `number` | `1000` | Radius of the rotation — distance each item sits from the centre, in pixels. |
| `pauseOnHover` | `boolean` | `false` | Pauses the rotation while the pointer hovers over the carousel. |
| `useParallaxEffect` | `boolean` | `true` | Drives the tilt from scroll position instead of the static `rotateX` prop. |
| `showControls` | `boolean` | `false` | Shows a visible pause/play button. Recommended (WCAG 2.2.2) for any auto-rotating content. |
| `respectReducedMotion` | `boolean` | `true` | Auto-pauses and disables the animation for `prefers-reduced-motion: reduce`. |
| `ariaLabel` | `string` | `"Rotating image carousel"` | `aria-label` on the root region — override for localisation. |
| `ariaDescription` | `string` | `"Use spacebar to pause or play the rotation."` | Screen-reader-only instructions rendered inside the region — override for localisation. |
| `playIcon` | `string` | `"mdi:play"` | Iconify icon name shown on the control button while paused. Ignored if the `toggle-icon` slot is used. |
| `pauseIcon` | `string` | `"mdi:pause"` | Iconify icon name shown on the control button while playing. Ignored if the `toggle-icon` slot is used. |
| `playLabel` | `string` | `"Play rotation"` | Control button `aria-label` while paused — override for localisation. |
| `pauseLabel` | `string` | `"Pause rotation"` | Control button `aria-label` while playing — override for localisation. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

Import the data type from the library's type exports when building `data` outside the component:

```ts
import type { CarouselImageData } from "srcdev-nuxt-components";
```

## Slots

`toggle-icon` (scoped with `{ isPaused: boolean }`) replaces the control button's icon entirely —
same pattern as `MarqueeScroller`:

```vue
<RotatingCarouselImage :data="images" show-controls>
  <template #toggle-icon="{ isPaused }">
    <Icon :name="isPaused ? 'lucide:play' : 'lucide:pause'" />
  </template>
</RotatingCarouselImage>
```

## Accessibility behaviour

- The root is `role="region"` with `tabindex="0"` so it's independently focusable.
- Spacebar toggles pause/play while the region is focused.
- Focusing the region always pauses the rotation so keyboard users can inspect it; blurring
  resumes it unless the user prefers reduced motion.
- Hovering the carousel pauses it only when `pauseOnHover` is `true` (default `false`, preserving
  the component's original opt-in behaviour).
- All user-visible copy (`ariaLabel`, `ariaDescription`, `playLabel`, `pauseLabel`) is a plain
  string prop with an English default — pass translated strings from the consumer's own i18n
  solution.

## Basic usage

```vue
<RotatingCarouselImage
  :data="[
    { src: '/carousel/1.jpg', alt: 'Product shot 1' },
    { src: '/carousel/2.jpg', alt: 'Product shot 2' },
  ]"
  show-controls
/>
```

Disable scroll-driven tilt for a static, self-contained rotation:

```vue
<RotatingCarouselImage :data="images" :use-parallax-effect="false" :rotate-x="10" show-controls />
```

## CSS custom properties

See `CONSUMER-STYLING.md` in this component's folder for the full public token table (carousel
height, item size, rotation duration, control button styling). `rotateX`/`perspective`/
`translateZ` are prop-driven, not tokens, since they also drive the component's own scroll-parallax
math.

## Migration note (2026-09-15)

Previously lived at `app/components/rotating-carousel/RotatingCarouselImage.vue` with
options-style `defineProps`, no accessibility controls (no focus/keyboard pause, no visible pause
button), and several hardcoded CSS values (item size, rotation duration, carousel height) with no
override hook. Moved to `01.atoms/animations/rotating-carousel-image/`, migrated to
`interface Props` + `withDefaults`, and given the same pause/focus/reduced-motion/control-button
pattern as `MarqueeScroller`.
