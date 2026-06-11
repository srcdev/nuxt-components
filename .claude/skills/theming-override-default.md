# Override the Default Theme in a Consuming App

## Overview

The layer ships a default blue theme. To replace it with your own palette, override two CSS custom
properties: `--theme-hue` and `--theme-chroma`. The full 11-step colour scale and all semantic
slots (buttons, inputs, prompts, toasts) recalculate automatically — no manual step mapping needed.

For the full architecture see `theming-colour-ramps.md`.

## Prerequisites

- `srcdev-nuxt-components` installed as a Nuxt layer
- A CSS entry point registered in `nuxt.config.ts` (e.g. `app/assets/styles/main.css`)

## Steps

### 1. Choose your hue and chroma

Open [oklch.com](https://oklch.com) and pick a hue angle and peak chroma:

| Value     | Controls                                    |
|-----------|---------------------------------------------|
| `--theme-hue`    | Colour direction (0–360°). See hue table below. |
| `--theme-chroma` | Saturation intensity at peak (step 06). Typical range: 0.12–0.25. Near 0 = grey. |

Hue quick reference:

| Range  | Colour         |
|--------|----------------|
| 30–70  | Orange / amber |
| 70–100 | Yellow / gold  |
| 100–160| Green          |
| 220–270| Blue           |
| 270–310| Violet         |

### 2. Create the default theme override file

Create `app/assets/styles/setup/03.theming/_default.css` in your consuming app:

```css
/* Override the layer's blue palette with warm gold */
:where(html) {
  --theme-hue: 85;       /* oklch hue angle — warm gold */
  --theme-chroma: 0.20;  /* peak chroma at step 06 */

  /* Page-level tokens — update any that reference the old palette */
  --page-bg: light-dark(var(--slate-00), var(--slate-08));
  --colour-text-default: light-dark(var(--slate-09), var(--slate-01));
  --colour-text-accent: light-dark(oklch(32% 0.16 85), oklch(64% 0.18 85));
  --colour-text-eyebrow: light-dark(oklch(32% 0.16 85), oklch(64% 0.18 85));
}
```

Only `--theme-hue` and `--theme-chroma` are strictly required — all component tokens update
automatically from there. Add page-level overrides only if their values reference the old palette.

### 3. (Optional) Name the palette for reuse

If you want to reference the palette from `[data-theme]` elements or component themes, name it:

```css
:where(html) {
  /* Named palette params */
  --palette-gold-hue: 85;
  --palette-gold-chroma: 0.20;

  /* Wire as default */
  --theme-hue:    var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);

  /* Page tokens */
  --page-bg: light-dark(var(--slate-00), var(--slate-08));
  --colour-text-default: light-dark(var(--slate-09), var(--slate-01));
  --colour-text-accent: light-dark(oklch(32% 0.16 85), oklch(64% 0.18 85));
}

/* Custom data-theme variant */
[data-theme="gold"] {
  --theme-hue:    var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);
}
```

### 4. Create the theming index

Create `app/assets/styles/setup/03.theming/index.css`:

```css
@import "./_default";
```

### 5. Create the setup index

Create `app/assets/styles/setup/index.css`:

```css
@import "./03.theming/";
```

### 6. Wire up the CSS entry point

In `app/assets/styles/main.css`:

```css
@import "./setup/";
```

Register in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: "srcdev-nuxt-components",
  css: [
    "srcdev-nuxt-components/app/assets/styles/main.css",
    "~/assets/styles/main.css",
  ],
});
```

The layer's CSS loads first via `extends`; your override CSS loads after — the cascade handles
priority automatically. No `!important` needed.

## How it works

The layer's `theme-ramp.css` declares the formula on `:where(html, [data-theme], [data-invalid])`.
When your override sets `--theme-hue: 85` on `:where(html)`, every `--colour-theme-*` step
recalculates to the gold palette. Semantic slots (`--theme-surface`, `--theme-text`, etc.) are
also declared on that same selector and use `light-dark()` against the recalculated steps — so
light/dark mode continues to work without any extra declarations.

## What you do NOT need to do

- Define `--colour-theme-0` through `--colour-theme-10` individually — the formula handles it
- Redeclare any `--theme-surface`, `--theme-border`, `--theme-ring`, etc. — they auto-update
- Separate light/dark files — use `light-dark()` in a single file instead
- Override button or input tokens — they all consume the semantic slots

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

- `--slate-*` neutrals ship with the layer — no need to redefine them for backgrounds/text
- To add a named palette with hue drift (e.g. sunset-style progression), see `theming-colour-ramps.md`
- The warning theme overrides `--theme-surface` steps directly to keep the amber feel — this pattern
  is available for any custom theme that needs a non-default surface step
