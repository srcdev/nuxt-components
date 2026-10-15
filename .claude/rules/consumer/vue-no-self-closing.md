---
paths:
  - "app/**/*.vue"
---

# No self-closing non-void elements

Always write explicit closing tags on non-void elements and slots: `<slot name="x"></slot>`,
`<span></span>`. Never `<slot name="x" />`. Components are the opposite: self-close them when
they have no content (`<InputButton :button-text="label" />`, not `<InputButton ...></InputButton>`).

Why: ESLint `vue/html-self-closing` is set to `normal: "never"`, `component: "always"`.
