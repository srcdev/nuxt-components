# ResponsiveHeader Component

## Overview

`ResponsiveHeader` is an adaptive main-navigation bar: it measures each nav item's real
rendered width on mount (and on resize), decides which items fit, and collapses whatever
doesn't fit into a burger/overflow dropdown rendered by `NavigationItems`. Supports
multi-level dropdowns (`childLinks`) at both the top-bar and overflow-panel level.

Most consumers should reach for [`SiteHeader`](site-header.md) instead, which wraps this
component together with `PageRow` and `SkipLinks` — use `ResponsiveHeader` directly only if
you need a different outer page-header structure.

[`NavigationItems`](navigation-items.md) is an internal component rendered inside
`ResponsiveHeader`'s overflow panel — it's not meant to be used standalone in a real app,
though it's independently testable/storyable.

---

## The measurement pipeline (read this before touching layout/CSS here)

On mount, a two-phase pass measures `navigationWrapperRects`/`secondaryNavRects`/each nav
item's `getBoundingClientRect()`/`offsetWidth`, then marks each item's `config.visible`.
Items with `visible: false` get a `visually-hidden` class in the top bar and are handed to
`NavigationItems` to render in the overflow panel instead. The pass re-runs on
`ResizeObserver` events targeting the root `.navigation` element, and once more after
`document.fonts.ready` resolves (a fonts-still-loading correction).

**This pipeline only re-measures when the *observed wrapper's own box size* changes.** Two
known failure modes, both fixed 2026-08-21 — keep them in mind before adding new nav content:

1. **Unsized async content (icons).** The chevron and any `iconName` decorator icons render
   via the `Icon` component, which resolves its SVG asynchronously. If an icon element has no
   reserved `width`/`height`, it measures at ~0 during the pass and then pops in and widens
   the item afterward — with nothing to detect it, since the wrapper's box didn't change size.
   `.decorator-icon` and the chevron `.icon` both reserve `1.35em` square for this reason.
   Any new icon-bearing element added to a nav item must reserve its own size too.
2. **Viewport-relative (`vw`/`clamp()`) font-size.** `html` has `scrollbar-gutter: stable`,
   which keeps the wrapper's own box width constant when the scrollbar toggles — but does
   nothing to stabilise the `vw` unit itself, so a fluid ancestor font-size can drift nav-item
   text width without ever re-triggering a re-measurement. This is why
   `--responsive-header-link-font-size` exists (see tokens below) — set it to a fixed value
   rather than leaving it to inherit a fluid ancestor font-size.

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `responsiveNavLinks` | `ResponsiveHeaderProp` (`{ [groupKey]: ResponsiveHeaderNavItem[] }`) | `{}` | Nav groups. Each item is either a link (`path`) or a dropdown (`childLinksTitle` + `childLinks`). A single group with no dropdowns is valid for simple sites. |
| `gapBetweenFirstAndSecondNav` | `number` | `12` | Pixel gap reserved between the first and second nav groups (also factored into the overflow-collapse width math). |
| `overflowDetailsSummaryIcons` | `Record<string, string>` | `{ more: "gravity-ui:ellipsis", burger: "gravity-ui:bars" }` | Icon names for the overflow button's two states: `more` shows when only *some* items collapsed, `burger` shows when `allowNavigationCollapse` is active (whole nav collapsed). |
| `collapseBreakpoint` | `number \| null` | `null` | A fixed pixel width below which the whole main nav collapses into the overflow burger, instead of the default per-item responsive collapse. |
| `collapseAtMainNavIntersection` | `boolean` | `false` | Like `collapseBreakpoint`, but the breakpoint is derived automatically from the main nav's own measured width rather than a fixed number. |
| `allowExpandOnGesture` | `boolean` | `true` | When `true`, hovering/focusing a dropdown summary opens it (in addition to click). When `false`, only click toggles it. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `.navigation` element. |

## Slots

| Slot | Purpose |
|------|---------|
| `#secondaryNavigation` | Extra content rendered after the overflow burger button (e.g. a settings icon link). Only rendered when the slot is provided. |

---

## Public CSS token API

All tokens are read via `var(--token, default)` — see the full list in the component's own
`<style>` block comment. Highlights:

| Token | Default | Controls |
|---|---|---|
| `--responsive-header-link-font-size` | `inherit` | Nav-link font-size. **Set this to a fixed value** — see the measurement-pipeline note above for why leaving it `inherit` from a fluid ancestor is a footgun. |
| `--responsive-header-link-color` | `inherit` | Link/summary text colour. |
| `--responsive-header-bg` / `--responsive-header-padding-*` / `--responsive-header-border*` | transparent / `0` / `none` | Root element theming. |
| `--responsive-header-overflow-btn-*` | various | Overflow burger button sizing/colour. |
| `--responsive-header-sub-nav-*` / `--responsive-header-overflow-nav-*` | various | Top-bar dropdown panel and overflow-panel container theming. |
| `--responsive-nav-decorator-indicator-color` / `--responsive-nav-decorator-hovered-*` | `currentColor` / inherits | The sliding active/hover indicator bar under the main nav. |

---

## Usage example

```vue
<script setup lang="ts">
const responsiveNavLinks = {
  firstNav: [
    { name: "Home", path: "/" },
    {
      name: "Components",
      childLinksTitle: "UI Components",
      childLinks: [{ name: "Buttons", path: "/forms/examples/buttons" }],
    },
  ],
  secondNav: [{ name: "Contact", path: "/contact" }],
};
</script>

<template>
  <ResponsiveHeader :responsive-nav-links="responsiveNavLinks" :style-class-passthrough="['site-header-nav']">
    <template #secondaryNavigation>
      <NuxtLink to="/settings" aria-label="Settings">
        <Icon name="material-symbols:settings-outline-rounded" />
      </NuxtLink>
    </template>
  </ResponsiveHeader>
</template>
```
