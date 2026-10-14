---
paths:
  - ".storybook/preview.ts"
---

# No TypeScript inside `storySort`

Never use type annotations or other TS-only syntax inside the `storySort` function. Verify a change
with `getStorySortParameter` in Node.

Why: Storybook evaluates `storySort` as plain JS, so TS syntax fails the build.
