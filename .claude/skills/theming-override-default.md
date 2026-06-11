# Override the Default Theme in a Consuming App

## Overview

The layer ships a default blue theme. The recommended way to replace it is to generate your own
named colour files — this gives you clean step variables (`--gold-09`, `--gold-04`) to reference
in your theme overrides rather than raw oklch values. Setting `--theme-hue` and `--theme-chroma`
drives the parametric ramp; the generated files give you named aliases for every step.

For the full architecture see `theming-colour-ramps.md`.

## Prerequisites

- `srcdev-nuxt-components` installed as a Nuxt layer
- A CSS entry point registered in `nuxt.config.ts` (e.g. `app/assets/styles/main.css`)

## Steps

### 1. Create `ramps.config.mjs` in your project root

Export only your own palettes — the layer's built-in ones (blue, red, green, etc.) are already
present via the layer CSS:

```js
// ramps.config.mjs
export const ramps = {
  gold: { hue: 85, chroma: 0.20 },
  // Optional — add hue drift to rotate colour across the scale:
  // copper: { hue: 45, chroma: 0.21, drift: -15 },
};
```

Choose your hue and peak chroma using [oklch.com](https://oklch.com). The `chroma` value controls
saturation at the peak step (06); typical range is 0.12–0.25.

Hue quick reference:

| Range   | Colour         |
|---------|----------------|
| 0–30    | Red / pink     |
| 30–70   | Orange / amber |
| 70–100  | Yellow / gold  |
| 100–160 | Green          |
| 220–270 | Blue           |
| 270–310 | Violet         |

### 2. Add the generator to `package.json`

The script lives in the layer's `node_modules` — no copying required:

```json
"scripts": {
  "generate:ramps": "node node_modules/srcdev-nuxt-components/scripts/generate-consumer-ramps.mjs"
}
```

To run it automatically after every install, add it to `postinstall`:

```json
"postinstall": "nuxt prepare && npm run generate:ramps && npm run setup:claude"
```

### 3. Run the generator

```bash
npm run generate:ramps
```

Produces in `app/assets/styles/setup/02.colours/`:

- `_gold.css` — `--gold-00` … `--gold-10` (literal oklch values, using the layer's lightness/chroma curve)
- `_palette-params.css` — `--palette-gold-hue`, `--palette-gold-chroma`

### 4. Import the generated files

Create `app/assets/styles/setup/02.colours/index.css`:

```css
@import "./_palette-params";
@import "./_gold";
```

### 5. Set the palette as the theme default

Create `app/assets/styles/setup/03.theming/_default.css`:

```css
:where(html) {
  --theme-hue:    var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);

  /* Page-level tokens — readable named steps, not raw oklch */
  --page-bg: light-dark(var(--slate-00), var(--slate-08));
  --colour-text-default:  light-dark(var(--slate-09), var(--slate-01));
  --colour-text-accent:   light-dark(var(--gold-09), var(--gold-04));
  --colour-text-eyebrow:  light-dark(var(--gold-09), var(--gold-04));
}
```

Only `--theme-hue` and `--theme-chroma` are strictly required — all component tokens update
automatically from there. Add page-level overrides only for tokens that reference the old blue
palette by name.

### 6. Create the setup index

`app/assets/styles/setup/index.css`:

```css
@import "./02.colours/";
@import "./03.theming/_default.css";
```

### 7. Wire up the CSS entry point

`app/assets/styles/main.css`:

```css
@import "./setup/";
```

Registered in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: "srcdev-nuxt-components",
  css: [
    "srcdev-nuxt-components/app/assets/styles/main.css",
    "~/assets/styles/main.css",
  ],
});
```

## How it works

The layer's `theme-ramp.css` declares the formula on `:where(html, [data-theme], [data-invalid])`.
When your override sets `--theme-hue`/`--theme-chroma` on `:where(html)`, every `--colour-theme-*`
step recalculates to your palette. Semantic slots (`--theme-surface`, `--theme-text`, etc.) are
declared on that same selector using `light-dark()` — light/dark mode continues to work without
any extra declarations.

The generated `_gold.css` gives you a named alias for each step (`--gold-09` etc.) so your
page-level token values stay readable. The values match what the formula would produce for
that hue/chroma pair.

## What you do NOT need to do

- Define `--colour-theme-0` through `--colour-theme-10` — the formula handles it
- Redeclare `--theme-surface`, `--theme-border`, `--theme-ring` etc. — they auto-update
- Write separate light/dark files — use `light-dark()` in a single file
- Override any button or input component tokens — they all consume semantic slots

## rem sizing

`html` has `font-size: 62.5%` set by the layer, making `1rem = 10px`:

| px   | rem    |
|------|--------|
| 8px  | 0.8rem |
| 12px | 1.2rem |
| 16px | 1.6rem |
| 24px | 2.4rem |
| 32px | 3.2rem |

## Notes

- `--slate-*` neutrals ship with the layer — no need to redefine for page backgrounds/text
- To add a custom `[data-theme]` variant using your generated palette, see `theming-colour-ramps.md`
- The `warning` theme overrides `--theme-surface` steps directly for a different surface intensity — this pattern is available for any custom theme that needs a non-default surface step
