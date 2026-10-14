---
paths:
  - "app/**/*.spec.ts"
---

# Assert hyphenated props as literal attributes

When a component binds a hyphenated prop like `:tab-index`, assert
`attributes("tab-index")`, not `attributes("tabindex")`.

Why: Vue renders the literal hyphenated name to the DOM.
