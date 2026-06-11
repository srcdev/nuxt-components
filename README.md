# SRCDEV Nuxt Components

[![Tests](https://github.com/srcdev/nuxt-components/workflows/Tests/badge.svg)](https://github.com/srcdev/nuxt-components/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/srcdev-nuxt-components.svg)](https://badge.fury.io/js/srcdev-nuxt-components)
[![License](https://img.shields.io/github/license/srcdev/nuxt-components.svg)](https://github.com/srcdev/nuxt-components/blob/main/LICENSE)

## NOTE

Althought this repo is public and feel free to do what you wish with it, this has been developed for use with websites we develop.

## Install Nuxt Components layer

```bash
npm install --save srcdev-nuxt-components
```

```ts
defineNuxtConfig({
  extends: "srcdev-nuxt-components",
  css: ["srcdev-nuxt-components/app/assets/styles/main.css", "./app/assets/styles/main.css"],
});
```

> **Note**: The layer CSS is not automatically included when installed from `node_modules`. You must explicitly add it to the `css` array as shown above. The second entry (`./app/assets/styles/main.css`) is your app's own stylesheet for overrides — create it if it doesn't exist.

## Claude Code Skills

This package ships Claude Code skills — reference docs for components and development tasks — in the `.claude/` directory.

To make them available in your project, add this script to your `package.json`:

```json
"setup:claude": "cp -r node_modules/srcdev-nuxt-components/.claude/skills .claude/skills/srcdev-nuxt-components"
```

Then run it after install:

```bash
npm run setup:claude
```

Skills are copied into `.claude/skills/srcdev-nuxt-components/` so they never conflict with or overwrite skills your own project defines. Re-running the script after a package update is safe.

### Automate with postinstall (recommended)

To ensure skills are always up to date and `nuxt prepare` is never forgotten, combine both into a `postinstall` script. npm runs this automatically after every `npm install`:

```json
"scripts": {
  "setup:claude": "cp -r node_modules/srcdev-nuxt-components/.claude/skills .claude/skills/srcdev-nuxt-components",
  "postinstall": "nuxt prepare && npm run setup:claude"
}
```

> If your app uses a standalone env flag for `nuxt prepare` (e.g. `NUXT_STANDALONE=true`), include it in the `postinstall` command. This is project-specific — check your own `nuxt.config.ts` to confirm whether it is needed.

---

## Scaffolding a New App

A Claude Code skill is included to scaffold a new Nuxt consumer app from scratch. It generates
`package.json`, `nuxt.config.ts`, ESLint/Prettier config, the full `app/` directory structure,
and a `CLAUDE.md` — all pre-wired to extend this layer correctly.

**Trigger it by saying to Claude Code:**

> "Scaffold a new layer consumer app. Repo: `/path/to/repo`, name: `my-app`, domain: `myapp.co.uk`, fonts: `Fraunces, Manrope`."

The skill is available at `.claude/skills/new-app-scaffold.md` once copied into your project
via `npm run setup:claude`.

---

## Consumer App Configuration

Configuration options for apps extending this layer. All options go in the consumer's `nuxt.config.ts` under `runtimeConfig.public` and can also be set via environment variable.

### Colour Scheme

The layer ships with light/dark/auto colour scheme support. This includes a synchronous `<head>` script (FOUC prevention) and the `useColourScheme()` composable.

Consumer apps that only use a single default scheme can disable it entirely:

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    colourScheme: {
      enabled: false, // disables head script injection and composable side effects
    },
  },
},
```

Or via environment variable:

```bash
NUXT_PUBLIC_COLOUR_SCHEME_ENABLED=false
```

When disabled, no `data-color-scheme` attribute is set on `<html>` and `useColourScheme()` is a no-op. The default is `true`.

> See [.claude/skills/colour-scheme-disable.md](.claude/skills/colour-scheme-disable.md) for the full guide.

---

## Colour System

The layer ships a parametric oklch colour ramp. Two CSS custom properties — `--theme-hue` and
`--theme-chroma` — drive an 11-step colour scale (`--colour-theme-0` to `--colour-theme-10`) that
all themed components (buttons, inputs, prompts, toasts) read through a shared set of semantic
slots. Switching the palette is a two-variable change; no token-by-token remapping is required.

### How it works

A formula declared on every potential theme host (`html`, `[data-theme]`, `[data-invalid]`)
computes the scale from the two params:

```css
--colour-theme-6: oklch(56% calc(var(--theme-chroma) * 1.00) var(--theme-hue)); /* peak chroma */
--colour-theme-0: oklch(98% calc(var(--theme-chroma) * 0.045) var(--theme-hue)); /* near-white */
--colour-theme-10: oklch(25% calc(var(--theme-chroma) * 0.64) var(--theme-hue)); /* near-black */
```

Scale direction: **00 = lightest, 10 = darkest**. Chroma tapers at both ends and peaks at step 06.

Eight semantic slots (`--theme-surface`, `--theme-text`, `--theme-ring`, etc.) are derived from the
scale using `light-dark()` and are shared by all components. Theme variants (`data-theme="success"`,
`"warning"`, `"error"`) swap `--theme-hue` and `--theme-chroma` on their element; the formula
re-evaluates locally so each themed element gets its own full palette without affecting the page.

### Built-in named palettes

| Name   | Hue | Used for                                          |
|--------|-----|---------------------------------------------------|
| blue   | 255 | Default (page-level)                              |
| red    | 30  | Error / `data-theme="error"`                      |
| green  | 157 | Success / `data-theme="success"`                  |
| amber  | 75  | Available for consumer use                        |
| orange | 60  | Available for consumer use                        |
| sunset | 50  | Warning / `data-theme="warning"` (with hue drift) |
| slate  | 260 | Near-neutral grey                                 |

### Consumer app: generating a custom palette

The recommended approach for a consuming app is to generate your own named colour files. This gives
you clean step variables (`--gold-09`, `--gold-04`) rather than raw oklch values in your theme
overrides.

#### 1. Create `ramps.config.mjs` in your project root

Define the palettes you want. You can add new ones, reuse a built-in name to override the
layer's values, or do both. Consumer CSS loads after the layer, so your generated files win
the cascade automatically:

```js
// ramps.config.mjs
export const ramps = {
  // New palette — adds --gold-00..10 and --palette-gold-* vars
  gold: { hue: 85, chroma: 0.20 },

  // Override a built-in — replaces the layer's --blue-00..10 with your values
  // blue: { hue: 240, chroma: 0.18 },

  // Override the error palette — all error/invalid states use your red
  // red: { hue: 15, chroma: 0.26 },

  // Optional — add hue drift to rotate colour across the scale:
  // copper: { hue: 45, chroma: 0.21, drift: -15 },
};
```

#### 2. Add the generator script to `package.json`

The script lives in the layer's `node_modules` — no copying required. Prepending it to `dev`,
`build`, and `generate` prevents generated CSS from drifting out of sync with `ramps.config.mjs`:

```json
"scripts": {
  "generate:ramps": "node node_modules/srcdev-nuxt-components/scripts/generate-consumer-ramps.mjs",
  "dev":      "npm run generate:ramps && nuxt dev",
  "build":    "npm run generate:ramps && nuxt build",
  "generate": "npm run generate:ramps && nuxt generate"
}
```

> **Do not manually edit generated files.** They carry a `/* GENERATED */` comment at the top
> and are rebuilt every time the generator runs. Put all changes in `ramps.config.mjs` instead.

#### 3. Run it

```bash
npm run generate:ramps
```

Produces in `app/assets/styles/setup/02.colours/`:

- `_gold.css` — `--gold-00` … `--gold-10` (literal oklch values)
- `_palette-params.css` — `--palette-gold-hue`, `--palette-gold-chroma`

#### 4. Import the generated files

In your `app/assets/styles/setup/02.colours/index.css` (create if it doesn't exist):

```css
@import "./_palette-params";
@import "./_gold";
```

#### 5. Set the palette as your theme default

```css
/* app/assets/styles/setup/03.theming/_default.css */
:where(html) {
  --theme-hue:    var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);

  /* Page-level tokens — readable named steps, not raw oklch */
  --colour-text-accent:  light-dark(var(--gold-09), var(--gold-04));
  --colour-text-eyebrow: light-dark(var(--gold-09), var(--gold-04));
}
```

#### 6. Wire up in your setup index

```css
/* app/assets/styles/setup/index.css */
@import "./02.colours/";
@import "./03.theming/_default.css";
```

And in `app/assets/styles/main.css`:

```css
@import "./setup/";
```

### Hue quick reference

| Range   | Colour         |
|---------|----------------|
| 0–30    | Red / pink     |
| 30–70   | Orange / amber |
| 70–100  | Yellow / gold  |
| 100–160 | Green          |
| 220–270 | Blue           |
| 270–310 | Violet         |

Use [oklch.com](https://oklch.com) to preview values before committing.

### Generator (for library contributors)

Named palettes in the layer itself are maintained in `ramps.config.mjs` at the repo root:

```bash
npm run generate:ramps   # rebuild all layer CSS from ramps.config.mjs
npm run check:ramps      # CI: fail if generated CSS is out of date
```

### Further reading

| Guide | Location |
|-------|----------|
| Full ramp architecture, formula details, hue drift | `.claude/skills/theming-colour-ramps.md` |
| Full palette swap for a consumer app | `.claude/skills/theming-override-default.md` |
| Partial token override (palette shift, buttons, inputs) | `.claude/skills/theming-partial-override.md` |
| Disable light/dark mode support | `.claude/skills/colour-scheme-disable.md` |

Skills are available in your project after running `npm run setup:claude`.

---

## Known Build / Production Issues

### `ERR_MODULE_NOT_FOUND: vue/index.mjs` — 500 on every request (Node 22)

**Symptom**: After `npm run build`, running `node .output/server/index.mjs` returns HTTP 500 on every page. The terminal shows:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  '.output/server/node_modules/vue/index.mjs'
Did you mean to import
  '.output/server/node_modules/.nitro/vue@3.5.34/dist/vue.cjs.prod.js'?
```

**Root cause**: Nitro's dependency tracer externalises `vue` and copies it to `.output/server/node_modules/vue/`, but only traces the CJS build (`dist/vue.cjs.prod.js`). Vue's `package.json` exports map resolves the `"import"` + `"node"` condition (used by Node 22 when importing from an ES module) to `./index.mjs` — a file that was never copied. This is a Nitro tracing bug exposed by Node 22's stricter ESM condition matching, made more likely by `vue.runtimeCompiler: true` (which changes how Nuxt aliases Vue at build time, causing Nitro to fall back to externalising it as a node_modules package).

**Fix** (already applied in this repo's `nuxt.config.ts`):

```ts
nitro: {
  externals: {
    inline: ["vue", "@vue/runtime-core", "@vue/runtime-dom", "@vue/reactivity", "@vue/shared", "@vue/server-renderer"],
  },
},
```

This tells Nitro to bundle these packages inline rather than externalise them, which sidesteps the runtime resolution entirely.

**Consumer apps**: This config is not gated behind `isStandalone`, so it is inherited automatically by any app that extends this layer. No consumer-side action is required.

**When it's safe to remove**: If a future Nitro release fixes the dependency tracer so that all export-condition files are copied correctly, the `inline` list can be removed. Verify by checking that `.output/server/node_modules/vue/index.mjs` exists after a clean build without the config.

---

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

## Contact Form — Resend Setup

The contact form at `/ui/contact-section` sends enquiries via [Resend](https://resend.com).
No extra packages are required — the server route calls the Resend REST API directly.

### 1. Create a Resend account

Sign up at [resend.com](https://resend.com). The free tier allows 3,000 emails/month (100/day),
which is more than sufficient for a contact form.

### 2. Verify a sending domain

In the Resend dashboard go to **Domains → Add Domain** and follow the DNS instructions for your
domain. This is required before you can send from a custom `from` address in production.

> **Local development shortcut:** you can skip domain verification and use Resend's shared sandbox
> address `onboarding@resend.dev` as the `from` address. Emails will only be delivered to the
> email address registered on your Resend account, so it is safe for testing.

### 3. Create an API key

In the Resend dashboard go to **API Keys → Create API Key**. Copy the key — it is only shown once.

### 4. Configure environment variables

Copy `.env.example` to `.env` and fill in the three values:

```bash
cp .env.example .env
```

```env
NUXT_RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NUXT_CONTACT_EMAIL_TO=you@yourdomain.com
NUXT_CONTACT_EMAIL_FROM=Enquiries <hello@yourdomain.com>
```

| Variable                  | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| `NUXT_RESEND_API_KEY`     | API key from the Resend dashboard                                          |
| `NUXT_CONTACT_EMAIL_TO`   | The inbox that receives enquiries                                          |
| `NUXT_CONTACT_EMAIL_FROM` | The "from" address shown to recipients — must use a verified Resend domain |

Nuxt maps `NUXT_*` variables to `runtimeConfig` automatically at runtime. The values are
**server-only** and never included in the client bundle.

### 5. Vercel deployment

Rather than committing a `.env` file, add the variables directly in the Vercel dashboard:

1. Open your project in [vercel.com](https://vercel.com)
2. Go to **Settings → Environment Variables**
3. Add each of the three `NUXT_*` variables, setting the environment to **Production**
   (and **Preview** if you want the form to work on preview deployments too)
4. Redeploy — Vercel injects the variables at build and runtime automatically

> `.env` is listed in `.gitignore` and should never be committed to the repository.

---

## Testing

This project has two test layers that run independently.

---

### Unit & Snapshot Tests (Vitest)

Runs component logic, HTML structure, and snapshot regression tests. No browser or running server required.

```bash
# Run in watch mode (development)
npm run test

# Run once (CI / pre-commit)
npm run test:run

# Open the Vitest UI (browser-based test explorer)
npm run test:ui

# Update snapshots after an intentional component change
npm run test:update
```

---

### Visual Regression Tests (Playwright)

Runs pixel-level screenshot comparisons against Storybook. Requires Storybook to be running first.

```bash
# 1. Start Storybook
npm run storybook:serve

# 2. In a separate terminal, run visual tests
npm run playwright

# Update visual baselines after an intentional visual change
npm run playwright:update

# View Playwright test report
npx playwright show-report
```

> Visual tests run across Chromium, Firefox, and WebKit. Snapshot baselines are stored per browser — expect three PNG files per component test.

---

### What Each Layer Catches

| Change                                | Unit tests | Visual tests |
| ------------------------------------- | ---------- | ------------ |
| Class added / removed                 | ✅         | ✅           |
| HTML structure changed                | ✅         | ✅           |
| Font weight / color / spacing changed | ❌         | ✅           |
| Prop or slot logic broken             | ✅         | ❌           |
| Accessibility attribute missing       | ✅         | ❌           |

---

## Storybook

Storybook is used for isolated component development and as the target for visual regression tests. It runs as a separate Vite-based dev server.

### Scripts

```bash
# Start Storybook dev server (http://localhost:6006)
npm run storybook

# Build a static Storybook (outputs to storybook-static/)
npm run storybook:build

# Build and serve locally — used before running Playwright visual tests
npm run storybook:serve

# Clear Storybook and Vite caches — run this if styles appear stale after changes
npm run storybook:cache:clean
```

> After clearing the cache, restart with `npm run storybook`. The cache clear is particularly
> useful when changes inside `@layer` CSS blocks are not reflected in the running dev server.

### Fonts

`@nuxt/fonts` is disabled in Storybook (detected via `process.env.STORYBOOK` in `nuxt.config.ts`).
Fonts are served instead from local files in `.storybook/public/_fonts/`, declared in `.storybook/fonts.css` and imported in `.storybook/preview.ts`.

| Font             | Format | Source                                       |
| ---------------- | ------ | -------------------------------------------- |
| Poppins          | TTF    | `.storybook/public/_fonts/poppins/`          |
| Playfair Display | woff2  | `.storybook/public/_fonts/playfair-display/` |

To add a new font, see [.claude/skills/storybook-add-font.md](.claude/skills/storybook-add-font.md).

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
