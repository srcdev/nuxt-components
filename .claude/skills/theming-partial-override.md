# Partial Token Override in a Consuming App

## Overview

Use this skill when you need to override a specific category of tokens (e.g. form inputs, buttons,
colours) without replacing the entire default theme. The full token reference is in
`CONSUMER-STYLING.md` at the root of the layer package.

## How it works

All library tokens are declared inside `@layer theming`. Any CSS written outside a layer wins
automatically — no `!important` or specificity tricks required. Override files just need to be
imported **after** the layer styles.

## Steps

### 1. Create your override file

Create a CSS file for the category you want to override. Place it anywhere in your app's assets —
`app/assets/styles/` is conventional.

**Example: form input overrides**

```css
/* app/assets/styles/form-overrides.css */
:root {
  --theme-input-surface: oklch(0.98 0.005 250);
  --theme-input-border: oklch(0.45 0.08 270);
  --theme-input-border-focus: oklch(0.55 0.18 280);
  --theme-input-outline-focus: oklch(0.55 0.18 280);
  --theme-focus-visible-shadow: 0 0 0 2px oklch(0.80 0.12 280);
  --theme-input-placeholder: oklch(0.60 0.02 255);
  --theme-input-text-color-normal: oklch(0.20 0.02 255);
}
```

**Example: add a red colour scale and remap accent tokens**

```css
/* app/assets/styles/red-palette.css */
:root {
  /* Red scale — 00 (lightest) to 10 (darkest) */
  --red-00: oklch(0.99 0.005 20);
  --red-01: oklch(0.96 0.020 20);
  --red-02: oklch(0.90 0.055 20);
  --red-03: oklch(0.82 0.105 20);
  --red-04: oklch(0.72 0.155 20);
  --red-05: oklch(0.62 0.185 20);
  --red-06: oklch(0.53 0.185 20);
  --red-07: oklch(0.44 0.165 20);
  --red-08: oklch(0.36 0.140 20);
  --red-09: oklch(0.28 0.110 20);
  --red-10: oklch(0.20 0.080 20);

  /* Remap semantic accent tokens to red */
  --colour-text-accent: var(--red-08);
  --colour-text-eyebrow: var(--red-08);
  --colour-link-default: var(--red-09);
  --colour-link-hover: var(--red-08);
}
```

**Example: button overrides only**

```css
/* app/assets/styles/button-overrides.css */
:root {
  --theme-button-primary-surface: oklch(0.55 0.20 280);
  --theme-button-primary-surface-hover: oklch(0.48 0.22 280);
  --theme-button-primary-surface-active: oklch(0.42 0.22 280);
  --theme-button-primary-text: oklch(1 0 0);
  --theme-button-primary-text-hover: oklch(1 0 0);
}
```

### 2. Register it in nuxt.config.ts

Import your override file **after** the layer styles:

```ts
export default defineNuxtConfig({
  extends: "srcdev-nuxt-components",
  css: [
    "~/assets/styles/form-overrides.css",   // or whichever file(s) you created
  ],
});
```

The layer's own CSS loads via the `extends` mechanism before app CSS, so your unlayered overrides
always win.

### 3. Dark mode (optional)

If you need dark mode variants of your overrides, add them in the same file using the `html.dark`
class selector:

```css
:root {
  --theme-input-surface: oklch(0.98 0.005 250);
}

:where(html.dark) {
  --theme-input-surface: oklch(0.15 0.02 255);
}
```

## Scoped overrides (section or component level)

To restrict an override to a specific section of the page, scope to a wrapper class instead of
`:root`:

```css
.pricing-section {
  --theme-button-primary-surface: oklch(0.55 0.20 140);  /* green for pricing CTA */
}
```

## Token reference

See `CONSUMER-STYLING.md` in the layer package for the full list of available tokens, grouped
by category (typography, colours, form inputs, buttons, checkboxes, toggle, glass panel,
StepperList).

## Notes

- Only override the tokens you actually need — unset tokens fall back to layer defaults.
- Use oklch for all colour values. Use an oklch colour picker (e.g. oklch.com) to build scales.
- For a full palette replacement (replacing the entire default theme), use
  `theming-override-default.md` instead.
- `--slate-*` neutral tokens come from the layer and do not need to be redefined unless you
  genuinely want different neutrals.
