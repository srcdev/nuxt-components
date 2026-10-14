---
paths:
  - "app/**/*.vue"
---

# No self-closing non-void elements

Always write explicit closing tags on non-void elements and slots: `<slot name="x"></slot>`,
`<span></span>`. Never `<slot name="x" />`.

Why: ESLint `vue/html-self-closing` rejects it.
