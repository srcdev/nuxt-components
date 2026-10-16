---
paths:
  - "app/**/*.vue"
---

# Element ids come from `useId()`, never from data

Build `id`/`for` pairs from `useId()` (plus a loop index for repeated items), never from props or
data values like `` `${name}-${item.value}` ``.

Why: two instances sharing a `name` and values produce duplicate ids, and a value with spaces makes
an invalid one, so labels toggle the wrong control (`MultipleCheckboxes`, 2026-10-16). Test
uniqueness with both instances inside one host component: separate `mountSuspended` calls each
restart the `useId()` counter. Detail: skill `testing-add-unit-test.md` (srcdev-nuxt-components).
