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

## Known issue: SSR/hydration layout shift when the nav needs to collapse (2026-07-07)

**Symptom:** on first page load (hard reload/direct navigation), the header briefly renders taller
than its settled state, then shrinks — visibly shifting all content below it up. Most noticeable on
short pages (little content below the fold makes the jump occupy a large fraction of the viewport),
but the same underlying reflow happens on every page where the nav actually needs to collapse at
the viewport's width; it's just less visible on long pages or when the timing happens to resolve
before first paint.

**Root cause:** `useNavCollapse`'s `isLoaded` ref (and therefore `isCollapsed`) can only be
determined client-side — the server has no way to measure real DOM/viewport widths. So:

```vue
<ul v-if="!isCollapsed || !isLoaded" ...>
```

SSR and the very first client paint always render the **full, uncollapsed** `<ul>` (since
`!isLoaded` is true pre-mount), regardless of whether it will actually fit. Once mounted,
`checkOverflow()` runs (in `onMounted`, after `nextTick()`), and if the nav overflows, sets
`isCollapsed = true` — swapping the full list out for the shorter collapsed/burger variant. That
swap is what shrinks the header and shifts everything below it.

Confirmed via `PerformanceObserver({type: "layout-shift"})` plus DOM `MutationObserver` tracing in a
consuming app (`luxury-locs-by-natasha-nuxt3`): the class mutation on `.tab-navigation` (adding
`is-loaded is-animated`) lines up exactly with `.main-content`'s bounding-rect top moving by the
header's full height delta, at a variable point (roughly 100ms–800ms after first paint depending on
hydration timing) after first paint.

**Candidate fixes (not yet implemented — pick up later):**

1. **CSS-only collapse instead of JS-measured overflow.** Use a `@container` or `@media` breakpoint
   to switch between the full nav and the burger button, so the correct variant renders on the very
   first paint (both server and client agree, no measurement round-trip needed). Loses the
   "collapse exactly when it overflows, regardless of item count" precision of the current
   JS-measured approach, gains zero-reflow correctness. Probably the most robust fix if a
   reasonably conservative breakpoint can be chosen.
2. **Reserve height instead of eliminating the swap.** Give the header a `min-height` matching the
   taller (uncollapsed) state so the swap doesn't change the header's box size — trades a visible
   "jump" for a slightly awkward gap during the pre-collapse window, but never moves content below
   it. Cheap, but doesn't fix the actual root cause, just its visible symptom.
3. **Suppress the flash rather than the shift**, e.g. hide the header's nav content entirely
   (`visibility: hidden` or `opacity: 0`) until `isLoaded` is true, then fade in — avoids showing
   the "wrong" state at all, but delays when the nav becomes visible/interactive, and would need
   care to avoid its own CLS/accessibility issues (e.g. focus order, screen readers encountering
   hidden nav).
4. Investigate whether a plausible default guess for `isCollapsed` could be derived from something
   SSR does have access to (e.g. a `Sec-CH-Viewport-Width` client hint header, if the deployment
   target reliably sends one) — likely not worth the complexity/fragility versus option 1.
