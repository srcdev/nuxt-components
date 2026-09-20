---
name: DisplayThemeSwitch
description: DisplayThemeSwitch system/light/dark theme picker wired to useSettingsStore, wraps TripleToggleSwitchCore
type: reference
---

# DisplayThemeSwitch

## Overview

`DisplayThemeSwitch` is a system/light/dark colour-scheme picker. It's a thin wrapper around
`TripleToggleSwitchCore` (`app/components/05.forms/triple-toggle-switch/`), wired to
`useSettingsStore` (`app/stores/useSettingsStore.ts`) so selecting an option updates the app's
`colourScheme` state and applies the matching class (`system`/`light`/`dark`) to
`<html>`. Renders inside `<ClientOnly>` since the store's persisted value isn't known until
hydration.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root. Pass `"small"` for compact sizing. |
| `systemLabel` | `string` | `"System"` | Accessible label for the system option. |
| `lightLabel` | `string` | `"Light"` | Accessible label for the light option. |
| `darkLabel` | `string` | `"Dark"` | Accessible label for the dark option. |
| `systemIcon` | `string` | `"material-symbols:night-sight-auto-sharp"` | Icon name for the system option. |
| `lightIcon` | `string` | `"radix-icons:sun"` | Icon name for the light option. |
| `darkIcon` | `string` | `"radix-icons:moon"` | Icon name for the dark option. |

## Basic usage

```vue
<DisplayThemeSwitch />

<!-- Compact, for a header/nav slot -->
<DisplayThemeSwitch style-class-passthrough="small" />

<!-- Translated labels -->
<DisplayThemeSwitch system-label="Automatique" light-label="Clair" dark-label="Sombre" />
```

## Styling

No `--display-theme-switch-*` tokens of its own — every visual aspect (colour, marker gradient,
sizing) is delegated to `TripleToggleSwitchCore`'s public `--triple-toggle-switch-*` tokens. See
CONSUMER-STYLING.md here and `TripleToggleSwitchCore`'s own CONSUMER-STYLING.md.

## Notes

- 2026-09-20 migration: moved from `app/components/display-theme-switch/` (unplaced) into
  `02.molecules/`. Added `systemLabel`/`lightLabel`/`darkLabel`/`systemIcon`/`lightIcon`/`darkIcon`
  props — the three option labels/icons were previously hardcoded English strings with no override
  hook. Removed a large block of dead/duplicate CSS in this component's own `<style>` that either
  no-op-duplicated `TripleToggleSwitchCore`'s own default styling (same selectors, same values) or
  actively bypassed its public `--triple-toggle-switch-*` tokens with hardcoded literals (a
  consumer setting e.g. `--triple-toggle-switch-surface` globally would have been silently
  overridden back). Only the genuine `small`-variant sizing override remains, now driving
  `TripleToggleSwitchCore`'s own public sizing tokens (`--triple-toggle-switch-gap`/`-padding`/
  `-option-padding`/`-icon-size`, added in the same migration) instead of reaching into its
  private `--_form-*`/`--_scheme-icon-font-size` locals directly.
