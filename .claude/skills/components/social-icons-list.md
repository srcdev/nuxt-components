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
| `showLabel` | `boolean` | `false` | Show each item's `networkName` as visible text after the icon. Filling the `label` slot shows it too. |
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
  brandColour?: string; // Exposed as --social-icons-list-brand-colour on the item, for recipes
}
```

The rendered `href` is `${baseHref}${profileId}`.

---

## Slots

Both are scoped and receive `{ item }` (the `ISocialIcon`). Types: `SocialIconsListSlots`.

| Slot | Replaces | Notes |
|------|----------|-------|
| `icon` | The `<Icon>` inside `.social-icons-list-icon-wrapper` | The wrapper is `aria-hidden` and keeps the size and circle tokens, so slot content (an initial, `DisplayAvatar`, an image) is decorative and sized by `--social-icons-list-icon-size`. |
| `label` | The visible `networkName` text | Filling it shows the label without `showLabel` (e.g. name plus `@handle`). |

Slot content sits inside the link: keep it non-interactive (no buttons or nested links).

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

Mono equivalents for recipes, with brand colours: `bi:facebook` (`#1877f2`), `bi:twitter-x` (`#000000`), `bi:instagram` (`#e1306c`), `bi:youtube` (`#ff0000`), `bi:tiktok` (`#000000`).

`logos:instagram-icon`, `logos:x` and other dark brand icons vanish on a dark background, and their colours can't be changed. On a dark background use a mono icon such as `mdi:instagram` (any set that draws in `currentColor`) and colour it with `--social-icons-list-icon-colour` (default `currentColor`). Installed mono Instagram icons: `mdi:instagram`, `bi:instagram`, `lucide:instagram`, `akar-icons:instagram-fill`, `radix-icons:instagram-logo`.

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
| `--social-icons-list-icon-size` | `2.4rem` | Icon size (a `font-size` on the icon wrapper) |
| `--social-icons-list-gap` | `1.2rem` | Gap between items |
| `--social-icons-list-icon-colour` / `-hover` | `currentColor` | Mono icons only; `logos:` colours are fixed |
| `--social-icons-list-link-padding` / `-border` / `-radius` / `-background` / `-background-hover` / `-shadow` / `-shadow-hover` / `-gap` | none / `0.8rem` gap | Turn links into tiles or pills |
| `--social-icons-list-icon-wrapper-padding` / `-border` / `-radius` / `-background` | none | Circle or tile behind the icon |
| `--social-icons-list-label-colour` / `-font-size` / `-font-weight` | `currentColor` / `--step-4` / `600` | Visible label |
| `--social-icons-list-hover-scale` | `1.15` | Hover/focus scale (none under reduced motion) |
| `--social-icons-list-hover-opacity` | `0.85` | Hover/focus opacity |
| `--social-icons-list-focus-ring-colour` | `var(--theme-ring, currentColor)` | Keyboard focus outline |

Full table with defaults in `CONSUMER-STYLING.md`. **Tokens that read `--social-icons-list-brand-colour` must be set on `.social-icons-list-item`**, where the brand colour is defined: a `var()` in a custom property resolves on the declaring element, so set on the list root it finds nothing. Four recipes (mono tiles with brand hover, dark dock with glow, labelled pills, overlapping stack) are in `stories/social-icons-list-recipes.css` and the `Recipe: …` stories; reuse them rather than inventing new structure.

> Renamed 2026-09-28 from `--theme-social-icon-size` / `--theme-social-icon-gap`. Inner classes renamed 2026-10-16 (`.social-icon-item`/`-link`/`.social-icon` are now `.social-icons-list-item`/`-link`/`-icon`). Full reference: `CONSUMER-STYLING.md` in the component folder.

The size token is a `font-size` on `.social-icons-list-icon-wrapper`, whose content box is a fixed `1em` square (`box-sizing: content-box`, padding added around it). The default icon fills it, any `icon` slot content is centred in it, and an icon name that doesn't resolve still leaves a visible, focusable target. With uniform `--social-icons-list-icon-wrapper-padding` and a `50%` radius it's always a circle; slot content bigger than `1em` overflows the square, so size it to fit (e.g. `font-size: 0.8em` for a letter).

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

    .social-icons-list-link {
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
- An item is skipped (with a dev-mode `console.warn`) when its `baseHref + profileId` isn't `http:`/`https:`, `mailto:`, `tel:` or a site-relative `/path`: `items` often comes from a CMS, and a `javascript:` href would otherwise render as a working link. `mailto:` and `tel:` items are fine, so email and phone can sit in the same row.
- Keys are `index + networkName`, so two accounts on the same network (two Instagram profiles) both render.
- The `<ul>` has `role="list"`: with `list-style: none`, Safari/VoiceOver stops announcing it as a list otherwise.
- Each link's `aria-label` comes from `linkLabelTemplate` (default `"{network} profile (opens in a new tab)"`, `{network}` = `networkName`), or the item's own `label`. Pass a translated template for other languages. The icon is `aria-hidden`.
- The `logos:*` Iconify collection requires `@iconify-json/logos` to be installed in the consumer app. Without it, icons will fall back to a CDN fetch (causing FOUC). See [icon-sets.md](../icon-sets.md).
- Auto-imported in Nuxt — no manual import needed.
