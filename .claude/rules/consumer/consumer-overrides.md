---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# Overriding srcdev-nuxt-components styles

Override a layer component through its public tokens (`--component-name-*`, listed in its
`CONSUMER-STYLING.md`) set on an ancestor you own. Never wrap override `<style>` blocks in a named
`@layer`, never set its private `--_` tokens, and override colours and geometry only, never
behaviour (`display`, `visibility`, `pointer-events`, `z-index`, animations). Applies in apps that
extend the layer, not to a component's own styles inside srcdev-nuxt-components.

Why: unlayered CSS always beats the layer's `@layer components`, while a named layer can be ordered
below it by SSR-inlined chunks; private tokens can change in any release.
Detail: skill `component-local-style-override.md` (srcdev-nuxt-components).
