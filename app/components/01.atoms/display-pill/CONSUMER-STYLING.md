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
| `--display-pill-success-background` / `-text-colour` | `var(--status-success-surface)` / `var(--status-success-text)` | `success` variant |
| `--display-pill-warning-background` / `-text-colour` | `var(--status-warning-surface)` / `var(--status-warning-text)` | `warning` variant |
| `--display-pill-danger-background` / `-text-colour` | `var(--status-danger-surface)` / `var(--status-danger-text)` | `danger` variant |
| `--display-pill-neutral-background` / `-text-colour` | `var(--slate-08)` / `var(--slate-03)` | `neutral` variant (dark) |
| `--display-pill-focus-ring` | `var(--theme-border-focus)` | `:focus-visible` outline on `button`/`a` pills |

> **Changed 2026-09-27**: variants used to read only their own tokens, so a base `bg`/`color`
> override never reached a non-default variant. That's why `ServiceSummary`'s and `ServiceDetail`'s
> pill tokens (their pills are `neutral`) had never applied. The `warning` variant read a
> `--yellow-*` ramp that doesn't exist, so it always showed its hardcoded hex fallbacks; it now uses
> the `orange` ramp the warning theme moved to.

`success`, `warning` and `danger` default to the global `--status-*` tokens
(`03.theming/_status.css`), so overriding those restyles pills along with every other status
indicator; same colours as before (changed 2026-10-07). `primary` (brand) and `neutral` (a dark,
inverted pill) keep their own defaults and don't read the status set. See
`.claude/skills/theming-status-tokens.md`.

### Border, outline and shape

| Token | Default | Controls |
|---|---|---|
| `--display-pill-border-colour` | `transparent` | Border colour (every variant's fallback) |
| `--display-pill-<variant>-border-colour` | the base border colour | Border colour for one variant (`primary`, `success`, `warning`, `danger`, `neutral`) |
| `--display-pill-border-width` | `0.1rem` | Border width |
| `--display-pill-border-style` | `solid` | Border style |
| `--display-pill-border-radius` | `100vw` | Radius (100vw is always a full pill) |
| `--display-pill-outline` | `none` | Decorative outline (shorthand) on every pill |
| `--display-pill-outline-offset` | `0` | Offset for that outline |
| `--display-pill-ring-width` | `0` | Width of a ring drawn just outside the border (a `box-shadow`, so it follows the radius on every browser and takes no layout space) |
| `--display-pill-<variant>-ring-colour` | the base ring colour | Ring colour for one variant (`primary`, `success`, `warning`, `danger`, `neutral`) |
| `--display-pill-ring-colour` | the pill's resolved background | Ring colour. The default follows each variant's background, so `border-colour: currentColor` plus a ring gives a two-tone border in every variant's own colours |

### Size

| Token | Default (`sm` / `md` / `lg`) | Controls |
|---|---|---|
| `--display-pill-font-size` / `-sm` / `-lg` | `1rem` / `1.2rem` / `1.4rem` | Text size |
| `--display-pill-icon-size` / `-sm` / `-lg` | `1.2rem` / `1.4rem` / `1.6rem` | Icon size (`font-size` on `.display-pill-icon`); also the unit all spacing below scales from |
| `--display-pill-font-weight` | `500` | Text weight |

The unsuffixed token is the `md` value; `-sm`/`-lg` apply to those sizes.

### Label

| Token | Default | Controls |
|---|---|---|
| `--display-pill-label-line-clamp` | `1` | Lines of label text before an ellipsis. `1` keeps the pill on one line; `none` lets a long label wrap; any other number caps the lines |

Applies to the `label` prop and to default-slot content alike. Clamped text stays in the DOM, so
screen readers still read all of it. If a pill's text must stay fully readable (a price, say) in a
narrow space, set `none`.

> **Changed 2026-09-27**: the icon-size tokens were declared but never used, so icons weren't
> sized. The icon slot is now wrapped in `.display-pill-icon`, which sets its `font-size`.

### Spacing

Padding and gap are the pill's icon size times a ratio, so every size (and any custom icon size)
keeps the same proportions. Tune a **ratio** to change spacing across all sizes, or set the
**absolute** token to pin one length (it then applies to every size).

| Ratio token | Default | Result (`sm` / `md` / `lg`) | Absolute override | Controls |
|---|---|---|---|---|
| `--display-pill-padding-inline-ratio` | `0.7` | ≈ `0.84` / `0.98` / `1.12rem` | `--display-pill-padding-inline` | `padding-inline` (both sides of a label-only pill; the non-icon side otherwise) |
| `--display-pill-padding-inline-icon-ratio` | `0.4` | ≈ `0.48` / `0.56` / `0.64rem` | `--display-pill-padding-inline-icon` | `padding-inline` on the icon side (both sides of an icon-only pill), tighter because icons carry their own whitespace |
| `--display-pill-padding-block-ratio` | `0.3` | ≈ `0.36` / `0.42` / `0.48rem` | `--display-pill-padding-block` | `padding-block` |
| `--display-pill-gap-ratio` | `0.35` | ≈ `0.42` / `0.49` / `0.56rem` | `--display-pill-gap` | Gap between icon and label |

> **Changed 2026-09-27**: spacing used to be hand-set per size (`--display-pill-padding-inline-sm`,
> `-lg`, etc., now removed). It's now derived from the icon size; results are within about 0.1rem
> of the old values, except `lg` block padding (`0.6rem` → `0.48rem`), which was out of proportion.

Private tokens (not public API): `--_background`, `--_text-colour`, `--_border-colour`, `--_ring-colour`, `--_font-size`, `--_padding-inline`,
`--_padding-block`, `--_padding-inline-icon` (derived from `--_icon-size`), `--_icon-size`, swapped by the size and variant attributes.

> **Changed 2026-10-06**: a pill is capped at its container's width (`max-inline-size: 100%`), and a
> label too long for it ends in an ellipsis instead of overflowing. Short labels are unaffected.
>
> **Changed 2026-10-08**: default-slot text is now wrapped in `.display-pill-label` too, so it
> ellipsizes like a `label` prop instead of spilling out of the pill. The ellipsis is now a
> line clamp (`--display-pill-label-line-clamp`, default `1`) rather than `white-space: nowrap`,
> so a long label breaks at a space before the ellipsis rather than mid-word. A pill with no text
> and no icon (empty or whitespace-only `label`, no slots) no longer renders a blank coloured blob.

## State hooks

- `data-size`: `sm`, `md`, `lg`. `data-variant`: `default`, `primary`, `success`, `warning`,
  `danger`, `neutral` (an unknown value gets the default colours). `data-reversed` when `reversed`.
- `data-icon-position`: `start` (icon before the text), `end` (`reversed`), `only` (icon with no
  label or text), or absent (no icon). It picks which side gets `--display-pill-padding-inline-icon`.
- Classes: `.display-pill` (root), `.display-pill-icon` (icon slot wrapper, only when used),
  `.display-pill-label` (wraps the `label` prop or default-slot content, absent when there's no text).
- `button`/`a` roots get a pointer cursor and a `:focus-visible` outline.

> **Changed 2026-09-27**: `.pill-label` → `.display-pill-label`.
>
> **Changed 2026-10-08**: size, variant and reversed were bare classes (`.sm`, `.primary`,
> `.success`, `.is-reversed`...), which a consumer's own utility classes of the same name could
> match, since the pill renders inside the consumer's DOM. Replace `.display-pill.primary` with
> `.display-pill[data-variant="primary"]`, `.display-pill.sm` with `.display-pill[data-size="sm"]`,
> and `.display-pill.is-reversed` with `.display-pill[data-reversed]`.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** components that render pills set some of these tokens themselves, so an ancestor value
won't reach those pills. `ServiceSummary` and `ServiceDetail` set `--display-pill-background`,
`-text-colour` and `-border-colour` on their pill rows; use their own `--service-*-pill-*` tokens.

## Recipe: two-tone ringed pills

A 1px border in each variant's dark text colour, inside a 2px ring in its light background colour:

```css
.tag-list {
  --display-pill-border-colour: currentColor;
  --display-pill-ring-width: 0.2rem;
}
```

The `neutral` variant is inverted (light text on dark), so its border comes out light and its ring dark.

## Recipe: outlined pills

```css
.tag-list {
  --display-pill-background: transparent;
  --display-pill-text-colour: currentColor;
  --display-pill-border-colour: currentColor;
}
```

That gives every variant the surrounding text colour. To keep each variant's own colour, leave
`--display-pill-text-colour` unset and set the per-variant text tokens instead. The default text
steps (`-09`/`-10`) are near-black in every hue, so lift them to `-07` to tell the variants apart
(the border follows, being `currentColor`):

```css
.tag-list {
  --display-pill-background: transparent;
  --display-pill-border-colour: currentColor;
  --display-pill-text-colour: var(--slate-07);
  --display-pill-primary-text-colour: var(--blue-07);
  --display-pill-success-text-colour: var(--green-07);
  --display-pill-warning-text-colour: var(--orange-07);
  --display-pill-danger-text-colour: var(--red-07);
  --display-pill-neutral-text-colour: var(--slate-10);
}
```

Add a ring in each variant's light `-02` step with `--display-pill-ring-width: 0.2rem` and
`--display-pill-<variant>-ring-colour` (`var(--blue-02)`, `var(--green-02)`, and so on).

## Class passthrough

`style-class-passthrough` adds classes to the root. Reachable in normal use.
