---
paths:
  - "app/**/*.vue"
---

# Prefix private tokens when sharing a root element

When a component renders another component as its root, prefix its own `--_` tokens with its name
(`--_avatar-size`, not `--_size`) and grep the other component's styles for the same `--_` names.

Why: both components' private tokens land on one element and the more specific rule wins.
Detail: CLAUDE.md pitfall #26.
