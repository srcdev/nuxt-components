# AccordionGroup — Consumer Styling Guide

> Renamed 2026-10-20: `AccordianCore` → `AccordionGroup`, root class `.display-accordian` →
> `.accordion-group`, panel class `.accordian-item` → `.accordion-group-item`.

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--accordion-group-max-width` | `60rem` | Maximum width of the group (it centres itself with `margin-inline: auto`). Use `100%` to fill the container. |

> Changed 2026-10-20: the width was a hardcoded `max-width: 600px`; it's now this token, same
> default.

Everything else (summary padding and gap, icon size, colours, borders) belongs to the panel
component the group renders, so set those panels' tokens; they reach every panel in the group:

- `variant="classic"` (default): `ExpandingPanelClassic`, see
  [../expanding-panel-classic/CONSUMER-STYLING.md](../expanding-panel-classic/CONSUMER-STYLING.md)
- `variant="modern"`: `ExpandingPanel`, see
  [../expanding-panel/CONSUMER-STYLING.md](../expanding-panel/CONSUMER-STYLING.md)

Private tokens: none. The animation duration reaches the CSS through `v-bind()` from the
`animationDuration` prop.

## State hooks

| Selector | Meaning |
|---|---|
| `.accordion-group` | Root element. |
| `.accordion-group-item` | Every panel in the group (added through each panel's `style-class-passthrough`). |
| `.accordion-group-item.expanding-panel-classic` | A panel, `variant="classic"`. |
| `.accordion-group-item.expanding-panel` | A panel, `variant="modern"`. |

The panel root class depends on `variant`, so a selector written for one variant won't match the
other.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

## Recipe: dividers between panels

```css
.faq-section {
  --accordion-group-max-width: 72rem;

  .accordion-group-item:not(:last-child) {
    border-block-end: 0.1rem solid var(--theme-border);
  }
}
```

## Class passthrough

`style-class-passthrough` adds classes to the root `.accordion-group` (reactive after mount). The
panels always get `.accordion-group-item`; there's no per-panel passthrough.

## Notes

- `contentIsOnTop` isn't exposed: it's for a single panel overlaying the content after it, not
  stacked panels. Use `ExpandingPanel`/`ExpandingPanelClassic` directly for that.
