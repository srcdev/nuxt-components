# DisplayChip — Consumer Styling Guide

## Public token API

### Geometry

| Token | Default | Controls |
|---|---|---|
| `--display-chip-size` | `1.2rem` | Dot diameter. Negative values clamp to `0` (no dot) |
| `--display-chip-mask-width` | `0.4rem` | Width of the cutout ring around the dot. Negative values clamp to `0` |
| `--display-chip-offset` | `0rem` | Extra distance from the host's edge (negative pulls the dot inwards) |
| `--display-chip-angle` | `90deg` | Position around the host, clockwise from the top |

A field set in the `config` prop wins over its token for that chip. Fields left out of `config` fall
back to the token, so `:config="{ label: '5' }"` gets the default geometry.

> Changed 2026-10-08: geometry tokens are new. Before, geometry came only from `config`, and a
> `config` missing any of `size`/`maskWidth`/`offset`/`angle` broke the dot and cutout entirely.

### Colour

| Token | Default | Controls |
|---|---|---|
| `--display-chip-colour-offline` | `var(--status-neutral)` | Dot colour for `status="offline"` (the default) |
| `--display-chip-colour-online` | `var(--status-success)` | Dot colour for `status="online"` |
| `--display-chip-colour-idle` | `var(--status-warning)` | Dot colour for `status="idle"` |
| `--display-chip-colour-dnd` | `var(--status-danger)` | Dot colour for `status="dnd"` |
| `--display-chip-text-colour` | `black` | Icon and label colour on the dot |

Private tokens (not public API): `--_chip-size`, `--_chip-mask-width`, `--_chip-offset` and
`--_chip-angle` (written inline from `config` or the geometry tokens), `--_size`, and the position
maths (`--_mask-diameter`, `--_position-x`, `--_position-y`, `--_offset`, `--_circle-x`,
`--_circle-y`), plus the resolved `--_dot-colour` and the label's `--_font-size-adjust`.

> Changed 2026-09-27: the status colours were unprefixed `--color-offline`, `--color-online`,
> `--color-idle` and `--color-dnd`, and the geometry and maths vars were unprefixed too
> (`--chip-size`, `--computed-*`, `--circle-*`). Generic names like these collided with any
> consumer variable of the same name. The icon is now sized with `font-size` (its old
> `width`/`height` were overridden by `@nuxt/icon`), and the icon/label colour is a token instead
> of a hardcoded `black`.
>
> Changed 2026-10-07: the status colours default to the global `--status-*` tokens
> (`03.theming/_status.css`) instead of hardcoded neon `rgb()` values and `slategrey`, so they
> match `DisplayPill`, `SelectMenu` and anything else reading the shared set. To keep the old
> look, set the four `--display-chip-colour-*` tokens to the previous values. To restyle every
> status across the library, override `--status-*` instead. See
> `.claude/skills/theming-status-tokens.md`.

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `[data-shape="circle\|square"]` | `.display-chip` (root) | The `shape` prop (must match the slotted content's shape) |
| `[data-status="offline\|online\|idle\|dnd"]` | `.display-chip` (root) | The `status` prop (default `offline`) |
| `[data-length="1\|2\|3"]` | `.display-chip-label` | Label length in characters (emoji count as one), for font-size stepping |

Inner elements: the dot is `.display-chip::after`; `.display-chip-icon` and `.display-chip-label`
sit on top of it. The `statusLabel` text is a `.sr-only` span. Every other direct child gets the
cutout `mask-image`.

> Changed 2026-10-08: shape and status are `data-shape`/`data-status` attributes instead of the
> `.circle`/`.square` and `.online`/`.idle`/`.dnd` classes, so they can't collide with a
> consumer's own classes of the same name. Status is now the `status` prop rather than a class
> passed through `style-class-passthrough`. `.chip-icon` → `.display-chip-icon`, `.chip-label` →
> `.display-chip-label`, and its `.length-N` classes → `data-length="N"`.
>
> Changed 2026-09-27: root class renamed from `.display-chip-core`.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** a geometry field set in `config` is written inline on the chip, so it beats the
matching `--display-chip-*` geometry token from any ancestor. Leave the field out of `config` to
let the token apply.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.display-chip`. Reactive after mount.
`DisplayAvatar` with `chip` renders this component as its root, so the same applies there.
