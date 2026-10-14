---
paths:
  - "app/**/*.vue"
---

# `:deep()` only in `<style scoped>`

Never use `:deep()` in an unscoped `<style>` block (srcdev-nuxt-components' own styles are never
scoped). There, reach a child component with a plain descendant selector (`& .input-button`), or
better, set the child's public tokens on an ancestor. In a `<style scoped>` block it works as normal.

Why: outside `<style scoped>` `:deep()` stays as an unknown pseudo-class and the browser silently
drops the whole rule.
