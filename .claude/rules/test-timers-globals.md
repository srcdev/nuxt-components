---
paths:
  - "app/**/*.spec.ts"
---

# Leave the global timer and stub setup alone

Never call `vi.useFakeTimers()`, `vi.useRealTimers()`, `vi.runAllTimers()` or
`vi.unstubAllGlobals()` in a test file. Advance time with `vi.advanceTimersByTime(ms)`.

Why: `test/vitest.setup.ts` installs fake timers and global stubs (`$fetch`, ...); `runAllTimers`
loops on self-requeueing timers. Detail: `.claude/skills/testing-add-unit-test.md`.
