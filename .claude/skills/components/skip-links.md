---
name: SkipLinks
description: SkipLinks accessibility skip-navigation utility — focus-revealed jump links, props, CSS tokens, consumer styling
type: reference
---

# SkipLinks

## Overview

`SkipLinks` renders a set of visually-hidden links that become visible on keyboard focus, letting
keyboard and screen-reader users jump past repeated navigation straight to main content, the
footer, or any other in-page target. Place it first in the page layout, before the header/nav, so
it's the first focusable element on the page.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `links` | `SkipLink[]` (`{ href: string; label: string }[]`) | `[{ href: "#main-content", label: "Skip to main content" }, { href: "#footer-content", label: "Skip to footer" }]` | no |
| `ariaLabel` | `string` | `"Skip navigation"` | no — override for localisation |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

`SkipLink` is exported from `~/types/components/skip-links` (and re-exported from
`~/types/components`):

```typescript
interface SkipLink {
  href: string;
  label: string;
}
```

## Slots

`homeLink` — optional content (typically a logo/home link) rendered before the skip-nav, wrapped
in `.skip-links__home`. Only rendered when the slot is actually used.

```vue
<SkipLinks>
  <template #homeLink>
    <NuxtLink to="/" class="logo">Acme</NuxtLink>
  </template>
</SkipLinks>
```

## Usage

```vue
<SkipLinks
  :links="[
    { href: '#site-navigation', label: 'Skip to navigation' },
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#footer-content', label: 'Skip to footer' },
  ]"
/>
```

Each `href` must match the `id` of a real element on the page (e.g. `<main id="main-content">`) —
the component does not create those anchors itself.

## Accessibility behaviour

- Links are hidden via `opacity`/`transform`, not `display`/`visibility` — they stay in the tab
  order and keyboard-focusable even while visually hidden.
- The panel reveals on `:focus-within`, so tabbing onto any link shows the whole group.
- Wrapped in a `<nav :aria-label="ariaLabel">` landmark, defaulting to `"Skip navigation"`.
- The reveal transition is disabled under `prefers-reduced-motion: reduce`.
- `ariaLabel` and every link's `label` are plain string props/fields — pass translated strings
  from the consumer's own i18n solution.

## CSS custom properties

See `CONSUMER-STYLING.md` in this component's folder for the full `--skip-links-*` token API
(panel background/border, link text colour, spacing, transition duration, focus outline).

## Notes

- Component is auto-imported in Nuxt — no import needed.
- Migrated 2026-09-15 from the unplaced `skip-links/` folder: the link set was previously
  hardcoded (two fixed `<a>` tags with hardcoded English copy) — now data-driven via `links` so
  consumers can add/remove targets and localise the copy without forking the component.
