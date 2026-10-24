# SiteHeader — Consumer Styling Guide

## Public token API

All `--site-header-*` tokens style the header row. They're the stable override surface: set them
at any scope without touching the component itself.

| Token | Default | Controls |
|---|---|---|
| `--site-header-gap` | `2.4rem` | Gap between the branding column and the nav column |
| `--site-header-branding-max-width` | `50%` | Widest the branding column may grow (`fit-content()`); past it, the branding wraps |
| `--site-header-padding-inline` | `2.4rem` | Horizontal padding on `.site-header` |
| `--site-header-padding-block` | `0px` | Vertical padding on `.site-header` |
| `--site-header-bg` | `transparent` | Background colour of `.site-header` (the content column, not the full-width row) |
| `--site-header-position` | `static` | Set to `sticky` to pin the header, paired with `--site-header-sticky-offset` |
| `--site-header-sticky-offset` | `0px` | `top` offset when `--site-header-position: sticky` |
| `--site-header-z-index` | `999999` | Stacking order of the row when it is sticky or fixed. Ignored while position is `static` |

> Changed 2026-10-21: `--site-header-position`, `--site-header-sticky-offset` and
> `--site-header-z-index` now apply to the outer row (`.site-header-row`, the `PageRow`) instead of
> the inner `<header>`. On the inner header, `sticky` never stuck: its parent is exactly its own
> height, so there was nowhere for it to move. The branding column was `auto` and is now capped by
> `--site-header-branding-max-width`, so a long brand can't squeeze the nav to nothing.
>
> Changed 2026-10-24: `--site-header-z-index` defaults to `999999` (was `9`), like the library's
> other overlays. A sticky header now sits above fixed elements with a lower z-index; set the token
> lower on an ancestor if something of yours must stay above it.

No private `--_` tokens.

`SiteHeader` composes `PageRow` + `SkipLinks` + `ResponsiveHeader`. Two separate
`styleClassPassthrough` props reach the composed components independently:

- `styleClassPassthrough` → the root `PageRow` (set `--site-header-*` tokens there)
- `navStyleClassPassthrough` → the nested `ResponsiveHeader` (its own `--responsive-header-*` and
  `--overflow-nav-*` tokens; see `ResponsiveHeader`'s `CONSUMER-STYLING.md`)

## State hooks

No state attributes. Element classes:

| Class | Element |
|---|---|
| `.site-header-row` | Root `PageRow` (with `.page-row` and the variant class); carries the sticky position |
| `.site-header` | The `<header>` grid: branding column + nav column |
| `.site-header-home-nav` | The branding `<nav>` wrapping `SkipLinks` and the `#branding` slot |

> Changed 2026-10-21: `.site-header-home-nav` was `.home-navigation`, and `.site-header-row` is new.

## Global theming

Set tokens on the scope class passed via `styleClassPassthrough`:

```css
.header {
  --site-header-gap: 1.6rem;
  --site-header-padding-inline: 1.2rem;
  --site-header-position: sticky;
  --site-header-bg: var(--theme-surface-subtle);
}
```

```vue
<SiteHeader :style-class-passthrough="['header']">
  <template #branding>
    <NuxtLink to="/" class="brand-link">Brand</NuxtLink>
  </template>
</SiteHeader>
```

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** sticky positioning needs the row's own parent to be taller than the row (normally the
page layout) and no `overflow` other than `visible` on the ancestors between it and the scroller.

## Class passthrough

`style-class-passthrough` adds classes to the root `PageRow`; `nav-style-class-passthrough` to
`ResponsiveHeader`'s root.

## Notes

- The branding markup (logo image, wordmark, etc.) is entirely consumer-authored via the
  `#branding` slot; `SiteHeader` has no opinion on brand styling. Long branding wraps
  (`overflow-wrap: anywhere`) once it reaches `--site-header-branding-max-width`.
- `SkipLinks`' hardcoded anchors (`#main-content`, `#footer-content`) expect the consuming
  layout's main/footer regions to carry those `id`s.
