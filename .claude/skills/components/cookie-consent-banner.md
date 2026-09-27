# CookieConsentBanner

## Overview

Fixed, non-modal banner shown while cookie consent is undecided (`useCookieConsent().status === 'unset'`). Accept/Reject buttons call `acceptAll()`/`rejectAll()` on [[composable-cookie-consent]] directly — no `v-model`, no emits to wire up. Pair with [[composable-analytics]] (or any other consent-gated script) which reads the same consent state.

**Location**: `app/components/01.atoms/cookie-consent-banner/CookieConsentBanner.vue`

**Types**: `~/types/components` — `CookieConsentBannerProps`, `CookieConsentStatus`

---

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `SemanticTheme` | `"info"` | Colours the banner's accent border and accept button via `--theme-accent`. |
| `ariaLabel` | `string` | `"Cookie consent"` | Accessible name for the banner's `role="region"`. Pass translated copy in non-English apps. |
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

Register once, in the app's default layout, alongside `DisplayToastProvider` and a call to `useAnalytics()`:

```vue
<!-- layouts/default.vue -->
<script setup lang="ts">
const { t } = useI18n();
useAnalytics();
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

Full token list in `CONSUMER-STYLING.md` next to the component (`--cookie-consent-banner-*`: z-index, gutter, max-width, padding, gap, border, accent, background, text colour, button padding/radius, reject/accept colours, focus ring, transition duration). Defaults are light-only (no `light-dark()`); see its "dark panel" recipe.

The banner is **teleported to `<body>`**, so set tokens on `:root`/`html`/`body` or through `style-class-passthrough`, not on a page wrapper.

## Notes

- **Teleported to `<body>`** — like `DisplayToastProvider`, query it in tests via `document.querySelector(".cookie-consent-banner")`, not `wrapper.find(...)`.
- **No focus trap / backdrop** — this is a dismiss-by-decision banner, not a modal. It collapses via a `grid-template-rows` transition (same mechanic as `DisplayPrompt`) once `status` leaves `"unset"`, rather than unmounting. When closed it is `visibility: hidden`, so its buttons leave the tab order and accessibility tree (before 2026-09-27 they stayed focusable while invisible).
- **Only ever one instance** — `useCookieConsent()`'s underlying state is a module-scope singleton, so mounting the banner twice in one app just duplicates the UI, it doesn't create separate consent state.
- To let a visitor change their mind later (e.g. from a cookie-policy page), call `useCookieConsent().rejectAll()` or clear the `privacy-notice-consent` cookie — the banner reappears since `status` returns to `"unset"` only once the cookie is gone; `rejectAll()` itself sets it to `"denied"`, which keeps the banner hidden but stops GA. Expose a dedicated "reset my choice" affordance if you want the banner itself to resurface.
- 2026-09-27 migration: classes/tokens/test ids renamed `privacy-notice-banner` → `cookie-consent-banner`; `light-dark()` defaults replaced with light values plus an explicit text colour; single-use private pass-throughs inlined and the hardcoded spacing, button and colour values promoted to public tokens; `ariaLabel` prop (was a hardcoded "Cookie consent"); closed banner hidden from keyboard and screen readers; visible `:focus-visible` outline on the buttons; reduced-motion support; `styleClassPassthrough` now reactive. Added CONSUMER-STYLING.md and a snippet.
