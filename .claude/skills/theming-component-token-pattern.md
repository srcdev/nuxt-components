# Component Token Pattern — Public Token + Inline Fallback

## Overview

The standard shape for every overridable CSS value in a component, from now on:

```css
background-color: var(--{component}-{property}, {real-default-or-shared-fallback});
```

One name, declared inline at the point of use, with a real default right there in the component
source. No separate "public token must be declared somewhere else or the component breaks"
requirement, and no private `--_` indirection standing in for the actual override point.
`ServicesCard.vue` is the reference implementation — read its `<style>` block for the shape in
practice.

## Why this replaced the old pattern

Two things used to go wrong, both found while auditing a consumer app's theming
overrides (2026-08-25):

1. **Bare `var(--theme-checkbox-symbol-color)` with no fallback anywhere.** The only way for this
   to resolve to something was a consuming app declaring it globally. When the component was later
   refactored (buttons moved onto the shared theme-slot system) and stopped reading the token, nothing
   signalled that to the consumer — the app's declaration became permanently dead, silently. A
   `var()` with an undefined custom property and no fallback just resolves to the property's
   initial value; there is no error, no warning, ever.
2. **Tokens that were "shared" only by accident.** `InputTextCore`, `InputSelect`,
   `InputNumber` and the checkbox button all read the exact same `--theme-input-surface`, so a
   consumer wanting to restyle just text inputs had no way to do that without also restyling every
   other input type. The private `--_input-text-surface: var(--theme-input-surface);` indirection
   made this look like it had its own override point when it didn't.

## The three tiers

| Tier | Example | No-fallback allowed? |
|---|---|---|
| **1 — theme slots** | `--theme-surface`, `--theme-border`, `--theme-ring`, `--theme-text`, ... (`_theme-slots.css`) | Yes — deliberately global, small, stable set. Changing one is meant to reskin everything that shares it. |
| **2 — cross-component families** | `--theme-input-surface`, `--theme-checkbox-symbol-surface` | No longer created new. Existing ones stay as the *fallback value* inside Tier 3 tokens, not as the thing components read directly. |
| **3 — component-scoped** | `--input-button-primary-surface`, `--services-card-border-colour` | Never — always `var(--{component}-token, <fallback>)`. |

Tier 1 is the one deliberate exception. Everything else gets a real component-prefixed name with
an inline fallback, even if that fallback happens to be a Tier 1 or Tier 2 token underneath.

## Public vs private tokens

Rule: `.claude/rules/css-public-private-tokens.md`.

The public/private decision is about **consumer relevance, not reuse
count**. A value a consumer could plausibly want to customise — colours, spacing, sizes, radii,
durations, and any per-state variant of these (a hover outline width, a focus border colour) — is
a **public token**, consumed directly at its point of use: `border-radius: var(--component-name-border-radius, 0.5rem)`.
This holds even when it's only used once — single-use is not a reason to demote a genuinely
consumer-facing value to private. Per-state variants get their own public token that falls back
to the resting one, rather than being derived privately: `--component-name-outline-width-hover`
falling back to `--component-name-outline-width`, not a private var with no override hook.

A value with **no plausible consumer relevance** — genuine internal implementation detail, e.g.
something composed from a `v-bind()` JS value, or an intermediate that exists purely to avoid
repeating a computation — is a **private token**, always prefixed `--_x`. Prefix it even when
it's used only once: the underscore is a grep-able, at-a-glance "this is not public API" signal,
and that signal shouldn't depend on how many places the value happens to appear.

```css
/* ✅ Single-use, consumer-facing — still a public token, consumed directly */
.component-name {
  border-radius: var(--component-name-border-radius, 0.5rem);
  transition: all var(--component-name-transition-duration, 300ms) ease;
}

/* ✅ Resting/hover pair — both public, hover falls back to resting; --_ only wraps the
   genuinely-shared intermediate so the fallback chain isn't repeated */
.component-name {
  --_border-colour: var(--component-name-border-colour, transparent);
  border-color: var(--_border-colour);

  &:hover {
    border-color: var(--component-name-border-colour-hover, var(--_border-colour));
  }
}

/* ✅ Private — internal only, no consumer would ever want to override this directly */
.component-name {
  --_computed-offset: calc(v-bind(dynamicWidth) * 0.5px);
}
```

CLAUDE.md pitfall #20 is the concrete case (`ServicesCard`'s private layer wrapped public tokens with
no composition or state-swap behind them: pure pass-through duplication, not genuine privacy).

## Naming convention

`--{component-kebab-name}-{variant-if-any}-{property}[-state]`

- `--input-button-primary-surface` / `-surface-hover` — variant + property + state
- `--services-card-border-colour` / `-border-colour-hover` — property + state
- Only add a `-hover`/`-focus`/`-active` suffix if that state's value actually differs from the
  base token. If hover reuses the exact same value as base (see `InputButton`'s primary text
  colour, fixed on purpose across states), reuse the base token — don't manufacture a second name
  for a value that never diverges.

## Line-clamp tokens

Text that could overflow (names, titles, descriptions, body text) gets one public token per
element, `--{component}-{element}-line-clamp`. It covers both ellipsis cases: `1` is single-line
ellipsis, any other number caps the lines with an ellipsis on the last, `none` shows everything.
Prefer this over a prop: line count is presentation, and CSS handles it without a re-render.

```css
.google-review-card-author-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere; /* unbroken strings still wrap before the clamp applies */
  -webkit-line-clamp: var(--google-reviews-author-line-clamp, 2);
  line-clamp: var(--google-reviews-author-line-clamp, 2);
}
```

- Default to `none` unless the layout clearly needs a cap (a row of equal-height cards, say). Use
  `none` for "no clamp", never a large number like `100` (`ServicesCard`'s
  `--description-line-clamp: 100` predates this; switch it to `none` when it's next migrated).
- Don't clamp text that must stay readable: legal or attribution text, error messages, link text
  that names its destination.
- Clamped text stays in the DOM, so screen readers read all of it; sighted users lose the rest,
  which is why `none` is the default. If a clamped item has nowhere else to read it in full,
  consider a "read more" link or a `title`.
- `display: -webkit-box` makes an inline element (`<a>`, `<span>`) block-level; check the
  layout around it.
- Document it in `CONSUMER-STYLING.md` with its default and the `1`/`none` options.

## Text over an image: scrim tokens

Any component that puts text over a photo (a header in a picture, a card title on its image) gets
the same scrim token set, so a consumer can match the scrim to their photos. `ProfileSection`'s
`header-placement="picture-top|picture-bottom"` is the reference; `ServicesCard`'s
`titles-within-image-wrapper` has the older subset (colour and whole-background override only) and
should gain the rest when it's next touched.

| Token | Default | Purpose |
|---|---|---|
| `--{c}-scrim-colour` | `#000` | Colour the scrim starts from at the image's edge |
| `--{c}-scrim-opacity` | `75%` | Its opacity at the start |
| `--{c}-scrim-solid-stop` | `0%` | How far it stays full strength before fading, so the text sits on a clean background |
| `--{c}-scrim-target-colour` | `transparent` | What it fades into: set to roughly the photo's colour where the fade ends, so there's no grey band |
| `--{c}-scrim` | the gradient | Whole `background` override; `none` removes it |
| `--{c}-text-colour` | `contrast-color(<scrim colour>)`, `#fff` without support | Text on the scrim |

```css
.component-header {
  --_scrim-colour: var(--component-scrim-colour, #000);
  --_scrim-start-colour: color-mix(in oklab, var(--_scrim-colour) var(--component-scrim-opacity, 75%), transparent);
  --_scrim-solid-stop: var(--component-scrim-solid-stop, 0%);
  --_scrim-target-colour: var(--component-scrim-target-colour, transparent);

  color: var(--component-text-colour, #fff);
  background: var(--component-scrim, linear-gradient(to top, rgb(0 0 0 / 0.75), rgb(0 0 0 / 0.75) var(--_scrim-solid-stop), var(--_scrim-target-colour)));

  @supports (color: color-mix(in oklab, red, transparent)) {
    background: var(--component-scrim, linear-gradient(to top, var(--_scrim-start-colour), var(--_scrim-start-colour) var(--_scrim-solid-stop), var(--_scrim-target-colour)));
  }

  @supports (color: contrast-color(red)) {
    color: var(--component-text-colour, contrast-color(var(--_scrim-colour)));
  }
}
```

- The `@supports` fallback is for Safari before 16.2 (no `color-mix()`): it starts from 75% black
  whatever the scrim colour, but keeps the solid stop and target colour.
- `contrast-color()` reads the scrim colour, not the photo. Document that a consumer who removes the
  scrim must set the text colour.
- Round only the corners on the image's edge (`border-end-*-radius: inherit` for a bottom scrim),
  or an opaque target colour shows rounded inner corners.
- If the text can be long, don't clip it: let the frame grow (absolutely position the image and
  keep `overflow` visible so `aspect-ratio` acts as a minimum).
- Give the story a light and a dark theme built only from these tokens, each with a photo whose
  edge suits the scrim.

## Multi-level fallback chains are fine

A component that wants to *look like* another component's default (rather than duplicating a
raw value) chains through it:

```css
/* InputCopy's copy button defaults to InputButton's primary look */
background-color: var(--input-copy-button-bg, var(--input-button-primary-surface, var(--theme-surface)));
```

Three tiers deep here: instance/global override → "look like the primary button" → the theme
slot underneath that. Each link in the chain is a real, resolvable token — nothing depends on a
consuming app having declared anything.

## What this does NOT change

- Tier 1 theme slots (`_theme-slots.css`) stay bare `var()`, no fallback, by design.
- Geometry/typography tokens that already have real component-local defaults
  (`--button-padding-block: 1rem;` in `06.button-geometry.css`) were never part of this problem —
  they're declared with real values already, just not inline at the point of use. Leave them.

## Rollout status

- ✅ `InputButton` (primary/secondary/tertiary), `InputCopy`, `PricingCard` — migrated
  2026-08-25, see their `CONSUMER-STYLING.md` for the full token list. This pass also included a
  deliberate visual redesign (flat borders, `color-mix()`-darkened hover, transparent resting
  outline, separated `:focus-visible`), not just the token API change.
- ✅ `InputCheckboxRadio`/`Button` — migrated 2026-08-25, see their `CONSUMER-STYLING.md`.
  Pure token-rename pass, no visual/default changes (unlike `InputButton`'s redesign above).
  Added Storybook stories for both (`InputCheckboxRadio`, `InputCheckboxRadioButton`) —
  neither had one before.
- ✅ `InputTextCore`, `InputSelect`, `InputNumber` — migrated 2026-08-25, see their
  `CONSUMER-STYLING.md`. `InputTextCore`/`InputSelect` also had this exact problem's original
  form: a private `--_input-text-*`/`--_input-select-*` naming scheme documented as a second
  "local override path" alongside the global tokens, added 2026-08-22 (three days before this
  pattern was formalised) as a workaround for a global-override-not-landing report that was never
  root-caused. That private-var-as-override-point shape is exactly what this pattern replaces —
  renamed public with real fallbacks, old two-path docs removed. `InputNumber` had no
  component-scoped tokens at all before this (bare `--theme-input-*` throughout). Added a
  Storybook story for `InputSelect` (didn't have one); `InputNumber` still doesn't.
  `InputTextCore`/`InputSelect`'s `.normal` variant also had hover and `:focus-visible` share
  one token (literally the same rule content duplicated under two selectors) — split into
  `--input-text-border-hover`/`--input-select-border-hover` alongside the existing `-border-focus`
  pair, both still defaulting to `--theme-border-focus` so default rendering is unchanged, but
  mouse and assistive-tech interaction can now be themed independently. `InputNumber` has no
  hover state on its border at all (only a `:focus-visible` box-shadow toggle), so there was
  nothing to split there.
- ✅ `ToggleSwitchCore`, `TripleToggleSwitch`, `DisplayThemeSwitch` — migrated 2026-08-25, see
  the first two's `CONSUMER-STYLING.md`. Correction to the two lines this replaces: they claimed
  `ToggleSwitchCore` read a bare `--theme-toggle-symbol-color-*` — that token doesn't exist
  anywhere in this codebase and never did; false memory from conflating it with the checkbox
  fix. `ToggleSwitchCore` itself turned out to be a plain Tier 2 case (real, live tokens, just no
  component-scoped override point) plus five confirmed-dead private locals (declared, never read
  anywhere in the file) removed outright. The real dead-token bug was in `TripleToggleSwitch`
  (and duplicated in `DisplayThemeSwitch`'s own override): `--theme-form-radio-border`,
  `--theme-form-radio-outline`, `--theme-form-checkbox-bg` — all three declared nowhere in the
  layer. The first two fed two further-unused private locals (removed); the third fed the
  selected-option marker's background (real bug, narrow impact — only visible when none of the
  component's `system`/`light`/`dark` `:has()` overrides match).

  Second bug, found while adding the Storybook story `TripleToggleSwitch` never had: those
  `:has()` selectors (and the matching `.option-icon.system/.light/.dark` classes, template-bound
  to each option's `id`) said `"auto"`, not `"system"` — but the only known consumer,
  `DisplayThemeSwitch`, has only ever emitted `id`/`value: "system"` (it has to; that literal
  string is `useSettingsStore.setColourScheme`'s type and the CSS class it applies to `<html>`).
  `"auto"` never matched anything real, so the system option's green gradient marker had never
  actually fired — confirmed live before and after the fix. Renamed the selectors to `"system"`
  rather than the data, since the data value is a real external contract this component's
  presentational selectors have no business dictating. `TripleToggleSwitch` still hardcodes
  three option values as CSS selectors rather than being genuinely value-agnostic — noted in its
  `CONSUMER-STYLING.md`, left as a larger separate change.
