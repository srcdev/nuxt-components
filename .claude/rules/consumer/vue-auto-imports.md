---
paths:
  - "app/**/*.vue"
  - "app/composables/**/*.ts"
  - "app/utils/**/*.ts"
---

# Vue and Nuxt auto-imports

Never import `ref`, `reactive`, `computed`, `watch`, `nextTick`, `useState`, `useRoute`, `useRouter`
or anything from `~/composables/` in app code. Import only `type`s and external packages.

Why: Nuxt auto-imports them; manual imports are noise and drift from the rest of the codebase.
Test and story files are the exception (see `explicit-vue-imports.md`).
