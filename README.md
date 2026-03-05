# SRCDEV Nuxt Components

[![Tests](https://github.com/srcdev/nuxt-components/workflows/Tests/badge.svg)](https://github.com/srcdev/nuxt-components/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/srcdev-nuxt-components.svg)](https://badge.fury.io/js/srcdev-nuxt-components)
[![License](https://img.shields.io/github/license/srcdev/nuxt-components.svg)](https://github.com/srcdev/nuxt-components/blob/main/LICENSE)

## NOTE

Althought this repo is public and feel free to do what you wish with it, this has been developed for use with websites we develop.

## Install Nuxt Forms layer

```bash
npm install --save srcdev-nuxt-components
```

```ts
defineNuxtConfig({
  extends: "srcdev-nuxt-components",
});
```

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

| Variable | Description |
| --- | --- |
| `NUXT_RESEND_API_KEY` | API key from the Resend dashboard |
| `NUXT_CONTACT_EMAIL_TO` | The inbox that receives enquiries |
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
npm run storybook-run-build

# 2. In a separate terminal, run visual tests
npx playwright test

# Update visual baselines after an intentional visual change
npx playwright test --update-snapshots

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
