---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# Never move the element whose `:hover` moves it

Put a hover lift (`translate`, `translateY`, a shrinking `scale`) on an inner element and key the
hover on a stable outer one (`.card:hover .card-surface`), never on the hovered element itself.

Why: the transform moves the hit box, so a pointer near the far edge falls outside, hover drops,
the element returns under the pointer and hover restarts: a visible jitter. A pseudo-element bridge
fails when the moving element has `overflow: hidden`, which clips the pseudo's hit area too
(`ServicesCard`, fixed 2026-11-24 with an inner `.services-card-surface`).
