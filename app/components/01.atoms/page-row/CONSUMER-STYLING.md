# PageRow — Consumer Styling Guide

## Public token API

All `--page-row-*` tokens are the stable override surface. Set them at any scope (global, page,
or instance) without touching the component itself.

| Token | Default | Controls |
|---|---|---|
| `--page-row-minimum-content-padding` | `1rem` | Minimum gutter on each side at narrow viewports |
| `--page-row-popout-max-width` | `1400px` | Maximum width of the `popout` column track |
| `--page-row-content-max-width` | `1064px` | Maximum width of the `content` column track |
| `--page-row-inset-content-max-width` | `840px` | Maximum width of the `inset-content` column track |

Private (not public API): `--_minimum-content-padding`,
`--_content-max-width`, `--_inset-content-max-width` (resolved copies of the tokens above) and the
computed tracks `--_full-track-min`, `--_full-track`, `--_popout-track`, `--_content-track`,
`--_inset-content-track`.

> Changed 2026-09-27: the computed tracks used to be unprefixed `--full`, `--popout`, `--content`
> and `--inset-content`. Declared on every `.page-row`, they overwrote any consumer variable with
> the same (very generic) name inside a page row. They are internal and now carry the `--_` prefix.

---

## State hooks

| Hook | When |
|---|---|
| `.page-row.full`, `.popout`, `.content`, `.inset-content` | The `variant` prop (default `content`). Sets the row's own track when nested, and the default track for its direct non-PageRow children |
| `[data-align="start"]`, `[data-align="end"]` | The `align` prop on a nested row: bleeds to the left or right edge instead of centring |

Direct children of a `.page-row` are grid items placed on a named track (`full`, `popout`,
`content`, `inset-content`). Place your own child elsewhere with e.g. `grid-column: popout`.

---

## Global theming

Create `assets/styles/setup/07.components/page-row.css` in the consuming app and set tokens on
`:root`. These values apply to every `PageRow` instance across the site.

```css
/* assets/styles/setup/07.components/page-row.css */
:root {
  --page-row-minimum-content-padding: 1.6rem;
  --page-row-popout-max-width: 1280px;
  --page-row-content-max-width: 960px;
  --page-row-inset-content-max-width: 720px;
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** a nested `.page-row` re-declares `--_minimum-content-padding` as
`var(--page-row-minimum-content-padding, 0px)`, so nested rows get no gutter by default. If you set
`--page-row-minimum-content-padding` on an ancestor, nested rows inherit that value and pick up the
gutter too. Reset it to `0px` on nested rows if that's not what you want.

### Page or section

Override track widths for a specific page by scoping tokens under the page wrapper. No `:deep()`
is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.landing-page {
  .page-row {
    --page-row-content-max-width: 800px;
    --page-row-minimum-content-padding: 2.4rem;
  }
}
```

### One instance: inline style

```vue
<PageRow
  variant="content"
  style="--page-row-content-max-width: 720px;"
>
  ...
</PageRow>
```

### One instance: style-class-passthrough

```vue
<PageRow variant="content" :style-class-passthrough="['narrow']">
  ...
</PageRow>
```

```css
.page-row {
  &.narrow {
    --page-row-content-max-width: 720px;
    --page-row-minimum-content-padding: 2rem;
  }
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.page-row` element, alongside the variant
class. Tokens set on a passthrough class land for that row and any rows nested in it.

---

## Notes

- Track widths are derived from the four tokens using `calc()` — changing one token shifts all
  related tracks proportionally.
- `--page-row-minimum-content-padding` controls how close content gets to the viewport edge on
  narrow screens; it also sets the outer `full` gutter minimum.
- The component applies no padding, margin, or background — those are always set by the consuming
  app on the PageRow element or its children.

