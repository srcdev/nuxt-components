# useAnalytics Composable

## Overview

`useAnalytics` is the **only** analytics composable consuming apps ever call — it fires custom events, tracks page views on client-side route changes, and does the one-time provider setup (script loading, consent wiring), all through the same call. It's deliberately provider-agnostic: `public.analytics.provider` in runtime config picks the backend (today only `"google-analytics"` is implemented), so call sites never reference a specific provider and adding a second one later doesn't touch any consuming-app code.

Gated behind [[composable-cookie-consent]]'s consent state — events don't fire, and (for the Google Analytics provider) `gtag.js` doesn't set any cookie, until the visitor accepts via [[cookie-consent-banner]] (or your own call to `useCookieConsent().acceptAll()`).

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useAnalytics.ts`). Consuming apps get it via Nuxt's layer auto-import — **do not create a local copy** in the consuming app.

## Prerequisites (for the `google-analytics` provider)

- `NUXT_PUBLIC_ANALYTICS_GOOGLE_ANALYTICS_ID` env var set to your GA4 measurement ID (`G-XXXXXXXXXX`).
- `@nuxt/scripts` — already a layer dependency, registered in the layer's own `modules` array. Nothing to add in the consuming app.
- The app's CSP (if using `nuxt-security`) must allow `https://www.googletagmanager.com` in `script-src`/`connect-src` and `https://*.google-analytics.com` (a wildcard — GA4 posts to regional subdomains like `region1.google-analytics.com`, not just the bare host) in `connect-src`, or hits will be blocked once consent is granted.

## Setup in the consuming app

### 1. Runtime config

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    analytics: {
      provider: "google-analytics", // only value implemented today
      googleAnalytics: {
        id: "", // NUXT_PUBLIC_ANALYTICS_GOOGLE_ANALYTICS_ID
      },
    },
  },
},
```

### 2. Call it once, near the app root

Call `useAnalytics()` once in the default layout's `<script setup>`, alongside where [[cookie-consent-banner]] is registered — this is what wires up script loading, the consent watcher, and site-wide page-view tracking on route change:

```vue
<script setup lang="ts">
useAnalytics();
</script>

<template>
  <div class="page-layout">
    <slot />
    <CookieConsentBanner />
  </div>
</template>
```

It no-ops (with a console warning) if the active provider's config is unset — safe to call unconditionally in every environment, including local dev without a real measurement ID.

### 3. Fire events from anywhere

`useAnalytics()` is also the API for firing custom events from any page or component — safe/cheap to call repeatedly (the underlying script instance is a registry singleton keyed by measurement ID, so this never re-runs setup or duplicates the consent watcher or the page-view route listener):

```ts
const { trackEvent } = useAnalytics();

const handlePlanSelect = (plan: PricingPlan) => {
  trackEvent("select_plan", { plan_tier: plan.id, value: plan.price, currency: "GBP" });
  // ...
};
```

`trackEvent(name, params)` only accepts flat string/number/boolean param values (matches GA4's own event-param constraints) and silently no-ops until consent is granted — never queues events from before consent, by design.

## Composable reference

Source lives at `app/composables/useAnalytics.ts` in the layer. Shown here for reference only — do not recreate it in the consuming app.

```ts
export type AnalyticsProvider = "google-analytics";

interface AnalyticsProviderImpl {
  trackEvent: (name: string, params?: Record<string, string | number | boolean>) => void;
}

let pageViewTrackingRegistered = false;

function useGoogleAnalyticsProvider(): AnalyticsProviderImpl | null {
  const config = useRuntimeConfig();
  const id = config.public.analytics?.googleAnalytics?.id;
  if (!id) {
    console.warn("[useAnalytics] public.analytics.googleAnalytics.id is not configured");
    return null;
  }

  const { status, trigger } = useCookieConsent();
  const { proxy, consent } = useScriptGoogleAnalytics({
    id,
    scriptOptions: { trigger },
    defaultConsent: {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    },
  });

  watch(
    status,
    (value) => {
      if (value === "unset" || !consent) return;
      const granted = value === "granted";
      consent.update({
        ad_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
      });
    },
    { immediate: true }
  );

  if (import.meta.client && !pageViewTrackingRegistered) {
    pageViewTrackingRegistered = true;
    const router = useRouter();
    let hasNavigated = false;
    router.afterEach((to) => {
      if (!hasNavigated) { hasNavigated = true; return }
      if (status.value !== "granted") return;
      proxy.gtag("event", "page_view", { page_path: to.fullPath, page_title: document.title });
    });
  }

  return {
    trackEvent: (name, params) => {
      if (status.value !== "granted") return;
      proxy.gtag("event", name, params);
    },
  };
}

export function useAnalytics() {
  const config = useRuntimeConfig();
  const provider = config.public.analytics?.provider as AnalyticsProvider | undefined;
  const impl = provider === "google-analytics" ? useGoogleAnalyticsProvider() : null;

  return {
    trackEvent: (name: string, params?: Record<string, string | number | boolean>) => {
      impl?.trackEvent(name, params);
    },
  };
}
```

### Key rules

- **The public surface (`trackEvent`) never mentions a provider.** All GA-specific code lives in `useGoogleAnalyticsProvider()`, which is not exported. Adding a second provider means: add a branch in `useAnalytics()`, write a new `use<Provider>Provider()` implementing the same `{ trackEvent }` shape, extend the `AnalyticsProvider` union and `public.analytics.<provider>` config — no consuming-app call site changes.
- **`trigger` only gates whether the script *loads*.** It does not itself update the Consent Mode v2 signals — `consent.update()` is the separate API that reports the visitor's actual decision to `gtag.js` for every hit it sends. Skipping this was a real bug: hits fired successfully (visible in Network) but stayed tagged as denied forever, which GA4 excludes from standard reporting.
- **The `router.afterEach` page-view listener is registered exactly once**, guarded by a module-scope flag (`pageViewTrackingRegistered`) — not per call-site. Unlike `trackEvent`, which is safe to fire from every component that calls `useAnalytics()`, a router listener registered per call-site would fire once per component on every single route change. The very first navigation is skipped (already covered by `gtag('config', id)`'s own initial page_view).
- **This composable, not `@nuxt/scripts`' GA registry, is what makes SPA route changes tracked at all** — `@nuxt/scripts`' GA integration has no router hook of its own; without this, only the very first page load (before any client-side navigation) would ever produce a `page_view`.

## Notes

- Only the Google Analytics provider is implemented — no other analytics backend exists yet, despite the provider-agnostic naming.
- The measurement ID in `public` config is visible in the client bundle — expected, GA4 IDs are not secret.
- Event names/params are entirely up to the consuming app; this composable doesn't define any standard event vocabulary (e.g. GA4's own `select_item`/`begin_checkout`/`purchase` ecommerce event shapes) — follow GA4's own conventions for anything you want its ecommerce reports to recognize.
