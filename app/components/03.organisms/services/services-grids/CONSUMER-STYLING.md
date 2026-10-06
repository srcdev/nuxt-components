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
| `--services-card-grid-button-text-white-space` | `normal` | Wrapping of each card CTA label (`InputButton`'s `--input-button-text-white-space`). Set `nowrap` for single-line labels |

Each item is a full `ServiceSummary` or `ServicesCard`, styled by its own tokens (see
`03.organisms/services/service-summary/CONSUMER-STYLING.md` and
`03.organisms/services/services-card/CONSUMER-STYLING.md`). ServicesCardGrid's CTA is
`InputButton` (`variant="secondary"`).

> Changed 2026-10-06: CTA labels wrap inside the card (they used to stay on one line and be clipped
> by the card edge for a long or translated title), and an empty title no longer leaves a trailing
> space in the label.

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

**Caveat:** `.services-card-grid` re-declares `--input-button-text-white-space` on itself, so setting
that InputButton token on an ancestor doesn't reach the grid's buttons. Use
`--services-card-grid-button-text-white-space` instead.

---

## Class passthrough

`style-class-passthrough` adds classes to each grid's root. Reactive after mount. It doesn't reach
the individual cards.
