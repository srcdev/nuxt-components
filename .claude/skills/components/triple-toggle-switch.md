---
name: TripleToggleSwitch
description: TripleToggleSwitch three-option radio pill with a sliding marker, v-model + v-model:field-data, system/light/dark marker gradients, CSS token API
type: reference
---

# TripleToggleSwitch

> **Renamed 2026-09-27**: `TripleToggleSwitchCore` → `TripleToggleSwitch` (Control/Field naming,
> see `.claude/skills/component-naming.md`). Root class `.triple-toggle-switch` unchanged.

## Overview

A pill containing three icon-only radio options, with a circular marker that slides behind the
selected one. Native `<input type="radio">` elements do the work (keyboard arrows, form
submission), hidden under each icon; each option's `label` is rendered `sr-only`.

Lives in `app/components/05.forms/triple-toggle-switch/`. Its one in-library consumer is
`DisplayThemeSwitch` (system/light/dark colour-scheme picker wired to `useSettingsStore`). Reach
for that for a theme switch; use `TripleToggleSwitch` directly for any other three-way choice.

## Props

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `v-model` | `string \| number \| boolean` | (required) | Selected option `value`. |
| `v-model:field-data` | `IFormMultipleOptions` | (required) | Options (`data[]` of `{ id, name, value, label, icon? }`). Read-only in practice; a `computed` works. |
| `name` | `string` | `"triple-toggle-switch"` | Shared radio `name`. Give each instance on a page its own. |
| `aria-label` | `string` | `""` | Accessible name for the `role="radiogroup"`. Omitted from the DOM when empty. Always pass one. |
| `theme` | `FormUiTheme` | `"default"` | Rendered as `data-theme`. |
| `step-animation-duration` | `string` | `"250ms"` | Marker slide duration; also times the icon colour swap (see Behaviour). Ignored under `prefers-reduced-motion`. |
| `style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root. |

Option `id`s are used as element ids (and as a class on each icon), so they must be unique on the
page.

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
  <TripleToggleSwitch v-model="scheme" v-model:field-data="options" name="scheme" aria-label="Colour scheme" />
</template>
```

## Behaviour

- Exactly three columns (`repeat(3, 1fr)`); more or fewer options will lay out wrongly.
- Options without an `icon` render no visible content (the label is `sr-only`), so always give
  each option an icon.
- The marker is measured from the first option's width on mount and fades in after ~250ms. It
  isn't re-measured on resize, so changing the icon-size/padding tokens after mount (e.g. toggling
  a class) leaves the marker at its old size.
- Icon colour swaps are timed to the marker: the newly active icon waits half of
  `stepAnimationDuration`, then fades to the active colour over the other half, so it lands as the
  marker arrives rather than turning white on the bare track. The previous icon fades back straight
  away. The marker takes the same time whatever the distance, so no per-index delay is needed.
- Option circles are sized by their content (1em icon + equal padding) with `place-items: center`,
  not `aspect-ratio`; older iPad Safari mis-centred the icons under the `aspect-ratio` version.
- Marker gradients only exist for the values `system`, `light` and `dark`; other values get the
  plain `--triple-toggle-switch-marker-surface` background.

## Styling

Full token list in `CONSUMER-STYLING.md` next to the component. Key tokens:
`--triple-toggle-switch-surface`, `-border`, `-gap`, `-padding`, `-option-padding`, `-icon-size`,
`-marker-gradient-system`/`-light`/`-dark`, `-option-icon-color`/`-color-active`.

## Notes

- 2026-09-27 migration: renamed from `TripleToggleSwitchCore`; marker gradients promoted to public
  tokens; `role="radiogroup"` + `ariaLabel` prop added (the group previously had no accessible
  name; `DisplayThemeSwitch` now passes `"Colour scheme"`); reduced-motion support for the marker;
  dead `--_form-border-radius` token and commented-out CSS removed; three identical per-id icon
  colour rules collapsed to one `.option-icon` rule (the per-id classes are still rendered);
  `fieldData` is now a typed required `defineModel`. Tests added.
