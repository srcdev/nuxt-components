---
paths:
  - "app/components/**/*.vue"
---

# Prefix structural class names

Prefix every structural class in a component's markup with the component name
(`.display-dialog-header`), never a bare generic name (`.header`, `.footer`, `.inner`, `.content`,
`.col-left`, `.image`).

Why: components render inside the consumer's DOM, and unlayered consumer CSS for those common names
beats `@layer components` regardless of specificity. Detail: CLAUDE.md pitfall #16.
