# Form Geometry Token Override

## Overview

`setup/04.elements/forms/*.css` defines every non-colour form/button/input token — padding,
border-radius, gaps, font-size, focus-ring width, transition duration. This is the geometry
counterpart to the colour tokens covered in `theming-partial-override.md` and the type-scale
tokens in `theming-typography-tokens.md`.

**You do not need to duplicate these files wholesale to override them.** Every value here is a
plain custom property declared on `:where(html)` inside the `form-tokens` cascade layer (see
`@import "./04.elements/" layer(form-tokens);` in `setup/index.css`). A consumer app's own CSS —
as long as it isn't itself wrapped in a named `@layer` — always wins over layered CSS regardless
of source order, because unlayered rules are cascade-ordered after every named layer per the CSS
Cascade Layers spec. Concretely: it does not matter whether the consumer's override file is
imported before or after this layer's `main.css` in `nuxt.config.ts`'s `css` array — unlayered
always wins either way. `theming-override-default.md`/`theming-partial-override.md` already rely
on this same mechanism for colour tokens; it applies identically here.

> **⚠️ Do not "fix" this by wrapping your override in `@layer consumer`** to mirror the library's
> own `@layer reset, colours, theming, form-tokens, typography, a11y, components, utilities,
> consumer;` stack — it looks like the intended slot but is unsafe in practice. Cascade layer
> priority is fixed by whichever layer name is first referenced *anywhere in the document*, not by
> its position in that pre-declaration. Nuxt/Nitro inlines many small per-component/per-page CSS
> chunks as `<style>` tags directly in `<head>` for SSR performance — if an inlined chunk declares
> `@layer consumer` before the library's main stylesheet (which carries the master statement) loads
> via its `<link>`, `consumer` gets registered first and pushed to the *lowest* priority instead of
> the highest, so `@layer form-tokens`/`theming` silently win instead, with no build error.
> Confirmed by reproducing against a real `npm run build` + preview, not just `nuxt dev`. Stay
> unlayered — that's what makes the guarantee above hold.

So: to change one geometry value, redeclare just that one custom property in your app's own CSS
(e.g. `app/assets/styles/setup/03.theming/_default.css`, or a new file imported the same way).
There is no dependency between these tokens — overriding `--button-padding-inline` alone does not
require also redeclaring `--button-border-radius` or anything else in the same source file.

## The token inventory

From `00.element-defaults.css` through `09.animation-motion.css`:

| File | Tokens |
| --- | --- |
| `01.field-layout-container-level.css` | `--field-margin-block`, `--field-gap-block`, `--field-gap-inline`, `--field-label-gap`, `--field-description-gap`, `--field-error-gap` |
| `02.typography.css` | `--field-label-font-size/-weight/-line-height`, `--input-font-size`, `--input-line-height`, `--theme-input-placeholder-font-size`, `--button-font-size/-line-height/-weight/-text-transform`, `--field-description-font-size/-line-height`, `--field-error-font-size/-weight` |
| `03.generic-input-geometry.css` | `--input-padding-block/-inline`, `--input-padding-inline-with-icon`, `--form-element-border-width`, `--form-element-border-bottom-width-underlined`, `--form-input-border-radius[-underlined]`, `--form-element-outline-width[-focus]`, `--form-element-outline-offset-focus`, `--input-focus-ring-width/-offset`, `--input-underline-width`, `--input-min-height`, `--input-element-line-height`, plus per-element-type geometry (textarea/select/range/checkbox/toggle — see file for the full set) |
| `04.slot-icon-system.css` | `--input-slot-width/-gap`, `--input-icon-size`, `--input-icon-slot-gap`, `--input-icon-color[-focus/-error]` |
| `05.checkbox-radio-geometry.css` | `--control-size`, `--control-border-radius`, `--radio-border-radius`, `--control-border-width`, `--control-indicator-scale`, `--control-label-gap` |
| `06.button-geometry.css` | `--button-padding-block/-inline`, `--button-border-radius[-icon-only]`, `--button-border-width`, `--button-outline-width`, `--button-focus-ring-width/-offset`, `--button-icon-gap` |
| `07.validation-error-block-layout.css` | `--error-icon-size/-gap`, `--error-border-radius`, `--error-padding-block/-inline` |
| `09.animation-motion.css` | `--control-transition-duration/-ease`, `--theme-form-transition-duration` |

`00.element-defaults.css` is the one exception — it's not tokens, it's a real selector-based rule
(browser autofill background/text-colour reset via `input:autofill` etc.). It reads
`var(--theme-surface)` and the component-private `--_input-text-core-color`, so changing
`--theme-surface` (per `theming-partial-override.md`) changes autofill colours too — no separate
override needed there. If you need to change that rule's *behaviour* itself (not just its colour
inputs), you'd need a competing unlayered selector of your own targeting the same pseudo-classes,
not a token.

## Example

```css
/* app/assets/styles/setup/03.theming/_default.css, or any unlayered file registered in nuxt.config.ts */
:where(html) {
  --button-padding-block: 1.2rem;
  --button-padding-inline: 2.4rem;
  --button-border-radius: 0.8rem;
}
```

## Notes

- Uses the layer's `62.5%` root font-size reset — see `theming-typography-tokens.md` before
  hand-writing any raw `rem` value here.
- `--theme-surface`, `--theme-input-surface`, etc. referenced by these geometry tokens are colour
  tokens covered in `theming-partial-override.md`, not this skill — geometry and colour are
  overridden the same mechanical way, just different token names.
- Found and fixed while writing this skill (2026-08-03): `00.element-defaults.css` referenced a
  `--theme-button-surface` token that was never declared anywhere in this codebase — a
  since-corrected typo for `--theme-surface`, present since the rule was first introduced. Silently
  broke autofill background/box-shadow (an undefined `var()` with no fallback resolves to the
  property's initial value). A reminder that a dangling `var()` reference produces no error/warning
  of any kind — it just quietly does nothing.
