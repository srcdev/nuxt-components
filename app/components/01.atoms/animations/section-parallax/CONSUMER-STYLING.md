# SectionParallax — Consumer Styling Guide

## Public CSS custom properties

| Token | Default | Description |
|---|---|---|
| `--section-parallax-min-height` | `100svh` | Section height on browsers/inputs where the fixed-background parallax doesn't apply (touch devices, `prefers-reduced-motion: reduce`, or no `background-attachment: fixed` support). |
| `--section-parallax-min-height-fixed` | `120vh` | Section height once the parallax effect is active — taller than the base height to give enough scroll travel to see the motion. |
| `--section-parallax-background-position` | `center` | `background-position` of the image. |
| `--section-parallax-background-size` | `cover` | `background-size` of the image. |
| `--section-parallax-background-colour` | `light-dark(var(--slate-01), var(--slate-08))` | Fallback colour visible if the image fails to load or hasn't loaded yet. |

```vue
<SectionParallax
  background-image="/images/candle-and-stones.jpg"
  style="--section-parallax-min-height: 60vh; --section-parallax-min-height-fixed: 70vh;"
>
  <p>Shorter atmospheric break</p>
</SectionParallax>
```

## Motion

The parallax effect (`background-attachment: fixed`) only activates on `(hover: hover) and
(pointer: fine)` inputs that support it, and is disabled under `prefers-reduced-motion: reduce`
(falls back to `background-attachment: scroll` and the base `--section-parallax-min-height`).

## Class passthrough

Use `styleClassPassthrough` to add classes to the root element — e.g. to override `min-height`
from a consuming page's own stylesheet instead of inline tokens:

```css
.my-page {
  .section-parallax {
    min-height: 60vh;
  }
}
```

## No overlay/gradient built in

The component has no built-in overlay or gradient scrim — add one via the default slot or a
`::before` pseudo-element in your consuming-page styles.
