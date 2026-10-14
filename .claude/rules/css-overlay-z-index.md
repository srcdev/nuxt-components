---
paths:
  - "app/**/*.vue"
---

# Overlays get a public z-index token

Give every `position: fixed`/`sticky` overlay a public z-index token
(`--component-name-z-index`) defaulting to `999999`.

Why: a hardcoded low z-index loses to consumers' sticky headers with no way to override.
Detail: CLAUDE.md pitfall #17.
