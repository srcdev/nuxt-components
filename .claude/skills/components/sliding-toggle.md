---
name: SlidingToggle
description: SlidingToggle single-choice segmented radiogroup with text labels of any width, measured sliding indicator (stretch-then-catch-up) plus hover indicator, corner-shape token, CSS token API
type: reference
---

# SlidingToggle

## Overview

A single-choice segmented control for short text choices such as a billing period or a site tier.
The selected option's background slides between options of different widths, with the same
stretch-then-catch-up motion as `TabbedContent`'s indicator (both use `useSlidingIndicator`), and a
second indicator follows the pointer. It's a WAI-ARIA radio group of `<button role="radio">`s, not
a form control: there are no native inputs and nothing is submitted.

Lives in `app/components/02.molecules/sliding-toggle/`.

**Which one to use:**

- `SlidingToggle` — text labels of any width, page UI state (pricing toggles, view switches).
- `SegmentedControl` (`05.forms`) — icon-only, equal-width options, native radio inputs that submit
  with a form.
- `TabbedContent` — the choice switches between panels of content.

## Props

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `v-model` | `T` (`string \| number`) | (required) | The selected option's `value`. A value matching no option leaves nothing selected. |
| `options` | `SlidingToggleOption<T>[]` | (required) | `{ value, label, disabled? }`. Labels are plain text. |
| `aria-label` | `string` | `""` | Names the radiogroup. Set this or `aria-labelledby`. |
| `aria-labelledby` | `string` | `""` | Id of a visible heading naming the group. |
| `disabled` | `boolean` | `false` | Disables every option. |
| `track-hover` | `boolean` | `true` | Show the hover indicator. |
| `transition-duration` | `number` (ms) | `200` | Length of each edge's slide. |
| `style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root. |

`SlidingToggleOption` is exported from `~/types/components`.

## Usage

```vue
<script setup lang="ts">
const billing = ref<"monthly" | "yearly">("monthly");
const billingOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly (save 20%)" },
] as const;
</script>

<template>
  <SlidingToggle v-model="billing" :options="[...billingOptions]" aria-label="Billing period" />
</template>
```

Equal widths across a full-width switch:

```css
.billing-switch {
  --sliding-toggle-option-flex: 1 1 0;
}

.billing-switch .sliding-toggle {
  inline-size: 100%;
}
```

## Behaviour

- The root is `role="radiogroup"`, named by `aria-label` or `aria-labelledby`. Each option is a
  `<button type="button" role="radio">` with `aria-checked`.
- Clicking an option sets `v-model`; changing `v-model` from outside moves the selection.
- Only the selected option is a tab stop. With no match, the first enabled option is.
- Arrow keys move focus and select, wrapping round and skipping disabled options. Right and Down go
  to the next option, Left and Up to the previous; inside `dir="rtl"` Left and Right swap. Home and
  End go to the first and last enabled option.
- `disabled` on the group or on one option blocks clicks and keys; disabled options are skipped and
  never get the hover indicator.
- The selected indicator slides to the new option, its leading edge first and the trailing edge one
  `transition-duration` later. The hover indicator follows the pointer and returns to the selected
  option when it leaves; `track-hover="false"` turns it off. `--sliding-toggle-indicator-stretch: 0`
  makes both indicators slide their edges together instead of stretching, mirroring TabbedContent's
  `--tabs-indicator-stretch`.
- Under `prefers-reduced-motion` both indicators snap.
- Before it's mounted and measured (SSR, first paint) the indicators are hidden and the selected
  option paints its own background and marker, so there's no flash of an unselected group.
- It re-measures when the track or any single option resizes (a late web font changes label widths
  without resizing the track) and when options are added, removed or re-classed.
- Long, unbroken and many labels wrap and shrink inside the track instead of overflowing.

## CSS custom properties

See `CONSUMER-STYLING.md` for the full `--sliding-toggle-*` token API: track surface, padding, gap,
radii, `--sliding-toggle-corner-shape`, indicator and hover-indicator surfaces, marker, option
padding/flex/typography/colours and the focus ring. Colours default from `--theme-*` tokens.

`--sliding-toggle-corner-shape` takes any `corner-shape` value (`squircle`, `superellipse(n)`,
`bevel`, `scoop`, `notch`). It's a progressive enhancement: Chromium 139+ only, and other browsers
keep the `border-radius` corners.

## Notes

- Auto-imported in Nuxt.
- The motion comes from the `useSlidingIndicator` composable, shared with `TabbedContent` (via
  `useTabs`). It writes `--_sliding-toggle-active-*` / `--_sliding-toggle-hover-*` on the root.
- Added 2026-10-19, generalised from a consumer app's pricing-page toggle (which used `aria-pressed`
  buttons; this version uses radio semantics).
