# DisplayBanner — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--display-banner-min-height` | `auto` | Minimum height of the banner |

```css
.my-page {
  --display-banner-min-height: 40rem;
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<DisplayBanner style-class-passthrough="hero-banner">...</DisplayBanner>
```

```css
.hero-banner {
  --display-banner-min-height: 40rem;
}
```

## Layout

`DisplayBanner` stacks its `canvas` and `content` slots on top of each other in a single grid
area (`grid-template-areas: "banner"`). Whichever slot is rendered later in the DOM sits visually
on top — put background media (an image, video, `CanvasSwitcher`-style visual) in `canvas` and
overlaid text/CTAs in `content`, since `content` follows `canvas` in the template.

Both slots are conditionally rendered (`v-if="$slots.canvas"` / `v-if="$slots.content"`), so an
unused slot contributes no empty wrapper `<div>` to the DOM.
