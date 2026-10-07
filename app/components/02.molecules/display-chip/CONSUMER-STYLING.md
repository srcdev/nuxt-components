# DisplayChip — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--display-chip-colour-offline` | `var(--status-neutral)` | Dot colour with no status class |
| `--display-chip-colour-online` | `var(--status-success)` | Dot colour with `.online` |
| `--display-chip-colour-idle` | `var(--status-warning)` | Dot colour with `.idle` |
| `--display-chip-colour-dnd` | `var(--status-danger)` | Dot colour with `.dnd` |
| `--display-chip-text-colour` | `black` | Icon and label colour on the dot |

Geometry (size, mask width, offset, angle) is set through the `config` prop, not tokens. Those
values are written inline as private `--_chip-size`, `--_chip-mask-width`, `--_chip-offset` and
`--_chip-angle`, which feed the private position maths (`--_mask-diameter`, `--_position-x`,
`--_position-y`, `--_offset`, `--_circle-x`, `--_circle-y`) and the resolved `--_dot-colour`. None
of these are public API.

> Changed 2026-09-27: the status colours were unprefixed `--color-offline`, `--color-online`,
> `--color-idle` and `--color-dnd`, and the geometry and maths vars were unprefixed too
> (`--chip-size`, `--computed-*`, `--circle-*`). Generic names like these collided with any
> consumer variable of the same name. The icon is now sized with `font-size` (its old
> `width`/`height` were overridden by `@nuxt/icon`), and the icon/label colour is a token instead
> of a hardcoded `black`.

> Changed 2026-10-07: the status colours default to the global `--status-*` tokens
> (`03.theming/_status.css`) instead of hardcoded neon `rgb()` values and `slategrey`, so they
> match `DisplayPill`, `SelectMenu` and anything else reading the shared set. To keep the old
> look, set the four `--display-chip-colour-*` tokens to the previous values. To restyle every
> status across the library, override `--status-*` instead. See
> `.claude/skills/theming-status-tokens.md`.

---

## State hooks

| Class | When |
|---|---|
| `.display-chip.circle`, `.square` | The `shape` prop (must match the slotted content's shape) |
| `.online`, `.idle`, `.dnd` | Added by you through `style-class-passthrough`; no class means offline |

Inner elements: the dot is `.display-chip::after`; `.chip-icon` and `.chip-label` (with
`.length-1`/`.length-2`/`.length-3` for font-size stepping) sit on top of it. Every other direct
child gets the cutout `mask-image`.

> Changed 2026-09-27: root class renamed from `.display-chip-core`.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.display-chip`. It's also how you set the
status (`online`, `idle`, `dnd`). Reactive after mount. `DisplayAvatar` with `chip` renders this
component as its root, so the same applies there.
