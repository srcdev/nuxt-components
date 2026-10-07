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
| `--responsive-header-link-color-hover` | `--responsive-header-link-color` | Top-bar link/summary colour on the hovered item. Unset, an active item keeps its active colour. |
| `--responsive-header-link-color-active` | `--responsive-header-link-color` | Top-bar link/summary colour on the active item (current route or hash). |
| `--responsive-header-sub-nav-bg` / `-border` / `-border-radius` / `-padding` | `var(--page-bg, var(--theme-surface-subtle))` / `1px solid color-mix(in oklch, var(--theme-text) 20%, transparent)` / `8px` / `12px` | Top-bar dropdown panel (`.main-navigation-sub-nav`). |
| `--responsive-header-sub-nav-max-inline-size` | `min(48rem, calc(100vw - 3.2rem))` | Widest the top-bar dropdown panel gets; long child names wrap inside it. |
| `--responsive-header-sub-nav-max-block-size` | `70vh` | Tallest the top-bar dropdown panel gets before it scrolls, so a long child list stays reachable under a sticky header. |
| `--responsive-header-overflow-btn-bg` / `-size` / `-border` / `-outline` / `-icon-color` / `-hover-outline` | `transparent` / `20px` / `1px solid color-mix(in oklch, var(--theme-text) 20%, transparent)` / `1px solid transparent` / `inherit` / `1px solid var(--theme-border-focus)` | Overflow burger button. |
| `--responsive-header-overflow-nav-bg` / `-border` / `-border-radius` / `-padding-block` | `var(--page-bg, var(--theme-surface-subtle))` / `1px solid color-mix(in oklch, var(--theme-text) 20%, transparent)` / `8px` / `12px` | Overflow panel container. |
| `--responsive-header-overflow-nav-max-block-size` | `70vh` | Tallest the overflow panel gets before it scrolls. |
| `--responsive-nav-decorator-indicator-color` | `currentColor` | Active-item indicator bar/underline. |
| `--responsive-nav-decorator-hovered-indicator-color` | inherits the above | Indicator colour while hovering. |
| `--responsive-nav-decorator-hovered-bg` | `color-mix(in oklch, var(--theme-text) 8%, transparent)` | Hover highlight background behind the hovered item. |

### Overflow panel content (`NavigationItems`)

| Token | Default | Controls |
|---|---|---|
| `--overflow-nav-link-color` | `inherit` | Link/summary colour in the overflow panel. |
| `--overflow-nav-link-color-hover` | `--overflow-nav-link-color` | Colour on the hovered item. Unset, an active item keeps its active colour. |
| `--overflow-nav-link-color-active` | `--overflow-nav-link-color` | Colour on the active item. |
| `--overflow-nav-link-border-color` | `color-mix(in oklch, var(--theme-text) 12%, transparent)` | Divider under each row. |
| `--overflow-nav-sub-item-color` / `--overflow-nav-sub-item-font-size` | `inherit` / `inherit` | Child links inside a group. |
| `--overflow-nav-decorator-indicator-color` | `currentColor` | Active-row indicator bar. |
| `--overflow-nav-decorator-hovered-indicator-color` | inherits the above | Indicator colour while hovering. |
| `--overflow-nav-decorator-hovered-bg` | `color-mix(in oklch, var(--theme-text) 6%, transparent)` | Hover highlight behind a row. |
| `--overflow-nav-padding-inline` / `--overflow-nav-items-padding-block` / `--overflow-nav-items-gap` | `0.8rem` / `0.8rem` / `0px` | Row spacing. |
| `--overflow-nav-max-inline-size` | `calc(100vw - 3.2rem)` | Widest the overflow panel's content gets; long names wrap inside it. |

Private: `--_link-color` / `--_overflow-link-color` carry the per-state (hover/active) link colour
from the item to its link and summary. Not public API.

Link and dropdown text is never line-clamped: it names where the link goes. Long unbroken names
wrap inside the dropdown and overflow panels; in the top bar, an item too wide to fit moves to the
overflow menu.

> **Changed 2026-10-07**: the defaults assumed a dark bar: `Canvas` panel and button backgrounds,
> translucent white borders (`#ffffff90`, `#efefef75`), a white button outline/hover outline and
> white-tint hover highlights, all near-invisible on a light header. They now come from the
> `--theme-*` slots and `--page-bg` (see the tables). A dark header sets these tokens. Also added
> the `-link-color-hover` / `-link-color-active` tokens (top bar and overflow panel), which
> TabNavigation had and ResponsiveHeader lacked.

> **Changed 2026-10-05**: the dropdown and overflow panels had no maximum size, so a long child
> name or a long child list ran off-screen. They are now capped by the max-size tokens above.
> `--_overflow-drop-down-width`, a private token nothing ever set, is gone (`min-width: fit-content`
> directly).

---

## Global theming

Create `assets/styles/setup/07.components/responsive-header.css` in the consuming app and set
tokens on a scope class matching the one passed via `styleClassPassthrough`:

```css
/* assets/styles/setup/07.components/responsive-header.css */
.site-header-nav {
  --responsive-header-link-color: var(--theme-text);
  --responsive-header-link-color-hover: var(--theme-accent);
  --responsive-header-link-color-active: var(--theme-accent);
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

- Same-page `#anchor` items (since 2026-10-06) render as plain `<a>` with the same classes as route
  links (`.main-navigation-link`, `.overflow-navigation-link`, the sub-nav link classes), so every token
  and selector here applies to them. Their `li.is-active` follows the current hash rather than the route.

- Anything with async-loaded content (an `iconName` icon on a nav item, a new decorator inside
  a nav link) must reserve its own `width`/`height` in CSS — an unsized element measures at
  `0` during the initial geometry pass and then pops in afterward with nothing to detect it.
  See `.decorator-icon`/the chevron `.icon` in the component's own `<style>` block for the
  pattern (`1.35em` square, `flex-shrink: 0`).
- `NavigationItems`' own tokens (`--overflow-nav-*`) have their own table above since
  they style the overflow-panel's *content*, distinct from `ResponsiveHeader`'s own tokens
  above which style the top bar and the overflow *button*/*container*.

