# InputButton — Consumer Styling Guide

## Public token API

Every colour token below is `var(--input-button-{variant}-{property}, {default})` — set the
`--input-button-*` name to override just this component's variant; leave it unset and it inherits
the shared `--theme-*` slot every other themed component (inputs, alerts, ...) also falls back to.
See `theming-component-token-pattern.md` for why this two-tier shape exists.

The variants follow the usual hierarchy: **primary** is filled, **secondary** is outlined
(transparent background, border and text in the theme colour), **tertiary** is text-only
(no background or border until hover), and **inline** has no colours at all, for wrapper
components that style the button themselves. Primary and secondary also carry a light **shadow ring** (`box-shadow`, 2px of theme step 2)
outside the border, and on **hover** their 1px outline (no offset) takes the hover border colour,
so it draws over the inner edge of that ring. Tertiary has neither. The `outline` is transparent
at rest. **`:focus-visible` is a separate token set**
(its `outline-width`/`-offset` come from `--button-focus-ring-width`/`-offset`, see
`theming-form-geometry-tokens.md`).

> **Changed 2026-10-17**: secondary was filled with `--theme-surface-inverted`, which read as a
> darker primary; tertiary was a grey `--slate-01` fill with an underlined label. To bring back
> the old look for one site, set the secondary or tertiary tokens below (e.g.
> `--input-button-secondary-surface: var(--theme-surface-inverted)` and
> `--input-button-secondary-text: var(--theme-text-inverted)`).

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
| `--input-button-primary-ring-hover` | the resolved hover border above | Outline colour on hover (1px, no offset) |
| `--input-button-primary-shadow` | `var(--colour-theme-2)` | Shadow ring colour (all states) |
| `--input-button-primary-border-focus` | `var(--theme-border-focus)` | Border colour on `:focus-visible` |
| `--input-button-primary-ring-focus` | `var(--theme-ring)` | Outline colour on `:focus-visible` |

### Secondary (outlined)

| Token | Falls back to | Controls |
|---|---|---|
| `--input-button-secondary-surface` | `transparent` | Background (resting) |
| `--input-button-secondary-text` | `var(--theme-surface)` | Text colour (all states) |
| `--input-button-secondary-border` | `var(--theme-surface)` | Border colour (resting) |
| `--input-button-secondary-ring` | `transparent` | Outline colour (resting) |
| `--input-button-secondary-ring-hover` | the resolved hover border | Outline colour on hover (1px, no offset) |
| `--input-button-secondary-shadow` | `var(--colour-theme-2)` | Shadow ring colour (all states) |
| `--input-button-secondary-surface-hover` | `var(--theme-surface-subtle)` | Background on hover |
| `--input-button-secondary-border-hover` | the resolved border above | Border colour on hover |
| `--input-button-secondary-border-focus` | `var(--theme-border-focus)` | Border colour on `:focus-visible` |
| `--input-button-secondary-ring-focus` | `var(--theme-ring)` | Outline colour on `:focus-visible` |

### Tertiary (text-only)

| Token | Falls back to | Controls |
|---|---|---|
| `--input-button-tertiary-surface` | `transparent` | Background (resting) |
| `--input-button-tertiary-text` | `var(--theme-surface)` | Text colour (all states) |
| `--input-button-tertiary-border` | `transparent` | Border colour (resting) |
| `--input-button-tertiary-ring` / `-ring-hover` | `transparent` | Outline colour |
| `--input-button-tertiary-surface-hover` | `var(--theme-surface-subtle)` | Background on hover |
| `--input-button-tertiary-border-hover` | `transparent` | Border colour on hover |
| `--input-button-tertiary-border-focus` | `var(--theme-border-focus)` | Border colour on `:focus-visible` |
| `--input-button-tertiary-ring-focus` | `var(--theme-ring)` | Outline colour on `:focus-visible` |

| Token | Default | Controls |
|---|---|---|
| `--input-button-shadow-width` | `0.2rem` | Width of the primary and secondary shadow ring. Set `0` to remove it |

The focus ring's offset (`--button-focus-ring-offset`, `0.2rem`) puts it just outside the shadow
ring; if you widen the ring, raise the offset to match or the focus ring will draw over it. An
ancestor with `overflow: hidden` and no spare room clips the ring.

Secondary and tertiary text sits on the page background, so on a dark section set their `-text`
and `-border` tokens to a light colour.

`[data-pending]` dims a primary button's surface to 50%; secondary and tertiary keep their own
background. The animated border added by `has-pending-effect` has its own `--pending-effect-*`
tokens, see `../pending-effect/CONSUMER-STYLING.md`.

### Text wrapping

| Token | Default | Controls |
|---|---|---|
| `--input-button-text-white-space` | `normal` | Long labels wrap onto several lines inside the button, and unbroken strings break anywhere. Set `nowrap` to keep a label on one line; the button then grows to fit it and can overflow a narrow container |

> Added 2026-10-06. **Changed 2026-10-17**: the default was `nowrap`, which pushed a long label
> past a narrow column. If you relied on one-line labels in a tight row, set
> `--input-button-text-white-space: nowrap` on that row.

Button text has no line-clamp token on purpose: a cut-off action label can't be trusted.

Private tokens (not public API): `--_surface` and `--_surface-hover` (primary's resolved
surfaces, which its border, hover and contrast colours derive from) and `--_primary-border-hover`, `--_secondary-border` and `--_secondary-border-hover`.

`InputCopy` and `PricingCard` fall back through `--input-button-primary-*` for their own copy/CTA
buttons (see their own `CONSUMER-STYLING.md`) rather than duplicating this chain.

> **Trial, 2026-09-27: automatic text contrast.** In browsers that support CSS `contrast-color()`
> (Safari/iOS 26, Firefox 146, Chrome/Edge 147), an unset `--input-button-primary-text` resolves
> to `contrast-color()` of that state's own surface: pure black or pure white, whichever has more
> contrast, re-evaluated on hover. Older browsers keep the defaults in the tables above. Setting
> the `-text` token explicitly always wins, so you can opt out. Secondary and tertiary aren't part of the trial since
> 2026-10-17: their surface is transparent. The whole behaviour is
> one `@supports` block in `InputButton.vue` and may be removed if the trial doesn't hold up.

---

> Renamed 2026-09-28: component `InputButtonCore` → `InputButton`, root class `.input-button-core` →
> `.input-button`, `data-testid="input-button-core"` → `"input-button"`. Icon size inside `.btn-icon`
> is now applied as `font-size: var(--input-icon-size)` (the old `width`/`height` on the `<Icon>` was
> overridden by `@nuxt/icon`).

---

## State hooks

| Hook | When |
|---|---|
| `[data-variant="primary" \| "secondary" \| "tertiary" \| "inline"]` | The `variant` prop |
| `[data-theme]` | The `theme` prop (re-declares the `--theme-*` palette on the button) |
| `[data-icon-only]` | The `#iconOnly` slot is used (square, text becomes `sr-only`) |
| `[data-pill]` | `is-pill` |
| `[data-pending]`, `[data-pending-effect]` | `is-pending` / `has-pending-effect` |
| `[data-link]` | `href` is set (renders `NuxtLink` or `<a>`) |
| `[readonly]` + `aria-disabled="true"` | `readonly` (dimmed, not operable by mouse or keyboard) |

Inner elements: `.input-button-text`, and `.input-button-icon` with `data-slot="left"`,
`"right"` or `"icon-only"`.

> **Changed 2026-10-17**: these were bare classes, which collided with consumer CSS. Update
> selectors: `.input-button.primary` → `.input-button[data-variant="primary"]`, `.pill` →
> `[data-pill]`, `.is-pending` → `[data-pending]`, `.pending-effect` → `[data-pending-effect]`,
> `.is-link` → `[data-link]`, `.icon-only` → `[data-icon-only]`, `.button-text` →
> `.input-button-text`, `.btn-icon.left` → `.input-button-icon[data-slot="left"]`. Same
> specificity, so overrides keep winning where they did.


## Global theming

Set tokens on `:where(html)` in the consuming app's own theming file (e.g.
`assets/styles/setup/03.theming/_button.css`). These apply to every `InputButton` instance:

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

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

```vue
<InputButton variant="primary" button-text="Book now" style="--input-button-primary-surface: var(--gold-06);" />
```

To make hover lighten instead of darken for one instance, override the hover token directly rather
than fighting the `color-mix()` default:

```vue
<InputButton
  variant="primary"
  button-text="Book now"
  style="--input-button-primary-surface-hover: var(--gold-04);"
/>
```


---

## Class passthrough

`style-class-passthrough` adds classes to the root `.input-button` element. Reactive after mount.
