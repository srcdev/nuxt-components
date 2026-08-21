# SiteHeader Component

## Overview

`SiteHeader` composes the standard page-header trio into one drop-in component: `PageRow` (header row wrapper) + `SkipLinks` (a11y skip-to-content/footer anchors with a home-link slot) + `ResponsiveHeader` (the adaptive/overflow-collapsing nav with dropdowns). It replaces manually assembling those three in every consuming app's `layouts/default.vue`.

This is **not** a classic multi-column "mega menu" (large flyout panels with images/promo blocks) — it's the existing `ResponsiveHeader` nav (main links, dropdown sub-nav, overflow burger collapse) wrapped for reuse. A single flat nav group with no dropdowns works fine too (see the `SimpleFlatNav` story) — you don't need to use the dropdown/overflow behaviour to benefit from the composition.

Branding (logo/wordmark) is entirely consumer-authored via the `#branding` slot — `SiteHeader` has no opinion on brand markup or colours.

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `responsiveNavLinks` | `ResponsiveHeaderProp` | `{}` | Forwarded to `ResponsiveHeader`. Keyed nav groups; each item is either a link (`path`) or a dropdown (`childLinksTitle` + `childLinks`). A single group with no dropdowns is valid for simple sites. |
| `gapBetweenFirstAndSecondNav` | `number` | `12` | Forwarded to `ResponsiveHeader`. |
| `overflowDetailsSummaryIcons` | `Record<string, string>` | `{ more: "gravity-ui:ellipsis", burger: "gravity-ui:bars" }` | Forwarded to `ResponsiveHeader`. |
| `collapseBreakpoint` | `number \| null` | `null` | Forwarded to `ResponsiveHeader`. |
| `collapseAtMainNavIntersection` | `boolean` | `false` | Forwarded to `ResponsiveHeader`. |
| `allowExpandOnGesture` | `boolean` | `true` | Forwarded to `ResponsiveHeader`. |
| `pageRowVariant` | `"full" \| "popout" \| "content" \| "inset-content"` | `"content"` | Forwarded to the root `PageRow`'s `variant` prop. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes on the root `PageRow` — targets `--site-header-*` tokens (see `CONSUMER-STYLING.md`). |
| `navStyleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes on the nested `ResponsiveHeader` — targets its own `--responsive-header-*`/`--overflow-nav-*` tokens. |

---

## Slots

| Slot | Purpose |
|------|---------|
| `#branding` | Logo/wordmark markup, rendered inside `SkipLinks`' `#homeLink` slot. Consumer supplies the `NuxtLink`/`NuxtImg`/text — `SiteHeader` doesn't wrap or style it. |
| `#secondaryNavigation` | Forwarded through to `ResponsiveHeader`'s own `#secondaryNavigation` slot (e.g. a settings icon link). Only rendered when provided. |

---

## Usage examples

### Full nav with dropdowns (mega-menu-style)

```vue
<SiteHeader
  :responsive-nav-links="responsiveNavLinks"
  :style-class-passthrough="['header']"
  :nav-style-class-passthrough="['site-header-nav']"
>
  <template #branding>
    <NuxtLink to="/" class="home-link">Brand</NuxtLink>
  </template>
</SiteHeader>
```

### Simple flat nav (few pages, no dropdowns)

```vue
<script setup lang="ts">
const responsiveNavLinks = {
  main: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ],
};
</script>

<template>
  <SiteHeader :responsive-nav-links="responsiveNavLinks" :style-class-passthrough="['header']">
    <template #branding>
      <NuxtLink to="/" class="home-link">Brand</NuxtLink>
    </template>
  </SiteHeader>
</template>
```

### With a secondary navigation slot

```vue
<SiteHeader :responsive-nav-links="responsiveNavLinks">
  <template #branding>
    <NuxtLink to="/" class="home-link">Brand</NuxtLink>
  </template>
  <template #secondaryNavigation>
    <NuxtLink to="/settings" aria-label="Settings">
      <Icon name="material-symbols:settings-outline-rounded" />
    </NuxtLink>
  </template>
</SiteHeader>
```

---

## Migration notes

- Consuming layouts previously assembling `PageRow` + `SkipLinks` + `ResponsiveHeader` (or `TabNavigation`) by hand can switch to `SiteHeader` directly; the two `styleClassPassthrough` props map 1:1 onto the two independent passthrough hooks that pattern used.
- `TabNavigation`'s `NavItemData` shape (`{ main: [{ text, href, iconName, cssName }] }`) is **not** the same shape as `ResponsiveHeaderProp` (`{ groupKey: [{ name, path, childLinksTitle, childLinks }] }`) — migrating a `TabNavigation` consumer means reshaping the nav data, not just swapping the component. `TabNavigation`'s `navAlign` prop has no `SiteHeader` equivalent since `ResponsiveHeader`'s layout is fixed (branding column + nav column).
- Requires the consuming layout's main/footer regions to carry `id="main-content"` / `id="footer-content"` — same requirement as using `SkipLinks` directly.
