# GridStack — Consumer Styling Guide

## Public token API

None. GridStack is pure layout: one grid area that every layer shares. It has no colours,
spacing or sizes of its own to expose, so styling happens on the root and layer classes below, or
on the content you put in each slot.

No private `--_` tokens.

---

## State hooks

| Class | Element |
|---|---|
| `.grid-stack` | Root element (`display: grid; grid-template-areas: "stack"`) |
| `.grid-stack__layer` | Wrapper div around each slot, all sharing `grid-area: stack` |

There are no `data-*` attributes or state classes.

---

## Stacking model

- **DOM order is z-order**: the last slot paints on top. There is no built-in `z-index`.
- The container sizes to the tallest layer, and every layer stretches to that height. Use
  `align-self`/`place-items` on a layer's own content to position it within the stretched space.
- For an overlay that shouldn't block the layer beneath it, put `pointer-events: none` on the
  overlay content and `pointer-events: auto` back on its interactive children.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** GridStack has no tokens, so in practice "overrides" here means plain property rules on
`.grid-stack` or `.grid-stack__layer` (scoped to your own page/section/passthrough class). Rules on
`.grid-stack__layer` reach inside the component, so they need `:deep()` from a scoped file.

### Page or section

```css
.my-page {
  .grid-stack {
    block-size: 60rem;
    border-radius: 1.2rem;
    overflow: hidden;
  }

  .grid-stack__layer:last-child {
    display: grid;
    place-items: center;
  }
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.grid-stack` element. A plain `class`
attribute also falls through to the same element, since GridStack has a single root.

---

## Notes

- Layer wrappers are keyed by slot name, so slot names must be unique.
- Adding `z-index` to a layer for other reasons creates a new stacking context; DOM order still
  decides everything else.
