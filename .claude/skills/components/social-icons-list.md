# SocialIconsList Component

## Overview

`SocialIconsList` renders a horizontal list of social network icon links. Each item is data-driven via the `items` prop — the component composes the full href from `baseHref + profileId` at render time. Icons are sourced from the `logos:*` Iconify collection (`@iconify-json/logos`), which uses brand colours baked into the SVG.

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `items` | `ISocialIcon[]` | — | **Required.** Array of social network items. |
| `label` | `string` | `"Social media profiles"` | `aria-label` applied to the `<ul>` element. |
| `linkLabelTemplate` | `string` | `"{network} profile (opens in a new tab)"` | `aria-label` for each link; `{network}` is replaced with the item's `networkName`. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `<ul>`. |

---

## ISocialIcon type

```ts
interface ISocialIcon {
  networkName: string; // Fills {network} in the list's linkLabelTemplate
  label?: string;      // Optional per-item aria-label, overrides the template
  iconName: string;    // Iconify icon name, e.g. "logos:instagram-icon"
  baseHref: string;    // Base URL including trailing slash, e.g. "https://www.instagram.com/"
  profileId: string;   // Profile identifier appended to baseHref
}
```

The rendered `href` is `${baseHref}${profileId}`.

### Importing the type

**Within the layer** (e.g. in another layer component or composable):

```ts
import type { ISocialIcon } from "~/types/components/social-icons-list.d";
```

**In a consuming app** — exported via the package barrel (`types.d.ts` → `app/types/components/index.ts`):

```ts
import type { ISocialIcon } from "srcdev-nuxt-components";
```

---

## Standard social network values

| Network | `iconName` | `baseHref` |
|---------|-----------|-----------|
| Facebook | `logos:facebook` | `https://www.facebook.com/` |
| X (Twitter) | `logos:x` | `https://x.com/` |
| Instagram | `logos:instagram-icon` | `https://www.instagram.com/` |
| YouTube | `logos:youtube-icon` | `https://www.youtube.com/@` |
| TikTok | `logos:tiktok-icon` | `https://www.tiktok.com/@` |

---

## Usage example

```vue
<SocialIconsList
  :items="[
    {
      networkName: 'Instagram',
      iconName: 'logos:instagram-icon',
      baseHref: 'https://www.instagram.com/',
      profileId: 'yourbrand',
    },
    {
      networkName: 'TikTok',
      iconName: 'logos:tiktok-icon',
      baseHref: 'https://www.tiktok.com/@',
      profileId: 'yourbrand',
    },
  ]"
/>
```

---

## CSS custom properties

| Property | Default | Notes |
|----------|---------|-------|
| `--social-icons-list-icon-size` | `2.4rem` | Icon size (applied as `font-size`) |
| `--social-icons-list-gap` | `1.2rem` | Gap between icons in the flex row |
| `--social-icons-list-hover-scale` | `1.15` | Hover/focus scale (none under reduced motion) |
| `--social-icons-list-hover-opacity` | `0.85` | Hover/focus opacity |

> Renamed 2026-09-28 from `--theme-social-icon-size` / `--theme-social-icon-gap`. Full reference: `CONSUMER-STYLING.md` in the component folder.

> **Note:** Iconify's `logos:*` styles are injected outside any CSS `@layer`, which means they override layered component styles. Icon sizing is applied via an inline `style` attribute on the `<Icon>` element so it takes precedence.

---

## Local style override scaffold

Offer this scaffold when placing the component in a consuming page or section. The style block is
**unscoped** — no `:deep()` needed. Scope by the page or section's existing wrapper class.

```vue
<template>
  <SocialIconsList :items="items" />
</template>

<style lang="css">
/* ─── SocialIconsList local overrides ──────────────────────────────
   Geometry and size only — brand colours are baked into logos: SVGs.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.my-page-or-section {
  .social-icons-list {
    /* --social-icons-list-icon-size: 3.2rem; */
    /* --social-icons-list-gap: 1.6rem; */
    /* margin-block-start: 1.6rem; */

    .social-icon-link {
      /* border-radius: 0.4rem; */
      /* padding: 0.4rem; */
      /* outline: 1px solid transparent; */
    }
  }
}
</style>
```

Use `styleClassPassthrough` only if the same component appears multiple times on the page and you
need to target a specific instance. See `component-local-style-override.md` for full pattern guidance.

---

## Notes

- All links open in a new tab with `rel="noopener noreferrer"`.
- Each link's `aria-label` comes from `linkLabelTemplate` (default `"{network} profile (opens in a new tab)"`, `{network}` = `networkName`), or the item's own `label`. Pass a translated template for other languages. The icon is `aria-hidden`.
- The `logos:*` Iconify collection requires `@iconify-json/logos` to be installed in the consumer app. Without it, icons will fall back to a CDN fetch (causing FOUC). See [icon-sets.md](../icon-sets.md).
- Auto-imported in Nuxt — no manual import needed.
