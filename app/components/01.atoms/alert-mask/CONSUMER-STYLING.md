# AlertMask — Consumer Styling Guide

> **Renamed 2026-10-17**: `AlertMaskCore` → `AlertMask`, root class `.alert-mask-core` →
> `.alert-mask`. The colours also became CSS tokens (below); `config` colours still override them.

`AlertMask` draws a border and a translucent fill around its slot as an SVG path, sized to the
measured content. Geometry (radii, per-side border widths) can't be a CSS token, because the path
is computed in script, so it comes from the `config` prop. Colours are plain CSS `fill` values, so
they're tokens.

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--alert-mask-border-colour` | `var(--theme-accent)` | Border fill |
| `--alert-mask-background-colour` | `color-mix(in oklab, var(--theme-surface-subtle) 80%, transparent)` | Inner fill |

A `config.borderColour` or `config.backgroundColour` is applied as an inline `fill` style on its
path and beats the token. Both read the theme of the nearest `data-theme` ancestor.

> **Changed 2026-10-17**: the colours were `config`-only, with hardcoded defaults
> (`var(--orange-08)` border, `rgba(0,0,0,0.25)` fill). They now default from the tokens above.

### Geometry (`config`, `AlertMaskConfig`)

| Field | Default | Controls |
|---|---|---|
| `radiusLeft` / `radiusRight` | `12` | Corner radius (px) of the left and right corners |
| `borderLeft` / `borderTop` / `borderRight` / `borderBottom` | `8` | Border width (px) per side; the content is inset by the same amounts |

Sides are physical (left stays left in a right-to-left layout), matching the drawn path. Negative
or non-finite values fall back to `0` and the default respectively, and a radius larger than the
box is clamped to half its smaller side.

Private tokens (not public API): `--_height` (the measured SVG height) and `--_inset-left`,
`--_inset-right`, `--_inset-top`, `--_inset-bottom` (content margins from the border widths), all set
inline from script.

---

## State hooks

None. Inner elements: `.alert-mask` > `.alert-mask-decorator` (the SVG, with `.alert-mask-border`
and `.alert-mask-background` paths) + `.alert-mask-content` > `.alert-mask-content-slot`.

---

## Global theming

```css
:where(html) {
  --alert-mask-border-colour: var(--theme-border);
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** a colour passed in `config` is an inline style on the path, so it wins over the token
wherever the token is set. `AlertMaskedContent` passes both colours this way (through its own
`--alert-masked-content-*` tokens), so inside it set those instead.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.alert-mask` element and updates after mount.
Use it for layout (sizing, positioning) or to scope the colour tokens.

```vue
<AlertMask style-class-passthrough="my-alert-mask">...</AlertMask>
```
