# TabNavigation — Consumer Styling Guide

## Public token API

All `--tab-nav-*` tokens are the stable override surface. Set them at any scope (global, page, or
instance) without touching the component itself.

### Horizontal nav

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-link-color` | `var(--slate-01, currentColor)` | Link text colour (rest state) |
| `--tab-nav-link-hover-color` | `var(--slate-04, currentColor)` | Link text colour on hover |
| `--tab-nav-link-active-color` | `var(--slate-01, currentColor)` | Link text colour when route is active |
| `--tab-nav-link-size` | `1.6rem` | Link font size |
| `--tab-nav-link-weight` | `400` | Link font weight |
| `--tab-nav-link-tracking` | `0.06em` | Link letter spacing |
| `--tab-nav-gap` | `2.2rem` | Gap between nav items |
| `--tab-nav-transition` | `250ms ease` | Colour transition on hover/active |

### Indicator decorators

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-decorator-indicator-color` | `var(--slate-01, currentColor)` | Active-item underline bar colour |
| `--tab-nav-decorator-hovered-bg` | `transparent` | Background fill pill that follows the pointer |

### Mobile panel

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-panel-bg` | `var(--page-bg, #1a1614)` | Panel background colour |
| `--tab-nav-panel-border-color` | `color-mix(in oklch, var(--slate-01, #c0847a) 35%, transparent)` | Border between nav bar and open panel |
| `--tab-nav-panel-item-border` | `color-mix(in oklch, var(--slate-01, white) 8%, transparent)` | Divider between panel items |
| `--tab-nav-panel-link-color` | `var(--slate-01, currentColor)` | Panel link text colour |
| `--tab-nav-panel-link-hover-color` | `var(--slate-04, currentColor)` | Panel link text colour on hover |
| `--tab-nav-panel-link-active-color` | `var(--slate-01, currentColor)` | Panel active link colour |
| `--tab-nav-panel-padding-block` | `1.4rem` | Panel link vertical padding |
| `--tab-nav-panel-padding-inline` | `1.5rem` | Panel link horizontal padding |
| `--tab-nav-panel-slide-duration` | `350ms` | Panel open/close animation duration |
| `--tab-nav-panel-slide-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Panel open/close easing |

### Burger button

| Token | Default | Controls |
|---|---|---|
| `--tab-nav-burger-color` | `var(--slate-01, currentColor)` | Burger bar colour |
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

## Global theming — app-level CSS file

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

## Page-scoped overrides

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

---

## Per-instance overrides via inline style

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

---

## Per-instance overrides via styleClassPassthrough

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
