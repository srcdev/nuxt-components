# ContentDocs — Consumer Styling Guide

## Public token API

Most tokens come in a **shared** form (`--content-docs-heading-*`, `-panel-*`, `-link-*`) that
styles both the docs nav and the page nav, plus **per-side** forms (`--content-docs-nav-*`,
`--content-docs-page-nav-*`) that fall back to the shared one when unset.

> Changed 2026-09-27: defaults no longer call `light-dark()` themselves (unsupported on older iPad
> Safari). Colours now come from the global scheme-aware tokens (`--colour-text-default`,
> `--page-bg`, `--theme-surface-subtle`), so they still follow light/dark mode. The active-link
> pill is a fixed green pair that reads the same in both.

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
| `--content-docs-link-active-bg` | `var(--green-01)` | `-nav-link-active-bg`, `-page-nav-link-active-bg` |
| `--content-docs-link-active-color` | `var(--green-10)` | `-nav-link-active-color`, `-page-nav-link-active-color` |
| `--content-docs-link-bg` | `transparent` | Shared only |
| `--content-docs-link-font-size` | `1.4rem` | Shared only |
| `--content-docs-link-padding-block` | `0.6rem` | Shared only |
| `--content-docs-link-padding-inline` | `0.8rem` | Shared only |
| `--content-docs-link-margin-block` | `0` | Shared only |
| `--content-docs-link-border-radius` | `0.4rem` | Shared only |

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
`--control-transition-ease` (`ease`); focus rings use `--theme-ring`.

The `--_*` variables declared on `.content-docs` (e.g. `--_link-color`, `--_nav-link-hover-bg`)
are the resolved shared/per-side fallback chain: not public API. Set the `--content-docs-*`
tokens instead.

---

## State hooks

| Selector | When |
|---|---|
| `.docs-nav-link.is-active`, `.docs-page-nav-link.is-active` | The link matching `v-model:active-nav-item` / `v-model:active-page-nav-item` (also gets `aria-current="page"`) |

Inner classes: `.content-docs-inner` (grid), `.docs-nav`, `.docs-content`, `.docs-page-nav` (grid
areas), `.docs-nav-heading`, `.docs-page-nav-heading`, `.docs-nav-list`, `.docs-page-nav-list`
(the `<nav>`s), `.docs-nav-link`, `.docs-page-nav-link`, `-link-icon`, `-link-label`.

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
