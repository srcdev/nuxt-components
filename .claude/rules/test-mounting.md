---
paths:
  - "app/**/*.spec.ts"
---

# Mount with mountSuspended and clean up

Always mount with `mountSuspended` from `@nuxt/test-utils/runtime`, never `mount`/`shallowMount`.
Every `afterEach` calls `wrapper?.unmount()` and `vi.restoreAllMocks()`.

Why: Nuxt components need the Nuxt runtime, and un-restored spies leak into later test files.
Detail: `.claude/skills/testing-add-unit-test.md`.
