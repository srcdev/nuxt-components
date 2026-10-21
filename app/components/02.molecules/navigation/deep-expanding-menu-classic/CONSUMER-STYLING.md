# DeepExpandingMenuClassic — Consumer Styling Guide

## Public token API

> Changed 2026-10-21: colour defaults now come from `--theme-*` tokens (were `--blue-10`, `white`,
> `black`, `--slate-10`), `--deep-expanding-menu-classic-panel-offset-top` defaults to
> `calc(100% + 1rem)` (was `4rem`, which overlapped a wrapped toggle label), the panel widths switch
> on the menu's own width instead of the viewport, and `--deep-expanding-menu-classic-gap` was
> removed (the root grid has one area, so it never did anything).

### Top-level row

| Token | Default | Controls |
|---|---|---|
| `--deep-expanding-menu-classic-item-gap` | `2.4rem` | Gap between top-level items (row and column, the row wraps) |
| `--deep-expanding-menu-classic-link-border-width` | `0.2rem` | Bottom border width on links, group toggles and child links |
| `--deep-expanding-menu-classic-link-padding-block` | `0.8rem` | Vertical padding on links and group toggles |
| `--deep-expanding-menu-classic-link-border-colour-hover` | `var(--theme-border)` | Bottom border colour on hover/focus |
| `--deep-expanding-menu-classic-focus-outline-width` | `0.2rem` | Keyboard focus ring width on links and toggles |
| `--deep-expanding-menu-classic-focus-outline-colour` | `var(--theme-ring, currentcolor)` | Keyboard focus ring colour |
| `--deep-expanding-menu-classic-icon-size` | `1.2rem` | Caret icon size |

### Panel

| Token | Default | Controls |
|---|---|---|
| `--deep-expanding-menu-classic-panel-offset-top` | `calc(100% + 1rem)` | Panel offset from the top of its group |
| `--deep-expanding-menu-classic-panel-width` | `20rem` | Panel width while the menu is under `768px` wide |
| `--deep-expanding-menu-classic-panel-width-tablet` | `40rem` | Panel width once the menu is `768px` wide |
| `--deep-expanding-menu-classic-panel-width-desktop` | `60rem` | Panel width once the menu is `1024px` wide |
| `--deep-expanding-menu-classic-panel-text-colour` | `var(--theme-text)` | Panel text colour |
| `--deep-expanding-menu-classic-panel-background-colour` | `var(--theme-surface-subtle)` | Panel background |
| `--deep-expanding-menu-classic-panel-border-width` | `0.1rem` | Panel border width |
| `--deep-expanding-menu-classic-panel-border-colour` | `var(--theme-border)` | Panel border colour |
| `--deep-expanding-menu-classic-panel-border-radius` | `1.2rem` | Panel corner radius |
| `--deep-expanding-menu-classic-panel-shadow` | `0 0 1rem rgba(0, 0, 0, 0.1)` | Panel box-shadow |
| `--deep-expanding-menu-classic-panel-padding` | `1.2rem` | Panel padding |
| `--deep-expanding-menu-classic-panel-heading-colour` | `var(--theme-text)` | `childLinksTitle` heading colour |
| `--deep-expanding-menu-classic-panel-heading-line-clamp` | `none` | Lines of `childLinksTitle` before an ellipsis. `1` is single-line ellipsis, `none` shows everything |
| `--deep-expanding-menu-classic-panel-list-gap` | `1.2rem` | Gap between the panel's heading and list, and between child link grid items |
| `--deep-expanding-menu-classic-group-link-colour` | `var(--theme-text)` | Child link text colour |
| `--deep-expanding-menu-classic-group-link-border-colour-hover` | `var(--theme-text)` | Child link bottom border colour on hover/focus |

Each panel width is capped at the menu's own width (`min(<token>, 100cqi)`). Private tokens (not
public API): `--_icon-transform` (caret flip).

## State hooks

| Hook | Meaning |
|---|---|
| `.deep-expanding-menu-classic-group[open]` | Group open (flips the caret) |

Inner elements: `.deep-expanding-menu-classic-inner` (the flex row),
`.deep-expanding-menu-classic-link` (direct link), `.deep-expanding-menu-classic-group` (the
`<details>`), `.deep-expanding-menu-classic-group-toggle` (the `<summary>`),
`.deep-expanding-menu-classic-group-label`, `.deep-expanding-menu-classic-group-icon`,
`.deep-expanding-menu-classic-group-panel`, `.deep-expanding-menu-classic-group-heading`,
`.deep-expanding-menu-classic-group-list`, `.deep-expanding-menu-classic-group-item`,
`.deep-expanding-menu-classic-group-link`.

> Changed 2026-10-21: these were `.inner`, `.navigation-link`, `.navigation-group`,
> `.navigation-group-toggle`, `.icon`, `.navigation-group-panel`, `.navigation-group-list`,
> `.navigation-group-item` and `.navigation-group-link`. The heading had no class of its own.

## Sizing model

The root is an inline-size container named `deep-expanding-menu-classic`, so it can't size itself
from its content: give it a width from its parent (it fills a block or grid cell by default). A
panel opens from its toggle's left edge, so a group near the menu's right edge can still overrun it
by up to the panel's width; `DeepExpandingMenu` flips its panel instead.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

## Class passthrough

`style-class-passthrough` adds classes to the root element (the `<nav>` by default). It's the
usual place to scope token overrides to one instance.
