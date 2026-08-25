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

Two things used to go wrong, both found while auditing `luxury-locs-by-natasha`'s theming
overrides (2026-08-25):

1. **Bare `var(--theme-checkbox-symbol-color)` with no fallback anywhere.** The only way for this
   to resolve to something was a consuming app declaring it globally. When the component was later
   refactored (buttons moved onto the shared theme-slot system) and stopped reading the token, nothing
   signalled that to the consumer — the app's declaration became permanently dead, silently. A
   `var()` with an undefined custom property and no fallback just resolves to the property's
   initial value; there is no error, no warning, ever.
2. **Tokens that were "shared" only by accident.** `InputTextCore`, `InputSelectCore`,
   `InputNumberCore` and the checkbox button all read the exact same `--theme-input-surface`, so a
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

## Naming convention

`--{component-kebab-name}-{variant-if-any}-{property}[-state]`

- `--input-button-primary-surface` / `-surface-hover` — variant + property + state
- `--services-card-border-colour` / `-border-colour-hover` — property + state
- Only add a `-hover`/`-focus`/`-active` suffix if that state's value actually differs from the
  base token. If hover reuses the exact same value as base (see `InputButtonCore`'s primary text
  colour, fixed on purpose across states), reuse the base token — don't manufacture a second name
  for a value that never diverges.

## Multi-level fallback chains are fine

A component that wants to *look like* another component's default (rather than duplicating a
raw value) chains through it:

```css
/* InputCopy's copy button defaults to InputButtonCore's primary look */
--_button-bg: var(--input-copy-button-bg, var(--input-button-primary-surface, var(--theme-surface)));
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

- ✅ `InputButtonCore` (primary/secondary/tertiary), `InputCopy`, `PricingCard` — migrated
  2026-08-25, see their `CONSUMER-STYLING.md` for the full token list. This pass also included a
  deliberate visual redesign (flat borders, `color-mix()`-darkened hover, transparent resting
  outline, separated `:focus-visible`), not just the token API change.
- ✅ `InputCheckboxRadioCore`/`Button` — migrated 2026-08-25, see their `CONSUMER-STYLING.md`.
  Pure token-rename pass, no visual/default changes (unlike `InputButtonCore`'s redesign above).
  Added Storybook stories for both (`InputCheckboxRadioCore`, `InputCheckboxRadioButton`) —
  neither had one before.
- ✅ `InputTextCore`, `InputSelectCore`, `InputNumberCore` — migrated 2026-08-25, see their
  `CONSUMER-STYLING.md`. `InputTextCore`/`InputSelectCore` also had this exact problem's original
  form: a private `--_input-text-*`/`--_input-select-*` naming scheme documented as a second
  "local override path" alongside the global tokens, added 2026-08-22 (three days before this
  pattern was formalised) as a workaround for a global-override-not-landing report that was never
  root-caused. That private-var-as-override-point shape is exactly what this pattern replaces —
  renamed public with real fallbacks, old two-path docs removed. `InputNumberCore` had no
  component-scoped tokens at all before this (bare `--theme-input-*` throughout). Added a
  Storybook story for `InputSelectCore` (didn't have one); `InputNumberCore` still doesn't.
  `InputTextCore`/`InputSelectCore`'s `.normal` variant also had hover and `:focus-visible` share
  one token (literally the same rule content duplicated under two selectors) — split into
  `--input-text-border-hover`/`--input-select-border-hover` alongside the existing `-border-focus`
  pair, both still defaulting to `--theme-border-focus` so default rendering is unchanged, but
  mouse and assistive-tech interaction can now be themed independently. `InputNumberCore` has no
  hover state on its border at all (only a `:focus-visible` box-shadow toggle), so there was
  nothing to split there.
- ✅ `ToggleSwitchCore`, `TripleToggleSwitchCore`, `DisplayThemeSwitch` — migrated 2026-08-25, see
  the first two's `CONSUMER-STYLING.md`. Correction to the two lines this replaces: they claimed
  `ToggleSwitchCore` read a bare `--theme-toggle-symbol-color-*` — that token doesn't exist
  anywhere in this codebase and never did; false memory from conflating it with the checkbox
  fix. `ToggleSwitchCore` itself turned out to be a plain Tier 2 case (real, live tokens, just no
  component-scoped override point) plus five confirmed-dead private locals (declared, never read
  anywhere in the file) removed outright. The real dead-token bug was in `TripleToggleSwitchCore`
  (and duplicated in `DisplayThemeSwitch`'s own override): `--theme-form-radio-border`,
  `--theme-form-radio-outline`, `--theme-form-checkbox-bg` — all three declared nowhere in the
  layer. The first two fed two further-unused private locals (removed); the third fed the
  selected-option marker's background (real bug, narrow impact — only visible when none of the
  component's `system`/`light`/`dark` `:has()` overrides match).

  Second bug, found while adding the Storybook story `TripleToggleSwitchCore` never had: those
  `:has()` selectors (and the matching `.option-icon.system/.light/.dark` classes, template-bound
  to each option's `id`) said `"auto"`, not `"system"` — but the only known consumer,
  `DisplayThemeSwitch`, has only ever emitted `id`/`value: "system"` (it has to; that literal
  string is `useSettingsStore.setColourScheme`'s type and the CSS class it applies to `<html>`).
  `"auto"` never matched anything real, so the system option's green gradient marker had never
  actually fired — confirmed live before and after the fix. Renamed the selectors to `"system"`
  rather than the data, since the data value is a real external contract this component's
  presentational selectors have no business dictating. `TripleToggleSwitchCore` still hardcodes
  three option values as CSS selectors rather than being genuinely value-agnostic — noted in its
  `CONSUMER-STYLING.md`, left as a larger separate change.
