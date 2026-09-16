---
name: UiBlockDecorated
description: UiBlockDecorated plain block wrapper with independent border/shadow/inner-shadow strength levels — props, CSS tokens
type: reference
---

# UiBlockDecorated

## Overview

`UiBlockDecorated` renders its slot content in a plain block element (configurable `tag`) with
three independent, optional decorations: a border, a drop shadow, and an inset ("inner") shadow.
Each decoration has its own 0-based "strength" prop that selects a level from a built-in scale;
`0` (the default) applies no class for that decoration, so all three are opt-in and combinable.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "p" \| "span" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "main" \| "nav" \| "ul" \| "ol"` | `"div"` | Root element tag. |
| `borderStrength` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Border strength level; `0` = no border. |
| `shadowStrength` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Drop shadow strength level; `0` = no shadow. |
| `innerShadowStrength` | `0 \| 1 \| 2 \| 3 \| 4` | `0` | Inset shadow strength level; `0` = no inner shadow. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Basic usage

```vue
<UiBlockDecorated :shadow-strength="3">
  <p>Block content</p>
</UiBlockDecorated>

<UiBlockDecorated tag="section" :border-strength="2" :inner-shadow-strength="1">
  <p>Block content</p>
</UiBlockDecorated>
```

## CSS custom properties

Each strength level has its own public token — see CONSUMER-STYLING.md for the full table. In
short: `--ui-block-decorated-border-1` .. `-6`, `--ui-block-decorated-shadow-1` .. `-6`,
`--ui-block-decorated-inner-shadow-1` .. `-4`, and `--ui-block-decorated-inner-shadow-highlight`
(layered on top of every inner shadow level).

## Notes

- 2026-09-16 migration: previously used options-style `defineProps` and referenced six families of
  global tokens (`--border-1`..`-6`, `--shadow-1`..`-6`, `--inner-shadow-1`..`-4`,
  `--inner-shadow-highlight`) that were never declared anywhere in the codebase — every border,
  shadow and inner shadow rendered as nothing. Fixed by giving each strength level its own
  component-scoped public token (`--ui-block-decorated-*`) with a real fallback value baked in, so
  the decorations work out of the box and are still fully overridable.
- The applied classes were also renamed from bare `.border-1`/`.shadow-1`/`.inner-shadow-1` to
  `.ui-block-decorated-border-1` etc. — the un-prefixed names risked colliding with a consumer
  app's own utility classes, since this component renders inline in the consumer's DOM (not
  teleported/portaled).
