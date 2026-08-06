---
description: Produce release notes as a fenced markdown block, scoped to commits since the last release
---

Produce release notes for the commits since the last `chore(release):` commit. Always output them as a single fenced ` ```markdown ` code block so the content can be copied directly into a git tag, GitHub release, or changelog — never render it as plain markdown.

Steps:

1. **Determine the range.** Run `git log --oneline -20` and find the most recent `chore(release): release vX.Y.Z` commit — that's the boundary. Also check `package.json` for the current version if you need to confirm what's already shipped vs pending.
2. **Review each commit since that boundary.** Run `git show <commit> --stat` (and the message) for each one to understand what changed. Skip other `chore(release):` commits themselves, and skip purely internal/tooling commits (e.g. adding slash commands, promoting doc gotchas) unless they're user-facing.
3. **Draft the notes** using the format below. Only include sections that have content — omit empty headings. Keep each bullet to one line where possible. Lead with the most user-facing changes (New, Fixed) before internal ones (Changed, Documentation). Fold minor follow-up commits (e.g. a test/docs completion commit for a feature shipped a commit earlier) into the same bullet as the feature rather than giving them their own line — unless the follow-up is substantial enough to warrant one.
4. **Output** the result wrapped in a ` ```markdown ` fence. Do not commit, tag, or push anything — this command only produces text for review.

## Format

```markdown
## vX.Y.Z

### New

- **`ComponentOrComposableName`** — one-line description of what it does and why it exists

### Fixed

- Short description of what was wrong and what was corrected

### Changed

- Short description of intentional behaviour or API changes

### Documentation

- **`skill-name` skill** — new/updated: what it covers
```
