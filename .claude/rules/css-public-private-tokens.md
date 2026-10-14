---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# Public vs private CSS tokens

Make any value a consumer could plausibly customise (colour, spacing, size, radius, duration, and
per-state variants of these) a public token read with a fallback at its point of use:
`var(--component-name-border-radius, 0.5rem)`, even if used once. Give per-state variants their own
public token falling back to the resting one. Prefix only genuinely internal values `--_`, and never
add a `--_` token that's a bare 1:1 pass-through of a public one.

Why: the split is by consumer relevance, not reuse count; a `--_` wrapper hides an override hook.
Detail: `.claude/skills/theming-component-token-pattern.md`, CLAUDE.md pitfall #20.
