# Environment-Aware robots.txt and Meta Robots

## Overview

SSR apps often run on multiple domains — a preview/staging URL (e.g. Vercel's auto-generated domain) and the real production domain. This skill sets up `@nuxtjs/robots` so that crawling is allowed only on the production host, and blocked everywhere else — covering both `robots.txt` and `<meta name="robots">` injection.

## Prerequisites

- SSR deployment (e.g. Vercel)
- `@nuxtjs/robots` installed: `npm install @nuxtjs/robots`

## Steps

### 1. Derive `isProduction` at the top of `nuxt.config.ts`

Before `defineNuxtConfig`, read the canonical host from an env var and compare it to the known production domain:

```ts
const PROD_HOST = "yourdomain.com"
const canonicalHost = process.env.NUXT_PUBLIC_CANONICAL_HOST ?? "your-preview.vercel.app"
const isProduction = canonicalHost === PROD_HOST
```

Using `??` means local dev and Vercel preview deployments default to the non-production host, so no special local config is needed.

### 2. Wire `canonicalHost` into `runtimeConfig` and add the robots module

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      canonicalHost,   // shorthand — value comes from the const above
    },
  },
  modules: ["@nuxtjs/robots"],
  robots: {
    enabled: isProduction,
    groups: [
      {
        userAgent: ["*"],
        allow: ["/"],
      },
    ],
    sitemap: [`https://${PROD_HOST}/sitemap.xml`],
  },
})
```

When `enabled: false` the module:
- Serves `robots.txt` with `Disallow: /` for all user agents
- Injects `<meta name="robots" content="noindex, nofollow">` on every page

When `enabled: true` it serves the `groups` config and no blocking meta tag.

### 3. Set the env var in Vercel

In the Vercel dashboard → Project → Settings → Environment Variables:

| Name | Value | Environment |
|---|---|---|
| `NUXT_PUBLIC_CANONICAL_HOST` | `yourdomain.com` | **Production** only |

Leave it unset for Preview and Development — the `??` fallback in step 1 handles those.

## Notes

- The `sitemap` URL always points to the production host (hardcoded via `PROD_HOST`) so it is never wrong regardless of which environment serves the file
- `NUXT_PUBLIC_CANONICAL_HOST` follows Nuxt's standard automatic env var mapping for `runtimeConfig.public.canonicalHost`
- No `sitemap.xml` is required immediately — remove the `sitemap` line until one is generated
