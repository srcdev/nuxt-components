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

## Known Dev Server Warnings

### `[request error] [GET] http://localhost:3000/_nuxt/` (404)

This error appears in the terminal when running `npm run dev` and is **harmless** — it does not affect dev server operation.

**Cause**: The Vue/Nuxt browser DevTools extension probes `/_nuxt/` to detect if the page is a Nuxt app. Since `/_nuxt/` is a directory (not a file), the server returns 404 and logs it.

**Resolution**: It cannot be suppressed without disabling the browser extension. Since the DevTools extension is useful for inspecting Pinia stores and component state, the recommended approach is to ignore this warning.

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
