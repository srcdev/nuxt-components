# SRCDEV Nuxt Components

## NOTE

Althought this repo is public and feel free to do what you wish with it, this has been developed for use with websites we develop.

## Install Nuxt Forms layer

```bash
npm install --save nuxt-compnents
```

## Additional reuired packages

```bash
npm install --save @oddbird/css-anchor-positioning
```

Then add the dependency to their `extends` in `nuxt.config`:

```ts
defineNuxtConfig({
  extends: 'nuxt-compnents',
});
```

## Styles Architecture

The `/assets/styles` directory contains a modular CSS architecture designed for scalability and maintainability. The styles are organized into the following structure:

### Main Entry Point

- **`main.css`** - Primary entry point that imports all style modules

### Setup Layer (`/setup`)

The setup layer provides the foundational styles and utilities:

#### Core Configuration

- **`_head.css`** - Root-level CSS custom properties including:
  - Font size and line height defaults
  - Primary font family stack (futura-pt, Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif)

#### Variables (`/variables`)

- **Color System** - Comprehensive color palette with semantic naming:
  - `_blue.css` - Blue color scale (--blue-0 to --blue-12)
  - `_gray.css` - Gray color scale
  - `_green.css` - Green color scale
  - `_orange.css` - Orange color scale
  - `_red.css` - Red color scale
  - `_yellow.css` - Yellow color scale

#### Typography (`/typography`)

- **Responsive Font Sizes** - Fluid typography using clamp() functions:
  - `--step-5` to `--step--2` providing 8 responsive font size steps
- **Utility Classes** - Pre-built typography classes:
  - `.heading-1` through `.heading-5` - Semantic heading styles
  - Generic font weight and variation settings
- **Font Variation Settings** - Advanced typography controls

#### Utility Classes (`/utility-classes`)

- **Spacing Helpers**:
  - `_margin-helpers.css` - Comprehensive margin utilities (`.mi-auto`, `.mb-0`, etc.)
  - `_padding-helpers.css` - Padding utility classes
- **Page Layout** - Base page styling (`_page.css`)

#### Accessibility (`/a11y`)

- **Screen Reader Utilities** - `.sr-only` class for accessible hidden content
- **A11y Variables** - Accessibility-focused CSS custom properties
- **Utility Functions** - Helper classes for improved accessibility

### Component Layer (`/extends-layer/srcdev-components`)

Component-specific styles for the included components:

#### Display Prompt Component

- **`_scaffolding.css`** - Core component structure with CSS custom properties:
  - Wrapper styling (border-radius, layout)
  - Inner content styling (margin, padding, gap)
  - Icon sizing and positioning
  - Content spacing and typography
- **Themes** - Pre-built component variants:
  - `_error.css` - Error state styling
  - `_info.css` - Information state styling
  - `_success.css` - Success state styling
  - `_warning.css` - Warning state styling

### Import Structure

The styles follow a cascading import pattern:

```text
main.css
├── setup/
│   ├── utility-classes/
│   ├── a11y/
│   ├── variables/
│   ├── typography/
│   └── _head.css
└── extends-layer/srcdev-components/
    └── display-prompt-core/
```

This architecture ensures proper CSS cascade order and allows for easy customization through CSS custom properties.
