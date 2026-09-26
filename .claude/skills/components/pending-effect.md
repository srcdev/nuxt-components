# PendingEffect Component

## Overview

`PendingEffect` is a decorative SVG that draws an animated dashed line around a busy button. It
is an internal part of `InputButtonCore`: set `has-pending-effect` on the button and toggle
`is-pending`. Don't render it on its own. Its CSS depends on the host having `.pending-effect`
(and `position: relative`, which that rule provides), plus `.is-pending` to show and animate it.

```vue
<InputButtonCore button-text="Submit" type="submit" has-pending-effect :is-pending="submitting" />
```

---

## Props reference

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `theme` | `"default" \| "success" \| "error" \| "warning"` | `"default"` | Set as `data-theme` on the SVG, so the `--theme-surface` colour defaults follow the theme. `InputButtonCore` passes its own `theme`. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the SVG. Not forwarded by `InputButtonCore`. |

No slots, no events.

---

## Behaviour

- Hidden (`opacity: 0`) until the host has `.is-pending`.
- The host must not clip overflow: the line is drawn outside the host's edge. `InputButtonCore`
  sets `overflow: hidden` on buttons generally, and switches it to `visible` when
  `.pending-effect` is present. Before 2026-09-26 it didn't, so the effect never rendered at all.
- Under `prefers-reduced-motion: reduce` it never shows, since the animation is the whole effect.
- `aria-hidden="true"` and `focusable="false"`: it is decorative. Busy state for assistive tech
  is the host button's responsibility.
- The dash animation runs on the SVG's own rects. It used to run on the host button, and because
  `stroke-dashoffset` is inherited, it also animated the stroke of any SVG icon inside the button.

---

## Styling

Full table in `app/components/05.forms/pending-effect/CONSUMER-STYLING.md`. Public tokens:
`--pending-effect-line-color|line-thickness|line-length`, `--pending-effect-blur-color|blur-size`,
`--pending-effect-offset`, `--pending-effect-border-radius|border-radius-icon-only`,
`--pending-effect-animation-duration`. All read with fallbacks at the point of use, so they can
be set on any ancestor.

---

## History

**Migrated 2026-09-26** (0/5 → full compliance):

- Tokens renamed to `--pending-effect-*` (were `--pending-line-*`, `--pending-blur-*`,
  `--pending-offset`, and the generic `--animation-speed`). They used to be declared on the host
  button, which blocked any override set on a parent. No consumer overrode the old names.
- Inner classes prefixed (`.pending-effect-container|blur|line`), keyframes renamed from the
  generic `stroke-dashoffset` to `pending-effect-dash`.
- Animation moved from the host button to the rects (see Behaviour).
- Corner radius became a public token; removed a dead base `stroke: black; stroke-width: 0.5rem`
  that both rects always overrode.
- SVG is now `aria-hidden`; `styleClassPassthrough` changes after mount are picked up.
