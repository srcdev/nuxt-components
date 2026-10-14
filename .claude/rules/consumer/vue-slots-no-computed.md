---
paths:
  - "app/**/*.vue"
  - "app/composables/**/*.ts"
---

# Never derive state from slots in a computed

Never read `useSlots()` inside a `computed()`. Use a plain function called from the template
(`v-if="hasFooter()"`, `:aria-describedby="ariaDescribedby()"`), including anything derived from it.
Test by toggling a `v-if`'d slot in a host component after mount.

Why: the slots object isn't reactive, so the computed caches its first value and leaves split state
when a slot is added or removed after mount.
