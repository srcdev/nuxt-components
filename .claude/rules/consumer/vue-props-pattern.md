---
paths:
  - "app/**/*.vue"
---

# Props pattern

Always declare props as `interface Props` + `withDefaults(defineProps<Props>(), {...})`, with factory
functions for array/object defaults. Never use options-style `defineProps({ x: { type, default } })`.
Never declare `class` or `style` as props; hide them from Storybook controls via `argTypes` instead.

Why: typed props are the standard across srcdev-nuxt-components and its apps, and a
`class`/`style` prop breaks Vue's automatic `$attrs` inheritance.
