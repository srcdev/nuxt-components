# InputText Component

> **Renamed 2026-10-16**: `InputTextCore` → `InputText`, `InputTextWithLabel` → `InputTextField`,
> `InputPasswordWithLabel` → `InputPasswordField`, `InputTextAsNumberWithLabel` →
> `InputTextAsNumberField` (DOM classes `.input-text-core` → `.input-text`,
> `.input-text-with-label` → `.input-text-field`; full class list in CONSUMER-STYLING.md). Skill
> doc renamed from `input-text-core.md`. Consumer apps use the first three old names; list their
> edits privately and apply them when each upgrades.

## Overview

`InputText` is the low-level native `<input>` primitive for the `05.forms` text-input family. It
renders one styled text-like input with left/right slots, focus/dirty state models, and digit-only
typing for `inputmode="numeric"`. It has no label, description or error rendering of its own:
those come from the Field wrappers under **Variants**, or pair it with your own `<label for>`.

Most consumers should reach for one of the Variants rather than `InputText` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:input-variant`, `:aria-describedby`.

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `:type` | `InputTypesText` (`"text" \| "email" \| "password" \| "number" \| "tel" \| "url" \| "date"`) | `"text"` | Native input type. |
| `:inputmode` | `InputMode` | `"text"` | Virtual keyboard hint. `"numeric"` also adds `pattern="[0-9]+"` and blocks typing anything but digits (a `beforeinput` handler; deletions and paste without data pass). Sets `data-inputmode` on the wrapper. |
| `:maxlength` | `number` | `255` | Native `maxlength`. |
| `:min` / `:max` | `string \| number` | (optional) | Passed straight through, e.g. an ISO date for `type="date"`. Inert on text-like types. |
| `:id` | `string` | (required) | Applied to the native input. |
| `:name` | `string` | (required) | Applied to the native input. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:readonly` | `boolean` | `false` | Native `readonly`; sets `data-readonly` on the wrapper. Added 2026-10-16: a `readonly` attribute used to fall through onto the wrapper div, not the input. |
| `:autocomplete` | `string` | (unset) | Native `autocomplete` token (`email`, `name`, `new-password`...). Added 2026-10-16. |
| `:placeholder` | `string` | `""` | Native placeholder. |
| `:field-has-error` | `boolean` | `false` | `data-invalid` on the wrapper and `aria-invalid="true"` on the input. It does **not** change `theme`. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the native input. Reacts to changes. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the wrapper. |
| `:aria-describedby` | `string` | `""` | Forwarded to the native input; omitted when empty. |
| `:input-variant` | `InputUiVariant` | `"normal"` | Sets `data-input-variant`. `normal` (bordered box) and `underlined` have CSS; `outlined` doesn't. |

### v-models

| Model | Type | Notes |
|---|---|---|
| `v-model` | `string` | **Required** (`defineModel({ required: true })`). |
| `v-model:is-dirty` | `boolean` | Read only: `InputText` never sets it. The Fields set it once the value is non-empty. Reflected as `data-dirty`. |
| `v-model:is-active` | `boolean` | Tracks focus (`focusin`/`focusout`). Reflected as `data-active`. |

---

## Slots

| Slot | Notes |
|---|---|
| `left` | Rendered before the input in `.input-text-slot-left`, inside the bordered wrapper (an icon, or `InputButton variant="inline"`, which the slot styles). Sets `data-has-left-slot`. |
| `right` | Same, after the input, in `.input-text-slot-right`. Sets `data-has-right-slot`; a right-slot `InputButton` removes the wrapper's end padding so it sits flush. |

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/input-text/CONSUMER-STYLING.md) for the
full table with defaults and the state hooks.

**Common tokens:**

- `--input-text-surface` / `-surface-hover` — wrapper background, slot button hover
- `--input-text-border` / `-border-hover` / `-border-focus` — border and outline colours
- `--input-text-color` — input text colour (also the browser-autofill text colour, global rule)
- `--input-text-placeholder-color` — placeholder colour

**State hooks** (on `.input-text-wrapper`): `data-input-variant`, `data-theme`, `data-invalid`,
`data-dirty`, `data-active`, `data-readonly`, `data-inputmode`, `data-has-left-slot`,
`data-has-right-slot`.

---

## Using `min`/`max` for a native date picker

```vue
<InputText
  id="appointment-date"
  v-model="appointmentDate"
  name="appointmentDate"
  type="date"
  :min="new Date().toISOString().split('T')[0]"
  max="2027-12-31"
/>
```

The browser enforces the range in its picker; validate the submitted value server-side as well.

---

## Changed 2026-10-16: rename, state hooks, wrapper fixes

- Renamed to the Control/Field convention (note at the top).
- State classes became data attributes (`.normal`/`.underlined` → `[data-input-variant]`,
  `.dirty`/`.active`/`.error` → `[data-dirty]`/`[data-active]`/`[data-invalid]`,
  `.has-left-slot`/`.has-right-slot` → `[data-has-*-slot]`); `.slot.left-slot`/`.right-slot` →
  `.input-text-slot-left`/`-right`. The input no longer carries `dirty`/`active` classes.
- Numeric filtering used a `beforeinput` listener added in `onMounted` that was never removed and
  added a new `input` listener per keystroke (it reverted pattern mismatches after the fact). It's
  now a template `@beforeinput` handler that cancels non-digit input up front, and it follows
  `inputmode` changes after mount.
- `aria-describedby=""` is no longer rendered when empty; an unused `FormUiTheme` computed is gone.
- `InputTextField` passed `label` and `error-message` to `InputText`, which has no such props, so
  they landed on `.input-text-wrapper` as HTML attributes. It also applied its passthrough to both
  its root and the input; now its root only.
- `InputPasswordField` forwarded both description slots unconditionally, so every password field
  rendered an empty `InputDescription` and pointed `aria-describedby` at it. Slots now forward
  only when filled. Its toggle icon class is `.input-password-field-icon` (was `.icon`).
- `InputTextAsNumberField`: step buttons overshot `min`/`max` and drifted on fractional steps
  (now round, clamp and start from 0 when empty, like `InputNumberField`); its own CSS read
  `--theme-*` directly and now uses the `--input-text-*` tokens; the step buttons ignored `theme`;
  `inputmode` follows `min`/`step` (a negative `min` or fractional `step` couldn't be typed); the
  input's width is capped at `12em`; root class `.input-text-as-number-field` (it reused
  `.input-text-with-label`), and `InputError` gets `input-variant`.
- The global autofill rule in `04.elements/forms/00.element-defaults.css` read an undefined
  `--_input-text-core-color`, so autofilled text lost its colour; it now uses `--input-text-color`.

---

## Variants

Three wrappers compose `InputText` with `InputLabel`, `InputDescription` and `InputError`. Ids
come from `useAriaDescribedById`, so they take `name`, not `id`. Each applies
`style-class-passthrough` to its own root only.

### InputTextField

The general-purpose labelled text field. Root `.input-text-field`, with `data-theme`,
`data-input-variant`, `data-invalid`, `data-dirty` (set once the value is non-empty) and
`data-active`.

```vue
<InputTextField
  v-model="email"
  name="email"
  type="email"
  label="Email address"
  autocomplete="email"
  :error-message="errors.email"
  :field-has-error="!!errors.email"
>
  <template #descriptionText>We only use it to reply to you.</template>
</InputTextField>
```

Props: `type` (required), `inputmode`, `maxlength`, `min`, `max`, `name`, `placeholder`,
`required`, `readonly`, `autocomplete`, `fieldHasError`, `theme`, `inputVariant`, plus `label`
(required), `errorMessage: object | string` (required, pass `""` if unused) and
`styleClassPassthrough`. Slots: `left`, `right`, `descriptionText`, `descriptionHtml`. The
description renders before the input, or after the input and error for `outlined`.

### InputPasswordField

`InputTextField` (root `.input-text-field.input-password-field`) with a show/hide toggle
(`InputButton variant="inline"` in the right slot) that swaps `type` between `password` and
`text`.

```vue
<InputPasswordField
  v-model="password"
  name="password"
  label="Password"
  autocomplete="new-password"
  :error-message="errors.password"
  :field-has-error="!!errors.password"
/>
```

Extra props: `showPasswordText`/`hidePasswordText` (defaults `"Show password"`/`"Hide password"`,
the toggle's accessible name; pass translated strings), `autocomplete` (default
`"current-password"`; use `"new-password"` on sign-up). A passed `type` is accepted and ignored.
Slots: `descriptionText`, `descriptionHtml`.

### InputTextAsNumberField

A compact numeric stepper on a text input (no native spinner). Root
`.input-text-as-number-field`.

```vue
<InputTextAsNumberField
  v-model="quantity"
  name="quantity"
  label="Quantity"
  :min="1"
  :max="99"
  step-down-text="Decrease quantity"
  step-up-text="Increase quantity"
  :error-message="errors.quantity"
>
  <template #left><Icon name="mdi:minus" /></template>
  <template #right><Icon name="mdi:plus" /></template>
</InputTextAsNumberField>
```

- `v-model` is `number | undefined`: clearing the field sets `undefined`; text that isn't a
  finite number is ignored.
- Step buttons appear when the `left`/`right` slots are filled (the slot content is the icon).
  They step by `step`, round to its precision, clamp to `min`/`max` (pulling a typed
  out-of-range value back in), start from 0 (clamped) when empty, and go read-only at the limits.
- `inputmode` is `numeric` (digits only) for a whole-number, non-negative range, `decimal` for a
  fractional `step`, `text` for a negative `min`.
- Extra props: `min`, `max` (required), `step` (default `1`), `stepDownText`/`stepUpText`
  (defaults `"Step down"`/`"Step up"`).

---

## Accessibility

- `field-has-error` sets `aria-invalid="true"`; the Fields link the error and description via
  `aria-describedby`.
- Focus is shown on the wrapper with `:has(input:focus-visible, button:focus-visible)`.
- The password and stepper buttons get accessible names through `InputButton`'s `buttonText`
  (visually hidden in icon-only mode).
- Use `autocomplete` on personal-data fields (WCAG 1.3.5).
