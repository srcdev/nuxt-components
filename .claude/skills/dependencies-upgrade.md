# Upgrade npm dependencies (dry run first)

## Overview

How to bump this layer's dependencies, or a consumer app's, without shipping a supply-chain risk or a
broken install. `/upgrade-packages` (in the srcdev-nuxt-components repo) runs this procedure. The
order is fixed: **age-gate → isolate → baseline → phase → verify → plan**. Nothing is applied to the
real checkout until the user has read the plan.

Recorded from upgrade passes on 2026-08-19 (Vitest 4), 2026-10-22 (Nuxt 4.6 dry run, deferred) and
2026-11-18 (Nuxt 4.6.4 dry run).

## 1. Age gate: nothing younger than 7 days

Compromised releases are usually caught and unpublished within days, so never install a version
younger than **7 days**: not direct dependencies and not transitive ones.

- **Pick direct targets** with `node scripts/aged-versions.mjs package.json 7` (in a consumer app:
  `node node_modules/srcdev-nuxt-components/scripts/aged-versions.mjs package.json 7`). For every exact
  pin in `dependencies`, `devDependencies` and `overrides` it prints the newest version in the same
  major that is at least 7 days old, the newest new major that clears the gate, and any newer version
  it blocked.
- **Install with the gate on**: `npm install --min-release-age=7` (npm 11.x; `--before=<date>` is the
  absolute form, and the two can't be combined). It applies to every package npm resolves, so
  transitive packages get the same floor. If a pinned direct version is too young, npm errors instead
  of picking another version: re-run `aged-versions.mjs`.
- To make the gate permanent, add `min-release-age=7` to the project's `.npmrc`. It only affects
  resolution (`npm install`, `npm update`); `npm ci` installs exactly what the lockfile says.
- A security fix younger than 7 days is the one exception. Take it only when `npm audit` says the
  advisory is exploitable in this context, and name it in the plan.

## 2. Isolate: a worktree in the scratchpad

```bash
git worktree add <scratchpad>/deps-dry-run -b chore/deps-dry-run-<yyyy-mm> HEAD
```

Run everything from the worktree root (tools started from a subfolder leave `.nuxt/` and
`node_modules/` strays there). Never `git stash` to compare old and new code. Never edit a consumer
repo: to test a consumer, copy it into the scratchpad (step 6).

## 3. Baseline

In the worktree, before changing anything:

```bash
npm ci && npm run prepare && npm run test:run
```

Record the pass counts, and run `npm run lint` too: record its error count and rules, because main may
already have lint errors and a bump can add hundreds through a plugin's defaults. Use the npm scripts, never bare `npx vitest`/`npx nuxt prepare`: they set
`SRCDEV_STANDALONE=true`, which loads modules a bare run skips.

Also capture `npm outdated` and an audit summary, and note which advisories only a specific bump
fixes (`npm audit --json`, `fixAvailable` per package).

## 4. Phases

Bump in separate phases so a failure points at one cause. Delete the lockfile and `node_modules`
before each phase's install, so the lockfile is rebuilt under the age gate rather than patched.

1. **Framework + same-major bumps**: `nuxt`, `@nuxt/schema` and every `@nuxt/*` module, Storybook
   packages together (`storybook`, `@storybook/*`, `eslint-plugin-storybook`, `@nuxtjs/storybook`),
   plus patch/minor bumps of everything else.
2. **New majors**, one family at a time: test stack (`vitest`, `@nuxt/test-utils`, `happy-dom`,
   `@vue/test-utils`), then runtime libraries (`@vueuse/core`, ...).
3. **Hold back** anything a known blocker affects (see the traps list) and say why in the plan. A
   green major can still be worth holding: if other dependencies pin the previous major (`@vueuse/core`
   15 while `@nuxt/scripts` needs `^14`), bumping a runtime dependency only adds another copy to every
   consumer's bundle. Check with `npm ls <pkg>` that it dedupes.

**Reading `npm audit`**: its `fixAvailable` often suggests a downgrade or an unrelated major (for
example `release-it@15` or `@vue/test-utils@2.4.11`). Trace each advisory to its root package and the
range that fixes it, then say whether the fix is reachable within the dependents' ranges. Report
production advisories (`--omit=dev`) separately from dev tooling ones.

Edit `package.json` with a script rather than `npm install pkg@x` one at a time, then:

```bash
rm -rf node_modules package-lock.json .nuxt
npm install --min-release-age=7
npm run prepare && npm run test:run
```

## 5. Verify each phase

All of these, not only the tests:

- `npm run test:run`: diff the failures against the baseline and walk them through the traps list
  before calling anything a regression.
- `npm run lint`
- `npm run build`: also type-checks (`typeCheck: "build"`).
- `npm run storybook:build`: the deployed demo surface.
- **One version per framework package**: `npm ls vue vue-router vite @nuxt/schema h3`. Two versions of
  one of these is the most common upgrade break.
- **Nothing moved sections**: `git diff package.json`. A runtime import must be in `dependencies`,
  because consumers don't get a layer's devDependencies. Check with
  `grep -rl "<pkg>" app modules | grep -v -E "/tests/|\.stories\."`.
- **Lockfile stubs**: a versionless optional binding crashes Linux installs (see skill
  `vercel-node-version.md`):
  `node -e "const l=require('./package-lock.json');console.log(Object.entries(l.packages).filter(([k,v])=>k&&!v.version&&!v.link).map(([k])=>k))"`
- **Two clean installs in a row** (`rm -rf node_modules package-lock.json && npm install
  --min-release-age=7`, twice) before trusting a lockfile: hoisting bugs have only shown up on the second
  pass.

## 6. Consumer impact

A layer upgrade isn't done until a consumer app has been tried against it:

1. Copy a consumer app into the scratchpad (never edit the real repo).
2. Point its `srcdev-nuxt-components` dependency at the worktree (`npm pack` the worktree and install the
   tarball, so `files` is honoured as it is for a published release).
3. Build the copy on its current versions first (`npm ci && npm run build`) so new warnings stand out.
4. Apply the consumer steps from the plan (`nuxt` bump, `overrides`, Node version), reinstall with the age
   gate, then run its tests and build. Check `npm ls nuxt vite vue-router` shows one version each.
5. Try every consumer, not just one: a consumer that also extends another layer (one that pins its own
   `vite`, `@vueuse/*` or Nuxt modules) can fail where a single-layer app passes. Check each other
   layer's published `dependencies` (`npm view <layer>@<version> dependencies`) for a Nuxt or Vite pin
   that would have to move in step.

Write the consumer steps into skill `consumer-layer-upgrade.md` as a new release section (exact
values, a snippet and a check per step), and update `new-app-scaffold.md`'s versions, `overrides`,
`engines` and config to match, in the same change as the upgrade.

What consumers must do themselves, because npm won't do it for them:

- **`overrides` don't propagate** from a dependency. Every override the layer needs, the consumer must
  copy into its own `package.json`.
- **The layer pins `nuxt` exactly**, so a consumer must bump Nuxt to the same version in the same
  change, or it gets a nested second Nuxt.
- **Node/engines bumps**: the consumer's `.nvmrc` and its deploy platform's Node version must match.

## 7. The plan

Write the plan as the deliverable: the phases with exact versions, what each phase needed fixing,
what was held back and why, the audit findings each phase closes, the consumer steps, and anything
for the release notes. Apply it only after the user agrees. The user runs git (commit, push,
release) themselves.

## Known upgrade traps

Check these first when a bump breaks things.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Every test file dies: `Missing field 'moduleType'` / `Plugin: builtin:replace` | Vite 7 still hoisted while Nuxt's config expects Vite 8 | `overrides.vite` to the Vite major Nuxt's `@nuxt/vite-builder` requires |
| `useRouter().afterEach` undefined, `reading 'baseURL'` in app init | Second `vue-router` hoisted (Storybook's Nuxt integration) | `overrides.vue-router` + a direct devDependency at the version `nuxt` requires |
| `defineNuxtConfig` not callable, missing Nuxt 4 types | `@nuxt/schema` 3.x hoisted by Storybook's Nuxt integration | Pin `@nuxt/schema` as a devDependency, same version as `nuxt` |
| `Cannot find package 'esbuild'` in build | `vite.build.cssMinify: "esbuild"` (lightningcss drops `backdrop-filter`) but esbuild only arrived transitively | `esbuild` as a real `dependency`: consumers inherit the config |
| `NUXT_B5025` warning on `css:` | A relative path in a layer's `css` array | `css: [resolve("./app/assets/styles/main.css")]` (the warning's `~/` fix is wrong in a layer) |
| Storybook build fails on a CSS import; a consumer's `nuxt build` fails with `Unable to resolve @import "./setup/"` | Vite 8 no longer resolves a directory `@import` to its `index.css`, in the layer or in a consumer's own `app/assets/styles/` tree | Import the file: `@import "./setup/index.css"`, at every level. Works on Vite 7 too, so consumers can change it before upgrading |
| Production bundle suddenly contains `console.*` calls; build warns `Both esbuild and oxc options were set ... { drop: [ 'console', 'debugger' ] }` | `nuxt-security`'s default `removeLoggers: true` strips loggers through `vite.esbuild.drop`, which Vite 8 (Oxc minifier) ignores. Still true in nuxt-security 2.7.0 | In the app: `security: { removeLoggers: false }` plus `vite: { build: { rolldownOptions: { output: { minify: { compress: { dropConsole: true, dropDebugger: true } } } } } }`. Don't use the `removeLoggers` object form: its plugin skips `node_modules`. Verify with `grep -roE 'console\.(log\|warn\|error\|info\|debug)\(' .output/public/_nuxt \| wc -l` |
| `Duplicated imports "X"` warning in `nuxt prepare`/build | Nuxt 4.6 also auto-imports type re-exports, so a store that re-exports a type from `~/types` clashes with the original | Drop the re-export |
| `TypeError: ... is not a constructor` (ResizeObserver, Image) | Vitest 4+: arrow-function mock implementations aren't constructible | `vi.fn(function () { ... })` |
| An outside-click test ignores its second click | `@vueuse/core` 14 `onClickOutside` guard reset by a real `setTimeout(0)` under fake timers | `vi.advanceTimersByTime(0)` between the clicks |
| `reading 'replace'` in `@nuxt/icon` `escapeCssSelector` | `@nuxt/icon` 2.6 reads `useAppConfig().icon.cssSelectorPrefix` at setup; a test's `useAppConfig` mock dropped the `icon` key | Merge mocks over the real config: `mockNuxtImport("useAppConfig", (original) => () => ({ ...original(), ...mock() }))`, never stub `icon: {}` |
| ~190 new `vue/html-self-closing` errors on `<slot>` | `eslint-plugin-vue` 10.12 classifies Vue built-ins (`slot`, `component`) as components, and `component: "always"` then demands `<slot />`, against the repo's `<slot></slot>` convention | Decide: pin `overrides["eslint-plugin-vue"]` to 10.11.1, or change the convention (rule `vue-no-self-closing.md`) and `eslint --fix`. Compare lint error counts with the baseline, not just pass/fail |
| App init throws in a composable unit test | `useRuntimeConfig` mock missing `app.baseURL` | Merge over `original()` the same way |
| `ts-api-utils` `reading 'Intrinsic'` | `typescript` outside `typescript-eslint`'s range (7.x is the native-compiler line) | Stay on the latest 5.x that `typescript-eslint` accepts; `vue-tsc` also needs TS's JS API |
| Tests time out under full-suite load only | Heavier environment setup after a Vitest/test-utils major | Raise `testTimeout` in `vitest.config.mts` |
| `npm install` on CI: `ERR_INVALID_ARG_TYPE` / `"from" argument` | Stale restored build cache vs a new lockfile | Redeploy without the build cache |
| Linux install: `npm error Invalid Version:` | Versionless optional-binding stub in the lockfile | Node 24 / npm 11 on the deploy platform; patch the stub if it persists |
| Package bumped by an editor extension now under devDependencies | The tool moved sections | `git diff package.json` after every tool-driven bump |
| `@nuxt/fonts` 1.x production font URLs | Fonts served from `/_nuxt/_fonts/` instead of `/_fonts/` | Check caching/CSP rules that name `/_fonts` |
