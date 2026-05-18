# TabNavigation

## Overview

A responsive horizontal navigation bar with CSS anchor-positioning indicators, smooth anchor
scroll, and a burger-menu collapse at narrow widths. Accepts both route links (`NuxtLink`) and
hash anchors (`<a>`). Items are driven by a `NavItemData` object; the component only reads the
`main` key.

---

## Types

Import from the layer package root — do **not** use `~/types/...` in consuming apps:

```ts
import type { NavItemData } from "srcdev-nuxt-components"
```

```ts
interface NavItem {
  text: string;
  href?: string;
  isExternal?: boolean; // adds target="_blank" rel behaviour via NuxtLink
  iconName?: string;    // icon set name, rendered via <Icon>
  cssName?: string;     // extra CSS class on the <li>
}

interface NavItemData {
  [key: string]: NavItem[]; // component reads navItemData.main
}
```

---

## Props

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `nav-item-data` | `NavItemData` | required | Navigation link data — only `main` key is read |
| `nav-align` | `"left" \| "center" \| "right"` | `"left"` | Positions the tab list within the nav container |
| `anchor-scroll-offset` | `number \| (() => number)` | — | Pixel offset subtracted from scroll target; pass a getter so it is re-evaluated at click time |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root `<nav>` element |

---

## Basic usage — route links

```vue
<TabNavigation :nav-item-data="navData" nav-align="center" />
```

```ts
import type { NavItemData } from "srcdev-nuxt-components"

const navData: NavItemData = {
  main: [
    { text: "Home", href: "/" },
    { text: "About", href: "/about" },
    { text: "Services", href: "/services" },
    { text: "Contact", href: "/contact" },
  ],
}
```

Items without a leading `#` render as `NuxtLink`. The active indicator tracks the current route
via `router-link-exact-active`.

---

## Anchor scroll usage

Hash-prefixed hrefs render as plain `<a>` elements to keep Vue Router out of the scroll path.
Pass a getter for the offset so the sticky bar height is read at click time (not at mount).

```vue
<div ref="stickyRef" class="sticky-nav">
  <TabNavigation
    :nav-item-data="anchorData"
    :anchor-scroll-offset="() => stickyRef?.offsetHeight ?? 0"
  />
</div>
```

```ts
const stickyRef = ref<HTMLElement | null>(null)

const anchorData: NavItemData = {
  main: [
    { text: "Overview", href: "#overview" },
    { text: "Features", href: "#features" },
    { text: "Pricing", href: "#pricing" },
  ],
}
```

Clicks are handled by `useAnchorScroll`. Respects `prefers-reduced-motion` — motion-sensitive
users get an instant jump rather than smooth scroll. See the `composable-anchor-scroll.md` skill
for the full composable reference.

### Mixed navigation

Route links and hash anchors can coexist in the same `navItemData`:

```ts
const navData: NavItemData = {
  main: [
    { text: "Home", href: "/" },          // NuxtLink
    { text: "Overview", href: "#intro" }, // <a> + smooth scroll
    { text: "Blog", href: "/blog" },      // NuxtLink
  ],
}
```

---

## Responsive collapse

`useNavCollapse` measures the nav list on every resize. When the list overflows its container it
is hidden and replaced with a burger button. The button opens a slide-down panel listing all items.

The nav hides itself (opacity 0) until the first measurement completes to prevent a flash of the
wrong state.

---

## Alignment variants

```vue
<TabNavigation :nav-item-data="navData" nav-align="left" />   <!-- default -->
<TabNavigation :nav-item-data="navData" nav-align="center" />
<TabNavigation :nav-item-data="navData" nav-align="right" />
```

`center` and `right` use `margin-inline: auto` / `margin-inline-start: auto` on the `ul`.

---

## CSS token API

Set `--tab-nav-*` tokens on any ancestor element — no prop needed. See `CONSUMER-STYLING.md` in
the component source folder for the full token reference.

### Horizontal nav

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-link-color` | `var(--slate-01, currentColor)` | Link text colour |
| `--tab-nav-link-hover-color` | `var(--slate-04, currentColor)` | Link hover colour |
| `--tab-nav-link-active-color` | `var(--slate-01, currentColor)` | Active link colour |
| `--tab-nav-link-size` | `1.6rem` | Font size |
| `--tab-nav-link-weight` | `400` | Font weight |
| `--tab-nav-link-tracking` | `0.06em` | Letter spacing |
| `--tab-nav-gap` | `2.2rem` | Gap between items |
| `--tab-nav-transition` | `250ms ease` | Colour fade on hover/active |

### Indicator decorators

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-decorator-indicator-color` | `var(--slate-01, currentColor)` | Active underline bar colour |
| `--tab-nav-decorator-hovered-bg` | `transparent` | Hover pill background (set non-transparent to enable) |

### Mobile panel

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-panel-bg` | `var(--page-bg, #1a1614)` | Panel background |
| `--tab-nav-panel-border-color` | `color-mix(in oklch, var(--slate-01) 35%, transparent)` | Panel top border |
| `--tab-nav-panel-item-border` | `color-mix(in oklch, var(--slate-01) 8%, transparent)` | Item dividers |
| `--tab-nav-panel-link-color` | `var(--slate-01, currentColor)` | Panel link colour |
| `--tab-nav-panel-padding-block` | `1.4rem` | Link vertical padding |
| `--tab-nav-panel-padding-inline` | `1.5rem` | Link horizontal padding |
| `--tab-nav-panel-slide-duration` | `350ms` | Panel open/close duration |
| `--tab-nav-panel-slide-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Panel easing |

### Burger button

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-burger-color` | `var(--slate-01, currentColor)` | Bar colour |
| `--tab-nav-burger-width` | `22px` | Bar width |
| `--tab-nav-burger-height` | `1.5px` | Bar height |
| `--tab-nav-burger-gap` | `5px` | Gap between bars |
| `--tab-nav-burger-transition` | `300ms ease` | Open/close animation |

### Backdrop

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-backdrop-bg` | `oklch(0% 0 0 / 55%)` | Overlay colour |
| `--tab-nav-backdrop-blur` | `3px` | Overlay blur |
| `--tab-nav-backdrop-duration` | `350ms` | Overlay fade duration |

### Page-scoped theme example

```css
/* Unscoped <style> in the consuming page */
.services-page {
  .tab-navigation {
    --tab-nav-decorator-indicator-color: var(--brand-accent);
    --tab-nav-decorator-hovered-bg: oklch(from var(--brand-accent) l c h / 0.1);
    --tab-nav-link-active-color: var(--brand-accent);
    --tab-nav-panel-bg: var(--page-bg);
  }
}
```

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- The indicator and hover pill use CSS Anchor Positioning and animate via `left`/`right` transitions
  — set `--tab-nav-decorator-hovered-bg` to a semi-transparent colour to enable the pill; it is
  invisible by default.
- `--tab-nav-transition` controls only the link colour fade; the indicator slide animation is
  internally managed and does not inherit this token.
- The panel teleports its backdrop to `<body>` so it escapes any parent `overflow: hidden` or
  stacking-context constraint.
- `--tab-nav-panel-bg` should match `--page-bg` for a seamless panel appearance in the collapsed
  state.
