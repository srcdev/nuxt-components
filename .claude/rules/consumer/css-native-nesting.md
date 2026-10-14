---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# Native CSS nesting, no Sass concatenation

Never write `&__child` or `&-modifier`. Use `& .block__child` or a top-level `.block__child {}` rule.
Nest child rules inside the component's root block.

Why: it's Sass syntax; esbuild turns `&__foo` into `:is(__foo)`, which silently matches nothing.
Detail: skill `css-nesting-conventions.md` (srcdev-nuxt-components).
