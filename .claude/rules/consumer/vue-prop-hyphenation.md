---
paths:
  - "app/**/*.vue"
  - "**/*.stories.ts"
---

# Hyphenated props in templates

Always write camelCase props hyphenated in templates: `:item-count`, `:style-class-passthrough`.

Why: ESLint `vue/attribute-hyphenation` requires it.
