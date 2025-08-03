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

## Development Environment (`.vscode`)

The `.vscode` directory contains Visual Studio Code configuration files to ensure a consistent development experience across the project:

### Workspace Configuration

- **`settings.json`** - VS Code workspace settings including:
  - Code formatting configuration (2-space indentation, auto-formatting on save)
  - ESLint, Prettier, and Stylelint integration
  - File handling settings (trim whitespace, final newlines, Unix line endings)
  - CSS variable recognition for the project's custom properties

### Recommended Extensions

- **`extensions.json`** - Curated list of VS Code extensions for optimal development:
  - **Vue.js Development**: `vue.volar` - Vue 3 language support
  - **Nuxt.js Development**: `nuxtr.nuxtr-vscode` - Enhanced Nuxt development tools
  - **Code Quality**: `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode` - Linting and formatting
  - **CSS Development**: `willofindie.vscode-cssvar` - CSS custom property IntelliSense
  - **Testing**: `vitest.explorer` - Vitest test runner integration
  - **Markdown**: `davidanson.vscode-markdownlint` - Markdown linting
  - **Productivity**: `jkjustjoshing.vscode-text-pastry`, `formulahendry.auto-rename-tag`

### Code Snippets

The `.vscode` directory includes comprehensive code snippets for rapid component development:

#### Core Components

- **`srcdev-nuxt3-component-boilerplate.code-snippets`** - Base component template with prop validation
- **`srcdev-nuxt3-page-layout.code-snippets`** - Page layout scaffolding
- **`srcdev-nuxt3-pinia-store-setup.code-snippets`** - Pinia store configuration

#### UI Components

- **`srcdev-nuxt3-accordian-component.code-snippets`** - Accordion component templates
- **`srcdev-nuxt3-carousel-basic-component.code-snippets`** - Basic carousel implementation
- **`srcdev-nuxt3-carousel-flip-component.code-snippets`** - Flip carousel variant
- **`srcdev-nuxt3-container-glow-component.code-snippets`** - Container with glow effects
- **`srcdev-nuxt3-dialog-component.code-snippets`** - Modal dialog templates
- **`srcdev-nuxt3-display-banner-component.code-snippets`** - Display banner component
- **`srcdev-nuxt3-display-details-component.code-snippets`** - Collapsible details component
- **`srcdev-nuxt3-display-prompt-component.code-snippets`** - Alert/notification prompts
- **`srcdev-nuxt3-expanding-panel-component.code-snippets`** - Expandable panel component
- **`srcdev-nuxt3-layout-row.code-snippets`** - Layout row component
- **`srcdev-nuxt3-responsive-header-component.code-snippets`** - Responsive navigation header
- **`srcdev-nuxt3-tabs-component.code-snippets`** - Tab component system

Each snippet provides both HTML template usage examples and TypeScript setup code, enabling developers to quickly implement components with proper typing and configuration.
