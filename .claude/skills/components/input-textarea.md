# InputTextarea Component

> **Renamed 2026-10-16**: `InputTextareaCore` → `InputTextarea`, `InputTextareaWithLabel` →
> `InputTextareaField` (DOM classes `.input-textarea-core` → `.input-textarea`,
> `.input-textarea-with-label` → `.input-textarea-field`; full class list in
> CONSUMER-STYLING.md). Skill doc renamed from `input-textarea-core.md`. Consumer apps use the
> Field's old name; list their edits privately and apply them when each upgrades.

## Overview

`InputTextarea` is the low-level native `<textarea>` primitive for the `05.forms` multi-line text
family. It renders one native textarea with left/right decorative slots and grows with its
content (`field-sizing: content`) between a minimum and an optional maximum height. It has no
label, description or error rendering of its own; that's composed by `InputTextareaField` below.

Most consumers should reach for **InputTextareaField** rather than `InputTextarea` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Applied to the native textarea. |
| `:name` | `string` | (required) | Applied to the native textarea. |
| `:maxlength` | `number` | `255` | Native `maxlength`. Raise it for free-text messages. |
| `:placeholder` | `string` | `""` | Native `placeholder`. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:readonly` | `boolean` | `false` | Native `readonly`. Added 2026-10-16. |
| `:autocomplete` | `string` | (unset) | Native `autocomplete` token (e.g. `street-address`). Added 2026-10-16. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the wrapper. |
| `:input-variant` | `InputUiVariant` | `"normal"` | Sets `data-input-variant`. `normal` (bordered box) and `underlined` have CSS; `outlined` doesn't. |
| `:field-has-error` | `boolean` | `false` | `data-invalid` on the wrapper and `aria-invalid="true"` on the textarea (omitted otherwise). |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes on the textarea. Reacts to changes. |
| `:aria-describedby` | `string` | `""` | Forwarded to the native textarea; omitted when empty. |

### v-models

- `v-model` — `string | number | readonly string[] | null | undefined`, **required**
  (`defineModel({ required: true })`; `""` is a valid value, "required" means it must be bound).
- `v-model:is-dirty` — `boolean`. Read only here: `InputTextareaField` sets it the first time the
  value is non-empty. Reflected as `data-dirty`.
- `v-model:is-active` — `boolean`. Tracks focus (`focusin`/`focusout`). Reflected as
  `data-active`.

---

## Slots

| Slot | Notes |
|------|-------|
| `left` | Rendered before the textarea in `.input-textarea-slot-left` (decorative, e.g. an icon). Sets `data-has-left-slot`. |
| `right` | Same, after the textarea, in `.input-textarea-slot-right`. Sets `data-has-right-slot`. |

The slots have no built-in `InputButton` styling, unlike `InputText`'s.

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/input-textarea/CONSUMER-STYLING.md) for
the full table with defaults and the state hooks.

**Common tokens:**

- `--input-textarea-surface` — wrapper background
- `--input-textarea-border` / `-border-hover` / `-border-focus` — border and outline colours
- `--input-textarea-text-color` / `-placeholder-color` — text colours
- `--input-textarea-min-height` (default `6lh`) / `-max-height` (default `none`) — growth range
- `--input-textarea-slot-gap` (default `1.2rem`) — gap between slots and textarea
- `--input-textarea-slot-align` (default `center`) / `-slot-padding-block` (default `0`) — where
  the slots sit against a tall textarea; `start` plus
  `var(--form-textarea-padding-block)` lines an icon up with the first line

**State hooks** (on `.input-textarea-wrapper`): `data-input-variant`, `data-theme`,
`data-invalid`, `data-dirty`, `data-active`, `data-has-left-slot`, `data-has-right-slot`.

`field-sizing: content` isn't supported in Safari 16 or Firefox; there the textarea keeps its
minimum height and scrolls. That's degraded, not broken.

---

## Changed 2026-10-16: rename, state hooks, line breaks

- Renamed to the Control/Field convention (note at the top).
- State classes became data attributes (`.normal`/`.underlined` → `[data-input-variant]`,
  `.dirty`/`.active`/`.error` → `[data-dirty]`/`[data-active]`/`[data-invalid]`,
  `.has-left-slot`/`.has-right-slot` → `[data-has-*-slot]`); `.slot.left-slot`/`.right-slot` →
  `.input-textarea-slot-left`/`-right`. The textarea no longer carries `dirty`/`active` classes.
- `all: unset` on the textarea also reset the browser's `white-space: pre-wrap`, so it inherited
  `normal` from the page. It now sets `white-space: pre-wrap` and `overflow-wrap: anywhere`
  explicitly, and `min-inline-size: 0` so a long unbroken string can't widen the field.
- `aria-invalid="false"` was rendered on every field without an error; it's now omitted.
  `aria-describedby=""` likewise.
- `InputTextareaField` applied its passthrough to both its root and the textarea; now its root
  only, which is `.input-textarea-field` itself (the unclassed outer `<div>` is gone).
- The hardcoded `gap: 12px` and `min-height: 6lh` became `--input-textarea-slot-gap` and
  `--input-textarea-min-height`; `--input-textarea-max-height` is new.
- Removed an unused `inputField` template ref.

## Fixed 2026-09-22: undefined tokens and dead code

Migrated from a score-1/5 state. Five undefined custom properties (wrapper padding and
placeholder font) were replaced with the tokens `InputText` uses; public `--input-textarea-*`
colour tokens were added (pitfall #14); a dead `FormUiTheme` computed, commented-out code and a
`label` pass-through to the control were removed; `defineModel` got `{ required: true }`; and
the Field story imported `reactive`, which it used without importing.

---

## Variants

### InputTextareaField

`InputTextareaField` composes `InputTextarea` with `InputLabel`, `InputDescription` (before the
control, or after the control and error when `inputVariant === "outlined"`) and `InputError`. Ids
come from `useAriaDescribedById`, so it takes `name`, not `id`. Root `.input-textarea-field`,
with `data-theme`, `data-input-variant`, `data-invalid`, `data-dirty` and `data-active`.

**Additional props over InputTextarea:**

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:error-message` | `object \| string` | (required) | Rendered via `InputError` when `field-has-error` is true. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Applied to the `.input-textarea-field` root only. |

`maxlength`, `name`, `placeholder`, `required`, `readonly`, `autocomplete`, `field-has-error`,
`theme` and `input-variant` are forwarded.

**Slots**: `descriptionHtml`, `descriptionText` (forwarded to `InputDescription`), plus
`left`/`right` (forwarded to `InputTextarea`).

```vue
<InputTextareaField
  v-model="message"
  name="message"
  label="Message"
  :maxlength="1000"
  :error-message="errors.message"
  :field-has-error="!!errors.message"
>
  <template #descriptionText>Please describe your enquiry in detail</template>
</InputTextareaField>
```
