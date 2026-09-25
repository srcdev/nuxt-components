# InputTextCore Component

## Overview

`InputTextCore` is the low-level native `<input>` primitive for the `05.forms` text-input family.
It renders a single styled text-like input with left/right icon slots, focus/dirty state models,
and numeric-pattern validation for `inputmode="numeric"`. It has no label, description, or error
message rendering of its own — those are composed by the wrapper variants below.

Most consumers should reach for one of the **Variants** rather than `InputTextCore` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:input-variant`, `:aria-describedby`.

| Prop (template form)       | Type                                                         | Default     | Notes                                                                 |
| --------------------------- | ------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------- |
| `:type`                     | `"text" \| "email" \| "password" \| "number" \| "tel" \| "url" \| "date"` | `"text"`    | Native input type.                                                     |
| `:inputmode`                | `"text" \| "email" \| "tel" \| "url" \| "search" \| "numeric" \| "none" \| "decimal"` | `"text"`    | Sets virtual keyboard hint; `"numeric"` also enables pattern validation. |
| `:maxlength`                | `number`                                                      | `255`       | Native `maxlength`.                                                   |
| `:min`                      | `string \| number`                                            | (optional)  | Passed straight through to the native input — e.g. earliest allowed date for `type="date"`, or lowest number for `type="number"`. Use an ISO date string (`"2026-01-01"`) for `type="date"`. |
| `:max`                      | `string \| number`                                            | (optional)  | Same as `min`, for the upper bound.                                   |
| `:id`                       | `string`                                                      | (required)  | Applied to the native input.                                          |
| `:name`                     | `string`                                                      | (required)  | Applied to the native input.                                          |
| `:required`                 | `boolean`                                                     | `false`     | Native `required`.                                                    |
| `:placeholder`              | `string`                                                      | `""`        | Native placeholder.                                                   |
| `:field-has-error`          | `boolean`                                                     | `false`     | Drives `.error` class, `aria-invalid`, and forces `theme` to `"error"`. |
| `:style-class-passthrough`  | `string \| string[]`                                          | `[]`        | Extra CSS classes applied to the wrapper.                             |
| `:theme`                    | `FormUiTheme`                                                 | `"default"` | Overridden to `"error"` internally when `fieldHasError` is true.       |
| `:aria-describedby`         | `string`                                                      | `""`        | Forwarded to the native input.                                        |
| `:input-variant`            | `"normal" \| "outlined" \| "underlined"`                      | `"normal"`  | Visual style — border box vs. underline.                              |

### v-models

| Model             | Type      | Notes                                                     |
| ----------------- | --------- | ---------------------------------------------------------- |
| `v-model`          | `string`  | The input value. **Required** (`defineModel({ required: true })`, 2026-09-25), same for `InputTextWithLabel` and `InputPasswordWithLabel`. |
| `v-model:is-dirty` | `boolean` | Set to `true` once the wrapper variant detects a non-empty value at mount or on change. |
| `v-model:is-active`| `boolean` | Tracks focus state (`focusin`/`focusout`).                   |

---

## Slots

| Slot    | Notes                                                                 |
| ------- | ---------------------------------------------------------------------- |
| `left`  | Rendered before the input, inside the bordered wrapper (e.g. an icon or `InputButtonCore variant="inline"`). |
| `right` | Rendered after the input, inside the bordered wrapper.                 |

---

## CSS Token Customization

All `--input-text-*` tokens can be overridden at global, page, or instance scope, each falling back
to the shared `--theme-*`/`--theme-input-*` tokens every other themed form component also uses. See
`CONSUMER-STYLING.md` in the component directory for the full token table.

**Common tokens:**
- `--input-text-surface` — wrapper background
- `--input-text-border` / `--input-text-border-hover` / `--input-text-border-focus` — border/outline colour
- `--input-text-color` — input text colour
- `--input-text-placeholder-color` — placeholder colour

---

## Using `min`/`max` for a native date picker

`type="date"` plus `min`/`max` is the standard way to stop the browser's native date picker from
offering dates outside an allowed range — e.g. preventing a booking date in the past:

```vue
<InputTextCore
  id="appointment-date"
  name="appointmentDate"
  type="date"
  v-model="appointmentDate"
  :min="new Date().toISOString().split('T')[0]"
  max="2027-12-31"
/>
```

`min`/`max` are passed straight through with no validation of their own — the browser enforces the
range in its native picker/typed-entry UI. Pair with server-side validation; a native `min`/`max`
constraint is a UX affordance, not a substitute for validating the submitted value.

---

## Variants

The `variants/` folder composes `InputTextCore` with `InputLabel`, `InputDescription`, and
`InputError` for the common "labelled field" case. Each forwards `min`/`max` straight through if
you pass them.

### InputTextWithLabel

The general-purpose labelled text field — supports every `InputTypesText` value including
`"date"`.

```vue
<InputTextWithLabel
  v-model="appointmentDate"
  id="appointment-date"
  name="appointmentDate"
  type="date"
  label="Appointment date"
  :min="new Date().toISOString().split('T')[0]"
  max="2027-12-31"
  :error-message="errors.appointmentDate"
  :field-has-error="!!errors.appointmentDate"
/>
```

Props: same `type`/`inputmode`/`maxlength`/`min`/`max`/`name`/`placeholder`/`label`/`errorMessage`/
`fieldHasError`/`required`/`styleClassPassthrough`/`theme`/`inputVariant` as `InputTextCore`, plus
`label: string` (required) and `errorMessage: object | string` (required — pass `""` if unused).
Slots: `left`, `right`, `descriptionHtml`, `descriptionText`.

### InputPasswordWithLabel

Adds a show/hide toggle button (`InputButtonCore variant="inline"` in the `right` slot) that swaps
`type` between `"password"` and `"text"`.

```vue
<InputPasswordWithLabel
  v-model="password"
  name="password"
  label="Password"
  :error-message="errors.password"
  :field-has-error="!!errors.password"
  show-password-text="Show password"
  hide-password-text="Hide password"
/>
```

Extra props: `showPasswordText` (default `"Show password"`) and `hidePasswordText` (default
`"Hide password"`) — the toggle button's accessible name in each state. Pass translated strings
here for a non-English consumer app; there is no built-in i18n framework dependency.

### InputTextAsNumberWithLabel

A numeric stepper: left/right `InputButtonCore variant="inline"` buttons decrement/increment the
value by `step`, disabled once `min`/`max` is reached.

```vue
<InputTextAsNumberWithLabel
  v-model="quantity"
  name="quantity"
  label="Quantity"
  :min="1"
  :max="99"
  :step="1"
  step-down-text="Decrease quantity"
  step-up-text="Increase quantity"
>
  <template #left>−</template>
  <template #right>+</template>
</InputTextAsNumberWithLabel>
```

`v-model` is `number | undefined` (`defineModel({ default: undefined })`): clearing the field sets it to `undefined`, so bind a `ref<number | undefined>` rather than assuming a number.

Extra props: `min: number` (required), `max: number` (required), `step?: number` (default `1`),
`stepDownText`/`stepUpText` (default `"Step down"`/`"Step up"`) — the decrement/increment buttons'
accessible names. Requires `left`/`right` slot content for the step icons (no default icon).

**Fixed 2026-09-22**: `updateElementClasses(["input-text-as-number", "has-left-button",
"has-right-button"])` computes marker classes onto this component's own `elementClasses`, which is
bound to the outer `.input-text-with-label` wrapper — but the nested `<InputTextCore>` was passed
`:style-class-passthrough` as a bare shorthand, which resolves to the raw incoming
`styleClassPassthrough` **prop**, not the local `elementClasses`. So the marker classes never
reached the actual `<input>`, the scoped `.input-text-core.input-text-as-number { width:
fit-content; text-align: center; ... }` CSS never matched anything, and the input silently fell
back to `InputTextCore`'s default full-width, left-aligned styling instead of the intended
compact, centered numeric stepper box. Fixed by changing that binding to
`:style-class-passthrough="elementClasses"` — `elementClasses` still carries any consumer-supplied
`styleClassPassthrough` too, since the composable seeds it from the prop before the marker classes
are toggled on top. When a component computes its own marker/state classes via
`updateElementClasses()` and needs them on a *child* component rather than its own root element,
always pass the computed `elementClasses` explicitly — the `:x` shorthand only ever resolves to
the prop of that exact name, never a same-named local composable output.

---

## Accessibility

- `field-has-error` sets `aria-invalid="true"` and forces the error theme, independent of what
  `theme` was passed.
- `inputmode="numeric"` adds a `pattern="[0-9]+"` and blocks non-numeric `beforeinput` edits that
  would fail it.
- Focus is tracked via native `focusin`/`focusout`, not a custom keyboard handler — `:focus-visible`
  styling is preserved.
- The password/number variants give their icon-only toggle/step buttons a real accessible name via
  `InputButtonCore`'s `buttonText` (visually hidden via `.sr-only` when an icon-only slot is used).

---

## Notes

- **No built-in label/error rendering**: `InputTextCore` alone renders no `<label>` or error text —
  use a variant, or compose your own wrapper the same way they do.
- **`min`/`max` need matching `type`**: they're inert on `type="text"`/`"email"`/etc. — only
  `"date"` and `"number"` (native range-constrained types) act on them.
