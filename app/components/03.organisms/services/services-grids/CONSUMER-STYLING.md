# ServiceSummaryGrid / ServicesCardGrid — Consumer Styling Guide

## Public token API

### ServiceSummaryGrid

| Token | Default | Controls |
|---|---|---|
| `--service-summary-grid-row-gap` | `4rem` | Gap between stacked `ServiceSummary` rows |

### ServicesCardGrid

| Token | Default | Controls |
|---|---|---|
| `--services-card-grid-column-min-width` | `250px` | Minimum card column width before wrapping (capped at the container width) |
| `--services-card-grid-gap` | `4rem` | Gap between cards |

Each item is a full `ServiceSummary` or `ServicesCard`, styled by its own tokens (see
`03.organisms/services/service-summary/CONSUMER-STYLING.md` and
`03.organisms/services/services-card/CONSUMER-STYLING.md`). ServicesCardGrid's CTA is
`InputButton` (`variant="secondary"`).

> Changed 2026-09-28: ServicesCardGrid columns use `minmax(min(<min-width>, 100%), 1fr)`, so a
> single column no longer overflows a container narrower than the minimum width.

No private `--_` tokens.

---

## State hooks

No state classes. The roots are `.service-summary-grid` and `.services-card-grid`; their children
are the item components' own roots.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to each grid's root. Reactive after mount. It doesn't reach
the individual cards.
