# SiteNavigation — Consumer Styling Guide

## Public token API

Defaults that read `var(--slate-01, currentColor)` use the library palette when it's loaded and fall
back to the inherited text colour otherwise.

### Horizontal nav

| Token | Default | Controls |
|---|---|---|
| `--site-nav-link-color` | `var(--slate-01, currentColor)` | Link colour |
| `--site-nav-link-hover-color` | `var(--slate-04, <link colour>)` | Link colour on hover |
| `--site-nav-link-active-color` | `var(--slate-01, <link colour>)` | Active link colour |
| `--site-nav-link-accent` | `var(--slate-01, currentColor)` | Link accent colour |
| `--site-nav-link-size` | `1.6rem` | Link font size |
| `--site-nav-link-weight` | `400` | Link font weight |
| `--site-nav-link-tracking` | `0.06em` | Link letter spacing |
| `--site-nav-gap` | `2.2rem` | Gap between links |
| `--site-nav-transition` | `250ms ease` | Link colour transition |
| `--site-nav-decorator-indicator-color` | `var(--slate-01, currentColor)` | Sliding underline bar |
| `--site-nav-decorator-hovered-bg` | `transparent` | Sliding pill behind the hovered link |
| `--site-nav-decorator-active-bg` | `transparent` | Pill behind the active link |

> Changed 2026-09-27: `--site-nav-decorator-hovered-bg` and `--site-nav-decorator-active-bg` are
> new. The values were hardcoded `transparent` with no override, unlike the panel equivalents.

### Collapsed panel

| Token | Default | Controls |
|---|---|---|
| `--site-nav-panel-bg` | `var(--page-bg, #1a1614)` | Panel background |
| `--site-nav-panel-border-color` | `color-mix(in oklch, var(--slate-01, #c0847a) 35%, transparent)` | Top border when open |
| `--site-nav-panel-item-border` | `color-mix(in oklch, var(--slate-01, white) 8%, transparent)` | Divider between panel links |
| `--site-nav-panel-link-color` | `var(--slate-01, currentColor)` | Panel link colour |
| `--site-nav-panel-link-hover-color` | `var(--slate-04, <panel link colour>)` | Panel link hover colour |
| `--site-nav-panel-link-active-color` | `var(--slate-01, <panel link colour>)` | Active panel link colour |
| `--site-nav-panel-padding-block` | `1.4rem` | Panel link vertical padding |
| `--site-nav-panel-padding-inline` | `1.5rem` | Panel link horizontal padding |
| `--site-nav-panel-slide-duration` | `350ms` | Open/close slide duration |
| `--site-nav-panel-slide-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Open/close easing |
| `--site-nav-panel-decorator-indicator-color` | `var(--slate-01, currentColor)` | Panel indicator bar |
| `--site-nav-panel-decorator-hovered-bg` | `transparent` | Pill behind the hovered panel link |
| `--site-nav-panel-decorator-active-bg` | `transparent` | Pill behind the active panel link |
| `--site-nav-panel-indicator-left` | `0` | Indicator bar left position |
| `--site-nav-panel-indicator-right` | `auto` | Indicator bar right position |

### Burger button

| Token | Default | Controls |
|---|---|---|
| `--site-nav-burger-color` | `var(--slate-01, currentColor)` | Bar colour |
| `--site-nav-burger-width` | `22px` | Bar width |
| `--site-nav-burger-height` | `1.5px` | Bar thickness |
| `--site-nav-burger-gap` | `5px` | Gap between bars |
| `--site-nav-burger-transition` | `300ms ease` | Open/close morph |

### Backdrop (teleported to `<body>`)

| Token | Default | Controls |
|---|---|---|
| `--site-nav-backdrop-bg` | `oklch(0% 0 0 / 55%)` | Scrim colour |
| `--site-nav-backdrop-blur` | `3px` | Blur behind the scrim |
| `--site-nav-backdrop-duration` | `350ms` | Fade duration |
| `--site-nav-backdrop-z-index` | `10` | Scrim stacking order; keep your header above it |

> Changed 2026-09-27: `--site-nav-backdrop-z-index` is new (was a hardcoded `10`).

The `--_*` variables declared on `.site-navigation` and `.site-nav-backdrop` are the resolved copies
of the tokens above: not public API.

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `.site-navigation--left`, `--center`, `--right` | root `<nav>` | `nav-align` |
| `.is-collapsed` | root | Links don't fit, so the burger and panel are shown |
| `.is-loaded` | root | First measurement done (the nav is `opacity: 0` until then) |
| `.menu-open` | root | Panel open |
| `.is-animated` | root | Indicator transitions enabled (after first layout) |
| `li.is-active` | nav and panel items | Item matches the current route |
| `.is-open` | `.site-nav-burger`, `.site-nav-panel`, `.site-nav-backdrop` | Panel open |

Inner classes: `.site-nav-list`, `.site-nav-link`, `.site-nav-burger`, `.burger-bar`,
`.site-nav-panel`, `.site-nav-panel-inner`, `.site-nav-panel-list`, `.site-nav-panel-link`,
`.site-nav-backdrop`; decorators `.nav__hovered`, `.nav__active`, `.nav__active-indicator`.
Each item `li` also gets its `NavItem.cssName`.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the backdrop is teleported to `<body>`, outside your header, so the
`--site-nav-backdrop-*` tokens only land when set on `:root`, `html` or `body`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `<nav>`. Reactive after mount. It doesn't reach
the teleported backdrop.
