---
paths:
  - "app/**/*.spec.ts"
  - "app/**/__snapshots__/**"
---

# Don't update snapshots to make a test pass

Never update a snapshot to fix a failing test until you've confirmed the markup change is intended.

Why: a blind update turns a regression into the new baseline.
Detail: `.claude/skills/testing-add-unit-test.md`.
