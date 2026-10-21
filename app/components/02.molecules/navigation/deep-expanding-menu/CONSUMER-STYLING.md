# DeepExpandingMenu — Consumer Styling Guide

## Public token API

> Changed 2026-10-21: colour defaults now come from `--theme-*` tokens (were `--blue-10`, `white`,
> `black`, `--slate-10`), and the structural classes are prefixed (see State hooks).

### Top-level row

| Token | Default | Controls |
|---|---|---|
| `--deep-expanding-menu-gap` | `2.4rem` | Gap between top-level items (row and column, the row wraps) |
| `--deep-expanding-menu-link-border-width` | `0.2rem` | Bottom border width on links, group toggles and child links |
| `--deep-expanding-menu-link-padding-block` | `0.8rem` | Vertical padding on links and group toggles |
| `--deep-expanding-menu-link-border-colour-hover` | `var(--theme-border)` | Bottom border colour on hover/focus |
| `--deep-expanding-menu-focus-outline-width` | `0.2rem` | Keyboard focus ring width on links and toggles |
| `--deep-expanding-menu-focus-outline-colour` | `var(--theme-ring, currentcolor)` | Keyboard focus ring colour |
| `--deep-expanding-menu-icon-size` | `1.2rem` | Caret icon size |

### Panel

| Token | Default | Controls |
|---|---|---|
| `--deep-expanding-menu-panel-width` | `min(100%, 50vw)` | Panel width |
| `--deep-expanding-menu-panel-max-height` | `70dvh` | Panel max height; longer lists scroll inside it |
| `--deep-expanding-menu-panel-text-colour` | `var(--theme-text)` | Panel text colour |
| `--deep-expanding-menu-panel-background-colour` | `var(--theme-surface-subtle)` | Panel background |
| `--deep-expanding-menu-panel-border-width` | `0.1rem` | Panel border width |
| `--deep-expanding-menu-panel-border-colour` | `var(--theme-border)` | Panel border colour |
| `--deep-expanding-menu-panel-border-radius` | `1.2rem` | Panel corner radius |
| `--deep-expanding-menu-panel-shadow` | `0 0 1rem rgba(0, 0, 0, 0.1)` | Panel box-shadow |
| `--deep-expanding-menu-panel-padding` | `1.2rem` | Panel padding |
| `--deep-expanding-menu-panel-heading-colour` | `var(--theme-text)` | `childLinksTitle` heading colour |
| `--deep-expanding-menu-panel-heading-line-clamp` | `none` | Lines of `childLinksTitle` before an ellipsis. `1` is single-line ellipsis, `none` shows everything |
| `--deep-expanding-menu-panel-list-gap` | `1.2rem` | Gap between child link grid items |
| `--deep-expanding-menu-group-link-colour` | `var(--theme-text)` | Child link text colour |
| `--deep-expanding-menu-group-link-border-colour-hover` | `var(--theme-text)` | Child link bottom border colour on hover/focus |
| `--deep-expanding-menu-panel-z-index` | `999999` | Panel stacking order in browsers without CSS anchor positioning. Ignored where the panel renders in the top layer |

Private tokens (not public API): `--_anchor-name` (per-group anchor, set inline),
`--_icon-transform` (caret flip), and `--_anchor-bottom`, `--_anchor-left`,
`--_anchor-top-inverse` (written by `useAnchoredPopover` in the fallback).

Not tokenised: the `1rem` gap between a toggle and its panel, and the `12rem` minimum child link
column. Anchor names and popover target ids come from `useId()`.

## State hooks

| Hook | Meaning |
|---|---|
| `.deep-expanding-menu-group-toggle[aria-expanded="true"]` | Group open, every browser (flips the caret) |
| `.deep-expanding-menu-group-panel:popover-open` | Panel open, Popover API browsers |
| `.deep-expanding-menu-panel-open` | Panel open, browsers without the Popover API (Safari 16 and older). Style it in a **separate rule** from `:popover-open`: a selector list containing `:popover-open` is dropped whole where it's unsupported |
| `.deep-expanding-menu-group-panel[data-placement="top"]` | Flipped above the toggle, browsers without CSS anchor positioning only |

Inner elements: `.deep-expanding-menu-inner` (the flex row), `.deep-expanding-menu-link` (direct
link), `.deep-expanding-menu-group`, `.deep-expanding-menu-group-toggle`,
`.deep-expanding-menu-group-label`, `.deep-expanding-menu-group-icon`,
`.deep-expanding-menu-group-panel`, `.deep-expanding-menu-group-heading`,
`.deep-expanding-menu-group-list`, `.deep-expanding-menu-group-item`,
`.deep-expanding-menu-group-link`.

> Changed 2026-10-21: these were `.inner`, `.navigation-link`, `.navigation-group`,
> `.navigation-group-toggle`, `.icon`, `.navigation-group-panel`, `.navigation-group-list`,
> `.navigation-group-item` and `.navigation-group-link`. The heading had no class of its own.

## Browser support and placement

Where CSS anchor positioning is supported, a panel that would overflow the right edge flips to
align with its toggle's right edge (`position-try-fallbacks: flip-inline`). Without anchor
positioning (e.g. Safari 17–18) the panel is placed with `position: fixed` from the toggle's
measured position. Without the Popover API (Safari 16) the panel also opens and closes in JS and
isn't in the top layer, so `--deep-expanding-menu-panel-z-index` applies, and an ancestor with
`transform`, `filter` or `contain` becomes its containing block and can misplace it.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** in browsers with the Popover API the panel renders in the top layer but stays a DOM
descendant of the menu, so tokens set on an ancestor still reach it.

## Class passthrough

`style-class-passthrough` adds classes to the root element (the `<nav>` by default). It's the
usual place to scope token overrides to one instance.
