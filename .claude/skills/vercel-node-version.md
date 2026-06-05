# Vercel Node Version — .nvmrc Required

## Overview

Every project deploying to Vercel must have a `.nvmrc` file pinned to Node 24. Without it, Vercel defaults to Node 22 (npm 10), which crashes with `npm error Invalid Version:` on platform-specific optional packages that npm 11 (Node 24) handles gracefully.

## The problem

When `npm install` runs on macOS with Node 24, it writes stub entries into `package-lock.json` for platform-specific optional packages that don't apply to the current OS. For example:

```json
"node_modules/oxc-transform/node_modules/@oxc-transform/binding-linux-arm-gnueabihf": {
  "optional": true
}
```

This stub has no `version` field. npm 11 (Node 24) skips it silently. npm 10 (Node 22) calls `semver.valid()` on the empty version string and throws:

```
npm error Invalid Version:
npm error A complete log of this run can be found in: ...
Error: Command "npm install" exited with 1
```

The build fails even though the package is optional and not needed on Vercel's Linux x86_64 runtime.

## Fix

### 1. Add `.nvmrc` to the project root

```
24
```

Vercel reads `.nvmrc` and provisions Node 24 (npm 11), which handles the versionless stubs without error.

### 2. Verify the file exists before every deployment

If `.nvmrc` is ever accidentally deleted, recreate it immediately. This applies to:
- `nuxt-components` (the layer)
- Every consumer app (`instepreflexology`, `luxury-locs-by-natasha-nuxt3`, etc.)

## Notes

- The specific stub that first surfaced this was `@oxc-transform/binding-linux-arm-gnueabihf` — a Linux ARM native binary written as a versionless placeholder on macOS.
- The build works locally on Node 24 regardless, so the failure is silent until Vercel runs.
- Vercel also respects the `engines.node` field in `package.json`, but `.nvmrc` is simpler and doesn't require a valid semver range.
- Do **not** attempt to fix by deleting stubs from `package-lock.json` alone — they reappear on the next `npm install`. The `.nvmrc` file is the durable fix.
