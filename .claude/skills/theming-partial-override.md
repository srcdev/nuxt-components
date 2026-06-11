# Partial Token Override in a Consuming App

## Overview

Use this skill when you need to tweak a specific colour role (page background, text, buttons,
inputs) without replacing the entire default theme. For a full palette swap see
`theming-override-default.md`. For the full architecture see `theming-colour-ramps.md`.

## How it works

All library tokens are declared inside `@layer theming`. Any CSS written outside a layer wins
automatically — no `!important` or specificity tricks required. Override files just need to load
after the layer styles.

## Semantic slots — the tokens to override

All themed components share the same 8-slot vocabulary. Overriding these affects buttons, inputs,
prompts, and toasts simultaneously:

| Token                   | Default (light → dark)     | Role                              |
|-------------------------|----------------------------|-----------------------------------|
| `--theme-surface`       | `--colour-theme-9` / `7`   | Filled button/chip surface        |
| `--theme-surface-hover` | `--colour-theme-8` / `6`   | Hover state of filled surface     |
| `--theme-surface-subtle`| `--colour-theme-1` / `9`   | Hover bg for outline elements     |
| `--theme-border`        | `--colour-theme-6` / `5`   | Input/card border                 |
| `--theme-border-focus`  | `--colour-theme-4` / `3`   | Focused border                    |
| `--theme-ring`          | `--colour-theme-2`         | Focus ring (outline)              |
| `--theme-on-surface`    | `--colour-theme-0`         | Text/icon on filled surface       |
| `--theme-text`          | `--colour-theme-9` / `2`   | Text on page, outline element text|

Input-specific tokens:

| Token                           | Role                      |
|---------------------------------|---------------------------|
| `--theme-input-surface`         | Input field background    |
| `--theme-input-surface-hover`   | Input hover background    |
| `--theme-input-text-color-normal` | Input text colour       |
| `--theme-input-placeholder`     | Placeholder text colour   |
| `--theme-checkbox-symbol-surface` | Checkbox surface        |

Page-level tokens:

| Token                    | Role                  |
|--------------------------|-----------------------|
| `--page-bg`              | Page background       |
| `--colour-text-default`  | Body text             |
| `--colour-text-accent`   | Accent / heading text |
| `--colour-text-eyebrow`  | Eyebrow text          |

## Steps

### 1. Create your override file

#### Shift the default palette hue (amber instead of blue)

```css
/* app/assets/styles/overrides.css */
:where(html) {
  --theme-hue: 75;      /* amber */
  --theme-chroma: 0.19;
}
```

#### Override button surface only

```css
/* Make primary buttons darker/more saturated */
:where(html) {
  --theme-surface:       light-dark(oklch(28% 0.18 85), oklch(45% 0.20 85));
  --theme-surface-hover: light-dark(oklch(22% 0.16 85), oklch(38% 0.18 85));
}
```

#### Override input colours only

```css
:where(html) {
  --theme-input-surface:           light-dark(oklch(0.99 0 0), oklch(0.12 0.01 255));
  --theme-input-text-color-normal: light-dark(oklch(0.20 0.01 255), oklch(0.95 0.01 255));
  --theme-input-placeholder:       light-dark(oklch(0.60 0.01 255), oklch(0.40 0.01 255));
}
```

#### Override page-level tokens for a different neutral palette

```css
:where(html) {
  --page-bg:             light-dark(oklch(0.98 0 0), oklch(0.10 0 0));
  --colour-text-default: light-dark(oklch(0.20 0 0), oklch(0.93 0 0));
  --colour-text-accent:  light-dark(oklch(0.30 0.16 85), oklch(0.65 0.18 85));
}
```

### 2. Register it in nuxt.config.ts

```ts
export default defineNuxtConfig({
  extends: "srcdev-nuxt-components",
  css: [
    "srcdev-nuxt-components/app/assets/styles/main.css",
    "~/assets/styles/overrides.css",
  ],
});
```

The layer's own CSS loads via `extends` before app CSS, so your unlayered overrides always win.

## Scoped overrides (section or component level)

To restrict an override to a specific section, scope to a wrapper class instead of `:where(html)`:

```css
.pricing-section {
  /* Entire section uses green theme */
  --theme-hue: 157;
  --theme-chroma: 0.19;
}

.hero-cta {
  /* Just these buttons use a different surface colour */
  --theme-surface:       light-dark(oklch(32% 0.16 85), oklch(55% 0.18 85));
  --theme-surface-hover: light-dark(oklch(25% 0.14 85), oklch(48% 0.16 85));
}
```

## Overriding a specific component theme

To change how `data-theme="success"` looks without affecting other themes:

```css
[data-theme="success"] {
  /* Shift to teal instead of green */
  --theme-hue: 185;
  --theme-chroma: 0.17;
}
```

## Notes

- Only override the tokens you actually need — everything else falls back to layer defaults
- Use `light-dark()` in a single rule rather than separate `:where(html.light)` / `:where(html.dark)` blocks — the layer's `color-scheme` infrastructure handles mode switching
- `--slate-*` neutral tokens come from the layer and do not need to be redefined unless you genuinely want different neutrals
- For a full palette replacement (changing the layer default), use `theming-override-default.md` instead
