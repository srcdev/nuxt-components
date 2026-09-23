# CarouselFlip — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--carousel-flip-gap` | `1rem` | Gap between items inside the item track |
| `--carousel-flip-layout-gap` | `1rem` | Grid gap between the prev/carousel/next/controls areas |
| `--carousel-flip-display-max-width` | `80rem` | Max width of the item track and the controls bar |
| `--carousel-flip-item-max-width` | `80rem` | Max width of a single item, before subtracting the edge-preview width |
| `--carousel-flip-edge-preview-width` | `4rem` | How much of the neighbouring items peek in at each edge |
| `--carousel-flip-marker-gap` | `1rem` | Gap between marker (dot) buttons |
| `--carousel-flip-marker-active-colour` | `var(--slate-10)` | Active marker background colour |
| `--carousel-flip-button-background-colour` | `white` | Prev/next button background colour |
| `--carousel-flip-button-border-width` | `0.1rem` | Prev/next button border width |
| `--carousel-flip-button-border-colour` | `hsl(0, 29%, 3%)` | Prev/next button border colour |
| `--carousel-flip-button-border-radius` | `100vw` | Prev/next button corner radius |
| `--carousel-flip-button-padding` | `0.8rem` | Prev/next button padding |
| `--carousel-flip-button-icon-size` | `2.4rem` | Prev/next button icon glyph size |
| `--carousel-flip-buttons-gap` | `1rem` | Gap between prev/next buttons in the `controls-grouped-right` layout |
| `--carousel-flip-overlay-controls-offset` | `1rem` | Distance of the controls bar from the bottom edge in the `overlay` layout |
| `--carousel-flip-focus-outline-width` | `0.2rem` | Marker button focus-visible outline width |
| `--carousel-flip-focus-outline-colour` | `var(--theme-ring)` | Marker button focus-visible outline colour |
| `--carousel-flip-focus-outline-offset` | `0.2rem` | Marker button focus-visible outline offset |

```css
.my-page {
  --carousel-flip-button-background-colour: var(--theme-surface);
  --carousel-flip-marker-active-colour: var(--brand-primary);
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<CarouselFlip style-class-passthrough="hero-carousel">...</CarouselFlip>
```

## Notes

- `--carousel-flip-display-max-width`/`--carousel-flip-item-max-width` previously had no declared
  value anywhere in the component (referenced via `var()` with no fallback) — this meant the
  edge-preview offset and max-width caps silently never applied in production. Fixed 2026-09-21;
  see the component's skill doc for detail.
- `useFlipAnimation`/`useSpringEffect`/`transitionSpeed` control animation behaviour via props,
  not tokens — use the props rather than CSS overrides for those.
