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

## Notes

- Track widths are derived from the four tokens using `calc()` — changing one token shifts all
  related tracks proportionally.
- `--page-row-minimum-content-padding` controls how close content gets to the viewport edge on
  narrow screens; it also sets the outer `full` gutter minimum.
- The component applies no padding, margin, or background — those are always set by the consuming
  app on the PageRow element or its children.

