# CanvasSwitcher Component

## Overview

`CanvasSwitcher` renders a row of icon buttons (mobile / tablet / laptop / desktop / full width)
for switching a bound `MediaCanvas` value — typically used to drive a preview/demo wrapper's width
while working on a responsive component in Storybook. Each button is an `InputButtonCore`
(`variant="tertiary"`, icon-only), giving it the library's standard button focus ring and hover
state for free instead of a raw `<button>`.

## Model

| Model | Type | Required |
|---|---|---|
| `canvasName` (`v-model:canvas-name`) | `MediaCanvas` | no |

`MediaCanvas` is exported from `~/types/components/canvas-switcher` (and re-exported from
`~/types/components`):

```typescript
type MediaCanvas = "mobileCanvas" | "tabletCanvas" | "laptopCanvas" | "desktopCanvas" | "fullWidthCanvas";
```

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

## Usage

```vue
<script setup lang="ts">
import type { MediaCanvas } from "~/types/components";

const canvasName = ref<MediaCanvas>("desktopCanvas");
</script>

<template>
  <CanvasSwitcher v-model:canvas-name="canvasName" />
  <div :class="canvasName">
    <!-- preview content constrained to the selected canvas width -->
  </div>
</template>
```

The selected value doubles as a utility class name: `CanvasSwitcher`'s stylesheet also declares
`.mobileCanvas`/`.tabletCanvas`/`.laptopCanvas`/`.desktopCanvas`/`.fullWidthCanvas` (max-width
utilities, not scoped to `.canvas-switcher`), so binding `:class="canvasName"` directly onto a
preview wrapper constrains it to match — see `LayoutGridA`/`LayoutGridB` stories for the pattern.
These classes only ship in the bundle once `CanvasSwitcher` (or another importer of them) is
actually imported somewhere, since Nuxt only bundles a component's SFC styles when it's used.

## Notes

- Component is auto-imported in Nuxt — no import needed.
- No accessible-name prop is needed on the buttons — each one's `button-text` ("Mobile", "Tablet",
  etc.) is rendered screen-reader-only by `InputButtonCore`'s icon-only handling, and the selected
  button is marked via `aria-pressed="true"` rather than a private CSS-only "current" class.
- See `CONSUMER-STYLING.md` in the component's own folder for the full `--canvas-switcher-*` token
  API. Button-level tokens (surface/hover/focus) belong to `InputButtonCore`, not this component.
