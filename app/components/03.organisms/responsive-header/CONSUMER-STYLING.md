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
| `--responsive-header-main-nav-justify-content` | `space-between` | How the main nav's groups are spread along the bar. Use `flex-start`, `safe center` or `safe end`; plain `center`/`end` let items that don't fit spill off the start edge, where they're clipped. (Safari 16 ignores `safe` values and falls back to start alignment.) |
| `--responsive-header-color` | `inherit` | Root element text colour. |
| `--responsive-header-margin` | `0` | Root element margin. |
| `--responsive-header-bg` | `transparent` | Root element background. |
| `--responsive-header-border` | `none` | Root element border. |
| `--responsive-header-border-radius` | `0` | Root element border-radius. |
| `--responsive-header-padding-block` / `--responsive-header-padding-inline` | `0` | Root element padding. |
| `--responsive-header-max-height` | `none` | Root element max-height. |
| `--responsive-header-inline-size` | `100%` | Root element inline-size. |
| `--responsive-header-sub-nav-bg` / `-border` / `-border-radius` / `-padding` | `Canvas` / `1px solid #efefef75` / `8px` / `12px` | Top-bar dropdown panel (`.main-navigation-sub-nav`). |
| `--responsive-header-sub-nav-max-inline-size` | `min(48rem, calc(100vw - 3.2rem))` | Widest the top-bar dropdown panel gets; long child names wrap inside it. |
| `--responsive-header-sub-nav-max-block-size` | `70vh` | Tallest the top-bar dropdown panel gets before it scrolls, so a long child list stays reachable under a sticky header. |
| `--responsive-header-overflow-btn-bg` / `-size` / `-border` / `-outline` / `-icon-color` / `-hover-outline` | `Canvas` / `20px` / `1px solid #ffffff90` / `1px solid #ffffff10` / `inherit` / `1px solid #ffffff` | Overflow burger button. |
| `--responsive-header-overflow-nav-bg` / `-border` / `-border-radius` / `-padding-block` | `Canvas` / `1px solid #ffffff90` / `8px` / `12px` | Overflow panel container. |
| `--responsive-header-overflow-nav-max-block-size` | `70vh` | Tallest the overflow panel gets before it scrolls. |
| `--overflow-nav-max-inline-size` | `calc(100vw - 3.2rem)` | Widest the overflow panel's content gets (set on `NavigationItems`); long names wrap inside it. |

Link and dropdown text is never line-clamped: it names where the link goes. Long unbroken names
wrap inside the dropdown and overflow panels; in the top bar, an item too wide to fit moves to the
overflow menu.

> **Changed 2026-10-05**: the dropdown and overflow panels had no maximum size, so a long child
> name or a long child list ran off-screen. They are now capped by the four tokens above.
> `--_overflow-drop-down-width`, a private token nothing ever set, is gone (`min-width: fit-content`
> directly).
| `--responsive-nav-decorator-indicator-color` | `currentColor` | Active-item indicator bar/underline. |
| `--responsive-nav-decorator-hovered-indicator-color` | inherits the above | Indicator colour while hovering. |
| `--responsive-nav-decorator-hovered-bg` | `oklch(100% 0 0 / 8%)` | Hover highlight background behind the hovered item. |

---

## Global theming

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

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

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

