# LayoutGridByCols — Consumer Styling Guide

## Public token API

| Token | Default | Set by prop | Controls |
|---|---|---|---|
| `--layout-grid-by-cols-column-count` | `2` | `columnCount` | Number of equal columns above the collapse threshold (integer) |
| `--layout-grid-by-cols-single-col-below` | `768px` | `singleColBelow` | Grid width below which it becomes one column. `0px` never collapses |
| `--layout-grid-by-cols-gap` | `1rem` | `gap` | Row and column gap (a single length) |
| `--layout-grid-by-cols-row-gap` | `var(--layout-grid-by-cols-gap)` | none | Row gap only |
| `--layout-grid-by-cols-column-gap` | `var(--layout-grid-by-cols-gap)` | none | Column gap only |

A prop, when passed, writes its token inline on the root and beats any CSS. None of the layout props
has a default of its own, so leave one off to control that value from CSS (e.g. per breakpoint).

> **Changed 2026-09-27**: `singleColBelow` used to do nothing (the breakpoint was hardcoded as a
> `768px` container query), and `gap`/`columnCount` were `v-bind()` values with no token. All three
> are now public tokens. The collapse no longer uses a container query, which is what lets the
> threshold be a token (container query conditions can't read custom properties).

Private tokens (not public API), all on `.layout-grid-by-cols-inner`: `--_cols`, `--_column-gap`,
`--_collapse`, `--_column-min`, intermediates for the column track calculation.

## State hooks

No `data-*` attributes. Classes:

- `.layout-grid-by-cols`: the root (`div` or `section`).
- `.layout-grid-by-cols-inner`: the grid itself; slot content are its direct children.
- `.sr-only`: the hidden label `<p>`, only when `tag="section"` and a `label` is passed.

> **Changed 2026-09-27**: `.layout-grid-inner` → `.layout-grid-by-cols-inner`. The root no longer
> sets `container-type`/`container-name: layoutGrid`.

## Sizing model

Columns are `repeat(auto-fill, minmax(<track>, 1fr))`, where the track minimum is either the full
width (below the threshold) or exactly one Nth of the width minus the gaps (at or above it). The
switch compares the grid's own width with the threshold, not the viewport's, so it behaves like the
old container query. Fewer items than columns leave empty tracks, as before.

The column-gap feeds that calculation, so it must be a single length (`gap: "1rem 2rem"` style
shorthand isn't supported; use the row/column gap tokens instead).

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** `columnCount`, `gap` and `singleColBelow`, when passed, are written inline on the root
and override their tokens. To drive one from CSS, don't pass its prop.

## Recipe: more columns on wide screens

```css
.team {
  --layout-grid-by-cols-column-count: 2;
  --layout-grid-by-cols-single-col-below: 480px;

  @media (width >= 1024px) {
    --layout-grid-by-cols-column-count: 4;
  }
}
```

## Class passthrough

`style-class-passthrough` adds classes to the root. Reachable in normal use, and the simplest place
to set the tokens for one instance.
