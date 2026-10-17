---
paths:
  - "app/assets/styles/**/*.css"
---

# Theme-relative global colours stay undeclared

Never declare a global colour knob as `var(--colour-theme-N)` (or any `--theme-*` value) on `:root`
or `html`. Leave it undeclared and let each component fall back at its own element:
`var(--global-knob, var(--colour-theme-2))`. Geometry knobs (widths) can be declared normally.

Why: a custom property holding `var()` is computed where it's declared, so a root declaration
freezes the root theme's hue and a `[data-theme]` or `[data-invalid]` element never gets its own
colour (`--form-element-shadow-colour`, 2026-10-17). Detail: skill
`theming-component-token-pattern.md`.
