---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# Text on dark surfaces uses `--theme-on-surface`

Pair a dark/bold surface (`--theme-surface-hover`, `--theme-surface-inverted`) with
`--theme-on-surface`, never `--theme-text` or `--theme-text-inverted`.

Why: those text tokens assume a light surface, so the pairing renders dark-on-dark in light mode.
Detail: skill `theming-partial-override.md` (srcdev-nuxt-components).
