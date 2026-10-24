---
paths:
  - "app/**/*.vue"
---

# Menus close themselves when a link inside them is followed

Any `<details>` dropdown or popover panel that holds links must close when one of them is clicked
(a delegated `@click` that checks `closest("a")`), and a header-level one also on route change.
Never rely on navigation to close it.

Why: a menu in a layout outlives the route change, and a popover only light-dismisses on outside
clicks, so the menu stayed open on the next page (`ResponsiveHeader` overflow menu and
`DeepExpandingMenu` panels, fixed 2026-10-24). Same-route clicks and back/forward need covering too.
