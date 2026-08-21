# SiteHeader — Consumer Styling Guide

## Public token API

All `--site-header-*` tokens style the outer `.site-header` grid row (branding column + nav
column). They're the stable override surface — set them at any scope without touching the
component itself.

| Token | Default | Controls |
|---|---|---|
| `--site-header-gap` | `2.4rem` | Gap between the branding column and the nav column |
| `--site-header-padding-inline` | `2.4rem` | Horizontal padding on `.site-header` |
| `--site-header-padding-block` | `0px` | Vertical padding on `.site-header` |
| `--site-header-bg` | `transparent` | Background colour of `.site-header` |
| `--site-header-position` | `static` | Set to `sticky` to pin the header, paired with `--site-header-sticky-offset` |
| `--site-header-sticky-offset` | `0px` | `top` offset when `--site-header-position: sticky` |
| `--site-header-z-index` | `9` | Stacking order of `.site-header` |

`SiteHeader` composes `PageRow` + `SkipLinks` + `ResponsiveHeader` internally. Two separate
`styleClassPassthrough` props reach the two composed components independently:

- `styleClassPassthrough` → forwarded to the root `PageRow` (targets `--site-header-*` tokens above)
- `navStyleClassPassthrough` → forwarded to the nested `ResponsiveHeader` (targets its own
  `--responsive-header-*` and `--overflow-nav-*` tokens — see
  [../../responsive-header/CONSUMER-STYLING.md](../../responsive-header/CONSUMER-STYLING.md) if present,
  or the `ResponsiveHeader` skill doc)

---

## Global theming — recommended approach

Create `assets/styles/setup/07.components/site-header.css` in the consuming app and set tokens
on a scope class matching the one passed via `styleClassPassthrough`:

```css
/* assets/styles/setup/07.components/site-header.css */
.header {
  --site-header-gap: 1.6rem;
  --site-header-padding-inline: 1.2rem;
  --site-header-position: sticky;
  --site-header-bg: #00000095;
}
```

```vue
<SiteHeader :style-class-passthrough="['header']">
  <template #branding>
    <NuxtLink to="/" class="brand-link">Brand</NuxtLink>
  </template>
</SiteHeader>
```

---

## Notes

- The branding markup (logo image, wordmark, etc.) is entirely consumer-authored via the
  `#branding` slot — `SiteHeader` has no opinion on brand styling.
- `SkipLinks`' hardcoded anchors (`#main-content`, `#footer-content`) expect the consuming
  layout's main/footer regions to carry those `id`s — unchanged from using `SkipLinks` directly.
