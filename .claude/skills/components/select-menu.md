# SelectMenu

## Overview

`SelectMenu` is a trigger-and-popover component for single-value selection from a list of
options — a custom, fully token-styled alternative to a native `<select>` or `InputSelectCore`,
built for non-form contexts (language switchers, category filters, faceted filter bars). It reuses
the same Popover API + CSS anchor-positioning mechanism as `ActionMenu` (see that skill doc), but
its items carry a `value`/`label`/optional `icon`, the selected option shows a checkmark, and the
whole thing is driven by `v-model` instead of slotted actions.

**Location**: `app/components/02.molecules/select-menu/`

---

## Components

### SelectMenu

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `SelectMenuOption[]` | — | **Required.** `{ value: string \| number; label: string; icon?: string }[]`. |
| `label` | `string` | — | **Required.** Accessible name for the trigger + listbox (`aria-label`). Also the trigger's fallback text when nothing is selected and no `placeholder` is set — this doubles as a visible category tag, e.g. `"Choose a service"`. |
| `placeholder` | `string` | `undefined` | Trigger text shown when nothing is selected. Falls back to `label` when omitted. |
| `showIcon` | `boolean` | `true` | Show the selected option's icon in the trigger. |
| `showLabel` | `boolean` | `true` | Show the selected option's label (or placeholder/label fallback) text in the trigger. Set `false` for an icon-only compact trigger. |
| `showChevron` | `boolean` | `true` | Show the trailing chevron in the trigger. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root `<div>`. |

**v-model**

`defineModel<string | number | undefined>({ default: undefined })` — the selected option's
`value`. `undefined` is a valid, expected state (renders the placeholder) — unlike
`InputSelectCore`'s `modelValue`, which uses `{ required: true }` because a native form field
genuinely can't be meaningfully empty, this model is optional by design, so `{ default: undefined }`
is the right `vue/require-default-prop` fix here (it satisfies the rule without making the prop
required — see that rule's `defineModel` gap noted in the repo's ledger `eslint_issues` docs).
Single-select only; for a filter bar with several independent categories, place multiple
`SelectMenu` instances side by side, each with its own `v-model`.

**Type import**

```ts
import type { SelectMenuOption } from "~/types/components/select-menu";
// consuming apps: import type { SelectMenuOption } from "srcdev-nuxt-components";
```

---

## Basic usage

```vue
<script setup lang="ts">
import type { SelectMenuOption } from "~/types/components/select-menu";

const language = ref<string>("en");
const languageOptions: SelectMenuOption[] = [
  { value: "en", label: "English", icon: "flag:gb-4x3" },
  { value: "fr", label: "Français", icon: "flag:fr-4x3" },
];
</script>

<template>
  <SelectMenu v-model="language" :options="languageOptions" label="Language" />
</template>
```

---

## Trigger content variants

| Variant | Usage |
|---|---|
| Icon-only (compact switcher, e.g. a flag in a tight header) | `:show-label="false" :show-chevron="false"` |
| Icon + chevron, no text (flag with a visible dropdown affordance) | `:show-label="false"` |
| Text + chevron (category filter, no per-option icons) | `:show-icon="false"` |
| Icon + text + chevron (full select) | Defaults — no overrides needed |

When nothing is selected, the trigger shows `placeholder` (or `label` if no placeholder is given)
— this is what makes it work as a filter-category tag, e.g. a `SelectMenu` with
`label="Choose a service"` and no `placeholder` shows "Choose a service" until an option is
picked, then swaps to the selected option's label.

---

## Filter bar (multiple categories)

`SelectMenu` is single-select per instance — a faceted filter bar is built by placing one instance
per category, each with its own `v-model`:

```vue
<template>
  <div style="display: flex; gap: 1.2rem;">
    <SelectMenu label="Choose a service" v-model="service" :options="serviceOptions" />
    <SelectMenu label="Choose a stylist" v-model="stylist" :options="stylistOptions" />
  </div>
</template>
```

---

## CSS token API

See `CONSUMER-STYLING.md` in the component folder for the full token reference. Default styling
targets the same visual language as the library's other select-like controls (border, background,
radius, focus ring drawn from `--theme-*` tokens).

Quick reference:

```css
/* assets/styles/setup/07.components/select-menu.css */
:root {
  --select-menu-trigger-border-radius: 999rem;
  --select-menu-trigger-surface: var(--brand-surface);
  --select-menu-popover-surface: var(--brand-surface);
  --select-menu-item-surface-hover: var(--brand-surface-subtle);
  --select-menu-item-check-color: var(--brand-accent);
}
```

---

## Notes

- **Popover API + CSS anchor positioning** — same mechanism as `ActionMenu`. Broadly supported
  (Chrome 114+, Firefox 125+, Safari 17+). No polyfill is included.
- **Left-aligned popover** (`left: anchor(left)`) — unlike `ActionMenu` which right-aligns. Matches
  native `<select>` dropdown behaviour. Flips above the trigger near the bottom of the viewport.
- **Keyboard navigation** follows the WAI-ARIA listbox pattern: `ArrowDown`/`ArrowUp` move between
  options (wraps around), `Home`/`End` jump to first/last, `Enter`/`Space` select the focused
  option and close, `Tab` closes without stealing focus back to the trigger (matches `ActionMenu`'s
  `handleKeydown` convention — see that skill doc's note on the `currentIndex === -1` guard, which
  applies identically here).
- **Opens focused on the current selection** — `handleToggle` focuses the selected `[role="option"]`
  if one exists, otherwise the first option (unlike `ActionMenu`, which always focuses the first
  item since it has no selection state).
- **Chevron rotation is pure CSS** via `:has(.select-menu-popover:popover-open)` on the root — no
  JS state drives the visual. `isOpen` is still tracked internally, but only to set `aria-expanded`
  on the trigger.
- **No native `<select>`/`appearance: base-select` involved** — this is a from-scratch popover
  listbox, not a styled native select, so it doesn't inherit `InputSelectCore`'s WebKit
  `appearance: base-select` constraints.
- **Not a form field** — `SelectMenu` has no `fieldHasError`/`theme`/`inputVariant` props like the
  `05.forms` inputs. Use `InputSelectCore` instead for an actual form field that needs validation
  state and native `<select>` semantics.
