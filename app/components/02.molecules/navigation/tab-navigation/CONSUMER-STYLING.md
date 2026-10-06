# TabNavigation — Consumer Styling Guide

## Public token API

All `--tab-nav-*` tokens are the stable override surface. Set them at any scope (global, page, or
instance) without touching the component itself.

### Horizontal nav

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-link-color` | `var(--theme-text)` | Link text colour (rest state) |
| `--tab-nav-link-hover-color` | `var(--theme-accent)` | Link text colour on hover |
| `--tab-nav-link-active-color` | the link colour | Link text colour when route is active |
| `--tab-nav-link-size` | `1.6rem` | Link font size |
| `--tab-nav-link-weight` | `400` | Link font weight |
| `--tab-nav-link-tracking` | `0.06em` | Link letter spacing |
| `--tab-nav-gap` | `2.2rem` | Gap between nav items |
| `--tab-nav-transition` | `250ms ease` | Colour transition on hover/active |
| `--tab-nav-focus-ring-width` | `2px` | Keyboard focus ring width, on bar and panel links |
| `--tab-nav-focus-ring-colour` | `currentColor` | Keyboard focus ring colour |
| `--tab-nav-focus-ring-offset` | `2px` | Focus ring gap on bar links (panel links draw it inset) |

> Changed 2026-10-06: keyboard focus now shows a ring. Before, `:focus-visible` only changed the
> link colour (`outline: none`).

> **Changed 2026-10-06: light defaults.** The colours used to assume a dark header (light `--slate-01`
> links, burger and indicator; dark `#1a1614` panel), so on a light page they were light-on-light.
> They now come from the light theme slots: links and burger `--theme-text`, hover and the indicator
> `--theme-accent`, the panel `--page-bg` (else `--theme-surface-subtle`), dividers mixed from the link
> colour. For a dark header, or dark mode, set the colour tokens yourself (e.g. with `light-dark()` in
> your own overrides); the library ships light values only. New: `--tab-nav-panel-item-hover-bg`.

### Indicator decorators

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-decorator-indicator-color` | `var(--theme-accent)` | Active-item underline bar colour |
| `--tab-nav-decorator-hovered-bg` | `transparent` | Background fill pill that follows the pointer |

### Mobile panel

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-panel-bg` | `var(--page-bg, var(--theme-surface-subtle))` | Panel background colour |
| `--tab-nav-panel-border-color` | the link colour at 20% | Border between nav bar and open panel |
| `--tab-nav-panel-item-border` | the panel link colour at 12% | Divider between panel items |
| `--tab-nav-panel-item-hover-bg` | the panel link colour at 5% | Panel item background on hover |
| `--tab-nav-panel-link-color` | the link colour | Panel link text colour |
| `--tab-nav-panel-link-hover-color` | the link hover colour | Panel link text colour on hover |
| `--tab-nav-panel-link-active-color` | the panel link colour | Panel active link colour |
| `--tab-nav-panel-padding-block` | `1.4rem` | Panel link vertical padding |
| `--tab-nav-panel-padding-inline` | `1.5rem` | Panel link horizontal padding |
| `--tab-nav-panel-slide-duration` | `350ms` | Panel open/close animation duration |
| `--tab-nav-panel-slide-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Panel open/close easing |

### Burger button

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-burger-color` | the link colour | Burger bar colour |
| `--tab-nav-burger-width` | `22px` | Width of each burger bar |
| `--tab-nav-burger-height` | `1.5px` | Height of each burger bar |
| `--tab-nav-burger-gap` | `5px` | Gap between burger bars |
| `--tab-nav-burger-transition` | `300ms ease` | Burger open/close animation |

### Backdrop

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-backdrop-bg` | `oklch(0% 0 0 / 55%)` | Backdrop overlay background colour |
| `--tab-nav-backdrop-blur` | `3px` | Backdrop blur amount |
| `--tab-nav-backdrop-duration` | `350ms` | Backdrop fade duration |

---

## State hooks

| Hook | When |
|---|---|
| `.tab-navigation.is-collapsed` | The items don't fit, so the bar shows the burger instead |
| `.tab-navigation.menu-open`, `.tab-nav-burger.is-open`, `.tab-nav-panel.is-open`, `.tab-nav-backdrop.is-open` | The burger menu is open |
| `.tab-navigation.is-loaded` | First measurement done (the nav is hidden before it, to avoid a wrong-state flash) |
| `.tab-navigation.is-animated` | Indicator transitions are on (off for a frame during route changes) |
| `.tab-navigation--left` / `--center` / `--right` | The `navAlign` prop |
| `.tab-nav-list li.is-active` / `.is-hovered` | The active and hovered items (the indicators anchor to these) |
| `.tab-nav-link.router-link-exact-active` | Route link for the current page |

Inner classes: `.tab-nav-list`, `.tab-nav-link`, `.nav__hovered`, `.nav__active-indicator`, `.tab-nav-burger`,
`.burger-bar`, `.tab-nav-panel`, `.tab-nav-panel-inner`, `.tab-nav-panel-list`, `.tab-nav-panel-link`,
`.tab-nav-backdrop` (teleported to `<body>`). Each item's `cssName` is added to its `<li>`.

---

## Global theming

Create `assets/styles/setup/07.components/tab-navigation.css` in the consuming app and set tokens
on `:root`. These values apply to every `TabNavigation` instance across the site.

```css
/* assets/styles/setup/07.components/tab-navigation.css */
:root {
  --tab-nav-link-color: var(--brand-text);
  --tab-nav-link-hover-color: var(--brand-text-muted);
  --tab-nav-link-active-color: var(--brand-accent);
  --tab-nav-decorator-indicator-color: var(--brand-accent);
  --tab-nav-decorator-hovered-bg: oklch(from var(--brand-accent) l c h / 0.1);
  --tab-nav-gap: 3rem;
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### Page or section

Override tokens for a single page by scoping them under a page wrapper. No `:deep()` is required
(component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.about-page {
  .tab-navigation {
    --tab-nav-link-color: var(--brand-warm-text);
    --tab-nav-decorator-indicator-color: var(--brand-warm-accent);
    --tab-nav-gap: 4rem;
  }
}
```

### One instance: inline style

```vue
<TabNavigation
  :nav-item-data="navData"
  style="
    --tab-nav-decorator-indicator-color: oklch(65% 0.2 230);
    --tab-nav-link-active-color: oklch(65% 0.2 230);
    --tab-nav-gap: 3rem;
  "
/>
```

### One instance: style-class-passthrough

```vue
<TabNavigation :nav-item-data="navData" :style-class-passthrough="['brand-nav']" />
```

```css
.tab-navigation.brand-nav {
  --tab-nav-decorator-indicator-color: var(--brand-accent);
  --tab-nav-decorator-hovered-bg: oklch(from var(--brand-accent) l c h / 0.1);
  --tab-nav-link-active-color: var(--brand-accent);
  --tab-nav-link-size: 1.4rem;
  --tab-nav-link-tracking: 0.08em;
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root `nav.tab-navigation`. Reactive after mount.

---

## Notes

- The active underline indicator and hover pill use CSS Anchor Positioning. They animate via
  `left`/`right` transitions, so `transition` on `.nav__active-indicator` and `.nav__hovered` is
  handled internally — only set `--tab-nav-transition` to control the link colour fade.
- `--tab-nav-decorator-hovered-bg: transparent` (the default) hides the hover pill entirely; set
  a semi-transparent colour to enable it.
- Panel and burger tokens only take visual effect when the nav has collapsed to the burger state
  (i.e. when the nav list overflows its container).
- `--tab-nav-panel-bg` should match `--page-bg` so the panel blends with the page background in
  the collapsed state.
- The backdrop (`--tab-nav-backdrop-*`) appears behind the open panel and above page content at
  `z-index: 10`. It teleports to `<body>` so it is unaffected by parent stacking contexts.

