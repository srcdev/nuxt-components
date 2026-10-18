# BannerVideo — Consumer Styling Guide

## Public token API

All `--banner-video-*` tokens are the stable override surface. Set them globally in a theme
file, scoped to a page wrapper, or per-instance via `styleClassPassthrough`.

### Depth tier max-height

| Token | Default | Controls |
|---|---|---|
| `--banner-video-max-height-xs` | `clamp(12rem, 15vw, 24rem)` | Max height at `depth="xs"` |
| `--banner-video-max-height-sm` | `clamp(18rem, 22vw, 36rem)` | Max height at `depth="sm"` |
| `--banner-video-max-height-md` | `clamp(28rem, 38vw, 56rem)` | Max height at `depth="md"` (default) |
| `--banner-video-max-height-lg` | `clamp(40rem, 52vw, 72rem)` | Max height at `depth="lg"` |
| `--banner-video-max-height-xl` | `clamp(52rem, 65vw, 90rem)` | Max height at `depth="xl"` |
| `--banner-video-max-height` | `clamp(28rem, 38vw, 56rem)` | Only reached if the root has no valid `data-depth`; every typed `depth` value has its own token above |

Only the active tier's token matters: `depth="lg"` reads `--banner-video-max-height-lg` and nothing
else. The `vw` values in the defaults track the viewport, not the banner's container.

### Pause/play toggle button

| Token | Default | Controls |
|---|---|---|
| `--banner-video-toggle-size` | `3.2rem` | Width and height of the toggle button |
| `--banner-video-toggle-offset` | `1.2rem` | Margin from the bottom-right corner of the banner |
| `--banner-video-toggle-background` | `oklch(0% 0 0 / 0.4)` | Button background |
| `--banner-video-toggle-background-hover` | `oklch(0% 0 0 / 0.6)` | Button background on hover and keyboard focus |
| `--banner-video-toggle-icon-color` | `white` | Icon colour (and slot text colour, via `color`) |
| `--banner-video-toggle-focus-outline-width` | `2px` | Focus ring width |
| `--banner-video-toggle-focus-outline-color` | `currentColor` (the icon colour) | Focus ring colour |
| `--banner-video-toggle-focus-outline-offset` | `2px` | Focus ring offset |

The toggle defaults are a dark scrim with a white icon rather than `--theme-*` colours: they sit
over video, whose colours the theme doesn't know.

Private tokens (not public API): `--_max-height` (the active depth tier's value), and
`--_aspect-ratio`, `--_align-self`, `--_justify-self`, set inline from the `aspectRatio`,
`verticalPosition` and `horizontalPosition` props.

## State hooks

| Hook | Meaning |
|---|---|
| `[data-depth="xs" \| "sm" \| "md" \| "lg" \| "xl"]` | The active depth tier, on the root |

| Class | Element |
|---|---|
| `.banner-video` | Root (tag from the `tag` prop) |
| `.banner-video-media` | The `<video>` |
| `.banner-video-fallback` | The poster `NuxtImg`, shown only under `prefers-reduced-motion: reduce` |
| `.banner-video-toggle` | The pause/play `InputButton` (also carries `.input-button`); hidden under reduced motion |

> **Changed 2026-10-18**: `.video` → `.banner-video-media`, `.fallback` → `.banner-video-fallback`
> and `.banner-video__toggle` → `.banner-video-toggle`, so they can't collide with consumer CSS.
> The toggle is now an icon-only `InputButton`: its label is visually hidden text
> (`.input-button-text.sr-only`, from `playLabel`/`pauseLabel`) instead of an `aria-label`. Token
> names are unchanged.

## Icon and label overrides: props and slots, not CSS

The toggle's icon is prop-driven:

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  play-icon="mdi:play-circle"
  pause-icon="mdi:pause-circle"
/>
```

For anything beyond swapping the icon name (a custom SVG, or an icon set the `Icon` component
doesn't cover), use the `toggle-icon` scoped slot, which receives `isPlaying`. Slot content is
clipped to the round button, so size it to `--banner-video-toggle-size`:

```vue
<BannerVideo src="/videos/hero.mp4" poster="/images/hero-poster.jpg">
  <template #toggle-icon="{ isPlaying }">
    <MyCustomIcon :name="isPlaying ? 'pause' : 'play'" />
  </template>
</BannerVideo>
```

The button's accessible name comes from `play-label`/`pause-label` (defaults "Play background
video" / "Pause background video"); pass translated strings from your own i18n.

## Global theming

```css
:where(html) {
  --banner-video-max-height-md: clamp(32rem, 45vw, 64rem);
  --banner-video-toggle-background: var(--brand-overlay);
  --banner-video-toggle-background-hover: var(--brand-overlay-strong);
  --banner-video-toggle-icon-color: var(--brand-on-overlay);
}
```

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### Page or section

```css
.homepage-hero {
  --banner-video-max-height-xl: 80rem;
  --banner-video-toggle-size: 4rem;
  --banner-video-toggle-offset: 2rem;
}
```

### One instance

```vue
<BannerVideo :style-class-passthrough="['quiet-toggle']" src="…" poster="…" />
```

```css
.quiet-toggle {
  --banner-video-toggle-background: transparent;
  --banner-video-toggle-background-hover: oklch(0% 0 0 / 0.3);
}
```

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the root `.banner-video`
element only, never to the video, image or toggle. Use it for per-instance token overrides or
layout utilities (`full-bleed`, `mbe-0`).

## Notes

- The toggle button's `border-radius` (`100vw`, a full circle) and transition (`0.2s`) are not
  tokenized: low-variance details rather than something consuming apps reskin per brand.
- `aspectRatio`, `objectFit`, `verticalPosition` and `horizontalPosition` are props, not tokens.
  An invalid `aspectRatio` (empty, zero, negative, not a number or `w/h` ratio) falls back to
  `21/9`.
- Once the viewport is wide enough, the depth tier's `max-height` wins over `aspect-ratio`, so
  changing `aspectRatio` can look like a no-op on desktop. Raise the active tier's token to let the
  ratio dominate.
