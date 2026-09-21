# InputRangeCore — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--input-range-accent-colour` | `var(--theme-accent)` | Native `accent-color` of the range input (track/thumb tint) |
| `--input-range-marker-background-colour` | `light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%))` | Background colour of each `markers` slot dot |
| `--input-range-marker-padding` | `0.5rem` | Padding of each marker dot |
| `--input-range-marker-border-radius` | `50%` | Corner radius of each marker dot |
| `--input-range-marker-outline-width` | `0.1rem` | Marker dot outline width |
| `--input-range-marker-outline-colour` | `light-dark(var(--slate-04), var(--slate-06))` | Marker dot outline colour |
| `--input-range-marker-icon-size` | `2rem` | Font size of the marker icon (`.marker-icon`) |
| `--input-range-marker-icon-colour` | `var(--input-range-accent-colour, var(--theme-accent))` | Marker icon colour |
| `--input-range-datalist-font-size` | `1.4rem` | Font size of the `datalist` slot's option labels |
| `--input-range-datalist-font-weight` | `500` | Font weight of the `datalist` slot's option labels |

Geometry (thumb/track height, border radius) comes from the shared global form-geometry tokens
(`--input-range-button-size`, `--form-input-border-radius`), not from this component's own
tokens — see `theming-form-geometry-tokens.md`.

```css
.my-page {
  --input-range-accent-colour: var(--brand-primary);
  --input-range-marker-background-colour: var(--brand-primary);
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<InputRangeCore style-class-passthrough="price-range" ... />
```

## Notes

- `accent-color` was previously read from `--theme-form-range-accent-color`, a custom property
  never declared anywhere in the codebase (no fallback either) — per CSS spec this made the whole
  `accent-color` declaration invalid at computed-value time, so it silently fell back to the
  browser's native default accent colour instead of the intended theme colour. Fixed 2026-09-21;
  see the component's skill doc for detail.
- The `weight` prop (`FormWeight`) generates an `input-range--{weight}` class on the input, but no
  CSS in this component (or elsewhere in the library) currently styles that class — it's a no-op
  today. Left as-is rather than redesigned, since the original intent wasn't clear; flagged here
  so you don't spend time debugging "why doesn't `weight` do anything."
