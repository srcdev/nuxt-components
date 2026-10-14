---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# Light/dark comes from `--theme-*` tokens only

Never use `light-dark()`, and never branch a component's colours on `prefers-color-scheme` or a
`data-color-scheme` attribute. Default colours to `--theme-*` tokens. Components and global tokens
are light-only; dark mode is the consumer's call (Storybook's dark values live in
`.storybook/color-scheme.css`).

Why: `light-dark()` breaks old iPad Safari, and per-component scheme switching has shipped with no
writer for its attribute, leaving colours undefined (pitfall #21).
Detail: `.claude/skills/theming-dark-mode.md`.
