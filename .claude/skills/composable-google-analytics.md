# useGoogleAnalytics Composable

## Overview

`useGoogleAnalytics` loads Google Analytics 4 (`gtag.js`) via `@nuxt/scripts`' `useScriptGoogleAnalytics()`, gated behind [[composable-cookie-consent]]'s consent state and Google Consent Mode v2's `defaultConsent`. The script does not fetch, and no analytics cookie is set, until the visitor accepts via [[cookie-consent-banner]] (or your own call to `useCookieConsent().acceptAll()`).

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useGoogleAnalytics.ts`). Consuming apps get it via Nuxt's layer auto-import — **do not create a local copy** in the consuming app.

## Prerequisites

- `NUXT_PUBLIC_GOOGLE_ANALYTICS_ID` env var set to your GA4 measurement ID (`G-XXXXXXXXXX`).
- `@nuxt/scripts` — already a layer dependency, registered in the layer's own `modules` array. Nothing to add in the consuming app.
- The app's CSP (if using `nuxt-security`) must allow `https://www.googletagmanager.com` in `script-src`/`connect-src` and `https://www.google-analytics.com` in `connect-src`, or the script will be blocked once consent is granted.

## Setup in the consuming app

### 1. Runtime config

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    googleAnalytics: {
      id: "", // NUXT_PUBLIC_GOOGLE_ANALYTICS_ID
    },
  },
},
```

### 2. Call it once

Call `useGoogleAnalytics()` once, near the app root — e.g. in the default layout's `<script setup>`, alongside where [[cookie-consent-banner]] is registered:

```vue
<script setup lang="ts">
useGoogleAnalytics();
</script>

<template>
  <div class="page-layout">
    <slot />
    <CookieConsentBanner />
  </div>
</template>
```

It no-ops (with a console warning) if `googleAnalytics.id` is unset — safe to call unconditionally in every environment, including local dev without a real measurement ID.

## Composable reference

Source lives at `app/composables/useGoogleAnalytics.ts` in the layer. Shown here for reference only — do not recreate it in the consuming app.

```ts
export const useGoogleAnalytics = () => {
  const config = useRuntimeConfig();
  const id = config.public.googleAnalytics?.id;

  if (!id) {
    console.warn("[useGoogleAnalytics] public.googleAnalytics.id is not configured");
    return;
  }

  const { trigger } = useCookieConsent();

  useScriptGoogleAnalytics({
    id,
    scriptOptions: { trigger },
    defaultConsent: {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    },
  });
};
```

### Key rules

- **`useRuntimeConfig()` inside the function body**, not module scope — same reasoning as `useWhatsApp` (see [[composable-whatsapp]]).
- **`defaultConsent` is all `"denied"`** — this is what makes the script Consent Mode v2 compliant: gtag.js can load (if triggered) but won't set cookies or send identifiable pings until `useCookieConsent().acceptAll()` calls `trigger.accept()`, which flips consent to granted via `@nuxt/scripts`' own consent-update wiring.
- Does not return anything — it's a side-effecting setup call, not a value composable. Read GA-related state (if ever needed) via `useCookieConsent()` instead.

## Notes

- Only loads GA4 (`gtag.js`) — no other Google tags (Ads, Tag Manager container, etc.). Extend `defaultConsent`/add a second `useScript*` call if those are needed later.
- The measurement ID in `public` config is visible in the client bundle — expected, GA4 IDs are not secret.
