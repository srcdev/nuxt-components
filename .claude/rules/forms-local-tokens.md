---
paths:
  - "app/components/05.forms/**"
---

# Form components get local token indirection

When touching a form component that reads a global `--theme-*` token directly at the point of use,
give it a local `--_<name>-*` token defaulting from the global one. Check any form control's height
against `--input-min-height` next to its siblings (text input, select, button).

Why: early form components had no component-level override point (CLAUDE.md pitfall #14), and an
active unitless `line-height` made `InputSelect` taller than its siblings (pitfall #15).
Detail: `.claude/skills/theming-component-token-pattern.md`.
