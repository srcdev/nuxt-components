---
paths:
  - "app/components/**/*.vue"
---

# ExpandingPanel classic is the default

Never hardcode `ExpandingPanel` (modern) in a component that renders panels. Pick between
`ExpandingPanel` and `ExpandingPanelClassic` via `<component :is>` driven by a `panelVariant:
"modern" | "classic"` prop defaulting to `"classic"`. Style both class sets
(`.expanding-panel-*` and `.expanding-panel-classic-*`).

Why: modern relies on `::details-content`, which WebKit drops, so overlay panels break on Apple
devices. Detail: CLAUDE.md pitfall #19, `.claude/skills/components/expanding-panel.md`.
