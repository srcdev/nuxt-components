---
paths:
  - "app/components/**/*.vue"
---

# Prefix structural class names

Prefix every structural class in a component's markup with the component name
(`.display-dialog-header`), never a bare generic name (`.header`, `.footer`, `.inner`, `.content`,
`.col-left`, `.image`). Put a prop-driven state or variant on a `data-*` attribute
(`[data-font-size="small"]`), never a bare class (`.small`, `.title`, `.label`, `.primary`).

Why: components render inside the consumer's DOM, and unlayered consumer CSS for those common names
beats `@layer components` regardless of specificity. Detail: CLAUDE.md pitfall #16.
EyebrowText and HeroText put their size (`.small`, `.title`, `.label`) and axis on the root as bare
classes until 2026-10-19.
