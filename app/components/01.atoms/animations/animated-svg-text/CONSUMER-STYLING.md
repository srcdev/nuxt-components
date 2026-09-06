# AnimatedSvgText — Consumer Styling

`AnimatedSvgText` has no props of its own beyond `styleClassPassthrough` — the SVG markup is
provided via the `text` slot, either as `<path>` outlines of the text or a plain SVG `<text>`
element (both support `stroke`/`fill`/`stroke-dasharray` per the SVG spec). All visual control is
through public CSS custom properties, consumed directly on `.animated-svg-text svg path, .animated-svg-text svg text`.

## Public tokens

| Property | Default | Description |
| -------- | ------- | ------------ |
| `--animated-svg-text-stroke-colour` | `var(--theme-text)` | Stroke colour during the draw-on phase. |
| `--animated-svg-text-fill-colour` | `var(--theme-text)` | Fill colour once the draw-on animation completes. |
| `--animated-svg-text-stroke-width` | `0.3` | Stroke width (in the SVG's own coordinate units) during the draw-on phase. |
| `--animated-svg-text-stroke-dasharray` | `1000` | Dash length used to drive the "draw" effect. Set this to roughly the total path length of your SVG — too small and the stroke completes before covering the full outline; too large and the animation appears to pause at the start. |
| `--animated-svg-text-animation-duration` | `2s` | Duration of the full draw-fill animation. |

```vue
<AnimatedSvgText style="--animated-svg-text-stroke-colour: #e63946; --animated-svg-text-animation-duration: 3.5s;">
  <template #text>
    <svg viewBox="0 0 400 100"><path d="..." /></svg>
  </template>
</AnimatedSvgText>
```

## Notes

- The animation runs once on mount (`forwards`, `1` iteration) — it does not loop or replay on re-entry.
- `--animated-svg-text-stroke-dasharray` is the one token worth tuning per SVG: it depends on the
  total length of the animated content, which varies with font, text length, and the SVG's
  coordinate scale (`viewBox`). The defaults (`0.3` stroke-width, `1000` dasharray) suit path data
  traced at a small/normalised coordinate scale — a larger `viewBox` (e.g. plain SVG `<text>` at a
  large `font-size`) needs a proportionally larger `--animated-svg-text-stroke-width` and
  `--animated-svg-text-stroke-dasharray`, or the stroke renders too thin/short to see.
