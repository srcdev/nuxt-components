# MasonryGrid — Consumer Styling Guide

## Public token API

| Token | Falls back to | Controls |
|---|---|---|
| `--masonry-grid-item-border-colour` | `var(--theme-border)` | Outline colour around each item |
| `--masonry-grid-item-padding` | `1.2rem` | Inner padding of each item |
| `--masonry-grid-transition-duration` | `0.3s` | How long an item takes to slide into its new position on resize (respects `prefers-reduced-motion`) |

Column width, gap, fixed-width mode, and alignment are controlled via props (`item-min-width`,
`gap`, `fixed-width`, `justify`), not CSS custom properties — column count and item positions are
computed in JS from measured pixel values. See `.claude/skills/components/masonry-grid.md`.

---

## Global theming

```css
:where(html) {
  --masonry-grid-item-border-colour: var(--rose-05);
  --masonry-grid-item-padding: 1.6rem;
  --masonry-grid-transition-duration: 0.5s;
}
```

---

## State hooks

| Hook | Meaning |
|---|---|
| `.masonry-grid-wrapper[data-multiple-cols]` | More than one column fits, so tiles are absolutely positioned by script |

Element classes: `.masonry-grid` (root), `.masonry-grid-wrapper`, `.masonry-grid-item`.

Private (not public API), set inline by script: `--_masonry-grid-item-position`,
`--_masonry-grid-item-top`, `--_masonry-grid-item-left` and `--_masonry-grid-item-width` on each tile and `--_masonry-grid-height` on the wrapper.

> Changed 2026-10-21: the state was the class `.multiple-cols`, and the private tokens were
> `--_position`, `--_position-top`, `--_position-left`, `--_element-width` and `--_wrapper-height`:
> generic names that inherited into components placed inside a tile.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

```vue
<MasonryGrid style="--masonry-grid-item-border-colour: var(--gold-04);">
  ...
</MasonryGrid>
```

