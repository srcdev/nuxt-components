# RotatingCarouselImage — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--rotating-carousel-height` | `70svh` | Height of the carousel's root element |
| `--rotating-carousel-item-width` | `200px` | Width of each rotating item (and the slider box itself) |
| `--rotating-carousel-item-height` | `250px` | Height of each rotating item (and the slider box itself) |
| `--rotating-carousel-offset-bottom` | `35%` | Vertical position of the slider box within the root element |
| `--rotating-carousel-rotation-duration` | `30s` | Duration of one full 360° rotation |
| `--rotating-carousel-z-index` | `2` | Stacking context of the slider box |
| `--rotating-carousel-focus-outline-width` | `2px` | Outline width on the root region and the control button when keyboard-focused (colour is `--theme-ring`) |
| `--rotating-carousel-focus-outline-offset` | `2px` | Outline offset on the same two focus states |
| `--rotating-carousel-control-offset` | `8px` | Distance of the pause/play button from the top and end edges |
| `--rotating-carousel-control-background-colour` | `rgba(0, 0, 0, 0.7)` | Pause/play button background |
| `--rotating-carousel-control-background-colour-hover` | `rgba(0, 0, 0, 0.9)` | Pause/play button background on hover |
| `--rotating-carousel-control-text-colour` | `white` | Pause/play button icon colour |
| `--rotating-carousel-control-border-radius` | `4px` | Pause/play button border radius |
| `--rotating-carousel-control-padding` | `8px` | Pause/play button padding |
| `--rotating-carousel-control-font-size` | `14px` | Pause/play button icon font size |
| `--rotating-carousel-control-transition-duration` | `0.2s` | Pause/play button background-colour transition duration |
| `--rotating-carousel-control-border-width` | `1px` | Pause/play button border width in forced-colors/high-contrast mode (`prefers-contrast: high`) |

```css
.my-page {
  --rotating-carousel-item-width: 260px;
  --rotating-carousel-item-height: 320px;
  --rotating-carousel-rotation-duration: 45s;
}
```

## High-contrast mode colours are not tokenised

Under `prefers-contrast: high`, the control button switches to the system colour keywords
`ButtonFace`/`ButtonText` rather than the component's own background/text tokens, so it tracks the
user's OS-level high-contrast theme. Only the border *width* in that mode is a token
(`--rotating-carousel-control-border-width`).

## Rotation geometry is prop-driven, not tokens

`rotateX`, `perspective`, and `translateZ` control the 3D tilt and radius of the rotation and are
set via props (not CSS custom properties), since they also drive the component's own scroll-based
parallax math:

```vue
<RotatingCarouselImage :data="images" :perspective="1200" :translate-z="1200" />
```

## Control button icon and copy

The pause/play button's icon and its `aria-label` copy are overridable via `playIcon`/`pauseIcon`/
`playLabel`/`pauseLabel` props, or the `toggle-icon` slot for a fully custom icon (scoped with
`isPaused`) — same pattern as `MarqueeScroller`.
