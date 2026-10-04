# InputOtp Component

## Overview

`InputOtp` is a one-time-code entry control: a row of single-digit boxes for verification codes
sent by email or SMS (sign-in, two-factor, email confirmation). It has no label, description or
error rendering of its own; that's composed by the `InputOtpField` variant below.

Most consumers should reach for **InputOtpField**.

Location: `app/components/05.forms/input-otp/`. Styling: `CONSUMER-STYLING.md` in that folder.

---

## Behaviour

- Only digits are accepted. Typing a digit fills the box and moves focus to the next one.
- Typing into a box that already holds a digit replaces it (focusing a box selects its contents).
- Backspace in an empty box clears the previous box and moves focus there; Backspace in a filled
  box only clears that box.
- Pasting spreads the digits across the boxes, strips non-digits and truncates to `length`. A
  full-length paste always fills from the first box; a shorter one fills from the focused box.
  Focus lands on the last box filled.
- Autofill works: the first box has `autocomplete="one-time-code"`, and several characters landing
  in one box (iOS/Android SMS autofill) are spread the same way as a paste.
- Enter submits the parent form via `form.requestSubmit()` (with the native implicit submission
  suppressed, so it never submits twice). Several single-character inputs don't otherwise get
  implicit submission when the form has no submit button.
- Left/Right arrows move between boxes; Home/End jump to the first/last box.
- The first box is focused on mount only when `autofocus` is set. When `fieldHasError` turns on,
  focus moves to the first box so the user can retype straight away.
- `complete` fires with the code whenever a change leaves every box filled.
- Each box has a visually hidden label built from `digitLabel` (translatable). In
  `InputOtpField` the fieldset legend names the group; on its own, `groupLabel` adds
  `role="group"` + `aria-label`.
- On error every box gets `aria-invalid="true"` and the `aria-describedby` ids.
- With `name` set, a hidden input carries the full code, so a native form submit sends one value.
  The boxes themselves have no `name`.
- **Leading zeros are kept.** The model is a `string` and the boxes are `type="text"` with
  `inputmode="numeric"`; nothing is ever converted to a number, so `"012345"` stays `"012345"`.
- `length` is clamped to 1–12. Non-digits and overflow in an incoming model value are ignored
  for display (they show as empty boxes).

---

## Props reference

> Write camelCase props hyphenated in templates (`:field-has-error`, `:digit-label`).

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Box ids are `{id}-0`, `{id}-1`, ... |
| `:name` | `string` | `""` | Name of the hidden input holding the full code. No hidden input when empty. |
| `:length` | `number` | `6` | Number of boxes, clamped 1–12. |
| `:autofocus` | `boolean` | `false` | Focus the first box on mount. Use when the field appears as the direct result of a user action (e.g. after submitting an email step). |
| `:required` | `boolean` | `false` | Native `required` on every box. |
| `:group-label` | `string` | `""` | When set, root gets `role="group"` and this `aria-label`. Leave empty inside `InputOtpField`. |
| `:digit-label` | `string` | `"Digit {index} of {length}"` | Per-box hidden label; `{index}` (1-based) and `{length}` are replaced. |
| `:field-has-error` | `boolean` | `false` | `data-invalid` on the root, `aria-invalid` on each box, focuses the first box when it turns on. |
| `:aria-describedby` | `string` | `""` | Forwarded to every box. |
| `:theme` | `FormUiTheme` | `"default"` | `data-theme` on the root. |
| `:input-variant` | `InputUiVariant` | `"normal"` | `normal` (bordered boxes) or `underlined`. `outlined` has no CSS, same as the other `05.forms` inputs. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Classes on the `.input-otp` root. |

### v-model

`v-model`: `string`, **required**. Digits only; unfilled trailing boxes are trimmed, so a
half-entered code is e.g. `"123"`. A gap in the middle (box 2 cleared while box 3 is filled)
is a space.

### Events

| Event | Payload | When |
|------|------|------|
| `complete` | `code: string` | A change leaves every box filled. Use it to auto-submit. |

---

## Variants

### InputOtpField

`FormFieldset` (the label is the `<legend>`) + `InputDescription` + `InputOtp` + `InputError`,
with ids linked through `useAriaDescribedById`. Root class `.input-otp-field` (on the fieldset).

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | `string` | (required) | Used for the ids and the hidden input's name. |
| `label` | `string` | (required) | Fieldset legend. |
| `errorMessage` | `string \| object` | `""` | Shown in `InputError` when `fieldHasError`. |
| `length`, `autofocus`, `required`, `digitLabel`, `fieldHasError`, `theme`, `inputVariant`, `styleClassPassthrough` | | | As on `InputOtp`; passthrough goes on the fieldset. |

Slots: `descriptionText`, `descriptionHtml` (linked via `aria-describedby`). Emits `complete`.

```vue
<form @submit.prevent="verify">
  <InputOtpField
    v-model="code"
    name="code"
    label="Verification code"
    autofocus
    :error-message="codeError"
    :field-has-error="Boolean(codeError)"
    @complete="verify"
  >
    <template #descriptionText>Enter the 6-digit code we sent to your email.</template>
  </InputOtpField>
</form>
```

---

## Migrating from an app-local `InputOtp`

This was ported from a consumer app's own `InputOtp.vue` (2026-10-04). Differences: the app version
took `id` + `label` in one component; use `InputOtpField` with `name` instead of `id`. It always
focused the first box on mount; pass `autofocus` to keep that. Its boxes were named `{id}-{index}`;
read the code from `v-model` or the hidden input (`name`) instead. Rename the app's file away (or
delete it) once on the layer release that ships this, or the app's own `InputOtp` shadows the
layer's.
