# New App Scaffold

## Overview

Scaffold a new Nuxt app that extends `srcdev-nuxt-components` as a layer. Use this skill when
a user asks to initialise or set up a new consumer app from scratch.

## Prerequisites

- An empty (or near-empty) git repo exists at the target path
- The user provides: repo path, package name, production domain, fonts, and whether to include
  `nuxt-security` + `@nuxtjs/robots`

## Steps

### 1. Gather details

Ask for (or confirm from context):

| Detail | Example |
|---|---|
| Repo path | `/Users/name/websites/my-app` |
| Package name | `my-app` (used in `package.json` and `bodyAttrs.class`) |
| Production domain | `myapp.co.uk` |
| Fonts | `Fraunces, Manrope` — assume bunny CDN unless stated otherwise |
| Include security modules? | yes / no (nuxt-security + @nuxtjs/robots) |

Check for any existing files (`.claude/`, `README.md`, design docs) before writing — read them
to inform the CLAUDE.md and CSS tokens.

### 2. Create `package.json`

```json
{
  "name": "{name}",
  "private": true,
  "type": "module",
  "scripts": {
    "clean": "rm -rf .nuxt && rm -rf .output && rm -rf node_modules && rm ./package-lock.json",
    "cleanupandprepare": "npx nuxi cleanup && npx nuxi prepare",
    "reinstall": "npm install",
    "cleaninstall": "npm run clean && npm run reinstall",
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "setup:claude": "mkdir -p .claude/skills/srcdev-nuxt-components && cp -r node_modules/srcdev-nuxt-components/.claude/skills/. .claude/skills/srcdev-nuxt-components",
    "postinstall": "NUXT_STANDALONE=true nuxt prepare && npm run setup:claude",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@iconify-json/gravity-ui": "1.2.12",
    "@iconify-json/ic": "1.2.4",
    "@iconify-json/lucide": "1.2.101",
    "@iconify-json/material-symbols": "1.2.65",
    "@iconify-json/mdi": "1.2.3",
    "modern-normalize": "3.0.1",
    "nuxt-security": "2.5.1"
  },
  "devDependencies": {
    "@nuxt/eslint": "1.15.2",
    "@nuxt/scripts": "0.13.2",
    "@nuxtjs/robots": "6.0.6",
    "eslint": "10.2.0",
    "nuxt": "4.4.2",
    "srcdev-nuxt-components": "{latest version}"
  }
}
```

> **`setup:claude` script**: `mkdir -p` is required — the destination folder won't exist on a
> fresh clone. The trailing `/.` on the source path copies contents into the destination rather
> than nesting a `skills` subfolder inside it.

### 3. Create `nuxt.config.ts`

```ts
const PROD_HOST = "{domain}"
const canonicalHost = process.env.NUXT_PUBLIC_CANONICAL_HOST ?? "{name}.vercel.app"
const isProduction = canonicalHost === PROD_HOST

export default defineNuxtConfig({
  debug: false,
  devServer: { https: false },
  compatibilityDate: "2025-08-04",
  runtimeConfig: {
    public: {
      canonicalHost,
      colourScheme: { enabled: false },
    },
  },
  extends: ["srcdev-nuxt-components"],
  modules: ["@nuxt/eslint", "@nuxt/scripts", "nuxt-security", "@nuxtjs/robots"],
  robots: {
    enabled: isProduction,
    groups: [{ userAgent: ["*"], allow: ["/"] }],
    sitemap: [`https://${PROD_HOST}/sitemap.xml`],
  },
  components: [{ path: "./components", pathPrefix: false }],
  imports: { dirs: ["./stores"] },
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      titleTemplate: "%s - {App Title}",
      meta: [{ charset: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
      link: [{ rel: "icon", href: "/icons/favicon.png" }],
      bodyAttrs: { class: "{name}-body" },
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  css: ["srcdev-nuxt-components/app/assets/styles/main.css", "./app/assets/styles/main.css"],
  fonts: {
    assets: { prefix: "/_fonts" },
    families: [
      // Add chosen fonts here — provider: "bunny" for Google Fonts via bunny CDN
      { name: "{Font}", weights: [300, 400, 500, 600, 700], styles: ["normal", "italic"], provider: "bunny", display: "optional" },
    ],
  },
  typescript: {
    includeWorkspace: true,
    strict: true,
    shim: true,
    typeCheck: false,
    tsConfig: { compilerOptions: { types: ["srcdev-nuxt-components"] } },
  },
  eslint: { config: {} },
  security: {
    headers: {
      contentSecurityPolicy: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://vercel.live"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "script-src-attr": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "connect-src": ["'self'", "https://api.iconify.design", "https://vercel.live"],
        "frame-src": ["'self'", "https://vercel.live"],
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@oddbird/css-anchor-positioning", "@vue/devtools-core", "@vue/devtools-kit", "zod"],
    },
  },
})
```

### 4. Create supporting config files

**`tsconfig.json`**
```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": { "strict": true }
}
```

**`eslint.config.mjs`**
```js
// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
  files: ["**/*.vue"],
  rules: {
    "@stylistic/max-len": "off",
    "vue/max-len": "off",
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/html-self-closing": [
      "error",
      { html: { void: "always", normal: "never", component: "always" } },
    ],
    "@stylistic/member-delimiter-style": [
      "error",
      {
        multiline: { delimiter: "semi", requireLast: true },
        singleline: { delimiter: "semi", requireLast: false },
        multilineDetection: "brackets",
      },
    ],
  },
})
```

**`.prettierrc`**
```json
{
  "printWidth": 120,
  "singleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "semi": false,
  "vueIndentScriptAndStyle": false,
  "htmlWhitespaceSensitivity": "ignore"
}
```

**`.nvmrc`**
```
node 20
```

**`.gitignore`** — include `.output`, `.nuxt`, `.nitro`, `.cache`, `node_modules`, `.env`, `.DS_Store`, `.vercel`, `storybook-static`.

### 5. Create app directory structure

```
app/
├── assets/styles/
│   └── main.css          ← brand tokens + font vars (loads after layer CSS)
├── layouts/
│   └── default.vue       ← minimal shell with <slot>
├── pages/
│   └── index.vue         ← placeholder home page with useSeoMeta
└── error.vue             ← 404 / 500 handler with clearError redirect
```

**`app/assets/styles/main.css`** — declare brand CSS custom properties and set font-family:

```css
:root {
  /* Add brand colour tokens */
  --font-display: "{Display Font}", serif;
  --font-body: "{Body Font}", sans-serif;
  font-family: var(--font-body);
}
```

**`app/layouts/default.vue`** — minimal:

```vue
<template>
  <div class="layout-default">
    <main><slot></slot></main>
  </div>
</template>
```

**`app/pages/index.vue`** — placeholder with `useSeoMeta`.

**`app/error.vue`** — handle `statusCode` 404 vs 500, call `clearError({ redirect: "/" })`.

### 6. Create `.claude/skills/.gitkeep`

Ensures `.claude/skills/` exists in the repo on a fresh clone so `setup:claude` never errors.

```bash
mkdir -p .claude/skills && touch .claude/skills/.gitkeep
```

### 7. Create `CLAUDE.md`

Brief project context file at repo root:

```md
# {App Title} — Claude Guidelines

This app extends the `srcdev-nuxt-components` Nuxt layer.

## Layer Skills

Skills are copied into `.claude/skills/srcdev-nuxt-components/` during `npm install`.
Run `npm run setup:claude` to refresh after a layer upgrade.

## Project Context

- **Design system**: `.claude/design.md` (if it exists)
- **Production domain**: {domain}
- **Fonts**: {fonts}

## Key Conventions

- Follow all guidelines in the layer's `CLAUDE.md`
- CSS custom properties for all design tokens — no hardcoded values in component styles
- Layer CSS loads first; `app/assets/styles/main.css` overrides
```

### 8. Confirm next step for the user

Tell the user to run:

```bash
npm install
```

`postinstall` will run `nuxt prepare` and copy the layer skills automatically.

## Notes

- If the repo contains a `.claude/design.md`, read it before writing `main.css` — use any
  brand colours or font choices from it to seed the CSS tokens.
- If security modules are not wanted, omit `nuxt-security` from `dependencies` and remove it
  from `modules` and the `security` config block in `nuxt.config.ts`. Same for `@nuxtjs/robots`.
- The `colourScheme.enabled: false` default is correct for most consumer apps — enable only if
  the app needs light/dark switching.
- Check the latest `srcdev-nuxt-components` version on npm before writing `package.json`.
