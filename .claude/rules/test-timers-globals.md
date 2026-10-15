---
paths:
  - "app/**/*.spec.ts"
---

# Leave the global timer and stub setup alone

Never call `vi.useFakeTimers()`, `vi.useRealTimers()`, `vi.runAllTimers()` or
`vi.unstubAllGlobals()` in a test file. Advance time with `vi.advanceTimersByTime(ms)`.

Before a native `el.click()`/`dispatchEvent` on a just-mounted element, call
`vi.advanceTimersByTime(1)` (or use `wrapper.trigger("click")`).

Why: `test/vitest.setup.ts` installs fake timers and global stubs (`$fetch`, ...); `runAllTimers`
loops on self-requeueing timers; Vue drops an event stamped no later than its listener was attached,
and frozen time makes the two equal. Detail: `.claude/skills/testing-add-unit-test.md`.
