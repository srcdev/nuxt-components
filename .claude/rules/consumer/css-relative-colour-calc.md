---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# No `calc()` on relative-colour channels in a stylesheet

Never write `calc()` over a relative-colour channel keyword in a `<style>` block or CSS file
(`oklch(from var(--x) l c calc(h + 50))`). When a value like that is needed, set the whole colour as
a custom property from script (an inline `:style`) and read it with `var()` in the CSS.

Why: the build's PostCSS `calc()` parser doesn't know channel keywords (`h`, `l`, `c`) and warns
"Lexical error ... Unrecognized text" on every build, even though browsers accept it. Inline styles
never go through PostCSS (`SparkleEffect`, 2026-10-20).
