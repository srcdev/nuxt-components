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
| orange | 55  | 0.19       | Warning theme                 |
| sunset | 50  | 0.22       | drift: -25 (amber to red-orange) |
| slate  | 260 | 0.02       | Near-neutral grey             |

Also generates one named-step file per palette, e.g. `_blue.css` with `--blue-00` … `--blue-10`.
These are used by components that need a specific step by name (e.g. error state colours in
`_error.css` reference `--red-06`).

## Semantic slots

Nine shared colour roles are declared in `_theme-slots.css` on the same selector as the ramp.
All themed components (buttons, inputs, prompts, toasts) read only these tokens:

| Token                   | Light (step) | Dark (step) | Role                              |
|-------------------------|--------------|-------------|-----------------------------------|
| `--theme-surface`       | 7            | 9           | Filled button/chip surface        |
| `--theme-surface-hover` | 9            | 7           | Hover state of filled surface     |
| `--theme-accent`        | 5            | 4           | Decorative accent strip (prompt/toast left edge) |
| `--theme-surface-subtle`| 1            | 9           | Subtle body bg for prompt/toast, outline element hover |
| `--theme-border`        | 6            | 5           | Input/card border                 |
| `--theme-border-focus`  | 4            | 3           | Focused border                    |
| `--theme-ring`          | 1            | 9           | Focus ring (outline)              |
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
| `"warning"`        | orange  | Surface step 6, hover step 7 (both modes), for AA text contrast |
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

1. Regenerate:

```bash
npm run generate:ramps
```

Produces `_gold.css` with `--gold-00` … `--gold-10`, and adds `--palette-gold-hue` /
`--palette-gold-chroma` to `_theme-params.css`.

1. Reference from a theme selector:

```css
[data-theme="gold"] {
  --theme-hue: var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);
}
```

1. Add a story export for it in `stories/foundations/colour-ramps/ColourRamps.stories.ts`
   (`export const Gold: Story = rampStory("gold");`). The "All Ramps" story picks new ramps up
   automatically, but Storybook needs a static export per ramp page.

## Storybook reference (Foundations)

`Foundations/Colour Ramps` in Storybook is the visual reference for this system: a Setup Guide
(consumer instructions, `SetupGuide.mdx`), an All Ramps overview, and one page per ramp showing
each step's oklch and hex value (flagged P3 when the hex is a clipped sRGB fallback), contrast
against white and black text, the theme roles it plays (parsed from `03.theming/*.css`), and
which components reference it by name (scanned from `app/` source via `import.meta.glob`).
Everything is derived from `ramps.config.mjs` and the source, so it never needs manual
updating beyond the per-ramp story export. It lives in the root `stories/` folder, which is not
in the package `files` list, so it doesn't ship to consumers.

## Consumer app: generating a custom palette

The recommended approach is to generate named colour files so you can reference clean step
variables (`--gold-09`, `--gold-04`) in your theme overrides rather than raw oklch values.

### 1. Create `ramps.config.mjs` in your project root

Define the palettes you want. You can add new ones, reuse a built-in name to override the
layer's values, or both. Consumer CSS loads after the layer, so generated files win the
cascade automatically:

```js
// ramps.config.mjs
export const ramps = {
  // New palette — adds --gold-00..10 and --palette-gold-* vars
  gold: { hue: 85, chroma: 0.20 },

  // Override a built-in — replaces the layer's --blue-00..10 with your values
  // blue: { hue: 240, chroma: 0.18 },

  // Override the error/invalid palette — all error states use your red
  // red: { hue: 15, chroma: 0.26 },

  // Optional — hue drift rotates colour linearly across the 11 steps:
  // copper: { hue: 45, chroma: 0.21, drift: -15 },
};
```

### 2. Add the generator to `package.json`

The script lives in the layer's `node_modules` — no copying required. Prepend it to `dev`,
`build`, and `generate` so generated CSS never drifts out of sync with `ramps.config.mjs`:

```json
"scripts": {
  "generate:ramps": "node node_modules/srcdev-nuxt-components/scripts/generate-consumer-ramps.mjs",
  "dev":      "npm run generate:ramps && nuxt dev",
  "build":    "npm run generate:ramps && nuxt build",
  "generate": "npm run generate:ramps && nuxt generate"
}
```

Also add it to `postinstall` so it runs automatically after every `npm install`:

```json
"postinstall": "nuxt prepare && npm run generate:ramps && npm run setup:claude"
```

> **Do not manually edit generated files.** They carry a `/* GENERATED */` comment at the top
> and are overwritten every time the generator runs. All changes belong in `ramps.config.mjs`.

### 3. Run the generator

```bash
npm run generate:ramps
```

Produces in `app/assets/styles/setup/02.colours/`:

- `_gold.css` — `--gold-00` … `--gold-10` (literal oklch values, same lightness/chroma curve as the layer)
- `_palette-params.css` — `--palette-gold-hue`, `--palette-gold-chroma`

### 4. Import the generated files

In `app/assets/styles/setup/02.colours/index.css` (create if it doesn't exist):

```css
@import "./_palette-params";
@import "./_gold";
```

### 5. Set the palette as the theme default

```css
/* app/assets/styles/setup/03.theming/_default.css */
:where(html) {
  --theme-hue:    var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);

  /* Page-level tokens — readable named steps, not raw oklch */
  --colour-text-accent:  var(--gold-09);
  --colour-text-eyebrow: var(--gold-09);
}

/* Optional: make it available as a data-theme variant too */
[data-theme="gold"] {
  --theme-hue:    var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);
}
```

### 6. Wire up in your setup index

```css
/* app/assets/styles/setup/index.css */
@import "./02.colours/";
@import "./03.theming/_default.css";
```

```css
/* app/assets/styles/main.css */
@import "./setup/";
```

### Quick palette-only override (no generator)

If you only need to shift the hue without named step references, you can skip the generator and
set the params directly. All components recalculate automatically:

```css
:where(html) {
  --theme-hue: 85;
  --theme-chroma: 0.20;
}
```

This works for components but gives you no named steps for page-level tokens — use the generator
approach whenever you need `--gold-09` style references in your CSS.

## Light / dark mode

The layer ships light values only (since 2026-10-04): no token uses `light-dark()`, because older
iPad Safari doesn't support it. Dark mode is the consumer app's decision. `theming-dark-mode.md`
has the full setup: enabling the scheme plumbing, the complete dark token set to copy (works on
older Safari), and the shorter `light-dark()` alternative for apps that don't need it.

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

> Changed 2026-09-27: `orange` moved from hue 60 / chroma 0.15 to hue 55 / chroma 0.19 (the old
> values read as brown, not orange), and the warning theme switched from `sunset` to `orange` so
> warning inputs, alerts, prompts and buttons read as orange rather than red-orange. `sunset`
> remains available as a named ramp. Warning's filled surface then moved from step
> 05 (light) / 04 (dark) to step 06 in both modes, hover step 07: step 06 is the lightest orange
> where the near-white `--theme-on-surface` text meets AA (4.65:1; step 05 was 3.3:1).
