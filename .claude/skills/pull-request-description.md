# Pull Request Description

## Overview

When asked to create a pull request description, produce a fenced markdown code block (` ```markdown `) so the content can be copied and pasted directly into GitHub's PR body field without formatting being stripped.

## Steps

### 1. Identify the base branch

Run `git log --oneline main..HEAD` to list all commits on the current branch since it diverged from `main`.

### 2. Review what changed

Run `git diff main...HEAD --stat` for a file-level summary, then `git diff main...HEAD` for the full diff. Focus on intent, not just mechanics.

### 3. Produce a fenced markdown block

Always wrap the output in a ` ```markdown ` code fence — never render it as plain markdown.

## Format

```markdown
## Summary

One or two sentences explaining what this PR does and why. No bullet points here — write it as prose.

## Changes

- **`FileOrComponentName`** — what changed and why
- Keep each bullet to one line where possible

## Testing

- How the change was verified (unit tests, manual check, build passing, etc.)
- Note any areas that couldn't be covered automatically

## Notes

Any caveats, follow-up tickets, or decisions worth flagging for reviewers (optional — omit if nothing to say).
```

## Notes

- Only include sections that have content — omit empty headings (especially `Notes` if there's nothing to flag)
- Lead with the user-facing or functional change; CSS/test/doc tidy-ups can be secondary bullets
- Keep the tone factual — describe what changed, not the effort involved
- Do not include "Co-Authored-By" or other git trailer lines — those belong in the commit message, not the PR body
