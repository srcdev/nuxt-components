# ClippedPanel — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--clipped-panel-background-colour` | `light-dark(hsl(0, 0%, 96%), hsl(0, 0%, 12%))` | Panel background |
| `--clipped-panel-outline-colour` | `light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%))` | Outline colour, and the panel's text/icon colour (`color`) |
| `--clipped-panel-outline-width` | `1px` | Outline width |

```css
.my-page {
  --clipped-panel-background-colour: #fef3e7;
  --clipped-panel-outline-colour: #b5651d;
  --clipped-panel-outline-width: 2px;
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<ClippedPanel variant="square" style-class-passthrough="promo-panel">...</ClippedPanel>
```

```css
.promo-panel {
  --clipped-panel-background-colour: #fef3e7;
}
```

## Shapes are fixed-size, not tokenised

Each `variant`'s notched/cutout shape is drawn with `clip-path: path("...")` using literal pixel
coordinates (`square`/`circle-cutout` at 200×200px, `rectangle` at 300×200px). CSS custom
properties cannot be interpolated into a `path()` string, so the shape geometry itself — corner
radii, notch size, overall dimensions — is **not** overridable via tokens or `width`/`height`
overrides. Changing `width` on the element stretches the box without moving the clip-path
coordinates, which will misalign the shape. If a different size or geometry is needed, that
requires a new variant with its own `path()` string, not a CSS override.
