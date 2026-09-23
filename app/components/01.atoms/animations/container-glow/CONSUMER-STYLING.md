# ContainerGlow — Consumer Styling Guide

## Public CSS custom properties

These are static, per-card visual tokens — override them with a `style` attribute or from a
consuming page's own stylesheet:

| Token | Default | Description |
|---|---|---|
| `--container-glow-background` | `white` | Card background colour. |
| `--container-glow-padding` | `2rem` | Card inner padding. |
| `--container-glow-aspect-ratio` | `330 / 400` | Card aspect ratio. |
| `--container-glow-border-radius` | `12px` | Card and glow-effect corner radius (shared by the card and every glow layer). |
| `--container-glow-min-width` | `280px` | Card minimum width. |
| `--container-glow-max-width` | `280px` | Card maximum width. |
| `--container-glow-content-gap` | `0.25rem` | Gap between a card's own slotted children. |
| `--container-glow-highlight-colour` | `hsl(280 10% 50% / 1)` | Tint of the thin proximity-tracking ring drawn under the coloured glow. |
| `--container-glow-brightness` | `1.5` | Brightness multiplier applied to the coloured glow layer. |
| `--container-glow-transition-duration` | `1s` | Fade duration when the glow's opacity changes (also disabled under `prefers-reduced-motion: reduce`). |
| `--container-glow-gradient` | 5-stop conic rainbow gradient | The glow's colour gradient. Override with any valid `background` value (a `conic-gradient(...)`, a flat colour, etc). |

```vue
<ContainerGlow
  style="--container-glow-background: #111; --container-glow-border-radius: 4px; --container-glow-gradient: conic-gradient(from 180deg, #22d3ee, #a855f7, #22d3ee);"
>
  <template #cta>
    <p>Custom-coloured glow card</p>
  </template>
</ContainerGlow>
```

## The `config` prop (layout and interaction behaviour)

Proximity distance, glow spread/blur, wrapper gap, wrapper direction, and the inactive-state
opacity are **not** CSS tokens — they're computed per-pointer-move in JavaScript and applied as
private custom properties, so they're driven entirely by the `config` prop instead
(`ContainerGlowConfig`, importable from `srcdev-nuxt-components`):

| Field | Type | Default | Description |
|---|---|---|---|
| `proximity` | `number` | `40` | Pointer distance (px) at which a card starts glowing. |
| `spread` | `number` | `80` | Angular spread of the glow (degrees). |
| `blur` | `number` | `20` | Blur applied to the glow layer (px). |
| `gap` | `number` | `32` | Gap between cards in the wrapper (px). |
| `vertical` | `boolean` | `false` | Stack cards vertically instead of horizontally. |
| `inactiveOpacity` | `number` | `0` | Glow opacity when the pointer isn't nearby. |

All fields are optional — pass only the ones you want to change:

```vue
<ContainerGlow :config="{ blur: 40, vertical: true }">
  <template #one><p>Card one</p></template>
  <template #two><p>Card two</p></template>
</ContainerGlow>
```

## Named dynamic slots

Each named slot renders as one glow card — the consumer controls the slot names, there's no
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

## Class passthrough

Use `styleClassPassthrough` to add classes to the root `.container-glow-wrapper` element.

```vue
<ContainerGlow style-class-passthrough="my-container-glow">...</ContainerGlow>
```

## Internal (non-overridable) custom properties

`--_start`, `--_opacity-active`, `--_gap`, `--_blur`, `--_spread`, `--_direction`, and `--_gradient`
are internal plumbing driven by pointer events and the `config` prop — use `config` (for
gap/blur/spread/direction/opacity) or the public tokens above (for colour/geometry) instead.
