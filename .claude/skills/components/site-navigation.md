# SiteNavigation

## Overview

`SiteNavigation` is a responsive site-wide navigation component. It renders a horizontal link list on wide viewports and automatically collapses to a burger-menu + slide-down panel on narrow viewports. Collapse is driven by a `ResizeObserver` that compares the list's natural `scrollWidth` against the nav container's `clientWidth` — no breakpoint prop needed.

Both the horizontal list and the panel include animated active/hover indicator decorators (underline indicator + background highlight) that snap into position using CSS custom properties set via JavaScript.

## Component location

`app/components/02.molecules/navigation/site-navigation/SiteNavigation.vue`

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `navItemData` | `NavItemData` | — (required) | Navigation items — see type below |
| `navAlign` | `"left" \| "center" \| "right"` | `"left"` | Alignment of the horizontal nav list |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root `<nav>` |

## NavItemData type

```ts
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

const navItemData: NavItemData = {
  main: [
    { text: "Home",     href: "/" },
    { text: "About",    href: "/about" },
    { text: "Services", href: "/services", cssName: "is-featured" },
    { text: "Contact",  href: "/contact", iconName: "heroicons:envelope", isExternal: false },
  ],
};
```

`NavItem` fields:

| Field | Type | Description |
|---|---|---|
| `text` | `string` | Link label |
| `href` | `string` | Link destination |
| `isExternal` | `boolean?` | Passed to NuxtLink `:external` — opens in new tab |
| `iconName` | `string?` | Iconify icon name rendered before the label |
| `cssName` | `string?` | CSS class applied to the `<li>` element |

## Basic usage

```vue
<SiteNavigation :nav-item-data="navItemData" nav-align="left" />
```

Always use hyphenated prop names in templates (ESLint enforces this).

## CSS token API

Set these tokens on a parent element (e.g. your `<header>`) to theme the navigation.

```css
.your-header {
  /* ── Decorators ────────────────────────────────────── */
  --site-nav-decorator-indicator-color: var(--rose-05);  /* underline bar */

  /* ── Horizontal nav links ──────────────────────────── */
  --site-nav-link-color:        var(--warm-01);
  --site-nav-link-hover-color:  var(--rose-04);
  --site-nav-link-active-color: var(--rose-05);
  --site-nav-link-size:         1.6rem;
  --site-nav-link-weight:       400;
  --site-nav-link-tracking:     0.06em;
  --site-nav-gap:               2.2rem;
  --site-nav-transition:        250ms ease;

  /* ── Mobile panel ──────────────────────────────────── */
  --site-nav-panel-bg:                  var(--page-bg, #1a1614);
  --site-nav-panel-border-color:        color-mix(in oklch, var(--rose-05) 35%, transparent);
  --site-nav-panel-link-color:          var(--warm-01);
  --site-nav-panel-link-hover-color:    var(--rose-04);
  --site-nav-panel-link-active-color:   var(--rose-05);
  --site-nav-panel-padding-block:       1.4rem;
  --site-nav-panel-padding-inline:      1.5rem;
  --site-nav-panel-slide-duration:      350ms;
  --site-nav-panel-slide-easing:        cubic-bezier(0.4, 0, 0.2, 1);
  --site-nav-panel-decorator-indicator-color: var(--rose-05);
  --site-nav-panel-indicator-left:      0;      /* position the panel indicator bar */
  --site-nav-panel-indicator-right:     auto;

  /* ── Burger button ─────────────────────────────────── */
  --site-nav-burger-color:      var(--warm-01);
  --site-nav-burger-width:      22px;
  --site-nav-burger-height:     1.5px;
  --site-nav-burger-gap:        5px;
  --site-nav-burger-transition: 300ms ease;

  /* ── Backdrop (teleported to <body>) ───────────────── */
  --site-nav-backdrop-bg:       oklch(0% 0 0 / 55%);
  --site-nav-backdrop-blur:     3px;
  --site-nav-backdrop-duration: 350ms;
}
```

## Behaviour notes

- **Collapse detection**: `ResizeObserver` fires on every container resize. The list's `scrollWidth` is cached whenever the list is in the DOM; that cached value is compared against the container's `clientWidth` to set `isCollapsed`.
- **isLoaded state**: The component uses `useState("site-nav-loaded")` — a Nuxt shared state — to gate visibility until the first measurement is complete, preventing a flash of the wrong nav state on load. The nav renders `opacity: 0` until `is-loaded` is applied.
- **Teleport**: The backdrop overlay is teleported to `<body>` via `<Teleport>` and is only mounted when `isCollapsed && isLoaded`.
- **Panel inert**: The `#site-nav-panel` div receives `:inert="!isMenuOpen ? true : undefined"` — it is inert (keyboard/pointer-inaccessible) when closed.
- **Decorator init**: `initNavDecorators()` and `initPanelDecorators()` inject `<li>` elements with CSS-driven indicator `<div>`s. They query `[data-nav-item]` / `[data-panel-nav-item]` to find links, and look for `router-link-active` to set the initial active position.

## Accessibility

- Root `<nav>` has `aria-label="Site navigation"`.
- Burger button uses `aria-expanded` (string `"true"/"false"`) and `aria-controls="site-nav-panel"`.
- Backdrop and indicator `<li>` elements are `aria-hidden="true"`.
- Panel div is `inert` when closed.

## Related files

- Type: `app/types/components/navigation-horizontal.d.ts`
- Tests: `app/components/02.molecules/navigation/site-navigation/tests/SiteNavigation.spec.ts`
- Story: `app/components/02.molecules/navigation/site-navigation/stories/SiteNavigation.stories.ts`
