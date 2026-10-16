# InputRange Component

> **Renamed 2026-10-16**: `InputRangeCore` → `InputRange`, `InputRangeDefault` → `InputRangeField`
> (DOM classes `.input-range-core` → `.input-range`, `.input-range-with-label` →
> `.input-range-field`; full class list in CONSUMER-STYLING.md). Skill doc renamed from
> `input-range-core.md`. No consumer app used either old name.

## Overview

`InputRange` is the low-level native `<input type="range">` primitive for the `05.forms`
range-slider family. It renders a single native range input with left/right button slots (for
step-down/step-up controls), an optional `markers` slot for custom tick marks overlaid on the
track, and an optional `datalist` slot for native tick-mark snapping. It has no label,
description, or error-message rendering of its own — that's composed by the `InputRangeField`
variant below.

Most consumers should reach for **InputRangeField** rather than `InputRange` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Applied to the native input. |
| `:name` | `string` | (required) | Applied to the native input. (Until 2026-10-16 it also built the datalist id, `${name}-datalist`; that id now comes from `useId()`.) |
| `:min` | `number` | (required) | Native `min`. |
| `:max` | `number` | (required) | Native `max`. |
| `:step` | `number` | `1` | Native `step`. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:placeholder` | `string` | `""` | Declared but not rendered — range inputs have no placeholder concept. Kept for prop-shape consistency with sibling `05.forms` components. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the wrapper. |
| `:weight` | `FormWeight` | `"normal"` | Adds an `input-range--{weight}` class to the input. **No CSS in the library currently styles this class — it's a no-op today**, kept for prop-shape consistency with sibling components. |
| `:field-has-error` | `boolean` | `false` | `data-invalid` on the wrapper and `aria-invalid="true"` on the input (it did nothing here until 2026-10-16). |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the input element. Reacts to changes. |
| `:aria-describedby` | `string` | `""` | Forwarded to the native input. |

### v-model

`v-model` — `number`, **required** (`defineModel<number>({ required: true })`). Bound directly to
the native range input. Required rather than defaulted deliberately — a real `<input type="range">`
always has a concrete value (there's no meaningful "empty" range slider), so a default here would
be an artificial value rather than reflecting actual native behaviour. This also satisfies
`vue/require-default-prop`, which otherwise flags any `defineModel()` without a default — see
`project_ledger_eslint_issues_column` in memory for why that's the correct fix (not a rule
disable, not a fake default).

---

## Slots

| Slot | Notes |
|------|-------|
| `left` | Rendered before the track (e.g. a step-down button). |
| `right` | Rendered after the track (e.g. a step-up button). |
| `markers` | Rendered as an overlay on top of the track (`grid-area: element-stack`, same cell as the input). Sets `data-has-markers` on the wrapper: a line joining the markers is drawn behind them, the input becomes a transparent layer over the whole marker row (so the row is draggable and clickable), and the thumb is restyled as a ring the size of one marker that circles the selected one. That lines up because markers are spaced `space-between` and given an explicit size (icon size + 2 × padding), the same as the thumb. Use one marker per step (`(max - min) / step + 1`). Expected shape: a `.input-range-markers` wrapper containing `.input-range-marker` elements (each optionally containing an `.input-range-marker-icon`); those classes are pre-styled (they were `.marker`/`.marker-icon` until 2026-10-16). |
| `datalist` | Rendered after the input, with a `datalistId` slot prop: put it on your `<datalist>` (`<template #datalist="{ datalistId }"><datalist :id="datalistId">`) and the input's `list` points at it. The id comes from `useId()`, so two ranges sharing a `name` don't collide. `list` is omitted when the slot is empty. |

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/input-range/CONSUMER-STYLING.md) for the
full table with defaults.

**Common tokens:**
- `--input-range-accent-colour` — native `accent-color` (track/thumb tint), falls back to `--theme-accent`
- `--input-range-marker-background-colour` / `-outline-colour` — marker dot styling
- `--input-range-marker-icon-colour` — falls back to `--input-range-accent-colour`

Thumb/track height and the button-slot's button size come from the shared global geometry token
`--input-range-button-size` (declared in `03.generic-input-geometry.css`, not owned by this
component), matching the convention `theming-form-geometry-tokens.md` documents for the rest of
`05.forms`.

---

## Fixed 2026-09-21: dead `accent-color` token

`accent-color` previously read `--theme-form-range-accent-color`, a custom property that was never
declared anywhere in the codebase, with no fallback. Per the CSS spec, an undefined `var()` with
no fallback makes the whole declaration invalid at computed-value time — so `accent-color` was
silently falling back to the browser's native default (an OS-dependent blue) instead of the
intended theme colour, in every place it was used (the input itself, its `.has-markers` state, and
the marker icon colour). This is the same bug class found in `CarouselFlip`'s edge-preview tokens
around the same time — check any component reaching for a `--theme-*`-prefixed custom property for
a real declaration of that name before trusting it renders correctly.

Also removed: a broken `::-webkit-slider-thumb` rule (`background-color: 0.1rem solid green` is
invalid CSS and was silently dropped; `accent-color`/`color` don't apply to that pseudo-element at
all) and ~60 lines of dead commented-out alternative thumb/track styling — none of it had any
visible effect, since `appearance: none` (required for custom thumb/track styling to take effect)
was itself commented out.

---

## Variants

### InputRangeField

`InputRangeField` (`InputRangeField.vue`) composes `InputRange` with `InputLabel`,
`InputDescription`, and `InputError`, plus optional step-down/step-up buttons (`InputButton`)
wired into the `left`/`right` slots.

**Additional props over InputRange:**

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:error-message` | `object \| string` | (required) | Rendered via `InputError` when `field-has-error` is true. |
| `:step-down-label` | `string` | `"Step down"` | `button-text` on the step-down `InputButton` — override for localisation. |
| `:step-up-label` | `string` | `"Step up"` | `button-text` on the step-up `InputButton` — override for localisation. |

**Slots**: `descriptionHtml`, `descriptionText` (both forwarded to `InputDescription`), plus
`left`/`right`/`markers`/`datalist` (forwarded straight through to the underlying
`InputRange`; `markers` wasn't forwarded until 2026-10-16, and `datalist` passes `datalistId` on — the step-down/step-up buttons only render when you use the `left`/`right`
slots yourself, since the button icon content itself is consumer-supplied via `#iconOnly`).

```vue
<InputRangeField
  name="priceRange"
  label="Price range"
  v-model="price"
  :min="0"
  :max="500"
  :step="10"
  error-message="Please choose a value within the allowed range"
  :field-has-error="hasError"
>
  <template #left><Icon name="mdi:minus" /></template>
  <template #right><Icon name="mdi:plus" /></template>
</InputRangeField>
```

`v-model` is `number`, **required** — same as `InputRange` above.

Each step-button press adds or subtracts `step` (its absolute value, or 1 when it's 0), rounds away
floating-point drift (0.2 + 0.1 gives 0.3) and clamps to `min`/`max`; step-down goes read-only at or
below `min`, step-up at or above `max`. `:style-class-passthrough` lands on the root
`.input-range-field` only (it also reached the inner input until 2026-10-16) and reacts to changes.
The root carries `data-theme` and `data-invalid` (its old `error` class is gone), and the label
gets `input-range-label` (it was the number field's `input-number-label`, with a non-existent
`body-normal-bold` utility).

**Fixed 2026-09-21**: removed a dead `deepCssClassPassthrough` prop (declared, never consumed
anywhere in the component or referenced elsewhere in the codebase) and a dead `<style>` block
targeting `.input-range-label`/`.label-description` — classes that nothing in this component (or
`InputLabel`/`InputDescription`) actually renders, so the block had no effect. Also removed two
dead commented-out lines (`// const id = useId();`, a duplicate no-op `FormUiTheme` computed), and
(same day, follow-up pass) a `const props = withDefaults(...)` in both `InputRange` and
`InputRangeField` that had become entirely unused once the dead `FormUiTheme` computed was
removed — the template's `:id`/`:name`/etc. shorthand bindings resolve straight from `defineProps`
automatically in `<script setup>`, no destructuring or `props.` reference needed.

---

## Stress pass 2026-10-16

- **Stepping** (`InputRangeField`): 0.1 steps drifted (0.30000000000000004) and a step that didn't
  divide the range overshot `min`/`max`; the read-only checks used `===`, so an overshot value
  never disabled the button. Now rounded, clamped, and `<=`/`>=`. A zero or negative `step`
  steps by its size, or 1.
- **Datalist id**: was `${name}-datalist`, so two ranges sharing a `name` linked to the same list
  (rule `ids-from-useid.md`). Now `useId()`, handed to the slot as `datalistId`.
- **Error state**: `fieldHasError` did nothing on `InputRange`; it now sets `data-invalid` and
  `aria-invalid`.
- **Slots**: the Field didn't forward `markers`.
- **Classes**: bare/generic classes became prefixed classes or data attributes, and the marker
  defaults moved from dark-page colours to `--theme-*` tokens (CONSUMER-STYLING.md has the
  mapping). The Field's passthrough no longer reaches the inner input as well as its root.
- **Overflow**: the slider container gets `min-inline-size: 0` and the step buttons don't
  shrink; the Field wraps long label, description and error copy.
- Specs unmount in `afterEach`; stories moved to `StoryObj` with Docs descriptions, a
  `DecimalSteps` story, `CanvasSwitcher` and a `StressTest` story on the Field. The bare
  control's step-button demo uses `InputButton`, not raw buttons.
