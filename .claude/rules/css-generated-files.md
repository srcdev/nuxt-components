---
paths:
  - "app/assets/styles/**"
---

# Never hand-edit generated style files

Never edit a file headed `/* GENERATED */` (colour ramps, `_theme-params.css`, `theme-ramp.css`).
Change the generator input and rerun `node scripts/generate-ramps.mjs`.

Why: hand edits are overwritten on the next run.
Detail: `.claude/skills/theming-colour-ramps.md`.
