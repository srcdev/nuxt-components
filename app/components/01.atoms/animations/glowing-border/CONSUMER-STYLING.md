# GlowingBorder — Consumer Styling Guide

## Public CSS custom properties

| Token | Default | Description |
|---|---|---|
| `--glowing-border-width` | `3px` | Border thickness. |
| `--glowing-border-radius` | `30px` | Corner radius. |
| `--glowing-border-surface` | `canvas` | Fill colour behind the glow (the padding-box layer). |
| `--glowing-border-animation-duration` | `10s` | Time for the glow to complete one full rotation. |

```vue
<GlowingBorder
  style="--glowing-border-width: 6px; --glowing-border-radius: 8px; --glowing-border-animation-duration: 3s;"
>
  <p>Fast, sharp-cornered glow</p>
</GlowingBorder>
```

## Variant colour stops

Each `variant` drives a 5-stop conic gradient. Every stop is an individually overridable token,
named `--glowing-border-{variant}-color-{1-5}`:

| Variant | Stops (defaults) |
|---|---|
| `subtle` (default) | `--glowing-border-subtle-color-1` `#ff9a9e` · `-2` `#fad0c4` · `-3` `#fad0c4` · `-4` `#fbc2eb` · `-5` `#a18cd1` |
| `vivid` | `--glowing-border-vivid-color-1` `#ff0000` · `-2` `#ffa500` · `-3` `#ffff00` · `-4` `#008000` · `-5` `#0000ff` |
| `silver` | `--glowing-border-silver-color-1` `#d4d4d4` · `-2` `#e4e4e4` · `-3` `#f5f5f5` · `-4` `#e4e4e4` · `-5` `#d4d4d4` |
| `steel` | `--glowing-border-steel-color-1` `#434343` · `-2` `#5a5a5a` · `-3` `#6e6e6e` · `-4` `#5a5a5a` · `-5` `#434343` |
| `green` | `--glowing-border-green-color-1` `#00ff87` · `-2` `#39ff14` · `-3` `#00c853` · `-4` `#64dd17` · `-5` `#00e676` |

```vue
<GlowingBorder
  variant="vivid"
  style="--glowing-border-vivid-color-1: var(--theme-accent); --glowing-border-vivid-color-5: var(--theme-accent-alt);"
>
  <p>Brand-coloured glow</p>
</GlowingBorder>
```

## Motion

The glow rotates continuously via CSS animation and stops automatically when the visitor has
`prefers-reduced-motion: reduce` set.

## Class passthrough

Use `styleClassPassthrough` to add classes to the root element for layout purposes (positioning,
sizing) — it doesn't affect the glow's colours or geometry, which stay governed by the tokens
above.

```vue
<GlowingBorder style-class-passthrough="my-glowing-border">...</GlowingBorder>
```

## Internal (non-overridable) custom properties

`--_glow-deg`, `--_clr-1` through `--_clr-5`, and `--_gradient-glow` are internal composition
plumbing (the resolved per-variant colour stops and the animated rotation angle) — use the public
tokens above instead.
