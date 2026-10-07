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

## The dropdown "safe triangle" (read this before touching hover-close logic)

`handleNavigationItemHover()` used to close every open top-bar dropdown the instant the mouse
entered **any** `.main-navigation-item` — including a sibling item the cursor only crossed in
transit. Moving the mouse diagonally from a dropdown's summary down into its own
`.main-navigation-sub-nav` panel briefly dips through the 12px gap between them
(`.main-navigation-sub-nav`'s `translate: 0 12px`), and at some cursor angles through a
neighbouring item's hit area — closing the dropdown before the user reached it.

**A pure-CSS "safe triangle" bridge (`clip-path` on a pseudo-element) was tried first and
reverted — don't reintroduce it without solving the problem below first.** For such a bridge to
escape `.main-navigation-item`'s `overflow: hidden` the same way `.main-navigation-sub-nav`
does, its *containing block* must resolve to `.navigation` (the only positioned ancestor above
the clipping box). But `.main-navigation-sub-nav` only manages this because it has no explicit
`top`/`left` (containing-block choice is irrelevant to where it visually lands) — a bridge
placed to *visually* sit under a specific trigger needs `top`/`left`/`inline-size` that resolve
against something local, which forces it onto a positioned ancestor, which is always either
already inside the `overflow: hidden` box (gets clipped, invisible, protects nothing) or itself
becomes the sub-nav's new containing block (moves the *panel* inside the clipped box instead —
the first attempt's mistake). A commented-out `/* position: relative; */` still sitting in the
`:last-child` override is evidence someone hit this exact trap once before, independently.
Neither approach is fixable without restructuring how the panel escapes clipping, which the
collapse-measurement pipeline depends on.

**Fixed (2026-08-21) with a JS hover-intent delay instead.** `handleNavigationItemHover()` now
calls `scheduleCloseAllNavigationDetails()`, which delays the actual close by
`HOVER_CLOSE_DELAY` (200ms) rather than firing it immediately. Two things cancel the pending
close before it fires:

- `handleSummaryHover()` (reaching a summary — cancels, then does its own close-others/toggle)
- a `mouseenter` on `.main-navigation-sub-nav` itself, via `handleSubNavHover()`

So a brief diagonal dip through a sibling's hit area survives (the close never actually runs
before the cursor reaches its destination), while genuinely moving to a different part of the
page still closes the dropdown promptly. `closeAllTimer` is cleared `onUnmounted` to avoid a
stray close firing against stale refs after the component's gone.

**`handleSummaryHover` never toggles — it only ever ensures the summary it's called on is
open.** A real mouse click moves focus to the clicked element *before* the click event fires, so
clicking a summary the mouse had just hover-opened dispatches both a `focusin` (→
`handleSummaryHover`) and a `click` (→ `handleSummaryAction`) in quick succession. If
`handleSummaryHover` toggled (as it did until 2026-08-21), that focusin would flip an
already-open item closed, and the click's own toggle would immediately flip it back open — a
visible open→closed→open flicker on every click, and the click effectively did nothing. Only
`handleSummaryAction` (the explicit click) is allowed to close a dropdown; hover/focus is
idempotent-safe to fire redundantly. `@vue/test-utils`' `.trigger("click")` doesn't synthesize
this implicit focus side effect on its own — a test asserting click-to-close must explicitly
`.trigger("focusin")` before `.trigger("click")` to reproduce it, or it'll pass against the
buggy toggle-based version too.

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
| `panelVariant` | `"modern" \| "classic"` | `"classic"` | Forwarded to `NavigationItems` for its dropdown submenu panels: `ExpandingPanel` (`"modern"`) or `ExpandingPanelClassic` (`"classic"`, default). `"modern"` is known not to work correctly on WebKit. See CLAUDE.md pitfall #19. |
| `mainNavAriaLabel` | `string` | `"Main navigation"` | aria-label on the primary nav landmark — override for localisation. |
| `secondaryNavAriaLabel` | `string` | `"Secondary navigation"` | aria-label on the secondary (overflow) nav landmark — override for localisation. |
| `overflowMenuAriaLabel` | `string` | `"Overflow navigation menu"` | Forwarded to `NavigationItems`' `ariaLabel` — override for localisation. |
| `overflowButtonLabel` | `string` | `"More navigation"` | Accessible name of the overflow/burger button, which shows only icons. |
| `submenuAriaLabel` | `string` | `"{title} submenu"` | aria-label on each dropdown summary, top bar and overflow panel; `{title}` is replaced with `childLinksTitle` (or `name`). Forwarded to `NavigationItems`. |
| `anchorScrollOffset` | `number \| (() => number)` | `undefined` (0) | Pixels left above a section when a `#anchor` link scrolls to it, e.g. a sticky header's height. Pass a getter to read it at click time. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `.navigation` element. |

## Same-page anchor links (since 2026-10-06)

Any item or child link whose `path` starts with `#` is a same-page section link:

- It renders as a plain `<a href="#section">`, not a `NuxtLink`, so Vue Router stays out of the scroll.
- Clicking it smooth-scrolls to the element with that id (`useAnchorScroll`), leaving
  `anchorScrollOffset` pixels above it, and pushes the hash to the URL. Under
  `prefers-reduced-motion: reduce` the browser's instant jump is used instead.
- It is active (`li.is-active`, the indicator) by hash, not by route. On load, the URL's hash wins;
  with none, the first anchor item in the data is active. Both the top bar and the overflow menu
  share that state.
- Clicking one closes any open dropdown and the overflow menu (route links close them by navigating).

Route links and anchor links can be mixed in the same data. See the "Same-Page Anchor Links" story.

## Migrating from TabNavigation

> `TabNavigation` was deprecated 2026-10-06 and **removed 2026-10-07**, along with its `NavItem` /
> `NavItemData` types and the `useNavCollapse` composable. Type the new data as `ResponsiveHeaderProp`.

`ResponsiveHeader` covers everything `TabNavigation` does, and collapses progressively (only the items
that don't fit move into the overflow menu) instead of all-or-nothing. To switch:

| TabNavigation | ResponsiveHeader |
|---|---|
| `:nav-item-data="{ main: [...] }"` | `:responsive-nav-links="{ main: [...] }"` |
| item `text` | item `name` |
| item `href` (route or `#anchor`) | item `path` (route or `#anchor`, same behaviour) |
| item `iconName` | item `iconName` |
| item `isExternal` | drop it: `NuxtLink` treats a full URL as external |
| item `cssName` | no equivalent; drop it (no consumer styles these classes) |
| `nav-align="right"` | `--responsive-header-main-nav-justify-content: safe end` (CSS token) |
| `aria-label` | `main-nav-aria-label` |
| `open-menu-label` / `close-menu-label` | `overflow-button-label` (one label; the button is a `<summary>`) |
| `anchor-scroll-offset` | `anchor-scroll-offset` |
| collapse everything to a burger when items don't fit | default is per-item overflow; add `collapse-at-main-nav-intersection` for the old all-or-nothing burger |
| `--tab-nav-link-color` | `--responsive-header-link-color` |
| `--tab-nav-link-hover-color` / `--tab-nav-link-active-color` | `--responsive-header-link-color-hover` / `-active` (added 2026-10-07) |
| `--tab-nav-decorator-hovered-bg` | `--responsive-nav-decorator-hovered-bg` |
| `--tab-nav-decorator-indicator-color` | `--responsive-nav-decorator-indicator-color` |
| `--tab-nav-panel-link-color` / `-hover-color` / `-active-color` | `--overflow-nav-link-color` / `-color-hover` / `-color-active` |
| `--tab-nav-panel-bg` / `--tab-nav-panel-border-color` / `--tab-nav-panel-item-border` | `--responsive-header-overflow-nav-bg` / `--responsive-header-overflow-nav-border` (full shorthand) / `--overflow-nav-link-border-color` |
| `--tab-nav-burger-color` | `--responsive-header-overflow-btn-icon-color` |

```vue
<!-- Before -->
<TabNavigation nav-align="right" :nav-item-data="{ main: [{ text: 'About', href: '#about' }] }" />

<!-- After -->
<ResponsiveHeader
  :responsive-nav-links="{ main: [{ name: 'About', path: '#about' }] }"
  style="--responsive-header-main-nav-justify-content: safe end"
/>
```

## Data edge cases (since 2026-10-05)

- A dropdown with no `childLinksTitle` shows its `name` instead (it used to render an empty
  summary labelled "undefined submenu").
- Child links are keyed by index, so duplicate names are fine.
- The overflow button appears whenever any item is hidden, whatever the group keys are called.
  It used to read `navListVisibility.firstNav`/`secondNav` only, so a group named anything else
  (e.g. `main`) kept the burger showing even when everything fitted. Empty nav data never shows
  it, and still completes the geometry pass.
- The top-bar dropdown and the overflow panel are capped in width and height (tokens in
  `CONSUMER-STYLING.md`); long names wrap and long lists scroll inside them.
- **Fit check (fixed 2026-10-05):** an item is visible when its right edge is at or before the main
  nav's own measured right edge (which already has the secondary nav and gap reserved as
  `margin-inline-end`). It used to compare against the wrapper while adding the gap a second time
  with a strict `<`, so the last item of a flush-right second group (e.g. "Contact") was always
  sent to the overflow menu, however wide the screen.
- The component copies `responsiveNavLinks` before measuring. It used to write each item's
  `config` straight into the consumer's own nav data object.
- The `StressTest` story covers all of the above.
- **Alignment (added 2026-10-05):** `--responsive-header-main-nav-justify-content`
  (default `space-between`) sets how the main nav's groups sit along the bar; use `safe end` /
  `safe center`, never plain `end`/`center`. The `MainNavAlignment` story shows the options.

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
| `--responsive-header-link-color-hover` / `-active` | the resting colour | Per-state link colour in the top bar (added 2026-10-07). Hover falls back to the item's current state. `--overflow-nav-link-color-hover` / `-active` do the same in the overflow panel. |
| `--responsive-header-bg` / `--responsive-header-padding-*` / `--responsive-header-border*` | transparent / `0` / `none` | Root element theming. |
| `--responsive-header-overflow-btn-*` | various | Overflow burger button sizing/colour. |
| `--responsive-header-sub-nav-*` / `--responsive-header-overflow-nav-*` | various | Top-bar dropdown panel and overflow-panel container theming. |

Defaults are for a **light** header (changed 2026-10-07): panels use `--page-bg`, borders and hover tints are `color-mix()`es of `--theme-text`, the overflow button is transparent with a `--theme-border-focus` hover outline. They used to assume a dark bar (`Canvas`, translucent white borders and tints). A dark header sets the tokens.
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
