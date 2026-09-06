# CookieConsentBanner

## Overview

Fixed, non-modal banner shown while cookie consent is undecided (`useCookieConsent().status === 'unset'`). Accept/Reject buttons call `acceptAll()`/`rejectAll()` on [[composable-cookie-consent]] directly — no `v-model`, no emits to wire up. Pair with [[composable-google-analytics]] (or any other consent-gated script) which reads the same consent state.

**Location**: `app/components/01.atoms/cookie-consent-banner/CookieConsentBanner.vue`

**Types**: `~/types/components` — `CookieConsentBannerProps`, `CookieConsentStatus`

---

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `SemanticTheme` | `"info"` | Colours the banner's accent border and accept button via `--theme-accent`. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root element. |

### app.config defaults

```ts
// Consumer's app.config.ts
export default defineAppConfig({
  srcdev: {
    cookieConsentBanner: {
      theme: "info",
    },
  },
})
```

Resolution chain: **prop → app.config → hardcoded fallback**.

## Slots

| Slot | Purpose | Default |
|---|---|---|
| `message` | The consent message body | "This site uses cookies to understand how it's used. You can accept or reject them." |
| `acceptLabel` | Accept button text | "Accept" |
| `rejectLabel` | Reject button text | "Reject" |

Per [[feedback_i18n_required]] in consuming apps, always fill these slots with `t()`-sourced copy rather than relying on the English defaults.

## Basic usage

Register once, in the app's default layout, alongside `DisplayToastProvider` and a call to `useGoogleAnalytics()`:

```vue
<!-- layouts/default.vue -->
<script setup lang="ts">
const { t } = useI18n();
useGoogleAnalytics();
</script>

<template>
  <div class="page-layout">
    <slot />
    <DisplayToastProvider position="top" alignment="right" :max-visible="3" />
    <CookieConsentBanner>
      <template #message>{{ t("global.cookieConsent.message") }}</template>
      <template #acceptLabel>{{ t("global.cookieConsent.accept") }}</template>
      <template #rejectLabel>{{ t("global.cookieConsent.reject") }}</template>
    </CookieConsentBanner>
  </div>
</template>
```

## CSS / styling

Public tokens (all on `.cookie-consent-banner`, `var(--cookie-consent-banner-*, fallback)` pattern):

| Token | Default |
|---|---|
| `--cookie-consent-banner-z-index` | `999999` |
| `--cookie-consent-banner-gutter` | `1.6rem` |
| `--cookie-consent-banner-max-width` | `64rem` |
| `--cookie-consent-banner-border-radius` | `0.8rem` |
| `--cookie-consent-banner-border` | `0.1rem solid light-dark(var(--slate-10), var(--slate-02))` |
| `--cookie-consent-banner-background` | `light-dark(var(--slate-00), var(--slate-10))` |
| `--cookie-consent-banner-transition-duration` | `200ms` |

## Notes

- **Teleported to `<body>`** — like `DisplayToastProvider`, query it in tests via `document.querySelector(".cookie-consent-banner")`, not `wrapper.find(...)`.
- **No focus trap / backdrop** — this is a dismiss-by-decision banner, not a modal. It collapses via a `grid-template-rows` transition (same mechanic as `DisplayPrompt`) once `status` leaves `"unset"`, rather than unmounting.
- **Only ever one instance** — `useCookieConsent()`'s underlying state is a module-scope singleton, so mounting the banner twice in one app just duplicates the UI, it doesn't create separate consent state.
- To let a visitor change their mind later (e.g. from a cookie-policy page), call `useCookieConsent().rejectAll()` or clear the `cookie-consent` cookie — the banner reappears since `status` returns to `"unset"` only once the cookie is gone; `rejectAll()` itself sets it to `"denied"`, which keeps the banner hidden but stops GA. Expose a dedicated "reset my choice" affordance if you want the banner itself to resurface.
