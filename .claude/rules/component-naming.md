---
paths:
  - "app/components/**"
---

# Component naming

Name the bare control `<Name>` (`InputNumber`) and the labelled wrapper `<Name>Field`
(`InputNumberField`). Never add `Core`, `Default` or `WithLabel` to a new or renamed component, and
never leave a single-word name that is (or could become) a native HTML element.

Why: one naming scheme across the library; native-element names collide in templates.
Detail: `.claude/skills/component-naming.md` (layer name-collision caveat, rename backlog).
