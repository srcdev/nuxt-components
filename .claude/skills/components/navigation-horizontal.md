# NavigationHorizontal

## Overview

A horizontal navigation bar that renders a flat list of links with an animated glow/underline effect on the active link. Fully themeable via CSS custom properties.

## Types

Import from the layer package root — do **not** use `~/types/...` (that resolves to the consuming app, not the layer):

```ts
import type { NavItemData } from "srcdev-nuxt-components"
```

```ts
interface NavItem {
  text: string;
  href?: string;
  isExternal?: boolean; // adds target="_blank" rel behaviour via NuxtLink
  iconName?: string;    // icon set name, rendered as <Icon name="icon-{iconName}" />
  cssName?: string;     // extra CSS class on the <li>
}

interface NavItemData {
  [key: string]: NavItem[]; // key name is arbitrary; component reads navItemData.main
}
```

**Important:** The component only iterates `navItemData.main`. Other keys in the object are ignored unless you fork the component.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navItemData` | `NavItemData` | required | Navigation link data |
| `tag` | `"ul" \| "ol" \| "div"` | `"ul"` | HTML element for the list |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes on the root `<nav>` |

## Basic usage

```vue
<NavigationHorizontal :nav-item-data="navLinks" />
```

```ts
import type { NavItemData } from "srcdev-nuxt-components"

const navLinks: NavItemData = {
  main: [
    { text: "Home", href: "/" },
    { text: "Services", href: "/services/" },
    { text: "Contact", href: "/contact" },
    { text: "GitHub", href: "https://github.com/example", isExternal: true },
  ],
}
```

## CSS token API

Override these custom properties on a wrapping selector to theme the nav without touching component internals:

```css
.your-wrapper {
  /* Colours */
  --nav-active-colour: lime;                  /* glow + border-bottom colour on hover/focus */
  --nav-link-colour: hsl(0 0% 100%);          /* link text colour */
  --nav-link-bg: hsl(0 0% 20%);              /* link background */
  --nav-border-colour: hsl(0 0% 100% / 0.2); /* top/bottom border on the list */

  /* Borders */
  --nav-border-start: 0px;   /* block-start border thickness */
  --nav-border-end: 3px;     /* block-end border thickness */

  /* Layout */
  --nav-list-padding: 2rem;
  --nav-list-gap: 1rem;
  --nav-link-padding-block: 0.5rem;
  --nav-link-padding-inline: 1rem;
  --nav-link-border-radius: 0.2rem;

  /* Glow effect */
  --nav-glow-pos-x: 50%;
  --nav-glow-pos-y: 100%;
  --nav-glow-inner-stop: 10%;
  --nav-glow-outer-stop: 75%;
  --nav-glow-size: 32px;
  --nav-glow-opacity: 0.5;
  --nav-anchor-offset: 40px;

  /* Animation */
  --nav-transition-duration: 300ms;
}
```

## Notes

- The glow effect uses CSS Anchor Positioning (`anchor-name`, `position-anchor`). The layer ships `@oddbird/css-anchor-positioning` as a polyfill for browsers that don't support it yet.
- The `--nav-active-colour` token drives both the border-bottom and the radial glow — set it to your brand accent colour.
- `isExternal: true` on a `NavItem` passes `:external="true"` to `<NuxtLink>`, which adds `target="_blank"` and `rel="noopener noreferrer"` automatically.
