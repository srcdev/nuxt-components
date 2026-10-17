---
name: SegmentedControl
description: SegmentedControl icon radio pill with a sliding marker, v-model + v-model:field-data, system/light/dark marker gradients, CSS token API
type: reference
---

# SegmentedControl

> **Renamed 2026-10-17**: `TripleToggleSwitch` → `SegmentedControl` (folder
> `05.forms/segmented-control/`). Classes `.triple-toggle-switch*` → `.segmented-control*`, tokens
> `--triple-toggle-switch-*` → `--segmented-control-*`; props, slots and behaviour unchanged.
>
> **Renamed 2026-09-27**: `TripleToggleSwitchCore` → `TripleToggleSwitch` (Control/Field naming,
> see `.claude/skills/component-naming.md`).

## Overview

A pill of icon-only radio options (three is the usual case, any count works), with a circular marker that slides behind the
selected one. Native `<input type="radio">` elements do the work (keyboard arrows, form
submission), hidden under each icon; each option's `label` is rendered `sr-only`.

Lives in `app/components/05.forms/segmented-control/`. Its one in-library consumer is
`DisplayThemeSwitch` (system/light/dark colour-scheme picker wired to `useSettingsStore`). Reach
for that for a theme switch; use `SegmentedControl` directly for any other three-way choice.

## Props

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `v-model` | `string \| number \| boolean` | (required) | Selected option `value`. |
| `v-model:field-data` | `IFormMultipleOptions` | (required) | Options (`data[]` of `{ id, name, value, label, icon? }`). Read-only in practice; a `computed` works. |
| `name` | `string` | generated | Radio `name`. Defaults to a unique `useId()` name, so several instances never share a group. |
| `aria-label` | `string` | `""` | Accessible name for the `role="radiogroup"`. Omitted from the DOM when empty. Always pass one. |
| `theme` | `FormUiTheme` | `"default"` | Rendered as `data-theme`. |
| `step-animation-duration` | `string` | `"250ms"` | Marker slide duration; also times the icon colour swap (see Behaviour). Ignored under `prefers-reduced-motion`. |
| `style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root. |

Element ids come from `useId()`, not from option `id`s, so duplicate or missing data ids are safe.

## Usage

```vue
<script setup lang="ts">
import type { IFormMultipleOptions } from "srcdev-nuxt-components";

const scheme = ref("system");
const options = ref<IFormMultipleOptions>({
  data: [
    { id: "system", name: "scheme", value: "system", label: "System", icon: "material-symbols:night-sight-auto-sharp" },
    { id: "light", name: "scheme", value: "light", label: "Light", icon: "radix-icons:sun" },
    { id: "dark", name: "scheme", value: "dark", label: "Dark", icon: "radix-icons:moon" },
  ],
  total: 3,
  skip: 0,
  limit: 3,
});
</script>

<template>
  <SegmentedControl v-model="scheme" v-model:field-data="options" aria-label="Colour scheme" />
</template>
```

## Behaviour

- One column per option (`repeat(<count>, minmax(0, 1fr))`), so two, four or five options lay out
  correctly; three is just the common case.
- Options without an `icon` render an empty circle (the label is `sr-only`), so give each option an
  icon.
- The marker sits in a second grid identical to the options grid and moves with
  `inset-inline-start: calc(index * (100% + gap))`, where `100%` is one column. No script measures
  anything, so it's right from the first paint, follows token and size changes, and moves the
  correct way in right-to-left layouts. A value that matches no option hides the marker (no
  `data-has-selection` on the root).
- Icon colour swaps are timed to the marker: the newly active icon waits half of
  `stepAnimationDuration`, then fades to the active colour over the other half, so it lands as the
  marker arrives rather than turning white on the bare track. The previous icon fades back straight
  away. The marker takes the same time whatever the distance, so no per-index delay is needed.
- Option circles are sized by their content (1em icon + equal padding) with `place-items: center`,
  not `aspect-ratio`; older iPad Safari mis-centred the icons under the `aspect-ratio` version.
- Marker gradients only exist for the values `system`, `light` and `dark`; other values get the
  plain `--segmented-control-marker-surface` background.

## Styling

Full token list in `CONSUMER-STYLING.md` next to the component. Key tokens:
`--segmented-control-surface`, `-border`, `-gap`, `-padding`, `-option-padding`, `-icon-size`,
`-marker-gradient-system`/`-light`/`-dark`, `-option-icon-color`/`-color-active`.

## Notes

- 2026-09-27 migration: renamed from `TripleToggleSwitchCore`; marker gradients promoted to public
  tokens; `role="radiogroup"` + `ariaLabel` prop added (the group previously had no accessible
  name; `DisplayThemeSwitch` now passes `"Colour scheme"`); reduced-motion support for the marker;
  dead `--_form-border-radius` token and commented-out CSS removed; three identical per-id icon
  colour rules collapsed to one `.option-icon` rule (the per-id classes are still rendered);
  `fieldData` is now a typed required `defineModel`. Tests added.

**2026-10-17**: resting shadow ring (`--segmented-control-shadow`), on the wrapper. Theme step 2 by default, so it turns red under `data-invalid`; width is the global `--form-element-shadow-width`. Hover now draws a 1px outline in the border colour with no offset, over the ring's inner edge (was a 2px outline at a 2px offset in the focus colour); focus is unchanged and sits just outside the ring.
- 2026-10-17 migration: inner classes prefixed (`.option-group` → `.segmented-control-option`,
  etc.) and state moved to `data-checked`/`data-value`/`data-has-selection`; the measured marker
  (first option's width, 250ms timer, no resize handling) replaced by a CSS-only grid position;
  any option count supported; ids and the default `name` from `useId()` (the fixed default name
  made two instances one radio group); icons `aria-hidden`, marker layer `aria-hidden`;
  passthrough now reactive; generic values no longer show a white icon on a white marker.
  `StressTest` story added.
