# InputRangeCore Component

## Overview

`InputRangeCore` is the low-level native `<input type="range">` primitive for the `05.forms`
range-slider family. It renders a single native range input with left/right button slots (for
step-down/step-up controls), an optional `markers` slot for custom tick marks overlaid on the
track, and an optional `datalist` slot for native tick-mark snapping. It has no label,
description, or error-message rendering of its own — that's composed by the `InputRangeDefault`
variant below.

Most consumers should reach for **InputRangeDefault** rather than `InputRangeCore` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Applied to the native input. |
| `:name` | `string` | (required) | Applied to the native input, and used to derive the `list` id when the `datalist` slot is used (`${name}-datalist`). |
| `:min` | `number` | (required) | Native `min`. |
| `:max` | `number` | (required) | Native `max`. |
| `:step` | `number` | `1` | Native `step`. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:placeholder` | `string` | `""` | Declared but not rendered — range inputs have no placeholder concept. Kept for prop-shape consistency with sibling `05.forms` components. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the wrapper. |
| `:weight` | `FormWeight` | `"normal"` | Adds an `input-range--{weight}` class to the input. **No CSS in the library currently styles this class — it's a no-op today**, kept for prop-shape consistency with sibling components. |
| `:field-has-error` | `boolean` | `false` | Declared, but doesn't drive any visible state inside `InputRangeCore` itself — `InputRangeDefault` handles the actual error styling (`data-invalid`/`.error` class) on its own wrapper. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the input element. |
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
| `markers` | Rendered as an overlay on top of the track (`grid-area: element-stack`, same cell as the input). Adds a `has-markers` class to the input, which shrinks its visible track to a thin `0.2rem` strip and hides the native thumb, so your marker content becomes the primary visual. Expected shape: a `.input-range-markers` wrapper containing `.marker` elements (each optionally containing a `.marker-icon`) — see the component's own scoped CSS for the classes it pre-styles. |
| `datalist` | Rendered after the input. Must contain a real `<datalist>` element whose `id` matches `${name}-datalist` for the browser to link it via the input's `list` attribute — the component computes that id string for the `list` attribute itself, but does not set the `id` on your slotted `<datalist>` for you. |

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

### InputRangeDefault

`InputRangeDefault` (`InputRangeDefault.vue`) composes `InputRangeCore` with `InputLabel`,
`InputDescription`, and `InputError`, plus optional step-down/step-up buttons (`InputButtonCore`)
wired into the `left`/`right` slots.

**Additional props over InputRangeCore:**

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:error-message` | `object \| string` | (required) | Rendered via `InputError` when `field-has-error` is true. |
| `:step-down-label` | `string` | `"Step down"` | `button-text` on the step-down `InputButtonCore` — override for localisation. |
| `:step-up-label` | `string` | `"Step up"` | `button-text` on the step-up `InputButtonCore` — override for localisation. |

**Slots**: `descriptionHtml`, `descriptionText` (both forwarded to `InputDescription`), plus
`left`/`right`/`markers`/`datalist` (forwarded straight through to the underlying
`InputRangeCore` — the step-down/step-up buttons only render when you use the `left`/`right`
slots yourself, since the button icon content itself is consumer-supplied via `#iconOnly`).

```vue
<InputRangeDefault
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
</InputRangeDefault>
```

`v-model` is `number`, **required** — same as `InputRangeCore` above.

**Fixed 2026-09-21**: removed a dead `deepCssClassPassthrough` prop (declared, never consumed
anywhere in the component or referenced elsewhere in the codebase) and a dead `<style>` block
targeting `.input-range-label`/`.label-description` — classes that nothing in this component (or
`InputLabel`/`InputDescription`) actually renders, so the block had no effect. Also removed two
dead commented-out lines (`// const id = useId();`, a duplicate no-op `FormUiTheme` computed), and
(same day, follow-up pass) a `const props = withDefaults(...)` in both `InputRangeCore` and
`InputRangeDefault` that had become entirely unused once the dead `FormUiTheme` computed was
removed — the template's `:id`/`:name`/etc. shorthand bindings resolve straight from `defineProps`
automatically in `<script setup>`, no destructuring or `props.` reference needed.
