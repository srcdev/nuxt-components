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
`<details>` element. Groups in one menu share a per-instance `name` (from `useId()`), so opening
one closes the others. A click outside the menu (`@vueuse/core` `onClickOutside`), a click
elsewhere inside it, Escape (focus returns to the group's `<summary>`) or following a child link
closes the open group.

Prefer `DeepExpandingMenu` unless the modern implementation's browser support isn't acceptable for
your target audience — see its own docs for the caveat.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "nav"` | `"nav"` | Root element tag. `ul`/`ol` were dropped 2026-10-21: the root wraps a `<div>`, so they rendered invalid HTML. |
| `ariaLabel` | `string` | `undefined` | Accessible name on the root. Set it when the page has more than one `<nav>`. |
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

Public tokens are all `--deep-expanding-menu-classic-*`: item gap, link border/padding/hover
colour, focus ring, icon size, and the panel's offset, three container-width tiers, colours,
border, radius, shadow, padding, heading line clamp, list gap and child link colours. Colours
default from `--theme-text`, `--theme-border`, `--theme-surface-subtle` and `--theme-ring`. The
full table with defaults, the prefixed class names and the sizing model are in this component's
`CONSUMER-STYLING.md`.

## Data handling

- An item with `path` is a link; anything else is a `<details>` group. An empty `path` is a group.
- A group's heading renders only when `childLinksTitle` is non-empty, and its list only when
  `childLinks` has items.
- Child links are keyed on index + name, so duplicate names are safe.
- Long or unbroken labels wrap, the top-level row wraps onto more lines, and each panel is capped
  at the menu's width. A panel opens from its toggle's left edge and doesn't flip, so near the
  right edge it can overrun the menu. The `StressTest` story covers all of these.

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Until 2026-10-21 every instance used the fixed `name="navigation-group"`, so all menus on a page
  formed one exclusive group (opening a panel in one menu closed another menu's), and the doc
  wrongly said siblings didn't auto-close. Click-outside listeners were also bound per group in
  `onMounted`, so groups added later never closed.
- 2026-10-21 migration: prefixed every structural class, moved colours to `--theme-*`, panel
  offset to `calc(100% + 1rem)`, panel widths from viewport `@media` to `@container`, removed
  the no-op `--deep-expanding-menu-classic-gap` and a `display: flex !important`, added
  `ariaLabel`, Escape and link-follow closing, a `:focus-visible` ring, `role="list"`, an
  `aria-hidden` caret, the heading line-clamp token and the `StressTest` story.
- 2026-09-07 migration: moved from an unplaced top-level folder (was `DeepExpandingMenuOld.vue`)
  into `02.molecules/navigation/deep-expanding-menu-classic/`; converted options-style
  `defineProps` to `interface Props` + `withDefaults`; switched its locally-declared
  `ResponsiveHeaderNavItem` interface to the shared exported type from `~/types/components`
  (was a duplicate, drift-prone copy); removed a dead, unused `:id="popovertarget-nav-1-..."`
  attribute left over from copying the modern implementation (this component doesn't use the
  Popover API); promoted 19 previously-hardcoded values to public CSS tokens.
- File: `app/components/02.molecules/navigation/deep-expanding-menu-classic/DeepExpandingMenuClassic.vue`
