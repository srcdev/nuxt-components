# Disable Colour Scheme in a Consumer App

## Overview

This layer includes light/dark/auto colour scheme support. By default it:

1. Injects a synchronous `<head>` script to apply the saved scheme before first paint (FOUC prevention)
2. Provides `useColourScheme()` composable to read/write the active scheme via localStorage, `html` class (`light`/`dark`), and `html.style.colorScheme`

A consumer app that only uses the default (no dark/light switching) can opt out entirely. Both the head script and composable behaviour are disabled together.

## Steps

### 1. Set `runtimeConfig.public.colourScheme.enabled` to `false`

In the consumer's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ["srcdev-nuxt-components"],
  runtimeConfig: {
    public: {
      colourScheme: {
        enabled: false,
      },
    },
  },
});
```

Or via environment variable (useful for CI or deployment config):

```bash
NUXT_PUBLIC_COLOUR_SCHEME_ENABLED=false
```

That's all that's needed. Nuxt merges `runtimeConfig.public` from the consumer over the layer default (`enabled: true`).

### 2. Remove any `useColourScheme()` usage (if present)

If the consumer app has a colour scheme toggle component, remove it or replace it with a no-op. The composable returns `{ currentColourScheme }` (always `"auto"`) when disabled, so it won't throw — but the toggle UI would be non-functional.

### 3. Remove colour scheme selectors from CSS (if any)

If the consumer's CSS references `html.dark` or `html.light` selectors, those can be removed since the classes will never be applied.

## How it works

| Part | Behaviour when disabled |
|---|---|
| `<head>` inline script | Not injected — no localStorage read, no class or `color-scheme` applied |
| `useColourScheme()` | Returns `{ currentColourScheme: ref("auto") }`, no localStorage/DOM side effects |

The injection is controlled by [modules/colour-scheme.ts](../../modules/colour-scheme.ts), which reads `runtimeConfig.public.colourScheme.enabled` at build time via a Nuxt module hook. The composable is in [app/composables/useColourScheme.ts](../../app/composables/useColourScheme.ts).

## Notes

- The layer default is `enabled: true` — no change required for apps that use the colour scheme feature
- The env var `NUXT_PUBLIC_COLOUR_SCHEME_ENABLED` follows Nuxt's standard automatic env var mapping for `runtimeConfig.public` values
