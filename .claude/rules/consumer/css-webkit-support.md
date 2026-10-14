---
paths:
  - "app/**/*.vue"
  - "app/**/*.css"
---

# Load-bearing CSS must work in WebKit / Safari 16

Never rely on a new CSS feature (`::details-content`, `@starting-style`, `appearance: base-select`,
anchor positioning, ...) for anything load-bearing unless Safari 16 has a working path; decorative
extras may degrade. Prefer routing to a proven alternative implementation over a CSS-only
`@supports` patch.

Why: WebKit silently drops unsupported rules, and Chrome's device emulation is still Blink so it
can't show the gap.
