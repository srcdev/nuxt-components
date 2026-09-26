# PendingEffect — Consumer Styling Guide

`PendingEffect` draws an animated dashed line around a button while it is busy. You don't use it
directly: `InputButtonCore` renders it when `has-pending-effect` is set, and it animates while
`is-pending` is true.

```vue
<InputButtonCore button-text="Save" has-pending-effect :is-pending="saving" />
```

The CSS keys off the host button's classes: `.pending-effect` (added by `has-pending-effect`),
`.is-pending`, and `.icon-only`. The SVG itself is `.pending-effect-container`.

The line sits outside the button's edge, so nothing around it may clip overflow. `InputButtonCore`
sets `overflow: visible` on itself when `has-pending-effect` is on, but an ancestor with
`overflow: hidden` and no spare room (e.g. a tight card or table cell) will still cut it off.

## Public token API

Set these on the button or any ancestor. Every token is read with its fallback at the point of
use, so an override anywhere up the tree applies.

| Token | Default | Controls |
|---|---|---|
| `--pending-effect-line-color` | `var(--theme-surface)` | Colour of the moving line |
| `--pending-effect-line-thickness` | `0.1rem` | Line stroke width |
| `--pending-effect-line-length` | `2rem` | Length of each dash (the dash pattern repeats every `5rem`) |
| `--pending-effect-blur-color` | `var(--theme-surface)` | Colour of the soft glow behind the line |
| `--pending-effect-blur-size` | `0rem` | Glow width and blur radius. `0rem` turns the glow off; try `0.3rem` |
| `--pending-effect-offset` | `1rem` | How far the line sits outside the button edge (total, split across both sides) |
| `--pending-effect-border-radius` | `0.8rem` | Corner radius of the line |
| `--pending-effect-border-radius-icon-only` | `100vw` | Corner radius on an icon-only button (fully round) |
| `--pending-effect-animation-duration` | `3000ms` | Time for one loop of the animation |

The colour defaults use `--theme-surface` resolved on the SVG, which carries the button's
`data-theme`, so `theme="error"` etc. recolours the line automatically.

Private tokens (not public API): `--_container-offset` (the SVG's overflow allowance, used for
positioning maths) and `--_offset` (the resolved `--pending-effect-offset`).

> **Changed 2026-09-26**: tokens were renamed from `--pending-line-color`, `--pending-line-thickness`,
> `--pending-line-length`, `--pending-blur-color`, `--pending-blur-size`, `--pending-offset` and
> `--animation-speed` to the `--pending-effect-*` names above. The old ones were declared on the
> button itself, so setting them on a parent element had no effect. Inner classes were renamed
> from `.pending-container`/`.pending-blur`/`.pending-line` to `.pending-effect-*`, and the
> keyframes from `stroke-dashoffset` to `pending-effect-dash`.

---

## Reduced motion

Under `prefers-reduced-motion: reduce` the effect stays hidden. The host button still gets
`pointer-events: none` while `.is-pending` is set, from this component's CSS, so it can't be
clicked twice.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --pending-effect-line-thickness: 0.2rem;
  --pending-effect-blur-size: 0.3rem;
}
```

## Scoped overrides

```css
.checkout-page {
  --pending-effect-line-color: var(--gold-05);
  --pending-effect-animation-duration: 2000ms;
}
```

## Class passthrough

`:style-class-passthrough` adds classes to the SVG. `InputButtonCore` doesn't forward it, so this
only matters if you render `PendingEffect` yourself.
