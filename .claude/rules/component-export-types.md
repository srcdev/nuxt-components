---
paths:
  - "app/components/**/*.vue"
  - "app/types/components/**"
---

# Consumer-facing types are exported

Never leave an interface consumers need (a data-shape prop) inline in a `.vue` file. Put it in
`app/types/components/<component-name>.d.ts` and export it from `app/types/components/index.ts`.

Why: inline types can't be imported by consuming apps.
Detail: `.claude/skills/component-export-types.md`.
