---
name: BannerVideo
description: BannerVideo full-width hero video banner — props, depth tier system, verticalPosition/horizontalPosition, playIcon/pauseIcon/toggle-icon slot, reduced-motion fallback, CSS tokens, consumer styling
type: reference
---

# BannerVideo

## Overview

`BannerVideo` renders a full-width banner section that plays a muted, looping mp4 video. A poster image is shown as fallback when the user has `prefers-reduced-motion: reduce` set — handled entirely in CSS, no JS. A visible pause/play toggle is always rendered over the video (see "Pause/play toggle" below) to satisfy WCAG 2.2.2 (Pause, Stop, Hide), since the video autoplays and loops indefinitely.

The banner is sized via `aspect-ratio` so it scales naturally. The `depth` prop selects a responsive `max-height` tier (`xs` → `xl`) implemented with `clamp()` — no breakpoint props needed. Each tier exposes a `--banner-video-max-height-{depth}` CSS token that consuming pages can override.

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
| `depth` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Responsive max-height tier. Each maps to a `clamp()` scale; override via `--banner-video-max-height-{depth}`. |
| `aspectRatio` | `string` | `"21/9"` | CSS `aspect-ratio` of the container (e.g. `"16/9"`, `"21/9"`, `"4/3"`). |
| `objectFit` | `"cover" \| "contain" \| "fill" \| "none" \| "scale-down"` | `"cover"` | How the video and fallback image fill the banner frame. |
| `verticalPosition` | `"start" \| "center" \| "end"` | `"center"` | Vertical crop position. Maps to `align-self` on the video element and `object-position` Y on the fallback image. |
| `horizontalPosition` | `"start" \| "center" \| "end"` | `"center"` | Horizontal crop position. Maps to `object-position` X on the fallback image. |
| `playIcon` | `string` | `"mdi:play"` | Iconify icon name shown on the toggle button before playback starts. |
| `pauseIcon` | `string` | `"mdi:pause"` | Iconify icon name shown on the toggle button once playback starts. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Slot props | Purpose |
|---|---|---|
| `toggle-icon` | `{ isPlaying: boolean }` | Replaces the toggle button's icon entirely. Default renders `<Icon :name="isPlaying ? pauseIcon : playIcon" />` — use this slot instead of `playIcon`/`pauseIcon` when an Iconify name isn't enough (custom SVG, different icon set). |

## Basic usage

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  alt="Studio interior"
/>
```

## Common variants

### Depth tiers

```vue
<!-- xs: clamp(12rem, 15vw, 24rem) — thin strip -->
<BannerVideo src="…" poster="…" depth="xs" />

<!-- sm: clamp(18rem, 22vw, 36rem) -->
<BannerVideo src="…" poster="…" depth="sm" />

<!-- md (default): clamp(28rem, 38vw, 56rem) -->
<BannerVideo src="…" poster="…" />

<!-- lg: clamp(40rem, 52vw, 72rem) -->
<BannerVideo src="…" poster="…" depth="lg" />

<!-- xl: clamp(52rem, 65vw, 90rem) — near full-screen hero -->
<BannerVideo src="…" poster="…" depth="xl" aspect-ratio="16/9" />
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

### Custom toggle icon

```vue
<!-- Swap the Iconify icon name -->
<BannerVideo src="…" poster="…" play-icon="mdi:play-circle" pause-icon="mdi:pause-circle" />

<!-- Replace the icon entirely (custom SVG, different icon set) -->
<BannerVideo src="…" poster="…">
  <template #toggle-icon="{ isPlaying }">
    <MyCustomIcon :name="isPlaying ? 'pause' : 'play'" />
  </template>
</BannerVideo>
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

Private tokens (set via `data-depth` + CSS selectors, not inline style):

| Property | Default (md tier) | Controlled by |
|---|---|---|
| `--_max-height` | `clamp(28rem, 38vw, 56rem)` | `data-depth` selector |

Inline style tokens (set from props):

| Property | Default | Set by prop |
|---|---|---|
| `--_aspect-ratio` | `21/9` | `aspectRatio` |
| `--_align-self` | `center` | `verticalPosition` |
| `--_justify-self` | `center` | `horizontalPosition` |

### Depth token defaults

| depth | token | clamp value |
|---|---|---|
| `xs` | `--banner-video-max-height-xs` | `clamp(12rem, 15vw, 24rem)` |
| `sm` | `--banner-video-max-height-sm` | `clamp(18rem, 22vw, 36rem)` |
| `md` | `--banner-video-max-height-md` | `clamp(28rem, 38vw, 56rem)` |
| `lg` | `--banner-video-max-height-lg` | `clamp(40rem, 52vw, 72rem)` |
| `xl` | `--banner-video-max-height-xl` | `clamp(52rem, 65vw, 90rem)` |

**Override a tier in a consuming page:**

```css
.my-page {
  --banner-video-max-height-md: clamp(32rem, 45vw, 64rem);
}
```

### Toggle button token defaults

| token | default | controls |
|---|---|---|
| `--banner-video-toggle-size` | `3.2rem` | Width and height of the toggle button |
| `--banner-video-toggle-offset` | `1.2rem` | Margin from the bottom-right corner of the banner |
| `--banner-video-toggle-background` | `oklch(0% 0 0 / 0.4)` | Button background |
| `--banner-video-toggle-background-hover` | `oklch(0% 0 0 / 0.6)` | Button background on hover/focus |
| `--banner-video-toggle-icon-color` | `white` | Icon colour |

Full details, plus global/page-scoped/per-instance override patterns, live in the
component's own `CONSUMER-STYLING.md`.

## Pause/play toggle

A `<button class="banner-video__toggle">` is always rendered in the bottom-right corner of the
banner, overlaying the video. It calls `videoEl.pause()` / `.play()` directly and its
`aria-label` reflects actual playback state ("Pause background video" / "Play background video"),
tracked via the video's native `play`/`pause` events rather than assumed — autoplay can be
blocked by the browser, so the label starts as "Play background video" until a `play` event
actually fires.

This exists to satisfy **WCAG 2.2.2 (Pause, Stop, Hide)**: content that autoplays and lasts more
than 5 seconds needs an on-page mechanism to pause it. The `prefers-reduced-motion` fallback only
covers users who have set that OS-level preference — everyone else still needs a way to stop the
loop, which is why the toggle is unconditional, not opt-in via a prop.

The toggle is hidden under `prefers-reduced-motion: reduce` (alongside the `<video>` itself,
since the fallback image is already static and has nothing to pause).

No captions/transcript are needed for this component's use case (silent, decorative ambient
background video) — if a consumer ever uses `BannerVideo` for a video that conveys information,
that content needs its own accessible alternative (transcript, captions) handled outside this
component, since `BannerVideo` has no slot for it.

## CSS classes

| Class | Applied when |
|---|---|
| `.banner-video` | Always — the root element |
| `.video` | The `<video>` element |
| `.fallback` | The `<NuxtImg>` fallback — hidden by default, shown via `prefers-reduced-motion` CSS |
| `.banner-video__toggle` | The pause/play button — always rendered except under `prefers-reduced-motion: reduce` |

## Consumer styling

Use an unscoped style block scoped by a page or section wrapper class. No `:deep()` needed — the component's styles live in `@layer components` so page styles win automatically.

```vue
<style>
.my-page {
  .banner-video {
    /* Override the md tier's clamp range and the toggle's colours for this page */
    --banner-video-max-height-md: clamp(32rem, 45vw, 64rem);
    --banner-video-toggle-background: var(--brand-overlay);
    --banner-video-toggle-background-hover: var(--brand-overlay-strong);
  }
}
</style>
```

See the component's `CONSUMER-STYLING.md` for the full token API and global/page-scoped/
per-instance override patterns.

## Gotcha: aspect-ratio is overridden by max-height at wide viewports

`max-height` from the depth tier silently wins over `aspect-ratio` once the viewport is wide enough. For example, at `depth="md"` the max-height clamp caps at `56rem` — so changing `aspectRatio` from `"21/9"` to `"1/1"` produces no visible change on a wide desktop because `max-height` is the binding constraint.

**If you need `aspect-ratio` to dominate**, override all depth tokens to a large fixed value on the parent:

```css
.my-page {
  --banner-video-max-height-xs: 80rem;
  --banner-video-max-height-sm: 80rem;
  --banner-video-max-height-md: 80rem;
  --banner-video-max-height-lg: 80rem;
  --banner-video-max-height-xl: 80rem;
}
```

Or via inline `:style` on the parent element (useful for dev QA exploration):

```vue
<div :style="{
  '--banner-video-max-height-xs': '80rem',
  '--banner-video-max-height-sm': '80rem',
  '--banner-video-max-height-md': '80rem',
  '--banner-video-max-height-lg': '80rem',
  '--banner-video-max-height-xl': '80rem',
}">
  <BannerVideo aspect-ratio="1/1" depth="lg" ... />
</div>
```

You must override **all five tier tokens** — overriding only the active depth token is not sufficient because the component resolves the token by name.

## Notes

- `loading="eager"` and `decoding="async"` are hardcoded on the fallback `NuxtImg` — it is above the fold by definition.
- The video has `autoplay muted loop playsinline preload="auto"` — intentional and not configurable. This component is for ambient background video only, not a media player — the pause/play toggle exists purely for WCAG 2.2.2 compliance, not as a general playback UI (no seek bar, volume, etc.).
- `prefers-reduced-motion` is handled in CSS (`.video { display: none }` + `.fallback { display: block }`), not via JS.
- Storybook: the `"none"` image provider is active, so `poster` paths pass through unchanged. Always provide explicit `img-width` and `img-height` to avoid the `w=1536` fallback in deployed Storybook.
