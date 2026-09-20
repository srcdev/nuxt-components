# WipeAwayVertical — Consumer Styling

## Public tokens

| Token | Default | Applies to |
|---|---|---|
| `--wipe-away-vertical-height` | `100vh` | `.sticky-items-container` height — the visible height of the sticky panel stack |
| `--wipe-away-vertical-border-radius` | `0.5rem` | `.sticky-item` corner radius |
| `--wipe-away-vertical-animation-duration` | `1s` | `wipe-out` scroll-linked animation, browsers supporting `animation-timeline: view()` |
| `--wipe-away-vertical-fallback-transition-duration` | `0.4s` | opacity fade transition, browsers without `animation-timeline: view()` support |
| `--wipe-away-vertical-trailing-buffer` | `50vh` | height of an invisible spacer rendered after the last scrolling section |

## Trailing buffer

A small cushion of extra scroll room after the last real scrolling section, so the sticky
container has a moment to settle on the final panel before it un-sticks and scrolls away with
the rest of the page. Reduce or zero it out only after verifying the final transition still
completes cleanly with your own `--wipe-away-vertical-height`.

## Sticky vertical centering — use vh, not %

`.sticky-items-container` centers itself with `top: 50vh; transform: translateY(-50%);`. Do
not change `50vh` to `50%` if you override this in consumer CSS: for `position: sticky`, a
percentage `top` resolves against the *containing block's* height (the whole component, which
is deliberately many viewport-heights tall to hold the scroll-tracking sections), not the
viewport — so `top: 50%` would compute to an enormous, unreachable offset and produce broken,
erratic sticky-engagement timing rather than vertical centering.

```css
.wipe-away-vertical {
  --wipe-away-vertical-border-radius: 1rem;
  --wipe-away-vertical-animation-duration: 1.5s;
}
```

## Not overridable

`--_wipe-away-vertical-calculated-inset` is a private token: it's computed at runtime from
`getBoundingClientRect()` measurements of the sticky items container and has no consumer-relevant
default to override.

## Reduced motion

The wipe animation and fallback opacity transition are both disabled under
`prefers-reduced-motion: reduce` — content is shown fully opaque with no clip/fade.

## Class passthrough

`styleClassPassthrough` (string or string array) is applied to the root element via
`useStyleClassPassthrough`.
