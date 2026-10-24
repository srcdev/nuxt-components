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

**Browser support:** since 2026-10-05 open/close and positioning go through the shared
`useAnchoredPopover` composable (see `composable-anchored-popover.md`), so the menu also works
without anchor positioning (Safari 17–18: JS-measured `position: fixed`) and without the Popover
API (Safari 16: JS open/close, outside click and Escape). Before that, panels never opened on
Safari 16. [`DeepExpandingMenuClassic`](deep-expanding-menu-classic.md) is still the alternative
built on `<details>`/`<summary>`: same API and visual result, with no popover layer involved.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "nav"` | `"nav"` | Root element tag. `ul`/`ol` were dropped 2026-10-21: the root wraps a `<div>`, so they rendered invalid HTML. |
| `ariaLabel` | `string` | `undefined` | Accessible name on the root. Set it when the page has more than one `<nav>`. |
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

Public tokens are all `--deep-expanding-menu-*`: row gap, link border/padding/hover colour, focus
ring, icon size, and the panel's width, max height, colours, border, radius, shadow, padding,
heading line clamp, list gap and child link colours. Colours default from `--theme-text`,
`--theme-border`, `--theme-surface-subtle` and `--theme-ring`. The full table with defaults, the
prefixed class names and the state hooks are in this component's `CONSUMER-STYLING.md`.

## Data handling

- An item with `path` is a link; anything else is a group (toggle + panel). An empty `path` is a group.
- A group's heading renders only when `childLinksTitle` is non-empty, and its list only when
  `childLinks` has items, so an empty group opens a panel with just its heading.
- Child links are keyed on index + name, so duplicate names are safe.
- Long or unbroken labels wrap (`overflow-wrap: anywhere`), the top-level row wraps onto more
  lines, panel lists longer than `--deep-expanding-menu-panel-max-height` scroll, and a panel near
  the right edge flips to align with its toggle's right edge where anchor positioning is supported.
  The `StressTest` story covers all of these.

## Notes

- Auto-imported in Nuxt — no manual import needed.
- Anchor names and popover target ids are generated per-instance via `useId()`, so multiple
  instances on one page don't collide.
- One `useAnchoredPopover` instance serves every group: `activeKey` tracks the open group, and the
  composable's `triggerRef`/`popoverRef` are computeds over per-group element maps (filled by
  function refs). Native `toggle` events for two auto popovers can arrive in either order (B opens,
  then A closes), so a close event is ignored unless it's for the active group.
- Clicking a link inside a panel hides it. The menu usually lives in a layout and outlives route
  changes, and auto popovers only light-dismiss on outside clicks, so a followed link left the panel
  open on the next page until 2026-10-24.
- Each group toggle has `aria-expanded`; the caret flip keys off it rather than
  `:has(:popover-open)`, so it works in the fallback too.
- Panels have no ARIA role: this is the disclosure-navigation pattern (a toggle with
  `aria-expanded` revealing ordinary links), not an ARIA menu. `role="menu"` was removed 2026-10-05
  because it requires `menuitem` children and arrow-key handling the panels don't have, so screen
  readers announced a menu that didn't behave like one. Don't add it back.
- 2026-10-21 migration: prefixed every structural class (`.inner`, `.navigation-*`, `.icon` became
  `.deep-expanding-menu-*`), moved colour defaults to `--theme-*` tokens, added `ariaLabel`, a
  `:focus-visible` ring, `role="list"` on the child list, an `aria-hidden` caret, the heading
  line-clamp and max-height tokens, `position-try-fallbacks: flip-inline`, and the `StressTest` story.
- 2026-10-05: removed two never-referenced `@position-try` blocks (`--anchor-left`, and an invalid
  `@position-try-fallbacks --anchor-right` at-rule).
- 2026-09-07 migration: moved from an unplaced top-level folder into
  `02.molecules/navigation/deep-expanding-menu/`; converted options-style `defineProps` to
  `interface Props` + `withDefaults`; the previous hardcoded `nav-1` anchor/popover id prefix
  (a multi-instance collision bug) was replaced with a `useId()`-scoped prefix; removed a dead,
  never-consumed `ref="detailsRef"` template ref; promoted 16 previously-hardcoded values (gap,
  border widths/colours, panel background/border/radius/shadow/padding, heading and link colours)
  to public CSS tokens.
- File: `app/components/02.molecules/navigation/deep-expanding-menu/DeepExpandingMenu.vue`
