# Override the Default Theme in a Consuming App

## Overview

The layer ships a default blue theme. This skill covers how to replace it with your own colour palette in a consuming Nuxt app — including adding a new colour scale and remapping all semantic tokens for light and dark modes.

## Prerequisites

- Consuming app has `srcdev-nuxt-components` installed as a Nuxt layer
- The consuming app has its own CSS entry point (e.g. `app/assets/styles/main.css`) registered in `nuxt.config.ts` via `css: [...]`

## Steps

### 1. Create the colour scale file

Create `app/assets/styles/setup/02.colours/_gold.css` (or your colour name).

Colours use the `oklch` colour space. The scale runs from `00` (lightest) to `10` (darkest) — `00` is optional and only needed if you require a near-white tint.

```css
:where(html) {
  --gold-00: oklch(98% 0.01 85);
  --gold-01: oklch(94% 0.04 85);
  --gold-02: oklch(88% 0.09 85);
  --gold-03: oklch(80% 0.14 85);
  --gold-04: oklch(72% 0.18 85);
  --gold-05: oklch(64% 0.20 85);
  --gold-06: oklch(56% 0.19 85);
  --gold-07: oklch(48% 0.17 85);
  --gold-08: oklch(40% 0.15 85);
  --gold-09: oklch(32% 0.12 85);
  --gold-10: oklch(25% 0.09 85);
}
```

Adjust the hue angle (third value) to taste — `85` is a warm gold. Use an oklch colour picker to preview the scale.

### 2. Create the colours index

Create `app/assets/styles/setup/02.colours/index.css` and import your scale:

```css
@import "./_gold";
```

### 3. Create the light theme override

Create `app/assets/styles/setup/03.theming/default/_light.css`.

This file uses `:where(html)` and maps semantic tokens to your colour scale. Copy the full token list from the layer and replace `--blue-*` references with `--gold-*`:

```css
:where(html) {
  /* Color scale */
  --colour-theme-1: var(--gold-01);
  --colour-theme-2: var(--gold-02);
  --colour-theme-3: var(--gold-03);
  --colour-theme-4: var(--gold-04);
  --colour-theme-5: var(--gold-05);
  --colour-theme-6: var(--gold-06);
  --colour-theme-7: var(--gold-07);
  --colour-theme-8: var(--gold-08);
  --colour-theme-9: var(--gold-09);
  --colour-theme-10: var(--gold-10);

  /* Body */
  --page-bg: var(--slate-00);
  --colour-text-default: var(--slate-09);
  --colour-text-accent: var(--gold-09);
  --colour-text-eyebrow: var(--gold-09);

  /* Links */
  --colour-link-default: var(--gold-10);
  --colour-link-hover: var(--gold-09);

  /* Form inputs */
  --theme-input-surface: var(--slate-00);
  --theme-input-surface-hover: var(--slate-01);
  --theme-input-border: var(--gold-06);
  --theme-input-border-hover: var(--gold-05);
  --theme-input-border-focus: var(--gold-04);
  --theme-input-outline: transparent;
  --theme-input-outline-focus: var(--gold-04);
  --theme-input-visible-outline: var(--gold-10);
  --theme-focus-visible-shadow: 0 0 0 2px var(--gold-02);
  --theme-input-placeholder: var(--slate-05);
  --theme-input-text-color-normal: var(--slate-09);

  /* Checkbox / radio */
  --theme-checkbox-symbol-color: var(--gold-08);
  --theme-checkbox-symbol-surface: var(--theme-input-surface);
  --theme-checkbox-decorator-color: var(--gold-09);

  /* Toggle */
  --theme-toggle-symbol-color-default: var(--gold-00);
  --theme-toggle-symbol-color-checked: var(--gold-08);

  /* Buttons — primary */
  --theme-button-primary-surface: var(--gold-09);
  --theme-button-primary-surface-hover: var(--gold-08);
  --theme-button-primary-surface-active: var(--gold-07);
  --theme-button-primary-border: var(--gold-09);
  --theme-button-primary-border-active: var(--gold-09);
  --theme-button-primary-outline: var(--gold-01);
  --theme-button-primary-outline-active: var(--gold-07);
  --theme-button-primary-text: var(--gold-00);
  --theme-button-primary-text-hover: var(--gold-00);

  /* Buttons — secondary */
  --theme-button-secondary-surface: transparent;
  --theme-button-secondary-surface-hover: var(--gold-01);
  --theme-button-secondary-surface-active: var(--gold-01);
  --theme-button-secondary-border: var(--gold-09);
  --theme-button-secondary-border-active: var(--gold-09);
  --theme-button-secondary-outline: var(--gold-09);
  --theme-button-secondary-outline-active: var(--gold-09);
  --theme-button-secondary-text: var(--gold-09);
  --theme-button-secondary-text-hover: var(--gold-09);

  /* Buttons — tertiary */
  --theme-button-tertiary-surface: var(--slate-01);
  --theme-button-tertiary-text: var(--gold-09);
  --theme-button-tertiary-border-active: var(--gold-09);
  --theme-button-tertiary-outline-active: var(--gold-09);
}
```

### 4. Create the dark theme override

Create `app/assets/styles/setup/03.theming/default/_dark.css`.

Selector is `:where(html.dark)`. Dark mode typically inverts the scale direction — light values for text/borders, dark values for backgrounds:

```css
:where(html.dark) {
  /* Color scale */
  --colour-theme-1: var(--gold-01);
  --colour-theme-2: var(--gold-02);
  --colour-theme-3: var(--gold-03);
  --colour-theme-4: var(--gold-04);
  --colour-theme-5: var(--gold-05);
  --colour-theme-6: var(--gold-06);
  --colour-theme-7: var(--gold-07);
  --colour-theme-8: var(--gold-08);
  --colour-theme-9: var(--gold-09);
  --colour-theme-10: var(--gold-10);

  /* Body */
  --page-bg: var(--slate-08);
  --colour-text-default: var(--slate-01);
  --colour-text-accent: var(--gold-05);
  --colour-text-eyebrow: var(--gold-05);

  /* Links */
  --colour-link-default: var(--gold-03);
  --colour-link-hover: var(--gold-04);

  /* Form inputs */
  --theme-input-surface: var(--slate-10);
  --theme-input-surface-hover: var(--slate-09);
  --theme-input-border: var(--gold-06);
  --theme-input-border-hover: var(--gold-05);
  --theme-input-border-focus: var(--gold-04);
  --theme-input-outline: var(--gold-06);
  --theme-input-outline-focus: var(--gold-04);
  --theme-input-visible-outline: var(--gold-04);
  --theme-focus-visible-shadow: 0 0 0 2px var(--gold-02);
  --theme-input-placeholder: var(--slate-04);
  --theme-input-text-color-normal: var(--slate-01);

  /* Checkbox / radio */
  --theme-checkbox-symbol-surface: var(--theme-input-surface);
  --theme-checkbox-symbol-color: var(--gold-02);
  --theme-checkbox-decorator-color: var(--gold-02);

  /* Buttons — primary */
  --theme-button-primary-border: var(--gold-07);
  --theme-button-primary-border-active: var(--gold-07);
  --theme-button-primary-text: var(--gold-00);
  --theme-button-primary-text-hover: var(--gold-00);

  /* Buttons — secondary */
  --theme-button-secondary-surface: var(--gold-01);
  --theme-button-secondary-border-active: var(--gold-01);
  --theme-button-secondary-text: var(--gold-09);

  /* Buttons — tertiary */
  --theme-button-tertiary-surface: transparent;
  --theme-button-tertiary-text: var(--gold-01);
  --theme-button-tertiary-border-active: var(--gold-01);
  --theme-button-tertiary-outline-active: var(--gold-09);
}
```

### 5. Create the theming index

Create `app/assets/styles/setup/03.theming/default/index.css`:

```css
@import "./_light";
@import "./_dark";
```

### 6. Create the setup index

Create `app/assets/styles/setup/index.css` that imports colours then theming (order matters — colours must be defined before theming references them):

```css
@import "./02.colours/";
@import "./03.theming/default/";
```

### 7. Wire up the CSS entry point

In your consuming app's `app/assets/styles/main.css` (or equivalent), import your setup after the layer's styles are applied:

```css
@import "./setup/";
```

Then register it in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: "srcdev-nuxt-components",
  css: ["~/assets/styles/main.css"],
});
```

The consuming app's CSS loads after the layer's, so your token overrides win via the cascade.

## Notes

- The `--slate-*` scale comes from the layer and does not need to be redefined — keep all neutral/background tokens pointing at `--slate-*`.
- Only redefine tokens that change. You do not need to copy tokens that stay identical between layer and your override.
- Dark mode is triggered by the `dark` class on `<html>`. The layer handles toggling this via `data-color-scheme` and the colour scheme store.
- If you need additional component-specific tokens (e.g. `--stepper-list-*`, `--glass-panel-*`), add them to `_light.css` and `_dark.css` following the same pattern.
- Use an oklch colour picker (e.g. oklch.com) to build and preview your scale before committing values.
