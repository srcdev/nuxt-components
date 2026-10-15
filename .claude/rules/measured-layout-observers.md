---
paths:
  - "app/components/**/*.vue"
---

# Re-measure JS-measured layout on per-item changes

When a component measures child positions in script (connectors, indicators, overlays), observe
each measured item with the `ResizeObserver`, and add a `MutationObserver` for `class` and
`childList` changes. Never rely on a container-only `ResizeObserver`. Don't watch `style` when the
script writes its results as inline styles, or it loops.

Why: one item growing while another shrinks leaves the container's size unchanged, so nothing
re-measures. Detail: CLAUDE.md pitfall #28; `StepperList.vue` is the reference.
