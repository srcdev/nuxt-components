---
name: DeepExpandingMenu
description: DeepExpandingMenu top-level nav with anchor-positioned popover child-link panels, browser support caveat, CSS token API
type: reference
---

# DeepExpandingMenu

## Overview

`DeepExpandingMenu` renders a top-level navigation row where each item is either a direct link
(`link.path` set) or a toggle button that opens a popover panel of child links. It's built on CSS
anchor-positioning (`anchor-name`/`position-anchor`/`anchor()`) and the native Popover API
(`popover`/`popovertarget`).

**Browser support caveat:** CSS anchor-positioning and the Popover API are both comparatively
recent — check current browser support before shipping this on a page that must work everywhere,
same caution as `ExpandingPanel`'s `::details-content` gap (CLAUDE.md pitfall #19). If broad
support is a hard requirement, use [`DeepExpandingMenuClassic`](deep-expanding-menu-classic.md)
instead — same API and visual result, built on `<details>`/`<summary>` +
`onClickOutside` instead.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "nav" \| "ul" \| "ol"` | `"nav"` | Root element tag. |
| `navLinks` | `ResponsiveHeaderNavItem[]` | `[]` | Top-level nav items. An item with `path` renders as a direct link; an item with `childLinks` renders as a toggle + popover panel. |
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
  <DeepExpandingMenu :nav-links="navLinks" />
</template>
```

## CSS custom properties

| Property | Default | Controls |
|----------|---------|----------|
| `--deep-expanding-menu-gap` | `2.4rem` | Gap between top-level items |
| `--deep-expanding-menu-link-border-width` | `0.2rem` | Bottom border width on links/toggles |
| `--deep-expanding-menu-link-padding-block` | `0.8rem` | Vertical padding on links/toggles |
| `--deep-expanding-menu-link-border-colour-hover` | `light-dark(var(--blue-10), var(--slate-00))` | Bottom border colour on hover/focus |
| `--deep-expanding-menu-icon-size` | `1.2rem` | Caret icon size |
| `--deep-expanding-menu-panel-width` | `min(100%, 50vw)` | Popover panel width |
| `--deep-expanding-menu-panel-background-colour` | `white` | Popover panel background |
| `--deep-expanding-menu-panel-border-width` | `0.1rem` | Popover panel border width |
| `--deep-expanding-menu-panel-border-colour` | `black` | Popover panel border colour |
| `--deep-expanding-menu-panel-border-radius` | `1.2rem` | Popover panel corner radius |
| `--deep-expanding-menu-panel-shadow` | `0 0 1rem rgba(0, 0, 0, 0.1)` | Popover panel box-shadow |
| `--deep-expanding-menu-panel-padding` | `1.2rem` | Popover panel padding |
| `--deep-expanding-menu-panel-heading-colour` | `var(--slate-10)` | `childLinksTitle` heading colour |
| `--deep-expanding-menu-panel-list-gap` | `1.2rem` | Gap between child link grid items |
| `--deep-expanding-menu-group-link-colour` | `var(--slate-10)` | Child link text colour |
| `--deep-expanding-menu-group-link-border-colour-hover` | `var(--slate-10)` | Child link bottom border colour on hover/focus |

See `CONSUMER-STYLING.md` for the full token API and what's not tokenised.

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Anchor names and popover target ids are generated per-instance via `useId()`, so multiple
  instances on one page don't collide.
- 2026-09-07 migration: moved from an unplaced top-level folder into
  `02.molecules/navigation/deep-expanding-menu/`; converted options-style `defineProps` to
  `interface Props` + `withDefaults`; the previous hardcoded `nav-1` anchor/popover id prefix
  (a multi-instance collision bug) was replaced with a `useId()`-scoped prefix; removed a dead,
  never-consumed `ref="detailsRef"` template ref; promoted 16 previously-hardcoded values (gap,
  border widths/colours, panel background/border/radius/shadow/padding, heading and link colours)
  to public CSS tokens.
- File: `app/components/02.molecules/navigation/deep-expanding-menu/DeepExpandingMenu.vue`
