---
paths:
  - "app/components/**/*.vue"
---

# Re-measure JS-measured layout on per-item changes

First check whether CSS can place it without measuring: a marker stacked in a grid identical to
the items grid, moved with `inset-inline-start: calc(index * (100% + gap))` (a grid item's
percentages resolve against its grid area), needs no script at all (`SegmentedControl`, 2026-10-17).
When a component does measure child positions in script (connectors, indicators, overlays), observe
each measured item with the `ResizeObserver`, and add a `MutationObserver` for `class` and
`childList` changes. Never rely on a container-only `ResizeObserver`. Don't watch `style` when the
script writes its results as inline styles, or it loops.

Why: one item growing while another shrinks leaves the container's size unchanged, so nothing
re-measures. Detail: CLAUDE.md pitfall #28; `StepperList.vue` is the reference.
