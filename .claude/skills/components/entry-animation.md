# EntryAnimation Component

## Overview

`EntryAnimation` wraps slot content in a configurable tag and applies one of three CSS
scroll-driven entry-animation utility classes (`entry-slide-in`, `entry-zoom-reveal`,
`entry-exit-blur` — see `.claude/skills/css-animation-utilities.md`). It has no styling of its
own beyond applying the class; the animation keyframes/timeline live in the shared
`06.utility-classes/animations` stylesheet.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:animation-type`, `:skip-animation`.

| Prop (template form)       | Type                                                    | Default          | Notes                                                                 |
| --------------------------- | -------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------- |
| `:tag`                      | `"div" \| "section" \| "article" \| "aside"`             | `"div"`           | Root element tag.                                                     |
| `:animation-type`           | `"entry-slide-in" \| "entry-zoom-reveal" \| "entry-exit-blur"` | `"entry-slide-in"` | Which utility animation class to apply.                              |
| `:skip-animation`           | `boolean`                                                 | `false`           | Renders with no animation class at all — see **Skipping the animation** below. |
| `:style-class-passthrough`  | `string \| string[]`                                      | `[]`              | Extra CSS classes applied to the root element; always applied regardless of `skipAnimation`. |

---

## Slots

| Slot      | Notes                                  |
| --------- | ---------------------------------------- |
| `default` | The content to animate in.               |

---

## Skipping the animation

The common case in a `v-for` loop over a list of cards/sections is that the **first** item is
already above the fold — animating it in only delays content the visitor can already see when the
page loads. Before `skipAnimation` existed, the only way to handle this was swapping the whole
component out for a plain tag per-item:

```vue
<!-- ❌ Old workaround — loses tag/styleClassPassthrough consistency for item 0 -->
<component :is="index === 0 ? 'div' : EntryAnimation">
  ...
</component>
```

Use `skip-animation` instead — it keeps the same component, tag, and `styleClassPassthrough` for
every item, it just omits the animation class for the ones that don't need it:

```vue
<EntryAnimation
  v-for="(item, index) in items"
  :key="item.id"
  :skip-animation="index === 0"
  animation-type="entry-slide-in"
>
  <template #default>
    <!-- item content -->
  </template>
</EntryAnimation>
```

---

## CSS Token Customization

None — this component has no `--entry-animation-*` tokens or CSS of its own. The animation
keyframes, timing, and `prefers-reduced-motion` guard live in the shared utility class
(`entry-slide-in`/`entry-zoom-reveal`/`entry-exit-blur`), not in this component. Full reference: `app/components/01.atoms/animations/entry/CONSUMER-STYLING.md`.

---

## Accessibility

- All three animation utility classes are already scoped inside `@media (prefers-reduced-motion:
  no-preference)` at the CSS level — a visitor with reduced motion enabled sees the content with no
  animation, same as `skip-animation`. `skip-animation` is for a layout/UX decision (already
  visible above the fold), not a substitute for the reduced-motion guard.

---

## Notes

- **Reactive**: `animationType`, `skipAnimation` and `styleClassPassthrough` can all change after mount; the animation class is bound in the template (it used to be set once at setup, fixed 2026-09-27). Note that switching the class on an element already in view restarts its scroll-driven timeline from wherever the scroll position currently is.
