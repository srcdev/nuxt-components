# Upgrade the srcdev-nuxt-components layer in a consumer app

## Overview

What a consumer app has to change when it bumps `srcdev-nuxt-components`. Start with **Every
upgrade**, then work through the release sections from the version you're on up to the one you're
moving to. Each step ends with a check you can run.

Skill `dependencies-upgrade.md` (srcdev-nuxt-components) is the full procedure for a dependency
bump: age gate, baseline, phases, and a table of known upgrade traps. This page is the app-side
checklist.

## Every upgrade

1. **Pin the layer exactly** (`"srcdev-nuxt-components": "x.y.z"`, no `^`).
2. **Match the layer's `nuxt` version exactly.** The layer pins `nuxt`. If the app's own `nuxt`
   differs, npm installs a nested second Nuxt.
3. **Copy the layer's `overrides` block exactly.** npm ignores `overrides` declared by a dependency,
   so the layer's pins only apply if the app repeats them:

   ```bash
   node -e "const p=require('./node_modules/srcdev-nuxt-components/package.json');console.log(JSON.stringify({nuxt:p.dependencies.nuxt,engines:p.engines,overrides:p.overrides},null,2))"
   ```

   Run it after installing the new layer version, then copy `overrides` into the app's
   `package.json` (merge with any of the app's own) and set `nuxt` and `engines.node` to match.
4. **Install with the age gate**, from a fresh lockfile:

   ```bash
   rm -rf node_modules package-lock.json .nuxt .output
   npm install --min-release-age=7
   ```

   `--min-release-age=7` (npm 11.13+) only installs versions published at least 7 days ago,
   transitive ones included. Add `min-release-age=7` to the app's `.npmrc` to make it permanent.
5. **Refresh the layer's copies**: snippets and Claude skills/rules (rule `layer-setup-copies.md`).
6. **Check**: `npm ls nuxt vite vue-router` prints one version of each, and `npm run build` passes.

## Upgrading to the Nuxt 4.6 release (from 9.8.0 or earlier)

The layer moves from Nuxt 4.4.8 to 4.6.4, which brings Vite 8 (Rolldown/Oxc). Steps 4 and 5 also
work on the old version, so they can land before the bump.

### 1. Bump the layer and Nuxt together

`nuxt` → `4.6.4` in the same change as the layer bump.

### 2. Add the overrides

```json
"overrides": {
  "vite": "8.3.8",
  "vue-router": "5.5.0",
  "h3": "1.15.11",
  "eslint-plugin-vue": "10.11.1"
}
```

`eslint-plugin-vue` 10.12 counts `<slot>` as a component, so with the layer's
`vue/html-self-closing` setting (`normal: "never"`, `component: "always"`) every `<slot></slot>`
becomes a lint error. The pin keeps the `<slot></slot>` convention (rule `vue-no-self-closing.md`).

### 3. Node 24.15 or later

```json
"engines": { "node": ">=24.15.0" }
```

`.nvmrc` stays `24`, which resolves to the latest 24.x (skill `vercel-node-version.md`). Check the
local version with `node -v`.

### 4. Import CSS folders by their `index.css`

Vite 8 can't resolve a directory `@import`, so the build fails with
`Unable to resolve @import "./setup/"`. Change every one, at every level:

```css
/* before */
@import "./setup/";
/* after */
@import "./setup/index.css";
```

Find them all:

```bash
grep -rnE '@import "[^"]*/"' app
```

Check: that command prints nothing. The full layout is in skill `consumer-styles-structure.md`.

### 5. Point the app's own `css` entry at `~/`

```ts
css: ["srcdev-nuxt-components/app/assets/styles/main.css", "~/assets/styles/main.css"],
```

A relative `./app/assets/styles/main.css` now logs `NUXT_B5025` (css entries resolve as module
ids). Check: the build log has no `NUXT_B5025` line.

### 6. Keep `console` calls out of production (apps using `nuxt-security`)

`nuxt-security`'s default `removeLoggers: true` strips `console`/`debugger` through
`vite.esbuild.drop`, which Vite 8 ignores. The only sign is a build warning (`Both esbuild and oxc
options were set ...`), and production bundles start shipping `console` calls. This is still the
case in nuxt-security 2.7.0. Move the job to Vite 8's minifier:

```ts
security: {
  removeLoggers: false,
  // ...headers etc.
},
vite: {
  build: {
    rolldownOptions: { output: { minify: { compress: { dropConsole: true, dropDebugger: true } } } },
  },
},
```

Don't use the object form of `removeLoggers`: its plugin skips `node_modules`, so the layer's own
calls would stay.

Check after `npm run build`:

```bash
grep -roE 'console\.(log|warn|error|info|debug)\(' .output/public/_nuxt | wc -l
```

It should print `0`.

### 7. Fonts are served from `/_nuxt/_fonts/`

`@nuxt/fonts` 1.x writes font files to `/_nuxt/_fonts/` and ignores `fonts.assets.prefix`, so remove
that setting. Update anything that names `/_fonts`: cache headers, CSP rules, `vercel.json` routes,
preload links.

Check: `grep -rn "_fonts" nuxt.config.ts vercel.json public 2>/dev/null` has no `/_fonts` paths
left, and after `npm run build` the font files are under `.output/public/_nuxt/_fonts/`
(`find .output/public -name "*.woff2" | head -3`). The built CSS points at them with relative
`url(./_fonts/...)`, which resolves to `/_nuxt/_fonts/`.

### 8. Verify

```bash
npm ls nuxt vite vue-router   # one version each
npm run build                 # passes; no NUXT_B5025 or esbuild/oxc warning
```

Then load the site and check the fonts, the theme colours from the app's own `setup/` CSS, and
any `backdrop-filter` (glass/blur) effects.
