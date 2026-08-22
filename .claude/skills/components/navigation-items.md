# NavigationItems Component

## Overview

Internal panel rendered inside [`ResponsiveHeader`](responsive-header.md)'s overflow burger
dropdown — renders the **complement** of what's visible in the main bar. An item appears here
only when its `config.visible` (set by `ResponsiveHeader`'s measurement pass) is `false`. Not
meant to be mounted standalone in a real app, but is independently tested and storyable since
it's a distinct piece of rendering logic (dropdown-within-dropdown via `ExpandingPanel`,
active-route highlighting, hover indicator).

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `mainNavigationState` | `ResponsiveHeaderState` | `{ clonedNavLinks: {}, navListVisibility: {}, hasSecondNav: false }` | Shared geometry/visibility state, normally supplied by the parent `ResponsiveHeader` — not something a consumer constructs by hand outside of tests/stories. |
| `panelVariant` | `"modern" \| "classic"` | `"classic"` | Which panel component renders a dropdown's submenu: `ExpandingPanel` (`"modern"`) or `ExpandingPanelClassic` (`"classic"`, default). `"modern"` is known not to work correctly on WebKit. Normally set via `ResponsiveHeader`'s own `panelVariant` prop rather than directly. See CLAUDE.md pitfall #19. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `.overflow-navigation-wrapper` element. |

---

## Behaviour notes

- A group's `<ul>` renders with the `visible` class (and thus becomes visible in the CSS)
  only when that group's `navListVisibility[groupKey]` is `false` — i.e. only when at least
  one item in it is collapsed.
- Plain links render as `NuxtLink`; items with `childLinks` render an `ExpandingPanel` nested
  dropdown (its own expand/collapse, independent of the outer overflow `<details>`).
- Active-route highlighting reuses the same `isActiveNavItem` logic as `ResponsiveHeader`
  (path match, or any `childLinks` path match).

---

## Usage example

`NavigationItems` is rendered automatically by `ResponsiveHeader` — you don't place it
yourself in a real app. For a test or story, construct the shared state directly:

```ts
const mainNavigationState: ResponsiveHeaderState = {
  hasSecondNav: false,
  navListVisibility: { firstNav: false },
  clonedNavLinks: {
    firstNav: [
      { name: "Home", path: "/", config: { left: 0, right: 0, width: 0, visible: true } },
      { name: "About", path: "/about", config: { left: 0, right: 0, width: 0, visible: false } },
    ],
  },
};
```
