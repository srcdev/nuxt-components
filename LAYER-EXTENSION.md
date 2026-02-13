/_ ===========================================
LAYER EXTENSION DOCUMENTATION
How to properly extend this Nuxt layer
=========================================== _/

/\*

# EXTENDING THIS LAYER

## 1. Installation in Your Nuxt App

```bash
# Add as layer dependency
npm install your-component-layer
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["your-component-layer"],
});
```

## 2. Override Styles Structure

Create this structure in your consuming app:

```
your-app/
├── assets/
│   └── styles/
│       ├── main.css
│       └── overrides/
│           ├── tokens.css      # Design system tokens
│           ├── themes.css      # Custom themes
│           ├── components.css  # Component overrides
│           └── utilities.css   # Additional utilities
```

## 3. Main CSS Import Order

```css
/* your-app/assets/styles/main.css */

/* Layer styles (automatic) */
/* Your overrides */
@import "./overrides/tokens.css";
@import "./overrides/themes.css";
@import "./overrides/components.css";
@import "./overrides/utilities.css";
```

## 4. Essential Overrides

### A. Brand Tokens (tokens.css)

```css
:root {
  /* Colors */
  --brand-primary: your-primary-color;
  --brand-secondary: your-secondary-color;

  /* Typography */
  --font-family-primary: your-font-stack;
  --font-family-secondary: your-font-stack;

  /* Spacing adjustments */
  --space-base: 1rem; /* if different from default */

  /* Shadows */
  --shadow-brand: your-custom-shadow;
}
```

### B. Custom Themes (themes.css)

```css
[data-theme="your-brand"] {
  --colour-theme-1: your-color-1;
  --colour-theme-2: your-color-2;
  /* ...continue pattern */
}
```

### C. Component Overrides (components.css)

```css
/* Override specific components */
.input-button-core[data-theme="your-brand"] {
  /* Your customizations */
}

/* Or create new variants */
.your-custom-button {
  /* Your styles */
}
```

## 5. Adding New Themes

Follow the established pattern:

1. Create color scale (12 steps)
2. Define component variables
3. Test accessibility
4. Document usage

## 6. Best Practices

- Always test in both light/dark modes
- Maintain accessibility standards (WCAG AA minimum)
- Use CSS custom properties for all themeable values
- Follow the established naming conventions
- Test component isolation

## 7. Breaking Change Prevention

- Never modify core layer files directly
- Always use overrides
- Test upgrades in isolated environment
- Document any workarounds needed

\*/
