---
name: SparkleEffect
description: SparkleEffect decorative wrapper that sends sparkles along its rounded border and fades in a glow on hover or keyboard focus
type: reference
---

# SparkleEffect

## Overview

`SparkleEffect` wraps one element (a button, link or card) and, on hover or keyboard focus inside
it, sends small blurred sparkles travelling along the wrapper's border box while a soft glow fades in
behind the slot. Adapted from a Kevin Powell CodePen ("whimsical" button). It's a wrapper rather than
a utility class because the effect needs its own decorative elements.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `5` | Number of sparkles. Floored and clamped to 1 to 12; a non-finite value falls back to 5. |
| `radius` | `string` | `undefined` | Written inline as `--sparkle-effect-radius`. Match the slotted element's corner radius. |
| `continuous` | `boolean` | `false` | Loop the sparkles for as long as the hover or focus lasts, instead of one burst per hover. Rendered as `data-continuous`. |
| `tag` | `"span" \| "div"` | `"span"` | `span` (inline-grid) for buttons and inline content, `div` (grid) for block content like cards. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root. |

## Slots

| Slot | Description |
|---|---|
| `default` | The element that gets the effect. One element; the wrapper shrinks to it. |

## Basic usage

```vue
<SparkleEffect>
  <InputButton button-text="Whimsy" is-pill />
</SparkleEffect>

<SparkleEffect continuous>
  <InputButton button-text="Keep hovering" is-pill />
</SparkleEffect>

<SparkleEffect tag="div" radius="1.2rem" :count="7">
  <NuxtLink to="/workshop" class="workshop-card">...</NuxtLink>
</SparkleEffect>
```

## Behaviour

- Renders the slotted content unchanged; the sparkles and glow are added around it.
- Renders `count` sparkles, floored and clamped to 1 to 12, with 5 for NaN or Infinity.
- The first five sparkles use tuned presets (lightness, hue shift, scale, drift, end point, speed)
  from the original pen. Sparkles 6 to 12 reuse them with a further hue shift (35° per cycle), an end
  point 13% further round the path and mirrored drift. Script writes them inline per sparkle, so there
  is no `:nth-child` and slotted siblings can't shift them.
- Hover, or `:focus-visible` on anything inside, runs the effect. By default it's one burst per hover; with
  `continuous` each sparkle loops at its own speed until the hover or focus ends. The slotted control keeps its own
  focus ring.
- The glow sits behind the slot (`isolation: isolate` on the root, glow at `z-index: -1`), so it
  works whatever stacking context the slotted element creates.
- Sparkles follow `--sparkle-effect-radius`: the wrapper can't read the child's radius.
- Sparkles are in an `aria-hidden`, `pointer-events: none` layer with nothing focusable.
- `prefers-reduced-motion: reduce` gives the glow only.
- Without `offset-path: border-box` (Safari before 17.2) no sparkles render; the glow still works.
  Without relative colour syntax (Safari before 18) sparkles use the base colour unshifted.
- No effect while the slotted element is `:disabled` or `aria-disabled="true"` (InputButton
  `readonly`).
- Hostile counts, long unbroken button labels, full-width block children, round icon buttons, nested
  wrappers and an empty wrapper don't break layout (`StressTest` story).

## Styling

Colour (defaults to `--theme-border`), sparkle size, sparkle blur (`1px`), duration, radius, glow blur and glow opacity
are public tokens; see `CONSUMER-STYLING.md`.

## Stories

**Atoms/Effects/SparkleEffect**: Default (the original pen's lavender), ThemeColour, ManySparks,
Continuous, OnCard, Disabled, StressTest.
