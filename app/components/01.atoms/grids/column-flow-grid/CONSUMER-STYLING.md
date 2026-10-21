# ColumnFlowGrid — Consumer Styling Guide

## Public token API

| Token | Falls back to | Controls |
|---|---|---|
| `--column-flow-grid-item-border-colour` | `var(--theme-border)` | Outline colour around each item |
| `--column-flow-grid-item-padding` | `1.2rem` | Inner padding of each item |

Column width and gap are controlled via props (`item-min-width`, `gap`, `unit`), not CSS custom
properties — they drive the CSS column layout directly and need JS-computed values, so they aren't
part of the public token API. See `.claude/skills/components/column-flow-grid.md`.

---

## Global theming

```css
:where(html) {
  --column-flow-grid-item-border-colour: var(--rose-05);
  --column-flow-grid-item-padding: 1.6rem;
}
```

---

## State hooks

No state attributes. Element classes: `.column-flow-grid-wrapper` (root, the multi-column box) and
`.column-flow-grid-item` (each slot, `break-inside: avoid`, wraps long words since 2026-10-21).

Private (not public API): `--_column-flow-grid-gap` and `--_column-flow-grid-item-min-width`, set
inline from the `gap`/`unit` and `itemMinWidth` props. The second was `--_item-min-width` until
2026-10-21, a generic name that leaked into slotted components.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

```vue
<ColumnFlowGrid style="--column-flow-grid-item-border-colour: var(--gold-04);">
  ...
</ColumnFlowGrid>
```

