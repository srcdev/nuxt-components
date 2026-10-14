---
paths:
  - "app/**/*.spec.ts"
  - "**/*.stories.ts"
---

# Import Vue APIs explicitly in tests and stories

Always import `nextTick`, `computed`, `ref`, etc. from `"vue"` in `.spec.ts` and `.stories.ts` files.

Why: auto-imports only apply inside components.
