# ResponsiveHeader — Consumer Styling Guide

## Public token API

All `--responsive-header-*` / `--responsive-nav-*` / `--overflow-nav-*` tokens are the stable
override surface. Set them at any scope (global, page, or instance) without touching the
component itself. `--overflow-nav-*` tokens style `NavigationItems`' overflow-panel content and
are documented alongside it since that's where they're consumed.

| Token | Default | Controls |
|---|---|---|
| `--responsive-header-link-font-size` | `inherit` | Nav-link font-size. **Always set this to a fixed value.** Leaving it `inherit` means a fluid ancestor font-size (`clamp()`/`vw`) can drift nav-item text width without ever re-triggering the overflow-collapse measurement — see the component skill doc's "measurement pipeline" section for the full mechanism. |
| `--responsive-header-link-color` | `inherit` | Link/summary text colour. |
| `--responsive-header-color` | `inherit` | Root element text colour. |
| `--responsive-header-margin` | `0` | Root element margin. |
| `--responsive-header-bg` | `transparent` | Root element background. |
| `--responsive-header-border` | `none` | Root element border. |
| `--responsive-header-border-radius` | `0` | Root element border-radius. |
| `--responsive-header-padding-block` / `--responsive-header-padding-inline` | `0` | Root element padding. |
| `--responsive-header-max-height` | `none` | Root element max-height. |
| `--responsive-header-inline-size` | `100%` | Root element inline-size. |
| `--responsive-header-sub-nav-bg` / `-border` / `-border-radius` / `-padding` | `Canvas` / `1px solid #efefef75` / `8px` / `12px` | Top-bar dropdown panel (`.main-navigation-sub-nav`). |
| `--responsive-header-overflow-btn-bg` / `-size` / `-border` / `-outline` / `-icon-color` / `-hover-outline` | `Canvas` / `20px` / `1px solid #ffffff90` / `1px solid #ffffff10` / `inherit` / `1px solid #ffffff` | Overflow burger button. |
| `--responsive-header-overflow-nav-bg` / `-border` / `-border-radius` / `-padding-block` | `Canvas` / `1px solid #ffffff90` / `8px` / `12px` | Overflow panel container. |
| `--responsive-nav-decorator-indicator-color` | `currentColor` | Active-item indicator bar/underline. |
| `--responsive-nav-decorator-hovered-indicator-color` | inherits the above | Indicator colour while hovering. |
| `--responsive-nav-decorator-hovered-bg` | `oklch(100% 0 0 / 8%)` | Hover highlight background behind the hovered item. |

---

## Global theming — recommended approach

Create `assets/styles/setup/07.components/responsive-header.css` in the consuming app and set
tokens on a scope class matching the one passed via `styleClassPassthrough`:

```css
/* assets/styles/setup/07.components/responsive-header.css */
.site-header-nav {
  --responsive-header-link-color: var(--slate-00);
  --responsive-header-bg: #efefef05;
  --responsive-header-padding-inline: 1.2rem;

  /* Fixed, NOT a fluid var(--step-*) token — see the token table above. */
  --responsive-header-link-font-size: 1.4rem;
  @media (min-width: 1024px) {
    --responsive-header-link-font-size: 1.5rem;
  }
}
```

```vue
<ResponsiveHeader :responsive-nav-links="responsiveNavLinks" :style-class-passthrough="['site-header-nav']" />
```

---

## Notes

- Anything with async-loaded content (an `iconName` icon on a nav item, a new decorator inside
  a nav link) must reserve its own `width`/`height` in CSS — an unsized element measures at
  `0` during the initial geometry pass and then pops in afterward with nothing to detect it.
  See `.decorator-icon`/the chevron `.icon` in the component's own `<style>` block for the
  pattern (`1.35em` square, `flex-shrink: 0`).
- `NavigationItems`' own tokens (`--overflow-nav-*`) are documented in its own skill doc since
  they style the overflow-panel's *content*, distinct from `ResponsiveHeader`'s own tokens
  above which style the top bar and the overflow *button*/*container*.
