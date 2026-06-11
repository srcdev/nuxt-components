# Colour Ramp System

## Overview

The layer uses a parametric oklch colour ramp system. A single formula computes an 11-step colour
scale (`--colour-theme-0` to `--colour-theme-10`) from two CSS custom properties: `--theme-hue`
and `--theme-chroma`. Changing those two variables on any element switches the entire colour theme
for that element's subtree — buttons, inputs, prompts, and toasts all respond automatically.

Named palettes are pre-defined in `ramps.config.mjs` and generated to CSS. Themes swap palettes by
reassigning `--theme-hue` and `--theme-chroma`.

## How the formula works

`theme-ramp.css` (generated) declares the formula on every potential theme host:

```css
:where(html, [data-theme], [data-invalid]) {
  --colour-theme-0:  oklch(98% calc(var(--theme-chroma) * 0.045) var(--theme-hue));
  --colour-theme-1:  oklch(94% calc(var(--theme-chroma) * 0.18)  var(--theme-hue));
  --colour-theme-2:  oklch(88% calc(var(--theme-chroma) * 0.32)  var(--theme-hue));
  --colour-theme-3:  oklch(80% calc(var(--theme-chroma) * 0.50)  var(--theme-hue));
  --colour-theme-4:  oklch(72% calc(var(--theme-chroma) * 0.68)  var(--theme-hue));
  --colour-theme-5:  oklch(64% calc(var(--theme-chroma) * 0.86)  var(--theme-hue));
  --colour-theme-6:  oklch(56% calc(var(--theme-chroma) * 1.00)  var(--theme-hue));
  --colour-theme-7:  oklch(48% calc(var(--theme-chroma) * 0.95)  var(--theme-hue));
  --colour-theme-8:  oklch(40% calc(var(--theme-chroma) * 0.86)  var(--theme-hue));
  --colour-theme-9:  oklch(32% calc(var(--theme-chroma) * 0.77)  var(--theme-hue));
  --colour-theme-10: oklch(25% calc(var(--theme-chroma) * 0.64)  var(--theme-hue));
}
```

Scale direction: **00 = lightest, 10 = darkest**. Chroma tapers at both extremes and peaks at
step 06.

The formula is declared on every potential theme host (not just `html`) so that `[data-theme]`
elements get direct declarations — not inherited ones. This is critical: inherited `--colour-theme-*`
values would not re-evaluate when `--theme-hue` changes on a child element.

### Hue drift

Ramps can declare `drift` to rotate the hue angle linearly across steps. The `sunset` palette uses
`drift: -25`, producing:

```css
var(--theme-hue) + var(--theme-hue-drift, 0) * (i / 10)
/* step 00: 50 + (-25 × 0.0) = 50°  (amber)      */
/* step 05: 50 + (-25 × 0.5) = 37°  (orange)      */
/* step 10: 50 + (-25 × 1.0) = 25°  (red-orange)  */
```

## Named palettes

Defined in `ramps.config.mjs`, generated to `_theme-params.css` as `--palette-{name}-hue`,
`--palette-{name}-chroma`, and (if drift is set) `--palette-{name}-drift`:

| Name   | Hue | Max chroma | Notes                         |
|--------|-----|------------|-------------------------------|
| blue   | 255 | 0.22       | Layer default                 |
| red    | 30  | 0.24       | Error/danger theme            |
| green  | 157 | 0.19       | Success theme                 |
| amber  | 75  | 0.19       |                               |
| orange | 60  | 0.15       |                               |
| sunset | 50  | 0.22       | Warning theme — drift: -25    |
| slate  | 260 | 0.02       | Near-neutral grey             |

Also generates one named-step file per palette, e.g. `_blue.css` with `--blue-00` … `--blue-10`.
These are used by components that need a specific step by name (e.g. error state colours in
`_error.css` reference `--red-06`).

## Semantic slots

Eight shared colour roles are declared in `_theme-slots.css` on the same selector as the ramp.
All themed components (buttons, inputs, prompts, toasts) read only these tokens:

| Token                   | Light (step) | Dark (step) | Role                              |
|-------------------------|--------------|-------------|-----------------------------------|
| `--theme-surface`       | 9            | 7           | Filled button/chip surface        |
| `--theme-surface-hover` | 8            | 6           | Hover state of filled surface     |
| `--theme-surface-subtle`| 1            | 9           | Hover bg for outline elements     |
| `--theme-border`        | 6            | 5           | Input/card border                 |
| `--theme-border-focus`  | 4            | 3           | Focused border                    |
| `--theme-ring`          | 2            | 2           | Focus ring (outline)              |
| `--theme-on-surface`    | 0            | 0           | Text/icon on filled surface       |
| `--theme-text`          | 9            | 2           | Text on page, outline element text|

Additional context tokens (declared in `_default.css`):

| Token                          | Role                             |
|--------------------------------|----------------------------------|
| `--theme-input-surface`        | Input field background           |
| `--theme-input-surface-hover`  | Input field hover background     |
| `--theme-input-text-color-normal` | Input text colour             |
| `--theme-input-placeholder`    | Placeholder text colour          |
| `--theme-checkbox-symbol-surface` | Checkbox/radio symbol surface |
| `--page-bg`                    | Page background                  |
| `--colour-text-default`        | Body text                        |
| `--colour-text-accent`         | Accent / heading text            |
| `--colour-text-eyebrow`        | Eyebrow text                     |

## Built-in component themes

| `data-theme` value | Palette | Notes                                        |
|--------------------|---------|----------------------------------------------|
| `"default"`        | blue    | Page-level default                           |
| `"success"`        | green   |                                              |
| `"warning"`        | sunset  | Overrides surface to step 5 for warm feel    |
| `"error"`          | red     | Also applied on `[data-invalid]` elements    |

## Generator

### Key files

| File                                                        | Description                                    |
|-------------------------------------------------------------|------------------------------------------------|
| `ramps.config.mjs`                                          | Source of truth — hue/chroma/drift per palette |
| `scripts/generate-ramps.mjs`                                | Generator — reads config, emits CSS            |
| `scripts/check-ramps.mjs`                                   | CI check — errors if CSS is out of date        |
| `app/assets/styles/setup/02.colours/_<name>.css`            | Named steps `--name-00` … `--name-10`          |
| `app/assets/styles/setup/02.colours/_theme-params.css`      | `--palette-*` vars                             |
| `app/assets/styles/setup/03.theming/theme-ramp.css`         | Formula (the `--colour-theme-*` declarations)  |

### Scripts

```bash
npm run generate:ramps   # rebuild all generated CSS from ramps.config.mjs
npm run check:ramps      # CI: fail if generated CSS is out of date
```

### Adding a new named palette

1. Open `ramps.config.mjs` and add an entry:

```js
export const ramps = {
  // existing entries...
  gold:   { hue: 85,  chroma: 0.20 },
  // with hue drift across steps:
  // copper: { hue: 45, chroma: 0.21, drift: -15 },
};
```

2. Regenerate:

```bash
npm run generate:ramps
```

Produces `_gold.css` with `--gold-00` … `--gold-10`, and adds `--palette-gold-hue` /
`--palette-gold-chroma` to `_theme-params.css`.

3. Reference from a theme selector:

```css
[data-theme="gold"] {
  --theme-hue: var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);
}
```

## Consumer app: changing the default palette

Consumer apps do **not** need to edit `ramps.config.mjs`. Just override `--theme-hue` and
`--theme-chroma` — the full 11-step ramp and all semantic slots recalculate automatically:

```css
/* app/assets/styles/setup/03.theming/_default.css */
:where(html) {
  --theme-hue: 85;       /* oklch hue angle (degrees) — warm gold */
  --theme-chroma: 0.20;  /* peak chroma at step 06 */
}
```

To also name it for reuse on `data-theme` elements:

```css
:where(html) {
  --palette-gold-hue: 85;
  --palette-gold-chroma: 0.20;
  --theme-hue:    var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);
}

[data-theme="gold"] {
  --theme-hue:    var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);
}
```

Wire it up after the layer styles (the cascade handles priority — no `!important` needed):

```css
/* app/assets/styles/main.css */
@import "./setup/03.theming/_default.css";
```

## Light / dark mode

Semantic slots use `light-dark()`, which responds to `color-scheme` on `html` (set by the layer's
`_head.css`):

```css
html {
  color-scheme: light dark;   /* OS preference */
  &.light { color-scheme: light; }
  &.dark  { color-scheme: dark; }
}
```

Use `light-dark()` in your own override values too:

```css
:where(html) {
  --theme-hue: 85;
  --theme-chroma: 0.20;
  --page-bg: light-dark(var(--slate-00), var(--slate-08));
}
```

**Multi-value caveat**: `light-dark()` cannot contain comma-separated values (e.g. box-shadow
lists). Use intermediate scalar vars:

```css
--_shadow-a: light-dark(0.08, 0.5);
--my-shadow: 0 8px 32px rgba(0, 0, 0, var(--_shadow-a));
```

The `useColourScheme()` composable toggles the `.light` / `.dark` class on `<html>`. See
`composable-colour-scheme.md` for the full API.

## Hue angle reference

| Range  | Colour           |
|--------|------------------|
| 0–30   | Red / pink       |
| 30–70  | Orange / amber   |
| 70–100 | Yellow / gold    |
| 100–160| Green            |
| 160–220| Cyan / teal      |
| 220–270| Blue             |
| 270–310| Violet / purple  |
| 310–360| Magenta / rose   |

Use [oklch.com](https://oklch.com) to preview values before committing.
