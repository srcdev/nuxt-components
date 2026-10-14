---
paths:
  - "app/assets/styles/setup/index.css"
  - "nuxt.config.ts"
---

# Keep the `icons` cascade layer before `components`

Keep `icon: { cssLayer: "icons" }` in `nuxt.config.ts` and `icons` listed before `components` in the
`@layer` order statement. Never fix icon sizing with `!important` or by moving rules out of
`@layer components`.

Why: unlayered or later-layered `@nuxt/icon` CSS silently overrides components' `width`/`height`.
Detail: `.claude/skills/icon-sizing.md`.
