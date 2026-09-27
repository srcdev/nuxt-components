# DisplayPill — Consumer Styling Guide

> **Changed 2026-09-27**: tokens renamed from `--theme-pill-*` to `--display-pill-*`, and `bg`/`color`
> to `background`/`text-colour`, and `padding-x`/`padding-y` to `padding-inline`/`padding-block` (`--theme-pill-bg` → `--display-pill-background`,
> `--theme-pill-primary-color` → `--display-pill-primary-text-colour`, etc.). The `--theme-` prefix
> read as a global theme slot and clashed with the library's real `--theme-*` tokens.

## Public token API

### Colour

Each variant resolves its colour as **variant token → base token → variant default**, so setting
the base token restyles every variant, and a variant token still wins for that one variant.

| Token | Default | Controls |
|---|---|---|
| `--display-pill-background` | `var(--slate-01)` | Background (the `default` variant, and the fallback for every other variant) |
| `--display-pill-text-colour` | `var(--slate-09)` | Text/icon colour (same fallback role) |
| `--display-pill-primary-background` / `-text-colour` | `var(--blue-01)` / `var(--blue-09)` | `primary` variant |
| `--display-pill-success-background` / `-text-colour` | `var(--green-01)` / `var(--green-10)` | `success` variant |
| `--display-pill-warning-background` / `-text-colour` | `var(--orange-01)` / `var(--orange-10)` | `warning` variant |
| `--display-pill-danger-background` / `-text-colour` | `var(--red-01)` / `var(--red-10)` | `danger` variant |
| `--display-pill-neutral-background` / `-text-colour` | `var(--slate-08)` / `var(--slate-03)` | `neutral` variant (dark) |
| `--display-pill-focus-ring` | `var(--theme-border-focus)` | `:focus-visible` outline on `button`/`a` pills |

> **Changed 2026-09-27**: variants used to read only their own tokens, so a base `bg`/`color`
> override never reached a non-default variant. That's why `ServiceSummary`'s and `ServiceDetail`'s
> pill tokens (their pills are `neutral`) had never applied. The `warning` variant read a
> `--yellow-*` ramp that doesn't exist, so it always showed its hardcoded hex fallbacks; it now uses
> the `orange` ramp the warning theme moved to.

### Border, outline and shape

| Token | Default | Controls |
|---|---|---|
| `--display-pill-border-colour` | `transparent` | Border colour |
| `--display-pill-border-width` | `0.1rem` | Border width |
| `--display-pill-border-style` | `solid` | Border style |
| `--display-pill-border-radius` | `100vw` | Radius (100vw is always a full pill) |
| `--display-pill-outline` | `none` | Decorative outline (shorthand) on every pill |
| `--display-pill-outline-offset` | `0` | Offset for that outline |

### Typography and spacing

| Token | Default (`sm` / `md` / `lg`) | Controls |
|---|---|---|
| `--display-pill-font-size` / `-sm` / `-lg` | `1rem` / `1.2rem` / `1.4rem` | Text size |
| `--display-pill-padding-inline` / `-sm` / `-lg` | `0.8rem` / `1rem` / `1.2rem` | `padding-inline` (both sides of a label-only pill; the non-icon side otherwise) |
| `--display-pill-padding-inline-icon` / `-sm` / `-lg` | `0.4rem` / `0.6rem` / `0.8rem` | `padding-inline` on the icon side (both sides of an icon-only pill), tighter because icons carry their own whitespace |
| `--display-pill-padding-block` / `-sm` / `-lg` | `0.3rem` / `0.4rem` / `0.6rem` | `padding-block` |
| `--display-pill-icon-size` / `-sm` / `-lg` | `1.2rem` / `1.4rem` / `1.6rem` | Icon size (`font-size` on `.display-pill-icon`) |
| `--display-pill-font-weight` | `500` | Text weight |
| `--display-pill-gap` | `0.5rem` | Gap between icon and label |

The unsuffixed token is the `md` value; `-sm`/`-lg` apply to those sizes.

> **Changed 2026-09-27**: the icon-size tokens were declared but never used, so icons weren't
> sized. The icon slot is now wrapped in `.display-pill-icon`, which sets its `font-size`.

Private tokens (not public API): `--_background`, `--_text-colour`, `--_font-size`, `--_padding-inline`,
`--_padding-block`, `--_padding-inline-icon`, `--_icon-size`, swapped by the size and variant classes.

## State hooks

- Size class: `.sm`, `.md`, `.lg`. Variant class: `.default`, `.primary`, `.success`, `.warning`,
  `.danger`, `.neutral`. `.is-reversed` when `reversed`.
- `data-icon-position`: `start` (icon before the text), `end` (`reversed`), `only` (icon with no
  label or text), or absent (no icon). It picks which side gets `--display-pill-padding-inline-icon`.
- Classes: `.display-pill` (root), `.display-pill-icon` (icon slot wrapper, only when used),
  `.display-pill-label` (only with the `label` prop).
- `button`/`a` roots get a pointer cursor and a `:focus-visible` outline.

> **Changed 2026-09-27**: `.pill-label` → `.display-pill-label`.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** components that render pills set some of these tokens themselves, so an ancestor value
won't reach those pills. `ServiceSummary` and `ServiceDetail` set `--display-pill-background`,
`-text-colour` and `-border-colour` on their pill rows; use their own `--service-*-pill-*` tokens.

## Recipe: outlined pills

```css
.tag-list {
  --display-pill-background: transparent;
  --display-pill-text-colour: currentColor;
  --display-pill-border-colour: currentColor;
}
```

## Class passthrough

`style-class-passthrough` adds classes to the root. Reachable in normal use.
