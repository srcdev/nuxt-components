---
name: GlowingBorder
description: GlowingBorder decorative wrapper with an animated conic-gradient glow border in 5 colour variants
type: reference
---

# GlowingBorder

## Overview

`GlowingBorder` wraps its default slot content in a rotating conic-gradient border effect, built
with `@property`-registered custom properties so the hue rotation animates smoothly. It renders as
a configurable root element via the `tag` prop.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "p" \| "span" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "main" \| "nav" \| "ul" \| "ol"` | `"div"` | Root element tag. |
| `variant` | `"subtle" \| "vivid" \| "silver" \| "steel" \| "green"` | `"subtle"` | Glow colour variant. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Description |
|---|---|
| `default` | Content rendered inside the glowing border. |

## Basic usage

```vue
<GlowingBorder variant="vivid">
  <p>Content wrapped in a glowing border</p>
</GlowingBorder>
```

## Styling

Border width, radius, surface colour, animation duration, and every variant's 5 gradient colour
stops are public CSS custom properties — see `CONSUMER-STYLING.md` for the full token table.

```vue
<GlowingBorder
  variant="steel"
  style="--glowing-border-width: 2px; --glowing-border-animation-duration: 6s;"
>
  <p>Slower, thinner steel glow</p>
</GlowingBorder>
```

## Motion

The glow animation stops automatically under `prefers-reduced-motion: reduce`.

## Notes

- 2026-09-20 migration: moved from `app/components/glowing-border/` (unplaced) into
  `01.atoms/animations/glowing-border/`; converted from options-style `defineProps({...})` to
  `interface Props` + `withDefaults`; promoted border width/radius/surface/animation-duration and
  every variant's 5 colour stops (previously hardcoded or unprefixed `--border-width`/`--surface`)
  to public `--glowing-border-*` tokens; renamed internal composition custom properties
  (`--clr-1..5`, `--glow-deg`, `--gradient-glow`) to private `--_clr-1..5`/`--_glow-deg`/
  `--_gradient-glow`; added a `prefers-reduced-motion` guard. No behaviour change beyond the new
  override surface.
- 2026-09-20: added `green` variant (vibrant, saturated greens: `#00ff87`, `#39ff14`, `#00c853`,
  `#64dd17`, `#00e676`), each stop overridable via `--glowing-border-green-color-{1-5}`.
