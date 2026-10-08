# ContainerGlow — Consumer Styling Guide

## Public token API

Static, per-card visual tokens. Set them on an element you own (see Local overrides) or with a
`style` attribute:

| Token | Default | Description |
|---|---|---|
| `--container-glow-background` | `var(--theme-surface-subtle)` | Card background colour. |
| `--container-glow-text-colour` | `var(--theme-text)` | Card text colour. |
| `--container-glow-padding` | `2rem` | Card inner padding. |
| `--container-glow-aspect-ratio` | `330 / 400` | Card aspect ratio. Content taller than this grows the card. |
| `--container-glow-border-radius` | `12px` | Card and glow-effect corner radius (shared by the card and every glow layer). |
| `--container-glow-min-width` | `280px` | Card minimum width, capped at the wrapper's width so a narrow viewport never overflows. |
| `--container-glow-max-width` | `280px` | Card maximum width. |
| `--container-glow-content-gap` | `0.25rem` | Gap between a card's own slotted children. |
| `--container-glow-highlight-colour` | `hsl(280 10% 50% / 1)` | Tint of the thin proximity-tracking ring drawn under the coloured glow. |
| `--container-glow-brightness` | `1.5` | Brightness multiplier applied to the coloured glow layer. |
| `--container-glow-transition-duration` | `1s` | Fade duration when the glow's opacity changes (also disabled under `prefers-reduced-motion: reduce`). |
| `--container-glow-gradient` | 5-stop conic rainbow gradient | The glow's colour gradient. Override with any valid `background` value (a `conic-gradient(...)`, a flat colour, etc). |

> Changed 2026-10-08: `--container-glow-background` defaulted to `white` and the card set no text
> colour. It now defaults to `var(--theme-surface-subtle)`, with the new
> `--container-glow-text-colour` defaulting to `var(--theme-text)`. Set
> `--container-glow-background: white` to keep the old look.

```vue
<ContainerGlow
  style="--container-glow-background: #111; --container-glow-text-colour: #eee; --container-glow-gradient: conic-gradient(from 180deg, #22d3ee, #a855f7, #22d3ee);"
>
  <template #cta>
    <p>Custom-coloured glow card</p>
  </template>
</ContainerGlow>
```

Private tokens, not public API: `--_start`, `--_opacity-active`, `--_gap`, `--_blur`, `--_spread`,
`--_direction` and `--_gradient`. They're driven by pointer events and the `config` prop; use
`config` (gap/blur/spread/direction/opacity) or the public tokens above (colour/geometry) instead.

## State hooks

| Selector | Element |
|---|---|
| `.container-glow-wrapper` | Root. A `<ul>` when `tag="li"`, otherwise a `<div>`. Flex row (column with `config.vertical`) that wraps onto new lines. |
| `.container-glow` | One card per named slot, rendered as the `tag` element. |
| `.container-glow-glows` | Decorative blurred glow layer inside each card (`aria-hidden`). |

> Changed 2026-10-08: the glow layer class was `.glows`; renamed to `.container-glow-glows` so a
> consumer's own `.glows` class can't collide with it. The wrapper also gained `flex-wrap: wrap`
> (many cards used to overflow sideways) and renders as a `<ul>` when `tag="li"` (previously an
> invalid `<li>` inside a `<div>`), with list margin, padding and bullets reset.

## The `config` prop (layout and interaction behaviour)

Proximity distance, glow spread/blur, wrapper gap, wrapper direction, and the inactive-state
opacity are **not** CSS tokens. They're computed in JavaScript and applied as private custom
properties, so they're driven entirely by the `config` prop (`ContainerGlowConfig`, importable
from `srcdev-nuxt-components`):

| Field | Type | Default | Description |
|---|---|---|---|
| `proximity` | `number` | `40` | Pointer distance (px) at which a card starts glowing. Minimum `0`. |
| `spread` | `number` | `80` | Angular spread of the glow (degrees). Clamped to `0`–`360`. |
| `blur` | `number` | `20` | Blur applied to the glow layer (px). Minimum `0`. |
| `gap` | `number` | `32` | Gap between cards in the wrapper (px). Minimum `0`. |
| `vertical` | `boolean` | `false` | Stack cards vertically instead of horizontally. |
| `inactiveOpacity` | `number` | `0` | Glow opacity when the pointer isn't nearby. Clamped to `0`–`1`. |

Non-finite values (`NaN`, `Infinity`) fall back to the default. All fields are optional:

```vue
<ContainerGlow :config="{ blur: 40, vertical: true }">
  <template #one><p>Card one</p></template>
  <template #two><p>Card two</p></template>
</ContainerGlow>
```

## Named dynamic slots

Each named slot renders as one glow card. The consumer controls the slot names; there's no
`itemCount`-style prop:

```vue
<ContainerGlow>
  <template #pricing><p>Starter</p></template>
  <template #featured><p>Pro</p></template>
</ContainerGlow>
```

## Motion

The glow's opacity fade (`--container-glow-transition-duration`) is disabled under
`prefers-reduced-motion: reduce`, so proximity changes are instant rather than animated.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

## Class passthrough

Use `styleClassPassthrough` to add classes to the root `.container-glow-wrapper` element.

```vue
<ContainerGlow style-class-passthrough="my-container-glow">...</ContainerGlow>
```
