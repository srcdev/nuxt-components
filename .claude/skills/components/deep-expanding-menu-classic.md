---
name: DeepExpandingMenuClassic
description: DeepExpandingMenuClassic <details>-based top-level nav with click-outside close, CSS token API
type: reference
---

# DeepExpandingMenuClassic

## Overview

`<details>`/`<summary>`-based fallback for [`DeepExpandingMenu`](deep-expanding-menu.md) — same
props, same `ResponsiveHeaderNavItem` data shape, same visual result, but built without CSS
anchor-positioning or the Popover API. Each nav item with `childLinks` renders as a native
`<details>` element; opening one and clicking outside it closes it again via `@vueuse/core`'s
`onClickOutside`.

Prefer `DeepExpandingMenu` unless the modern implementation's browser support isn't acceptable for
your target audience — see its own docs for the caveat.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "nav" \| "ul" \| "ol"` | `"nav"` | Root element tag. |
| `navLinks` | `ResponsiveHeaderNavItem[]` | `[]` | Top-level nav items. An item with `path` renders as a direct link; an item with `childLinks` renders as a `<details>` group. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

`ResponsiveHeaderNavItem` is exported from `~/types/components` (shared with `ResponsiveHeader`).

## Basic usage

```vue
<script setup lang="ts">
import type { ResponsiveHeaderNavItem } from "~/types/components";

const navLinks: ResponsiveHeaderNavItem[] = [
  { name: "Home", path: "/" },
  {
    name: "Services",
    childLinksTitle: "Our services",
    childLinks: [
      { name: "Haircuts", path: "/services/haircuts" },
      { name: "Colouring", path: "/services/colouring" },
    ],
  },
];
</script>

<template>
  <DeepExpandingMenuClassic :nav-links="navLinks" />
</template>
```

## CSS custom properties

| Property | Default | Controls |
|----------|---------|----------|
| `--deep-expanding-menu-classic-gap` | `1.2rem` | Gap on the root grid |
| `--deep-expanding-menu-classic-item-gap` | `2.4rem` | Gap between top-level items |
| `--deep-expanding-menu-classic-link-border-width` | `0.2rem` | Bottom border width on links/toggles |
| `--deep-expanding-menu-classic-link-padding-block` | `0.8rem` | Vertical padding on links/toggles |
| `--deep-expanding-menu-classic-link-border-colour-hover` | `light-dark(var(--blue-10), var(--slate-00))` | Bottom border colour on hover/focus |
| `--deep-expanding-menu-classic-icon-size` | `1.2rem` | Caret icon size |
| `--deep-expanding-menu-classic-panel-offset-top` | `4rem` | Panel offset from the toggle |
| `--deep-expanding-menu-classic-panel-width` | `20rem` | Panel width below `768px` |
| `--deep-expanding-menu-classic-panel-width-tablet` | `40rem` | Panel width from `768px` |
| `--deep-expanding-menu-classic-panel-width-desktop` | `60rem` | Panel width from `1024px` |
| `--deep-expanding-menu-classic-panel-background-colour` | `white` | Panel background |
| `--deep-expanding-menu-classic-panel-border-width` | `0.1rem` | Panel border width |
| `--deep-expanding-menu-classic-panel-border-colour` | `black` | Panel border colour |
| `--deep-expanding-menu-classic-panel-border-radius` | `1.2rem` | Panel corner radius |
| `--deep-expanding-menu-classic-panel-shadow` | `0 0 1rem rgba(0, 0, 0, 0.1)` | Panel box-shadow |
| `--deep-expanding-menu-classic-panel-padding` | `1.2rem` | Panel padding |
| `--deep-expanding-menu-classic-panel-heading-colour` | `var(--slate-10)` | `childLinksTitle` heading colour |
| `--deep-expanding-menu-classic-panel-list-gap` | `1.2rem` | Gap between child link grid items |
| `--deep-expanding-menu-classic-group-link-colour` | `var(--slate-10)` | Child link text colour |
| `--deep-expanding-menu-classic-group-link-border-colour-hover` | `var(--slate-10)` | Child link bottom border colour on hover/focus |

See `CONSUMER-STYLING.md` for the full token API.

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Multiple `<details>` groups sharing `name="navigation-group"` means opening one does **not**
  auto-close siblings (unlike a native accordion) — each group closes independently via
  click-outside.
- 2026-09-07 migration: moved from an unplaced top-level folder (was `DeepExpandingMenuOld.vue`)
  into `02.molecules/navigation/deep-expanding-menu-classic/`; converted options-style
  `defineProps` to `interface Props` + `withDefaults`; switched its locally-declared
  `ResponsiveHeaderNavItem` interface to the shared exported type from `~/types/components`
  (was a duplicate, drift-prone copy); removed a dead, unused `:id="popovertarget-nav-1-..."`
  attribute left over from copying the modern implementation (this component doesn't use the
  Popover API); promoted 19 previously-hardcoded values to public CSS tokens.
- File: `app/components/02.molecules/navigation/deep-expanding-menu-classic/DeepExpandingMenuClassic.vue`
