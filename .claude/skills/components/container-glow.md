---
name: ContainerGlow
description: ContainerGlow pointer-proximity glow-border cards, named dynamic slots (one card per slot), config-prop-driven layout/interaction, full CSS token API for static visuals
type: reference
---

# ContainerGlow

## Overview

`ContainerGlow` renders one "glow card" per named default slot the consumer provides — each card
tracks the pointer and reveals an animated conic-gradient glow border when the pointer is near it.
It uses the named dynamic slots pattern (`v-for="(_, name) in $slots"`), so there's no
`itemCount`-style prop; the consumer's slot names are the source of truth.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "li" \| "article" \| "section"` | `"div"` | HTML tag rendered for each card. |
| `config` | `ContainerGlowConfig` | `{}` | Proximity/spread/blur/gap/direction/inactive-opacity — see below. All fields optional. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root wrapper element. |

### `ContainerGlowConfig` (`app/types/components/container-glow.d.ts`)

| Field | Type | Default | Description |
|---|---|---|---|
| `proximity` | `number` | `40` | Pointer distance (px) at which a card starts glowing. |
| `spread` | `number` | `80` | Angular spread of the glow (degrees). |
| `blur` | `number` | `20` | Blur applied to the glow layer (px). |
| `gap` | `number` | `32` | Gap between cards in the wrapper (px). |
| `vertical` | `boolean` | `false` | Stack cards vertically instead of horizontally. |
| `inactiveOpacity` | `number` | `0` | Glow opacity when the pointer isn't nearby. |

## Slots

Named dynamic — every slot the consumer provides renders as one glow card. There is no fixed slot
name list or count prop.

```vue
<ContainerGlow>
  <template #one><p>Card one</p></template>
  <template #two><p>Card two</p></template>
</ContainerGlow>
```

## Basic usage

```vue
<ContainerGlow :config="{ blur: 40, vertical: true }">
  <template #pricing><p>Starter plan</p></template>
  <template #featured><p>Pro plan</p></template>
</ContainerGlow>
```

## How it works

- A single `pointermove` listener on `document.body` (added on mount, removed via `AbortController`
  on unmount) drives every card at once, throttled to one `requestAnimationFrame` per frame.
- For each card, the listener checks whether the pointer is within `config.proximity` px of the
  card's bounding box. If so, it computes the pointer's angle relative to the card centre and sets
  that on a private `--_start` custom property (registered via `@property` so it participates in
  the conic-gradient mask math); the card's `--_opacity-active` is set to `1` (or
  `config.inactiveOpacity` otherwise).
- Two pseudo-elements (`::before`/`::after`) and a `.glows` layer combine a thin proximity ring, a
  coloured gradient glow, and a blurred backdrop glow, all masked by conic gradients driven from
  `--_start` and `--_spread`.
- `config.gap`/`config.blur`/`config.spread`/`config.vertical` are applied once (and on every
  `config` change, via a deep `watch`) as private custom properties on the wrapper, which cards
  inherit.

## Styling

Card background/padding/sizing/border-radius/highlight-colour/brightness/transition-duration and
the glow gradient itself are public CSS custom properties — see `CONSUMER-STYLING.md` for the full
token table. Layout and interaction behaviour (proximity, spread, blur, gap, direction, inactive
opacity) go through the `config` prop instead, since they're computed in JavaScript per pointer
event rather than static CSS.

```vue
<ContainerGlow style="--container-glow-border-radius: 4px; --container-glow-brightness: 2;">
  <template #cta><p>Sharper, brighter glow</p></template>
</ContainerGlow>
```

## Motion

The opacity transition is disabled under `prefers-reduced-motion: reduce` (proximity state changes
apply instantly instead of fading).

## Notes

- 2026-09-20 migration: renamed from `ContainerGlowCore` to `ContainerGlow` — the `Core` suffix in
  this library denotes a primitive with a non-Core wrapper built on top of it (`InputTextCore` →
  `InputTextWithLabel`, `AlertMaskCore` → `AlertMaskedContent`), and this component has no such
  sibling. Checked all consumer repos first; found one real usage in the defunct
  `nuxt-extend-nuxt-forms` demo app, left as a follow-up for that repo rather than edited here.
- Moved from `app/components/container-glow/` (unplaced) into
  `01.atoms/animations/container-glow/`.
- The `Config` type was previously an inline, non-exported interface with **all fields required**,
  so passing a partial `:config="{ blur: 40 }"` silently dropped every other field to `undefined`
  (breaking the proximity/spread/gap/direction maths). Fixed: all `ContainerGlowConfig` fields are
  now optional, merged against defaults internally, and the type is exported from
  `app/types/components/container-glow.d.ts` for consumers to import.
- `config.gap` and `config.vertical` were computed in JS (`--gap`/`--direction` custom properties
  set on the wrapper) but never actually consumed anywhere in the CSS — the wrapper's flex layout
  hardcoded `gap: 3.2rem` with no `flex-direction` at all, so both fields were silently inert.
  Fixed by wiring the wrapper's `gap`/`flex-direction` to the (now privately-prefixed) computed
  values.
- `@property --start` was nested inside the `.container-glow-wrapper` style rule, which is invalid
  CSS (`@property` must be a top-level or `@layer`-nested rule, not nested inside a normal
  selector) — browsers silently drop invalid nested at-rules, so the custom property was never
  actually type-registered. Moved to a top-level declaration inside `@layer components`, renamed
  `--start` → `--_start` to match the private-token convention.
- Removed a dead, never-referenced `--alpha: 0` custom property that appeared on two pseudo-element
  rules.
- Promoted the previously hardcoded background/padding/aspect-ratio/border-radius/min-max-width/
  content-gap/highlight-colour/brightness/transition-duration and gradient colours to public
  `--container-glow-*` tokens; the JS/config-driven proximity/spread/blur/gap/direction/opacity
  custom properties were renamed to `--_start`/`--_opacity-active`/`--_gap`/`--_blur`/`--_spread`/
  `--_direction`/`--_gradient` to match the private-token convention (they're config-driven, not a
  direct CSS override surface).
- Added a `prefers-reduced-motion: reduce` guard disabling the opacity transition.
