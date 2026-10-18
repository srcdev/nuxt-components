# ContentDocs — Consumer Styling Guide

## Public token API

Most tokens come in a **shared** form (`--content-docs-heading-*`, `-panel-*`, `-link-*`) that
styles both the docs nav and the page nav, plus **per-side** forms (`--content-docs-nav-*`,
`--content-docs-page-nav-*`) that fall back to the shared one when unset.

> Changed 2026-09-27: defaults no longer call `light-dark()` themselves (unsupported on older iPad
> Safari). Text and panel colours come from the global page tokens (`--colour-text-default`,
> `--page-bg`); hover from `--theme-surface-subtle`.
>
> Changed 2026-10-18: the active-link pill was a fixed green pair (`--green-01` / `--green-10`). It
> now follows the theme: `--theme-surface` with `--theme-on-surface` text. Set
> `--content-docs-link-active-bg` / `-color` to keep the old look.

### Headings

| Shared token | Default | Per-side overrides |
|---|---|---|
| `--content-docs-heading-font-size` | `1.4rem` | `--content-docs-nav-heading-font-size`, `--content-docs-page-nav-heading-font-size` |
| `--content-docs-heading-font-weight` | `700` | `-nav-heading-font-weight`, `-page-nav-heading-font-weight` |
| `--content-docs-heading-color` | `var(--colour-text-default)` | `-nav-heading-color`, `-page-nav-heading-color` |
| `--content-docs-heading-bg` | `transparent` | `-nav-heading-bg`, `-page-nav-heading-bg` |
| `--content-docs-heading-margin` | `0` | `-nav-heading-margin`, `-page-nav-heading-margin` |
| `--content-docs-heading-padding-block` | `0.4rem 0.8rem` | `-nav-heading-padding-block`, `-page-nav-heading-padding-block` |
| `--content-docs-heading-padding-inline` | `0` | `-nav-heading-padding-inline`, `-page-nav-heading-padding-inline` |

### Panels (the `<nav>` list containers)

| Token | Default | Notes |
|---|---|---|
| `--content-docs-panel-bg` | `var(--page-bg)` | Per-side: `--content-docs-nav-panel-bg`, `--content-docs-page-nav-panel-bg` |
| `--content-docs-panel-padding-block` | `0.8rem` | Shared only |
| `--content-docs-panel-padding-inline` | `0.8rem` | Shared only |
| `--content-docs-panel-border-radius` | `0.5rem` | Shared only |

### Links

| Shared token | Default | Per-side overrides |
|---|---|---|
| `--content-docs-link-color` | `var(--colour-text-default)` | `-nav-link-color`, `-page-nav-link-color` |
| `--content-docs-link-hover-bg` | `var(--theme-surface-subtle)` | `-nav-link-hover-bg`, `-page-nav-link-hover-bg` |
| `--content-docs-link-hover-color` | the link colour | `-nav-link-hover-color`, `-page-nav-link-hover-color` |
| `--content-docs-link-active-bg` | `var(--theme-surface)` | `-nav-link-active-bg`, `-page-nav-link-active-bg` |
| `--content-docs-link-active-color` | `var(--theme-on-surface)` | `-nav-link-active-color`, `-page-nav-link-active-color` |
| `--content-docs-link-bg` | `transparent` | Shared only |
| `--content-docs-link-font-size` | `1.4rem` | Shared only |
| `--content-docs-link-padding-block` | `0.6rem` | Shared only |
| `--content-docs-link-padding-inline` | `0.8rem` | Shared only |
| `--content-docs-link-margin-block` | `0` | Shared only |
| `--content-docs-link-border-radius` | `0.4rem` | Shared only |
| `--content-docs-link-focus-outline-width` | `0.2rem` | Shared only. Keyboard focus ring, drawn inside the link (`outline-offset: -0.2rem`) |
| `--content-docs-link-focus-outline-color` | `var(--theme-border-focus)` | Shared only |

### Link icons

| Token | Default | Notes |
|---|---|---|
| `--content-docs-link-icon-size` | `1.6rem` | Icon column width and icon `font-size` (both lists) |
| `--content-docs-link-icon-gap` | `0.6rem` | Gap between icon and label (both lists) |
| `--content-docs-nav-link-icon-order` | `ltr` | `rtl` puts the icon after the label in the docs nav |
| `--content-docs-page-nav-link-icon-order` | `ltr` | Same, for the page nav |

> Changed 2026-09-27: renamed from `--docs-nav-link-icon-size`, `--docs-nav-link-icon-gap`,
> `--docs-nav-link-icon-order` and `--docs-page-nav-link-icon-order`. The size is now applied as
> `font-size`; as `width`/`height` it was silently overridden by `@nuxt/icon`'s own rule.

### Layout

| Token | Default | Notes |
|---|---|---|
| `--content-docs-nav-column-width` | `23rem` | Docs nav track at 1024px+ container width |
| `--content-docs-page-nav-column-width` | `22rem` | Page nav track at 1024px+ |
| `--content-docs-page-nav-column-width-tablet` | `20rem` | Page nav track at 768px–1023px |

Link transitions also read the library-wide `--control-transition-duration` (`200ms`) and
`--control-transition-ease` (`ease`).

Private tokens (not public API), declared on `.content-docs`: `--_heading-*` and `--_link-color`,
`--_link-hover-*`, `--_link-active-*`, `--_panel-bg` (the shared values each per-side token falls
back to), and `--_link-focus-outline` (width + colour). Set the `--content-docs-*` tokens instead.

---

## State hooks

| Selector | When |
|---|---|
| `.content-docs-nav-link[aria-current="page"]`, `.content-docs-page-nav-link[aria-current="page"]` | The link whose `to` matches `v-model:active-nav-item` / `v-model:active-page-nav-item`. Every item sharing that `to` matches |

Inner classes: `.content-docs-inner` (grid), `.content-docs-nav`, `.content-docs-content`,
`.content-docs-page-nav` (grid areas, each `min-inline-size: 0`), `.content-docs-nav-heading`,
`.content-docs-page-nav-heading`, `.content-docs-nav-list`, `.content-docs-page-nav-list` (the
`<nav>`s; their `<ul>`s carry `role="list"`), `.content-docs-nav-link`, `.content-docs-page-nav-link`,
and each link's `-icon` and `-label`.

> **Changed 2026-10-18**: generic class names collided with consumer CSS (a docs site is the likeliest
> place to already have a `.docs-nav`). Every inner class gained the `content-docs-` prefix:
>
> | Old | New |
> |---|---|
> | `.docs-nav`, `.docs-content`, `.docs-page-nav` | `.content-docs-nav`, `.content-docs-content`, `.content-docs-page-nav` |
> | `.docs-nav-heading`, `.docs-page-nav-heading` | `.content-docs-nav-heading`, `.content-docs-page-nav-heading` |
> | `.docs-nav-list`, `.docs-page-nav-list` | `.content-docs-nav-list`, `.content-docs-page-nav-list` |
> | `.docs-nav-link`, `.docs-page-nav-link` (and `-icon`, `-label`) | `.content-docs-nav-link`, `.content-docs-page-nav-link` (and `-icon`, `-label`) |
> | `.is-active` | removed: select `[aria-current="page"]` |
>
> The three grid areas now set `min-inline-size: 0` and the grid tracks are `minmax(0, 1fr)`, so a
> consumer `min-width: 0` on them is no longer needed. `.content-docs-content` also sets
> `overflow-wrap: break-word`. Token names are unchanged.

The collapsible wrappers are `ExpandingPanelClassic` by default (`.expanding-panel-classic-*`
classes) or `ExpandingPanel` with `panel-variant="modern"` (`.expanding-panel-*`). Style both if
you target them.

---

## Breakpoints

Container queries on `.content-docs` (`container-name: contentDocs`), matched in script by
`useContainerBreakpoints`:

| Container width | Layout |
|---|---|
| < 768px | Single column; both navs are collapsible panels that overlay content |
| 768px–1023px | Page nav pinned open in a right-hand column; docs nav collapsible above content |
| ≥ 1024px | Three columns, both navs pinned open |

Labels and headings wrap anywhere (`overflow-wrap: anywhere`), so an unbroken label stays inside its
column. Labels take their direction from their own text (`unicode-bidi: plaintext`), so a
right-to-left label reads and aligns right-to-left even though the link sets `direction` for the
icon-order trick. The page itself is assumed left-to-right: on a `dir="rtl"` page set both
`-icon-order` tokens to `rtl` to put icons at the inline start.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** set the public `--content-docs-*` tokens, not the `--_*` names. The `--_*` chain is
re-declared on `.content-docs` itself, so an ancestor value for a `--_*` name never lands.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.content-docs` element, which is where the
token fallback chain is resolved, so tokens set on a passthrough class land for the whole
component.
