---
name: MarqueeScroller
description: MarqueeScroller infinite horizontal logo/badge scroller — props, dynamic per-item slots, accessibility controls, CSS tokens, consumer styling
type: reference
---

# MarqueeScroller

## Overview

`MarqueeScroller` renders an infinite horizontal scroller for small repeating items — client
logos, badges, testimonial avatars. The track is duplicated once so the loop is seamless
(`.marquee-scroller-group` renders twice: once real, once `aria-hidden="true"` and `inert`), and the
whole thing pauses automatically on hover, whenever focus is inside it, and when the user has
`prefers-reduced-motion` set.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animationRuntime` | `string` | `"40s"` | CSS `animation-duration` for one full loop of the track. |
| `reverse` | `boolean` | `false` | Reverses the scroll direction. |
| `marqueeData` | `MarqueeItem[]` (`{ id: number; content: string }[]`) | `[]` | The items to render. Each item's `id` names the slot that renders its markup. `content` is not rendered by the component itself — it's a convenience field for the consumer to key off inside the slot. |
| `itemConfig` | `MarqueeItemConfig` (`{ width?, height?, gap? }`) | `{ width: "50px", height: "50px", gap: "16px" }` | Item box size and the gap between items. Also sets the track height. |
| `ariaLabel` | `string` | `"Scrolling content"` | `aria-label` on the root region — override for localisation. |
| `ariaDescription` | `string` | `"Use spacebar to pause or play the animation."` | Screen-reader-only instructions rendered inside the region — override for localisation. |
| `showControls` | `boolean` | `false` | Shows a visible pause/play button. Recommended (WCAG 2.2.2, Pause/Stop/Hide) whenever content scrolls automatically and indefinitely. |
| `respectReducedMotion` | `boolean` | `true` | Auto-pauses and disables the animation for users with `prefers-reduced-motion: reduce` (and keeps it paused after focus leaves). Focus-pausing no longer depends on it. |
| `playIcon` | `string` | `"mdi:play"` | Iconify icon name shown on the control button while paused. Ignored if the `toggle-icon` slot is used. |
| `pauseIcon` | `string` | `"mdi:pause"` | Iconify icon name shown on the control button while playing. Ignored if the `toggle-icon` slot is used. |
| `playLabel` | `string` | `"Play animation"` | Control button text (visually hidden, its accessible name) while paused — override for localisation. |
| `pauseLabel` | `string` | `"Pause animation"` | Control button text (visually hidden, its accessible name) while playing — override for localisation. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root `.marquee-scroller`, via `useStyleClassPassthrough` (reacts to prop changes). |

Import the item types from the library's type exports when building `marqueeData`/`itemConfig`
outside the component:

```ts
import type { MarqueeItem, MarqueeItemConfig } from "srcdev-nuxt-components";
```

## Slots

One dynamically-named slot per `marqueeData` entry, named after that item's `id`:

```vue
<MarqueeScroller :marquee-data="[{ id: 1, content: 'logo-a' }, { id: 2, content: 'logo-b' }]">
  <template #1>
    <img src="/logos/a.svg" alt="Logo A" />
  </template>
  <template #2>
    <img src="/logos/b.svg" alt="Logo B" />
  </template>
</MarqueeScroller>
```

Each slot is rendered twice (once in the visible group, once in the `aria-hidden`, `inert`
duplicate group) so the loop wraps seamlessly. Don't put anything with side effects or unique ids
inside a slot. Links are fine: only the real copy is focusable. Items are fixed-size boxes; text
wraps inside them (`overflow-wrap: anywhere`) but content taller than `itemConfig.height` overflows.

`toggle-icon` (scoped with `{ isPaused: boolean }`) replaces the control button's icon entirely —
use this instead of `playIcon`/`pauseIcon` when an Iconify name isn't enough (custom SVG, a
different icon set):

```vue
<MarqueeScroller show-controls>
  <template #toggle-icon="{ isPaused }">
    <Icon :name="isPaused ? 'lucide:play' : 'lucide:pause'" />
  </template>
</MarqueeScroller>
```

## Accessibility behaviour

- The root is `role="region"` with `tabindex="0"` so it's independently focusable.
- Spacebar toggles pause/play while the region itself is focused (keydown from inside, e.g. on the
  control button or a link, is left to that element). Arrow keys do nothing — there is no
  manual-stepping behaviour, so the default `ariaDescription` doesn't claim one (fixed 2026-09-08;
  it previously announced "arrow keys ... for manual control" with no implementation behind it).
- Focus anywhere inside the region (the region itself, or a link in an item) pauses the animation
  and removes `aria-hidden` from the track, so the focused content is announced. Focus moving between
  elements inside keeps it paused. When focus leaves, it resumes only if focus caused the pause and
  the user doesn't prefer reduced motion: a pause chosen with the button or spacebar sticks.
  Focus landing on the control button doesn't auto-pause, so one click pauses. (Changed 2026-10-17:
  this used to listen for `focus`/`blur` on the region only, gated on `respectReducedMotion`, so
  tabbing to a link in an item left it moving and `aria-hidden`.)
- Hovering anywhere over the scroller pauses the track and applies
  `--marquee-scroller-group-hover-filter` (default `grayscale(1)`) to every item; hovering an
  individual item restores it via `--marquee-scroller-item-hover-filter` (default `grayscale(0)`).
- `aria-live` switches to `"polite"` while paused so screen readers announce the paused content.
- The track is `aria-hidden="true"` while playing (attribute removed when paused). The duplicate
  group is always `aria-hidden="true"` and `inert`, so its copies of any links can't be focused.
- The control button is an `InputButton` (`variant="inline"`, icon-only): `playLabel`/`pauseLabel`
  is its visually hidden text rather than an `aria-label`.
- All user-visible copy (`ariaLabel`, `ariaDescription`, `playLabel`, `pauseLabel`) is a plain
  string prop with an English default — there's no i18n framework dependency in this library, so
  pass translated strings from the consumer's own i18n solution.

## Basic usage

```vue
<MarqueeScroller
  :marquee-data="[
    { id: 1, content: 'acme' },
    { id: 2, content: 'globex' },
  ]"
  :item-config="{ width: '120px', height: '60px', gap: '24px' }"
  show-controls
>
  <template #1><img src="/logos/acme.svg" alt="Acme" /></template>
  <template #2><img src="/logos/globex.svg" alt="Globex" /></template>
</MarqueeScroller>
```

## CSS custom properties

See `CONSUMER-STYLING.md` in this component's folder for the full public token table. Item size,
gap, and animation duration are prop-driven (`itemConfig`, `animationRuntime`), not tokens, since
they also drive the component's own layout math. The `prefers-contrast: high` override's
`ButtonFace`/`ButtonText` colours are deliberately not tokens (they track the OS high-contrast
theme); only its border width is (`--marquee-scroller-control-border-width`).

## Seamless loop math

The track duplicates `marqueeData` into two `.marquee-scroller-group` children so the loop can wrap without
a visible cut. The animation must shift the track by exactly one group's width plus its connecting
gap — not `translateX(-50%)`, which overshoots short of the seam once the track's own `gap`
between the two groups is added to its total width. This is computed as a private
`--_track-shift: calc(itemCount * (itemWidth + gap))` token and used in the `marquee-scroller-move`
keyframe. Fixed 2026-09-08 — the original `-50%` version produced a small but visible gap/overlap
at the loop point once more than a couple of items were in `marqueeData`.

## Auto-repeating marqueeData in a wide container

If a single pass of `marqueeData` is narrower than the container (few items, or a full-bleed
section on a wide viewport), the loop briefly shows empty space before snapping back into view —
the visible track only spans as wide as the content, not the container. On mount (and on
container resize, via `ResizeObserver`), the component measures one rendered group's `scrollWidth`
against the root element's `offsetWidth` and repeats `marqueeData` internally (`repeatCount`)
enough times per `.marquee-scroller-group` so a single group's width always covers the container. This is
transparent to consumers — it doesn't change `marqueeData` or any prop, only how many times each
item's slot is rendered internally. Fixed 2026-09-08.

The repeat count is capped at 50 copies per group, so tiny items in a huge container can't flood
the DOM (added 2026-10-17).

## Storybook

`Atoms/Effects/MarqueeScroller`: `WithControls`, `FocusableItems` (links in items, for the focus
behaviour), and `StressTest` (24 items of hostile copy, a broken image, long localised labels, a
single item, tiny items hitting the repeat cap, and empty data). Stories use the `CanvasSwitcher`
decorator.

## History

**2026-10-17** (stress-test pass, breaking class renames):

- Structural classes prefixed (`.marquee-scroller-item`, `-control`, `-track`, `-group`,
  `-description`); bare `.reverse`/`.paused`/`.reduced-motion` became `data-*` attributes; keyframes
  renamed `marquee-scroller-move`. See CONSUMER-STYLING.md for the full map.
- Raw `<button>` replaced with `InputButton variant="inline"` (icon-only slot).
- Focus-pausing reworked (focusin/focusout, see Accessibility behaviour); duplicate group `inert`.
- `prefers-reduced-motion` change listener is now removed on unmount.
- New `--marquee-scroller-focus-outline-colour` token (was bare `--theme-ring`).
- Added `styleClassPassthrough`. Removed the redundant `aspect-ratio: 1 / 1` on items (width and
  height are both set, and it mis-centres on old Safari). Items wrap unbroken text.
