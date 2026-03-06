# Consumer Styling Guide

How to customise the appearance of `nuxt-components` in your own application.

---

## How the cascade works

All library styles sit inside named `@layer` blocks. In CSS, **unlayered styles always win over layered styles**, regardless of specificity. This means any CSS you write in your app automatically takes priority — no `!important`, no specificity tricks required.

```
@layer reset          (lowest priority)
@layer colours
@layer theming
@layer form-tokens
@layer typography
@layer a11y
@layer utilities
@layer components     (highest library priority)
──────────────────────────────────────────────
Your unlayered CSS    (wins over everything above)
```

---

## Tier 1 — Token overrides (recommended for most cases)

Components expose CSS custom properties for all configurable values: colours, spacing, gaps, font sizes, border radii, shadows. Override these in your app's CSS and they cascade into every component automatically.

### Global token overrides

```css
/* your-app/assets/styles/theme.css */

:root {
  /* Accent colour used in hero text, eyebrow labels, links */
  --colour-text-accent: #e63946;
  --colour-text-eyebrow: #e63946;

  /* Hero text scale */
  --hero-text-display: clamp(3rem, 8vw, 7rem);
  --hero-text-title: clamp(2rem, 5vw, 4rem);

  /* Form input appearance */
  --theme-input-border: #334155;
  --theme-input-border-focus: #6366f1;
  --theme-input-surface: #f8fafc;

  /* Button colours (default/primary variant) */
  --theme-button-primary-surface: #6366f1;
  --theme-button-primary-surface-hover: #4f46e5;
  --theme-button-primary-text: #ffffff;
}
```

### Scoped token overrides (per-section or per-component)

Wrap a section in any selector and tokens override only within that scope:

```css
/* Override just inside a hero section */
.my-hero-section {
  --colour-text-accent: #f97316;
  --hero-text-title: clamp(3rem, 6vw, 5rem);
}
```

```html
<section class="my-hero-section">
  <HeroText :text-content="..." tag="h1" />
</section>
```

### Using the data-theme attribute

Components accept a `theme` prop that maps to `data-theme` on the element. You can define an entirely different token set for a named theme:

```css
/* your-app/assets/styles/themes/brand.css */
[data-theme="brand"] {
  --theme-input-border: #7c3aed;
  --theme-input-border-focus: #5b21b6;
  --theme-input-surface: #faf5ff;
  --theme-button-primary-surface: #7c3aed;
  --theme-button-primary-surface-hover: #6d28d9;
  --theme-checkbox-symbol-color: #7c3aed;
}
```

```html
<InputTextCore theme="brand" ... />
```

---

## Tier 2 — Direct class overrides (for structural changes tokens can't cover)

Because library component styles are in `@layer components`, your plain unlayered CSS always wins. Target component class names directly:

```css
/* your-app/assets/styles/overrides.css */

/* Change the accent span styling inside HeroText */
.hero-text .accent {
  font-style: normal;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

/* Restyle the glass panel shape */
.glass-panel {
  border-radius: 0.25rem;
  backdrop-filter: blur(8px);
}

/* Change form field layout */
.field-layout {
  gap: 0.25rem;
}
```

No wrapper class needed. No `!important`. Your selectors win because they are unlayered.

---

## Setup in your Nuxt app

### 1. Import the library styles

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    'nuxt-components/assets/styles/main.css',  // library base styles
    '~/assets/styles/theme.css',               // your token overrides
    '~/assets/styles/overrides.css',           // your structural overrides (optional)
  ]
})
```

### 2. Token overrides file structure (suggested)

```
your-app/assets/styles/
├── theme.css          ← global token overrides (:root)
├── themes/
│   ├── brand.css      ← [data-theme="brand"] overrides
│   └── dark.css       ← [data-theme="dark"] overrides
└── overrides.css      ← structural class overrides (if needed)
```

### 3. Import order matters

Your override files must be imported **after** the library styles so they take effect. The `css` array in `nuxt.config.ts` is processed in order.

---

## What can be customised via tokens

### Typography

| Token | Controls |
|---|---|
| `--hero-text-display` | HeroText display size |
| `--hero-text-title` | HeroText title size |
| `--hero-text-heading` | HeroText heading size |
| `--hero-text-subheading` | HeroText subheading size |
| `--hero-text-label` | HeroText label size |

### Colours

| Token | Controls |
|---|---|
| `--colour-text-default` | Default body text |
| `--colour-text-accent` | Accent spans in HeroText, links |
| `--colour-text-eyebrow` | EyebrowText colour |
| `--colour-link-default` | Anchor link colour |
| `--colour-link-hover` | Anchor link hover colour |
| `--page-bg` | Page background |

### Form inputs

| Token | Controls |
|---|---|
| `--theme-input-surface` | Input background |
| `--theme-input-surface-hover` | Input background on hover |
| `--theme-input-border` | Input border |
| `--theme-input-border-hover` | Input border on hover |
| `--theme-input-border-focus` | Input border on focus |
| `--theme-input-outline-focus` | Focus ring colour |
| `--theme-input-placeholder` | Placeholder text colour |
| `--theme-input-text-color-normal` | Input text colour |

### Buttons (per variant)

| Token | Controls |
|---|---|
| `--theme-button-primary-surface` | Primary button background |
| `--theme-button-primary-surface-hover` | Primary button background hover |
| `--theme-button-primary-text` | Primary button text |
| `--theme-button-secondary-surface` | Secondary button background |
| `--theme-button-secondary-border` | Secondary button border |
| `--theme-button-secondary-text` | Secondary button text |

### Checkboxes & radio buttons

| Token | Controls |
|---|---|
| `--theme-checkbox-symbol-color` | Tick/dot colour |
| `--theme-checkbox-symbol-surface` | Checkbox background |
| `--theme-checkbox-decorator-color` | Border/decorator colour |
| `--theme-checkbox-label-text-color` | Label text colour |

### Glass panel

| Token | Controls |
|---|---|
| `--glass-panel-bg` | Panel background (rgba) |
| `--glass-panel-border-color` | Panel border (rgba) |
| `--glass-panel-shadow` | Panel drop shadow |

---

## What cannot be customised

Behavioural CSS — `display`, `flex-direction`, `overflow`, `position`, `grid-template-*` — is intentionally not exposed as tokens. These define how a component functions, not how it looks.
