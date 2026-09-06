# useCookieConsent Composable

## Overview

`useCookieConsent` tracks the visitor's cookie-consent decision (`unset` / `granted` / `denied`), persists it in a `privacy-notice-consent` cookie, and wraps `@nuxt/scripts`' `useScriptTriggerConsent()` gate so any consent-dependent script (Google Analytics via [[composable-google-analytics]], or anything else added later) can be wired to it.

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useCookieConsent.ts`). Consuming apps get it via Nuxt's layer auto-import — **do not create a local copy** in the consuming app.

## Prerequisites

- `@nuxt/scripts` — the layer itself declares this as a dependency and registers it in its own `modules` array, so it's present in any app that extends this layer. No action needed in the consuming app, but be aware `useScriptTriggerConsent`/`useScriptGoogleAnalytics` are auto-imported from that module, not this layer.

## Setup in the consuming app

### 1. No import needed

`useCookieConsent` is auto-imported by Nuxt from the layer. Use it directly in `<script setup>` or any composable without an explicit import.

### 2. Render the banner

Pair it with [[cookie-consent-banner]] (`CookieConsentBanner.vue`), registered once in the app's default layout — see that component's skill doc for placement and copy slots.

## Composable reference

Source lives at `app/composables/useCookieConsent.ts` in the layer. Shown here for reference only — do not recreate it in the consuming app.

```ts
const consentTrigger = useScriptTriggerConsent(); // module-scope singleton

export function useCookieConsent() {
  const stored = useCookie<"granted" | "denied" | null>("privacy-notice-consent", {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    default: () => null,
  });

  if (stored.value === "granted" && !consentTrigger.consented.value) {
    consentTrigger.accept();
  }

  const status = computed(() => stored.value ?? "unset");

  const acceptAll = () => {
    stored.value = "granted";
    consentTrigger.accept();
  };

  const rejectAll = () => {
    stored.value = "denied";
    consentTrigger.revoke();
  };

  return { status, acceptAll, rejectAll, trigger: consentTrigger };
}
```

### Key rules

- **`useScriptTriggerConsent()` is called once at module scope**, mirroring `@nuxt/scripts`' own documented pattern — it's a single shared gate for the app's lifetime, not a fresh instance per call-site. `useCookie()` is read fresh inside the function body on every call instead, which stays SSR-request-safe (Nuxt dedupes `useCookie()` by key within a single request).
- **`status` is the public read API.** `trigger` is exposed only so `useGoogleAnalytics` (or another consent-gated script composable) can pass it straight into `scriptOptions.trigger` — don't read/mutate `trigger` directly from app code, use `status`/`acceptAll`/`rejectAll`.
- A prior "granted" cookie is replayed into the trigger on init, since the in-memory trigger resets on every full page load but the cookie doesn't.

## Usage

```ts
const { status, acceptAll, rejectAll } = useCookieConsent();

if (status.value === "unset") {
  // show the banner
}
```

To let a user change their mind later (e.g. a "cookie preferences" link in the footer or a cookie-policy page), call `rejectAll()` or clear the `privacy-notice-consent` cookie to bring the banner back.

## Notes

- Cookie name `privacy-notice-consent` is fixed by the layer, not configurable per app.
- This composable only tracks the yes/no decision — it does not itself load any script. See [[composable-google-analytics]] for the GA4 integration that consumes `trigger`.
