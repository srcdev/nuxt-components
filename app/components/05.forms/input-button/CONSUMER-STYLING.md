# InputButtonCore — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-button-{variant}-{property}, {default})` — set the
`--input-button-*` name to override just this component's variant; leave it unset and it inherits
the shared `--theme-*` slot every other themed component (inputs, alerts, ...) also falls back to.
See `theming-component-token-pattern.md` for why this two-tier shape exists.

**Resting state is flat by design**: `border` defaults to the variant's own surface colour, so
there's no visible edge until you hover, focus, or override it. **`outline` defaults to fully
transparent** in both resting and hover state — outline is reserved for the focus-visible ring,
not used to reinforce the flat look. **Hover always darkens the resting surface** via `color-mix()`
rather than jumping to a different `--theme-*` step — it's reliably darker in both light and dark
mode. **`:focus-visible` is a separate token set**, not grouped with hover, since it's the one
state that gets a real, independently-themeable indicator (its `outline-width`/`-offset` come from
`--button-focus-ring-width`/`-offset`, not from here — see `theming-form-geometry-tokens.md`).

Geometry and typography (`--button-*`) are separate, already-global tokens with real defaults —
see `theming-form-geometry-tokens.md`. Not duplicated here. One geometry token worth calling out:
`--button-min-height` defaults to `var(--input-min-height)`, so a button lines up height-wise with
a text input/select/number field placed next to it (e.g. an inline "email + submit" pattern — see
the `InlineWithTextInput` story). `box-sizing: content-box` means it's a floor, not a fixed height.

### Primary

| Token | Falls back to | Controls |
|---|---|---|
| `--input-button-primary-surface` | `var(--theme-surface)` | Background (resting) |
| `--input-button-primary-text` | `var(--theme-on-surface)` | Text colour (all states) |
| `--input-button-primary-border` | the resolved surface above | Border colour (resting) — flat by default |
| `--input-button-primary-ring` | `transparent` | Outline colour (resting) |
| `--input-button-primary-surface-hover` | `color-mix(in oklab, surface 85%, black)` | Background on hover |
| `--input-button-primary-border-hover` | the resolved hover surface above | Border colour on hover |
| `--input-button-primary-ring-hover` | `transparent` | Outline colour on hover |
| `--input-button-primary-border-focus` | `var(--theme-border-focus)` | Border colour on `:focus-visible` |
| `--input-button-primary-ring-focus` | `var(--theme-ring)` | Outline colour on `:focus-visible` |

### Secondary

Same shape, falls back to the inverted-surface slots instead:

| Token | Falls back to |
|---|---|
| `--input-button-secondary-surface` | `var(--theme-surface-inverted)` |
| `--input-button-secondary-text` | `var(--theme-text-inverted)` |
| `--input-button-secondary-border` | the resolved surface above (flat) |
| `--input-button-secondary-ring` / `-ring-hover` | `transparent` |
| `--input-button-secondary-surface-hover` | `color-mix(in oklab, surface 85%, black)` |
| `--input-button-secondary-border-hover` | the resolved hover surface above |
| `--input-button-secondary-border-focus` | `var(--theme-border-focus)` |
| `--input-button-secondary-ring-focus` | `var(--theme-ring)` |

### Tertiary

Same shape again; resting surface is transparent by default in dark mode (see note below):

| Token | Falls back to |
|---|---|
| `--input-button-tertiary-surface` | `light-dark(var(--slate-01), transparent)` |
| `--input-button-tertiary-text` | `var(--theme-text)` |
| `--input-button-tertiary-border` | the resolved surface above (flat) |
| `--input-button-tertiary-ring` / `-ring-hover` | `transparent` |
| `--input-button-tertiary-surface-hover` | `color-mix(in oklab, surface 85%, black)` |
| `--input-button-tertiary-border-hover` | the resolved hover surface above |
| `--input-button-tertiary-border-focus` | `var(--theme-border-focus)` |
| `--input-button-tertiary-ring-focus` | `var(--theme-ring)` |

> `--input-button-tertiary-surface`'s dark-mode default is literal `transparent`. `color-mix()`
> still produces a correct darker hover from that — mixing `transparent` with `black` lowers the
> alpha channel rather than the lightness, so hover reads as a faint dark tint over whatever's
> behind the button, not a flat fill swap.

`.is-pending` always dims the *primary* surface regardless of variant — a pre-existing quirk, not
something this token set changes.

`InputCopy` and `PricingCard` fall back through `--input-button-primary-*` for their own copy/CTA
buttons (see their own `CONSUMER-STYLING.md`) rather than duplicating this chain.

---

## Global theming — app-level CSS file

Set tokens on `:where(html)` in the consuming app's own theming file (e.g.
`assets/styles/setup/03.theming/_button.css`). These apply to every `InputButtonCore` instance:

```css
:where(html) {
  --input-button-primary-surface: var(--rose-09);
  --input-button-primary-text: var(--rose-00);
  /* Hover/border/ring all derive from --input-button-primary-surface automatically via
     color-mix() — no need to also set -hover/-border/-ring unless you want a different
     relationship than "same colour, darker". */
}
```

Only declare the tokens you want to change — everything else keeps inheriting the shared
`--theme-*` slots (or, for hover, keeps darkening whatever surface you did set).

---

## Per-instance overrides

```vue
<InputButtonCore variant="primary" button-text="Book now" style="--input-button-primary-surface: var(--gold-06);" />
```

To make hover lighten instead of darken for one instance, override the hover token directly rather
than fighting the `color-mix()` default:

```vue
<InputButtonCore
  variant="primary"
  button-text="Book now"
  style="--input-button-primary-surface-hover: var(--gold-04);"
/>
```
