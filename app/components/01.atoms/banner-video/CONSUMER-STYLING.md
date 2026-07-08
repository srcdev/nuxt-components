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
| `--banner-video-max-height` | `clamp(28rem, 38vw, 56rem)` | Fallback used if the active depth tier's own token isn't set |

### Pause/play toggle button

| Token | Default | Controls |
|---|---|---|
| `--banner-video-toggle-size` | `3.2rem` | Width and height of the toggle button |
| `--banner-video-toggle-offset` | `1.2rem` | Margin from the bottom-right corner of the banner |
| `--banner-video-toggle-background` | `oklch(0% 0 0 / 0.4)` | Button background |
| `--banner-video-toggle-background-hover` | `oklch(0% 0 0 / 0.6)` | Button background on hover/focus |
| `--banner-video-toggle-icon-color` | `white` | Icon colour (and any text colour, via `color`) |

---

## Icon and content overrides — props and slots, not CSS

The toggle's icon is prop-driven, not hardcoded:

```vue
<BannerVideo
  src="/videos/hero.mp4"
  poster="/images/hero-poster.jpg"
  play-icon="mdi:play-circle"
  pause-icon="mdi:pause-circle"
/>
```

For anything beyond swapping the icon name (e.g. a custom SVG, or an icon set the `Icon`
component doesn't cover), replace it with the `toggle-icon` scoped slot, which receives
`isPlaying`:

```vue
<BannerVideo src="/videos/hero.mp4" poster="/images/hero-poster.jpg">
  <template #toggle-icon="{ isPlaying }">
    <MyCustomIcon :name="isPlaying ? 'pause' : 'play'" />
  </template>
</BannerVideo>
```

---

## Global theming — recommended approach

Create `assets/styles/setup/07.components/banner-video.css` in the consuming app and set
tokens on `:root`. This applies to every `BannerVideo` across the site.

```css
/* assets/styles/setup/07.components/banner-video.css */
:root {
  --banner-video-max-height-md: clamp(32rem, 45vw, 64rem);
  --banner-video-toggle-background: var(--brand-overlay);
  --banner-video-toggle-background-hover: var(--brand-overlay-strong);
  --banner-video-toggle-icon-color: var(--brand-on-overlay);
}
```

---

## Page-scoped overrides

Override tokens for a specific banner by scoping them under the page or layout wrapper.
No `:deep()` is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.homepage-hero {
  .banner-video {
    --banner-video-max-height-xl: 80rem;
    --banner-video-toggle-size: 4rem;
    --banner-video-toggle-offset: 2rem;
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct
visual style, pass a modifier class:

```vue
<BannerVideo :style-class-passthrough="['quiet-toggle']" src="…" poster="…" />
```

```css
.banner-video.quiet-toggle {
  --banner-video-toggle-background: transparent;
  --banner-video-toggle-background-hover: oklch(0% 0 0 / 0.3);
}
```

---

## Notes

- `--banner-video-max-height` (no suffix) only applies if the active `data-depth` tier's own
  token isn't set — in practice this only matters if you delete a depth tier's token without
  replacing it. Prefer setting the specific `-{depth}` token you need.
- The toggle button's `border-radius` (`100vw`, i.e. a full circle) and `transition-duration`
  (`0.2s`) are not tokenized — they're low-variance visual details rather than something
  consuming apps are expected to reskin per-brand.
- `aspectRatio`, `objectFit`, `verticalPosition`, and `horizontalPosition` are props, not
  tokens — set them directly on the component.
