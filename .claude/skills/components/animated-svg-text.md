---
name: AnimatedSvgText
description: AnimatedSvgText inline SVG stroke-draw-then-fill animation — text slot, CSS token API
type: reference
---

# AnimatedSvgText

## Overview

`AnimatedSvgText` animates SVG content placed in its `text` slot with a stroke-draw-then-fill
effect: the outline strokes in, then the shape fills. Works with either `<path>` elements (e.g.
letters converted to path data) or a plain SVG `<text>` element — both support `stroke`,
`fill`, and `stroke-dasharray` per the SVG spec.

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root `<div>`. |

## Slots

| Slot | Description |
| ---- | ----------- |
| `text` | The SVG markup to animate. Any `<path>` elements inside are targeted by the draw animation. |

## Basic usage

```vue
<AnimatedSvgText>
  <template #text>
    <svg viewBox="0 0 600 150">
      <path d="..." />
    </svg>
  </template>
</AnimatedSvgText>
```

Or with a plain SVG `<text>` element (no need to trace letterforms to paths) — just scale
`--animated-svg-text-stroke-width`/`-stroke-dasharray` up for a larger `viewBox`/`font-size`:

```vue
<AnimatedSvgText style="--animated-svg-text-stroke-width: 2; --animated-svg-text-stroke-dasharray: 2200;">
  <template #text>
    <svg viewBox="0 0 600 150">
      <text x="0" y="110" font-size="120" font-weight="700">Hello</text>
    </svg>
  </template>
</AnimatedSvgText>
```

## CSS custom properties

All public — see `CONSUMER-STYLING.md` in the component folder for the full table.

| Property | Default |
| -------- | ------- |
| `--animated-svg-text-stroke-colour` | `var(--theme-text)` |
| `--animated-svg-text-fill-colour` | `var(--theme-text)` |
| `--animated-svg-text-stroke-width` | `0.3` |
| `--animated-svg-text-stroke-dasharray` | `1000` |
| `--animated-svg-text-animation-duration` | `2s` |

`--animated-svg-text-stroke-dasharray` is the one worth tuning per SVG — it should roughly match
the total path length of the animated content; too small finishes the stroke early, too large
makes the animation appear to stall before it starts.

## Notes

- The animation runs once on mount (`forwards`, 1 iteration) — no loop, no scroll trigger, no
  replay on re-entry.
- Previous versions of this component tried to switch colours via a `[data-color-scheme]`
  attribute on `<html>` that nothing in this app ever set, referencing custom properties
  (`--_animated-svg-text-stroke-light`, etc.) that were never declared anywhere — the animation's
  colour and duration were effectively dead/undefined in production. Fixed by exposing genuine
  public tokens that default to `var(--theme-text)`, matching the rest of the library's `--theme-*`
  light/dark convention instead of reimplementing it per-component.
