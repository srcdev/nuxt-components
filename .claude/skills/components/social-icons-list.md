# SocialIconsList Component

## Overview

`SocialIconsList` renders a horizontal list of social network icon links. Each item is data-driven via the `items` prop — the component composes the full href from `baseHref + profileId` at render time. Icons are sourced from the `logos:*` Iconify collection (`@iconify-json/logos`), which uses brand colours baked into the SVG.

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `items` | `ISocialIcon[]` | — | **Required.** Array of social network items. |
| `label` | `string` | `"Social media profiles"` | `aria-label` applied to the `<ul>` element. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `<ul>`. |

---

## ISocialIcon type

```ts
interface ISocialIcon {
  networkName: string; // Used as aria-label: "{networkName} profile"
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
| `--theme-social-icon-size` | `2.4rem` | Width and height of each icon |
| `--theme-social-icon-gap` | `1.2rem` | Gap between icons in the flex row |

> **Note:** Iconify's `logos:*` styles are injected outside any CSS `@layer`, which means they override layered component styles. Icon sizing is applied via an inline `style` attribute on the `<Icon>` element so it takes precedence.

---

## Local style override scaffold

```vue
<SocialIconsList :style-class-passthrough="['my-social-icons']" :items="items" />

<style>
/* ─── SocialIconsList local overrides ──────────────────────────────
   Geometry and size only — brand colours are baked into logos: SVGs.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.social-icons-list {
  &.my-social-icons {
    /* --theme-social-icon-size: 3.2rem; */
    /* --theme-social-icon-gap: 2rem; */
  }
}
</style>
```

---

## Notes

- All links open in a new tab with `rel="noopener noreferrer"`.
- Each link carries `aria-label="{networkName} profile"` for screen reader accessibility.
- The `logos:*` Iconify collection requires `@iconify-json/logos` to be installed in the consumer app. Without it, icons will fall back to a CDN fetch (causing FOUC). See [icon-sets.md](../icon-sets.md).
- Auto-imported in Nuxt — no manual import needed.
