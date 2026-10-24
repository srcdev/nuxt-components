---
paths:
  - "app/**/*.vue"
---

# Size floating panels from their content

Give an absolutely positioned dropdown or panel that has no `left`/`right` (or only one) an explicit
width, usually `width: max-content` capped by a `max-inline-size` token. Never leave it `auto`.

Why: an auto width shrinks to the space between the panel's start and its containing block's edge,
so near the right edge it squeezes to one word per line, and a `translate` applied afterwards can't
widen it (`ResponsiveHeader` last dropdown, 2026-10-25, CLAUDE.md pitfall #36).
