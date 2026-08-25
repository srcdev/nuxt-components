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
- ⏳ Not yet migrated: `ToggleSwitchCore`, `TripleToggleSwitchCore` (still read bare
  `--theme-toggle-symbol-color-*`, which are dead — nothing declares them by default), and the
  shared `--theme-input-surface`-family tokens used by `InputTextCore`/`InputSelectCore`/
  `InputNumberCore` (still Tier 2, not yet split into per-component Tier 3 tokens).
