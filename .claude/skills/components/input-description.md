# InputDescription Component

## Overview

`InputDescription` renders a form field's help text. Every `*Field` wrapper in `05.forms`
(`InputTextWithLabel`, `InputNumberField`, `InputSelectWithLabel`, `InputTextareaWithLabel`,
`InputRangeDefault`, `InputTextAsNumberWithLabel`, `SingleCheckbox`, `MultipleCheckboxes`,
`MultipleRadiobuttons`) already renders one and forwards its own `descriptionText` /
`descriptionHtml` slots into it, so consumers normally just pass those slots to the wrapper:

```vue
<InputTextWithLabel v-model="email" name="email" label="Email" :field-has-error :error-message>
  <template #descriptionText>We'll only use this for your booking confirmation</template>
</InputTextWithLabel>
```

Use `InputDescription` directly only when building a custom field wrapper.

With neither slot provided it renders nothing (no empty element, no dangling id).

---

## Props reference

> **Hyphenation rule**: write camelCase props hyphenated in templates: `:description-id`, `:field-has-error`, `:input-variant`, `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:description-id` | `string` | `""` | Rendered as the root `id`, omitted when empty. Must match the id in the control's `aria-describedby`; wrappers get it from `useAriaDescribedById(...).descriptionId`, which only adds it to `aria-describedby` when a description slot is present. |
| `:field-has-error` | `boolean` | `false` | Rendered as `data-invalid`. Styling hook only. |
| `:input-variant` | `"normal" \| "outlined" \| "underlined"` | `"normal"` | Rendered as `data-input-variant`. Styling hook only. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root, reacts to prop changes. |

## Slots

| Slot | Rendered in | Notes |
|------|-------------|-------|
| `descriptionHtml` | `<div class="input-description-html">` | Rich markup (lists, links). Rendered first. |
| `descriptionText` | `<p class="input-description-text">` | Plain text only (it's inside a `<p>`, so no block elements). |

**Forwarding slots from a wrapper**: only forward a slot when your own consumer provided it,
otherwise `InputDescription` sees an (empty) slot and renders an empty element:

```vue
<InputDescription :description-id :input-variant :field-has-error>
  <template v-if="slots.descriptionHtml" #descriptionHtml><slot name="descriptionHtml"></slot></template>
  <template v-if="slots.descriptionText" #descriptionText><slot name="descriptionText"></slot></template>
</InputDescription>
```

---

## Accessibility

- It's a plain description, not a live region: link it with `aria-describedby` on the control
  (`useAriaDescribedById` does this in every wrapper).
- `InputTextWithLabel`, `InputSelectWithLabel` and `InputTextareaWithLabel` render it **after**
  the control for the `outlined` variant and before it otherwise; both positions carry the same id.

---

## Styling

Full token table in `app/components/05.forms/input-description/CONSUMER-STYLING.md`. Public
tokens: `--input-description-color`, `--input-description-font-size`,
`--input-description-line-height`, `--input-description-slot-margin-block-start|end`,
`--input-description-slot-margin-inline`; panel tokens on the root (matching `FormFieldset`):
`--input-description-background-color`, `--input-description-margin-block|inline`,
`--input-description-padding-block|inline`, `--input-description-border`,
`--input-description-border-radius`, `--input-description-outline|outline-offset`. For a callout
look, zero the slot margins and space it with the root margins (example in CONSUMER-STYLING.md). Hooks:
`data-input-variant`, `data-invalid`.


---

## History

**Migrated 2026-09-26** (1/5 → full compliance):

- Wrappers forwarded both description slots unconditionally, so every field rendered an empty
  description element (with its id) even when no description was given. Each wrapper now forwards
  a slot only when its own consumer supplied it.
- `InputTextWithLabel` and `InputSelectWithLabel` rendered the description **twice** for the
  `outlined` variant (before and after the control); the first copy now has
  `v-if="inputVariant !== 'outlined'"`, matching `InputTextareaWithLabel`.
- The outlined-variant copies had no `description-id`, so the control's `aria-describedby`
  pointed at an id that didn't exist. They now pass it.
- Removed props that were never read: `id` (a leftover from a commented-out id computation) and
  `theme`. Wrappers also stopped passing `name`, which wasn't a prop and fell through as an
  invalid `name` attribute on the `<div>`.
- `inputVariant` and `fieldHasError` (previously accepted but unused) now render as
  `data-input-variant` / `data-invalid` styling hooks.
- Colour read `--form-description-color`, which was never declared anywhere; replaced by
  `--input-description-color` (defaults to `inherit`, same visual result). Font size, line height
  and margins promoted to public tokens with the old values as defaults.
- Added root panel tokens (background, margin, padding, border, radius, outline) matching
  `FormFieldset`. Removed `InputLabel`'s `.input-label + .input-description { margin-block-end: 0.2rem }`
  rule, which overrode the root margin token (no visual change by default: the slot's `0.8rem`
  bottom margin collapsed through and won anyway).
- An empty `descriptionId` no longer renders `id=""`. `styleClassPassthrough` now reacts to prop
  changes.
