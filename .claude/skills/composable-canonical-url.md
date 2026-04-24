# useCanonicalUrl Composable

## Overview

`useCanonicalUrl` sets a `<link rel="canonical">` tag in the page `<head>` using the current
route path and the app's configured canonical host. Call it once in the default layout so every
page gets a canonical URL automatically.

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useCanonicalUrl.ts`).
Consuming apps get it via Nuxt's layer auto-import — **do not create a local copy** in the consuming app.

## Prerequisites

- `NUXT_PUBLIC_CANONICAL_HOST` env var set to the production domain (e.g. `myapp.co.uk`).

## Setup in the consuming app

### 1. Runtime config

`canonicalHost` must be declared in `runtimeConfig.public` in `nuxt.config.ts`. The standard
scaffold pattern reads it from an env var with a Vercel preview URL as the fallback:

```ts
// nuxt.config.ts
const PROD_HOST = "myapp.co.uk"
const canonicalHost = process.env.NUXT_PUBLIC_CANONICAL_HOST ?? "myapp.vercel.app"

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      canonicalHost,
    },
  },
})
```

Set `NUXT_PUBLIC_CANONICAL_HOST` in `.env` locally and in your hosting provider's environment
variables for production. On Vercel preview deployments the fallback URL is used, so canonical
tags point to preview — that is intentional and correct.

### 2. Call in the default layout

Call `useCanonicalUrl()` at the top of `<script setup>` in `app/layouts/default.vue`. This runs
on every page without needing to repeat it per-page:

```vue
<!-- app/layouts/default.vue -->
<script setup lang="ts">
useCanonicalUrl()
</script>
```

### 3. Node types (required for `process.env` in nuxt.config)

The `process.env` access at the top of `nuxt.config.ts` requires Node type definitions. Ensure
`@types/node` is installed and `"node"` is in the types array:

```bash
npm i --save-dev @types/node
```

```ts
// nuxt.config.ts — typescript block
typescript: {
  tsConfig: { compilerOptions: { types: ["srcdev-nuxt-components", "node"] } },
},
```

## Composable reference

```ts
export const useCanonicalUrl = () => {
  const route = useRoute();
  const config = useRuntimeConfig();

  const canonicalHost = config.public.canonicalHost;
  const canonicalUrl = `https://${canonicalHost}${route.path}`;

  useHead({
    link: [{ rel: "canonical", href: canonicalUrl }],
  });

  return { canonicalUrl };
};
```

## Notes

- The composable returns `{ canonicalUrl }` if you need to read the value elsewhere (e.g. for
  structured data), but in most cases you call it purely for the side effect.
- On pages with query strings or hash fragments only the `route.path` (pathname) is used, which
  is the correct canonical behaviour.
