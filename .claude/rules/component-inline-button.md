---
paths:
  - "app/components/**/*.vue"
---

# Inline action buttons use InputButton

Use `InputButton variant="inline"` for an action button inside a custom wrapper, never a raw
`<button>`.

Why: keeps focus, theming and token behaviour consistent with every other button.
Detail: `.claude/skills/component-inline-action-button.md`.
