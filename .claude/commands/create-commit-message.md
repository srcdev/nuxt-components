---
description: Draft a commit message from staged changes only — never runs git add/commit/push
---

Draft a commit message for the currently staged changes. Do not run `git add`, `git commit`, or `git push` — this command only produces the message text for review.

Steps:
1. Run `git status` and `git diff --staged` to see what's staged. If nothing is staged, say so and stop.
2. Run `git log --oneline -10` to match this repo's existing commit message style (e.g. `type(scope): summary`).
3. Draft a concise message: a short summary line, plus a body only if the change needs context not obvious from the diff. Focus on *why*, not a restatement of the diff.
4. Present the message in a fenced code block. Do not commit it.

If the user's request also explicitly says "commit this" or "run it", that's authorization to act — use the `/run-commit` flow instead of stopping at the draft.
