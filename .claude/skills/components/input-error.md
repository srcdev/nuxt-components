# InputError Component

## Overview

`InputError` renders the red error message strip under a form control. Every `*Field` wrapper in
`05.forms` (`InputTextWithLabel`, `InputNumberField`, `InputSelectWithLabel`, `InputTextareaWithLabel`,
`InputRangeDefault`, `ToggleSwitchWithLabel`, `SingleCheckbox`, `MultipleCheckboxes`,
`MultipleRadiobuttons`, `InputTextAsNumberWithLabel`) already renders one, so consumers rarely use
it directly. Use it yourself only when building a custom field wrapper.

It is designed to sit in **grid row 2** of the wrapper, directly under the control in row 1: it is
translated up by the control's border width + radius so an attached error tucks under the
control's bottom edge. It opens with a `grid-template-rows: 0fr → 1fr` + opacity transition.

Its root carries `data-theme="error"`, so the red `--theme-*` ramp applies inside it regardless of
the surrounding theme.

---

## Props reference

> **Hyphenation rule**: write camelCase props hyphenated in templates: `:error-message`, `:show-error`, `:is-detached`, `:input-variant`, `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Must match an id in the control's `aria-describedby` while in error. Wrappers get it from `useAriaDescribedById(...).errorId`, which only adds it to `aria-describedby` when `fieldHasError` is true. |
| `:error-message` | `string \| string[] \| object` | (required) | A string renders as one message; an array renders as a `<ul>` list. |
| `:show-error` | `boolean` | (required) | Opens the strip. Rendered as `data-visible`; when `false` the root gets `aria-hidden="true"`. |
| `:is-detached` | `boolean` | (required) | `true`: sits below the control with a `2rem` gap, fully rounded. `false`: tucked under the control's bottom edge. Rendered as `data-detached`. |
| `:input-variant` | `"normal" \| "outlined" \| "underlined"` | `"normal"` | Match the control's variant. Rendered as `data-input-variant`. `underlined` drops the rounded corners and (when attached) the outline. |
| `icon` | `string` | `"radix-icons:circle-backslash"` | Iconify name for the decorative icon (`aria-hidden`). |
| `data-testid` | `string` | `"inputError"` | |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root, reacts to prop changes. |

No slots.

---

## Usage (inside a custom field wrapper)

```vue
<template>
  <div class="my-field">
    <input :id :aria-describedby="ariaDescribedby()" :aria-invalid="fieldHasError" />
    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="false" :input-variant />
  </div>
</template>

<script setup lang="ts">
const { id, errorId, ariaDescribedby } = useAriaDescribedById(props.name, toRef(props, "fieldHasError"), useSlots());
</script>

<style>
.my-field {
  display: grid;
  grid-template-rows: auto auto;
}
</style>
```

---

## Accessibility

- The message is exposed through the control's `aria-describedby`, not a live region, so it's
  read when the control is focused. Moving focus to the first invalid field on submit is the
  form's job (see `FormWrapper` / pattern forms).
- Hidden errors are `aria-hidden="true"`; the icon is always `aria-hidden`.
- The open/close transition is disabled under `prefers-reduced-motion: reduce`.

---

## Styling

Full token table in `app/components/05.forms/form-errors/CONSUMER-STYLING.md`. Public tokens:
`--input-error-text-color`, `--input-error-icon-color`, `--input-error-icon-size`,
`--input-error-background-color`, `--input-error-border-color`, `--input-error-outline-color`,
`--input-error-border-radius`, `--input-error-font-family|size|weight`,
`--input-error-padding-inline`, `--input-error-padding-block-start|end`, `--input-error-list-gap`,
`--input-error-detached-offset`, `--input-error-margin-block-start`,
`--input-error-transition-duration`.

Set them on an ancestor, not the global `--theme-error-*` tokens: the root's `data-theme="error"`
re-declares those on the element itself, so ancestor overrides of them never land.

---

## History

**Migrated 2026-09-26** (1/5 → full compliance):

- State moved from bare classes (`.show`, `.detached`, `.normal`/`.outlined`/`.underlined`) to
  `data-visible`, `data-detached`, `data-input-variant`; inner elements renamed from generic
  `.inner`/`.inner-content`/`.inner-icon`/`.icon`/`.message`/`.message-*` to
  `.input-error-message-*`. It renders inline in the consumer's DOM, so those names collided with
  consumer CSS (pitfall #16).
- Removed the unused `compact` prop (declared, never read, never passed).
- Added the `icon` prop.
- Removed dead CSS: detached-state border colours (including a hardcoded `--red-08` bottom border)
  only applied while hidden at `opacity: 0` and were overridden by the visible-state border, and a
  top-level `.underlined` outline rule that the visible state always overrode.
- Hardcoded `white` on the icon and list items replaced by the text-colour token (same default).
  Hardcoded font size/weight, padding, list gap and detached gap promoted to public tokens.
- `aria-hidden` now omitted when visible (was `"false"`); icon marked `aria-hidden`;
  `prefers-reduced-motion` respected; `styleClassPassthrough` now reacts to prop changes.
