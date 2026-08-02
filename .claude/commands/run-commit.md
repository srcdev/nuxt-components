---
description: Stage named files, commit, and push — the full flow (explicit authorization to act)
---

Run the full commit flow: stage, commit, and push. Unlike `/create-commit-message`, this command is explicit authorization to execute git commands, not just draft text.

Steps:
1. Run `git status`, `git diff`, and `git diff --staged` to see the full picture before staging anything.
2. Stage files by name (never `git add -A` or `git add .`) so nothing unexpected — stray build output, `.env`, credentials — gets swept in. Confirm with the user if it's unclear which changed files belong in this commit.
3. Draft the commit message following the repo's existing style (`git log --oneline -10`), and create the commit with a HEREDOC so formatting is preserved, ending with the `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer.
4. Push to the current branch's tracked remote. If the branch has no upstream yet, ask before setting one with `-u`. Never force-push without explicit user instruction.

Never use `--no-verify`, `--no-gpg-sign`, or otherwise skip hooks/signing. If a pre-commit hook fails, fix the underlying issue and create a **new** commit — never amend to work around a failed hook.
