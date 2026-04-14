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
@layer components
@layer utilities      (highest library priority)
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
  --colour-text-accent: oklch(0.612 0.208 22.2);
  --colour-text-eyebrow: oklch(0.612 0.208 22.2);

  /* Hero text scale */
  --hero-text-display: clamp(3rem, 8vw, 7rem);
  --hero-text-title: clamp(2rem, 5vw, 4rem);

  /* Form input appearance */
  --theme-input-border: oklch(0.372 0.039 257.3);
  --theme-input-border-focus: oklch(0.585 0.204 277.1);
  --theme-input-surface: oklch(0.984 0.003 247.9);

  /* Button colours (primary variant) */
  --theme-button-primary-surface: oklch(0.585 0.204 277.1);
  --theme-button-primary-surface-hover: oklch(0.511 0.230 277.0);
  --theme-button-primary-text: oklch(1 0 0);
}
```

### Scoped token overrides (per-section or per-component)

Wrap a section in any selector and tokens override only within that scope:

```css
/* Override just inside a hero section */
.my-hero-section {
  --colour-text-accent: oklch(0.705 0.187 47.6);
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
  --theme-input-border: oklch(0.541 0.247 293.0);
  --theme-input-border-focus: oklch(0.432 0.211 292.8);
  --theme-input-surface: oklch(0.977 0.014 308.3);
  --theme-button-primary-surface: oklch(0.541 0.247 293.0);
  --theme-button-primary-surface-hover: oklch(0.491 0.241 292.6);
  --theme-checkbox-symbol-color: oklch(0.541 0.247 293.0);
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
│   └── brand.css      ← [data-theme="brand"] overrides
└── overrides.css      ← structural class overrides (if needed)
```

> **Dark mode** is controlled via the `html.dark` class, not a `data-theme` attribute. Override dark-mode tokens by targeting `:where(html.dark) { ... }` in your `theme.css`.

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
| `--hero-text-bg-img` | HeroText gradient (accent/shimmer effect) |
| `--eyebrow-text-large` | EyebrowText large size |
| `--eyebrow-text-medium` | EyebrowText medium size |
| `--eyebrow-text-small` | EyebrowText small size |
| `--eyebrow-text-bg-img` | EyebrowText gradient (accent/shimmer effect) |

### Colours

| Token | Controls |
|---|---|
| `--colour-text-default` | Default body text |
| `--colour-text-accent` | Accent spans in HeroText, links |
| `--colour-text-eyebrow` | EyebrowText colour |
| `--colour-link-default` | Anchor link colour |
| `--colour-link-hover` | Anchor link hover colour |
| `--page-bg` | Page background |
| `--colour-theme-1` … `--colour-theme-12` | Colour scale (maps to the active theme palette) |

### Form inputs

| Token | Controls |
|---|---|
| `--theme-input-surface` | Input background |
| `--theme-input-surface-hover` | Input background on hover |
| `--theme-input-surface-focus` | Input background on focus |
| `--theme-input-border` | Input border |
| `--theme-input-border-hover` | Input border on hover |
| `--theme-input-border-focus` | Input border on focus |
| `--theme-input-outline` | Input outline (default state) |
| `--theme-input-outline-focus` | Input outline on focus |
| `--theme-input-visible-outline` | Visible outline (e.g. keyboard nav) |
| `--theme-focus-visible-shadow` | Focus-visible box shadow |
| `--theme-input-placeholder` | Placeholder text colour |
| `--theme-input-text-color-normal` | Input text colour |

### Buttons (per variant)

| Token | Controls |
|---|---|
| `--theme-button-primary-surface` | Primary background |
| `--theme-button-primary-surface-hover` | Primary background hover |
| `--theme-button-primary-surface-active` | Primary background active |
| `--theme-button-primary-border` | Primary border |
| `--theme-button-primary-border-active` | Primary border active |
| `--theme-button-primary-outline` | Primary outline |
| `--theme-button-primary-outline-active` | Primary outline active |
| `--theme-button-primary-text` | Primary text |
| `--theme-button-primary-text-hover` | Primary text hover |
| `--theme-button-secondary-surface` | Secondary background |
| `--theme-button-secondary-surface-hover` | Secondary background hover |
| `--theme-button-secondary-surface-active` | Secondary background active |
| `--theme-button-secondary-border` | Secondary border |
| `--theme-button-secondary-border-active` | Secondary border active |
| `--theme-button-secondary-outline` | Secondary outline |
| `--theme-button-secondary-outline-active` | Secondary outline active |
| `--theme-button-secondary-text` | Secondary text |
| `--theme-button-secondary-text-hover` | Secondary text hover |
| `--theme-button-tertiary-surface` | Tertiary background |
| `--theme-button-tertiary-text` | Tertiary text |
| `--theme-button-tertiary-border-active` | Tertiary border active |
| `--theme-button-tertiary-outline-active` | Tertiary outline active |

### Checkboxes & radio buttons

| Token | Controls |
|---|---|
| `--theme-checkbox-symbol-color` | Tick/dot colour |
| `--theme-checkbox-symbol-surface` | Checkbox background |
| `--theme-checkbox-decorator-color` | Border/decorator colour |
| `--theme-checkbox-label-text-color` | Label text colour |

### Toggle switch

| Token | Controls |
|---|---|
| `--theme-toggle-symbol-color-default` | Toggle knob colour (off) |
| `--theme-toggle-symbol-color-checked` | Toggle knob colour (on) |

### Glass panel

| Token | Controls |
|---|---|
| `--glass-panel-bg` | Panel background (rgba) |
| `--glass-panel-border-color` | Panel border (rgba) |
| `--glass-panel-shadow` | Panel drop shadow |
| `--glass-panel-highlight` | Panel highlight overlay (rgba) |

### StepperList

| Token | Controls |
|---|---|
| `--stepper-list-counter-circle-background` | Circle counter background |
| `--stepper-list-counter-circle-text` | Circle counter text |
| `--stepper-list-counter-circle-border` | Circle counter border |
| `--stepper-list-counter-disc-background` | Disc counter background |
| `--stepper-list-counter-disc-text` | Disc counter text |
| `--stepper-list-counter-disc-border` | Disc counter border |
| `--stepper-list-counter-square-background` | Square counter background |
| `--stepper-list-counter-square-text` | Square counter text |
| `--stepper-list-counter-square-border` | Square counter border |
| `--stepper-list-connector-color` | Line connecting steps |
| `--stepper-list-icon` | Icon colour |

---

## What cannot be customised

Behavioural CSS — `display`, `flex-direction`, `overflow`, `position`, `grid-template-*` — is intentionally not exposed as tokens. These define how a component functions, not how it looks.
