# Breadcrumb — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--breadcrumb-font-size` | `1.3rem` | Font size of the whole trail |
| `--breadcrumb-gap` | `0.8rem` | Gap between an item's label and its separator, and between items |
| `--breadcrumb-text-transform` | `uppercase` | Text transform of the whole trail |
| `--breadcrumb-letter-spacing` | `0.05em` | Letter spacing of the whole trail |
| `--breadcrumb-colour` | `currentColor` | Colour of links, separators, and non-current labels |
| `--breadcrumb-colour-current` | `currentColor` | Colour of the current-page item (the last item, when it has no `to`) |
| `--breadcrumb-link-decoration-hover` | `underline` | `text-decoration` on link hover/focus |
| `--breadcrumb-item-line-clamp` | `none` | Max lines of each item's label, with an ellipsis on the last. `1` is single-line ellipsis, `none` shows everything |

> Added 2026-10-06: `--breadcrumb-item-line-clamp`; long unbroken labels now wrap inside the trail.

```css
.breadcrumb {
  --breadcrumb-colour: white;
  --breadcrumb-colour-current: var(--colour-text-accent);
}
```

---

## State hooks

| Hook | When |
|---|---|
| `.breadcrumb__label[aria-current="page"]` | The last item, when it has no `to` (styled by `--breadcrumb-colour-current`) |

Inner classes: `.breadcrumb__list`, `.breadcrumb__item`, `.breadcrumb__link`, `.breadcrumb__label`,
`.breadcrumb__separator`.

---

## Text content — props, not CSS

`items`, `separator` and `ariaLabel` (the nav landmark's label) are props. There is no hardcoded copy to
override in CSS.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `nav.breadcrumb`. Reactive after mount.

---

## Notes

- An item renders as a `NuxtLink` when it has a `to`, otherwise as a plain `<span>`. The last item gets
  `aria-current="page"` when it has no `to`, so omit `to` on the current page's item.
- The separator (`aria-hidden="true"`) is only rendered between items, never after the last one, and
  not at all when `separator` is `""`.
- Items with a blank `label` are skipped, and no `<nav>` is rendered when none are left (added 2026-10-06).
- `--breadcrumb-colour` is what `ServiceDetail` overrides internally (to `white` by default) so
  the breadcrumb reads over its hero image — see `ServiceDetail`'s `CONSUMER-STYLING.md`.

