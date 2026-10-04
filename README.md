# SRCDEV Nuxt Components

[![Tests](https://github.com/srcdev/nuxt-components/workflows/Tests/badge.svg)](https://github.com/srcdev/nuxt-components/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/srcdev-nuxt-components.svg)](https://badge.fury.io/js/srcdev-nuxt-components)
[![License](https://img.shields.io/github/license/srcdev/nuxt-components.svg)](https://github.com/srcdev/nuxt-components/blob/main/LICENSE)

## NOTE

Although this repo is public and feel free to do what you wish with it, this has been developed for use with websites we develop.

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

To ensure skills are always up to date, VSCode snippets are installed, and `nuxt prepare` is never forgotten, add a `postinstall` script. npm runs this automatically after every `npm install`:

```json
"scripts": {
  "setup:claude": "mkdir -p .claude/skills/srcdev-nuxt-components && cp -r node_modules/srcdev-nuxt-components/.claude/skills/. .claude/skills/srcdev-nuxt-components",
  "postinstall": "node node_modules/srcdev-nuxt-components/scripts/copy-snippets.mjs && nuxt prepare && npm run setup:claude"
}
```

**What this does:**

1. `copy-snippets.mjs` — copies VSCode snippets (`.code-snippets` files) from the layer to your `.vscode/` folder
2. `nuxt prepare` — generates Nuxt type declarations
3. `setup:claude` — copies skills into `.claude/skills/srcdev-nuxt-components/`

> **Note**: The snippet copy must run from your consumer app's postinstall, not the layer's. npm doesn't invoke postinstall hooks for dependencies, so each consumer app is responsible for copying snippets into its own `.vscode/` folder. Don't set `SRCDEV_STANDALONE` in a consumer app: that flag is only for running this layer on its own (it enables dev-only modules and the ramp watcher).

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

## Components

Components live in `app/components/`, grouped into tiers:

| Folder         | Storybook title prefix |
| -------------- | ---------------------- |
| `01.atoms`     | `Atoms/`               |
| `02.molecules` | `Molecules/`           |
| `03.organisms` | `Organisms/`           |
| `04.templates` | `Templates/`           |
| `05.forms`     | `Forms/`               |

Components are auto-imported with `pathPrefix: false`, so the tier folder never appears in the tag name.

**Naming**: a bare form control is `<Name>` (e.g. `InputNumber`) and its labelled wrapper is `<Name>Field` (e.g. `InputNumberField`). Older `Core` / `Default` / `WithLabel` suffixes are being renamed to this convention; see `.claude/skills/component-naming.md` for the backlog.

Each component ships with:

- **`CONSUMER-STYLING.md`** next to the `.vue` file, listing its public CSS custom properties and how to override them
- **a Storybook story**, the only place components are demonstrated (this repo has no demo pages)
- **a skill doc** in `.claude/skills/components/`, copied into your app by `npm run setup:claude`
- **a VS Code snippet** in `.vscode/srcdev-component-{name}.code-snippets`, copied into your app by `postinstall`

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

### Analytics

Call `useAnalytics()` from a layout, page or component and use `trackEvent(name, params)` to fire events. Only Google Analytics (GA4) is implemented today; call sites never name the provider, so adding another later won't change them.

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    analytics: {
      provider: "google-analytics",
      googleAnalytics: { id: "G-XXXXXXXXXX" },
    },
  },
},
```

Or via environment variable:

```bash
NUXT_PUBLIC_ANALYTICS_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

With no ID set, `trackEvent` does nothing.

### WhatsApp

`useWhatsApp().openWhatsApp(fields)` opens a WhatsApp chat pre-filled with the given label/value pairs. Set the number in international format, without `+` or spaces:

```bash
NUXT_PUBLIC_WHATSAPP_NUMBER=447700900000
```

Without a number it logs a warning and does nothing.

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
--colour-theme-6: oklch(56% calc(var(--theme-chroma) * 1) var(--theme-hue)); /* peak chroma */
--colour-theme-0: oklch(98% calc(var(--theme-chroma) * 0.045) var(--theme-hue)); /* near-white */
--colour-theme-10: oklch(25% calc(var(--theme-chroma) * 0.64) var(--theme-hue)); /* near-black */
```

Scale direction: **00 = lightest, 10 = darkest**. Chroma tapers at both ends and peaks at step 06.

Nine semantic slots (`--theme-surface`, `--theme-accent`, `--theme-text`, `--theme-ring`, etc.) are derived from the
scale and are shared by all components. They ship light values only (no `light-dark()`, which older iPad
Safari lacks); dark mode is left to the consuming app, see `.claude/skills/theming-dark-mode.md`. Theme variants (`data-theme="success"`,
`"warning"`, `"error"`) swap `--theme-hue` and `--theme-chroma` on their element; the formula
re-evaluates locally so each themed element gets its own full palette without affecting the page.

### Built-in named palettes

| Name   | Hue | Used for                                          |
| ------ | --- | ------------------------------------------------- |
| blue   | 255 | Default (page-level)                              |
| red    | 30  | Error / `data-theme="error"`                      |
| green  | 157 | Success / `data-theme="success"`                  |
| amber  | 75  | Available for consumer use                        |
| orange | 55  | Warning / `data-theme="warning"`                  |
| sunset | 50  | Available for consumer use (with hue drift)       |
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
  gold: { hue: 85, chroma: 0.2 },

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
  --theme-hue: var(--palette-gold-hue);
  --theme-chroma: var(--palette-gold-chroma);

  /* Page-level tokens — readable named steps, not raw oklch */
  --colour-text-accent: var(--gold-09);
  --colour-text-eyebrow: var(--gold-09);
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
| ------- | -------------- |
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

| Guide                                                   | Location                                     |
| ------------------------------------------------------- | -------------------------------------------- |
| Full ramp architecture, formula details, hue drift      | `.claude/skills/theming-colour-ramps.md`     |
| Full palette swap for a consumer app                    | `.claude/skills/theming-override-default.md` |
| Partial token override (palette shift, buttons, inputs) | `.claude/skills/theming-partial-override.md` |
| Add a dark scheme (layer ships light values only)       | `.claude/skills/theming-dark-mode.md`        |
| Disable light/dark mode support                         | `.claude/skills/colour-scheme-disable.md`    |

Skills are available in your project after running `npm run setup:claude`.

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
  - **Productivity**: `jkjustjoshing.vscode-text-pastry`, `formulahendry.auto-rename-tag`, `nixon.env-cmd-file-syntax`
  - **AI-assisted development**: `anthropic.claude-code`

### Code Snippets

Every component ships a matching `.vscode/srcdev-component-{name}.code-snippets` file — one per
component, kept up to date as part of this project's component migration workflow (see
`CLAUDE.md`). Consumer apps get all of them copied into their own `.vscode/` folder automatically
via the `postinstall` setup described above; there's nothing to configure manually.

## Contact Form — Resend Setup

The `ContactSection` component (see it in Storybook under **Molecules/ContactSection**) sends enquiries via [Resend](https://resend.com).
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

Runs pixel-level screenshot comparisons against Storybook. Requires Storybook to be running first. Coverage is currently limited to a few components (`InputButton`, `HeroText`, `EyebrowText`, `ContentDocs`); specs live in each component's `playwright/` folder as `*.playwright.ts`.

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

Storybook (v10, via `@nuxtjs/storybook`) is the only demo surface for this library, and the target for visual regression tests. The deployed build is at [storybook.srcdev.co.uk](https://storybook.srcdev.co.uk).

### Scripts

```bash
# Start Storybook dev server (http://localhost:6006). `npm run dev` does the same after
# regenerating the colour ramps; there is no `nuxt dev` entry point.
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

### MCP server for AI agents

`@storybook/addon-mcp` exposes the stories over MCP while the dev server is running, so a coding agent can look up components, their props and story examples instead of guessing. The endpoint is `http://localhost:6006/mcp`. To connect Claude Code:

```bash
claude mcp add --transport http storybook http://localhost:6006/mcp
```

See the [Storybook MCP docs](https://storybook.js.org/docs/next/ai/mcp/overview) for other clients.

### Fonts

`@nuxt/fonts` is disabled in Storybook (detected via `process.env.STORYBOOK` in `nuxt.config.ts`).
Fonts are served instead from local files in `.storybook/public/_fonts/`, declared in `.storybook/fonts.css` and imported in `.storybook/preview.ts`.

| Font             | Format | Source                                       |
| ---------------- | ------ | -------------------------------------------- |
| Poppins          | TTF    | `.storybook/public/_fonts/poppins/`          |
| Playfair Display | woff2  | `.storybook/public/_fonts/playfair-display/` |
| Mono MMM 5       | TTF    | `public/fonts/`                              |

To add a new font, see [.claude/skills/storybook-add-font.md](.claude/skills/storybook-add-font.md).
