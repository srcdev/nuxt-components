# InputLabel Component

## Overview

`InputLabel` renders a form field's `<label>`. Every labelled wrapper in `05.forms`
(`InputTextWithLabel`, `InputTextAsNumberWithLabel`, `InputNumberField`, `InputSelectWithLabel`,
`InputTextareaWithLabel`, `InputRangeDefault`, `ToggleSwitchWithLabel`,
`ToggleSwitchWithLabelInline`) already renders one from its `label` prop, so consumers normally
never use it directly.

Use `InputLabel` directly only when building a custom field wrapper:

```vue
<InputLabel :id="inputId" :input-variant :field-has-error>
  <template #textLabel>{{ label }}</template>
</InputLabel>
```

---

## Props reference

> **Hyphenation rule**: write camelCase props hyphenated in templates: `:required-text`, `:optional-icon`, `:field-has-error`, `:input-variant`, `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | required | The **control's** id, rendered as the label's `for`. The label itself gets no id. Must match the id actually on the `<input>`/`<select>`/`<textarea>` (e.g. `ToggleSwitchCore` prefixes its input id with `toggle-switch-`, so its wrappers pass `toggleSwitchId`). |
| `:required` | `boolean` | `false` | Whether the field is required. Only decides which fields the indicator marks; it doesn't set `required` on the control. Wrappers forward their own `required`. |
| `:indicator` | `"none" \| "required" \| "optional"` | `undefined` → app.config → `"none"` | Which fields get a marker. |
| `:required-text` | `string` | `undefined` → app.config → `"*"` | Required marker text. |
| `:optional-text` | `string` | `undefined` → app.config → `"(optional)"` | Optional marker text (translatable). |
| `:required-icon` | `string` | `undefined` → app.config → none | Iconify name that replaces the required text. |
| `:optional-icon` | `string` | `undefined` → app.config → none | Iconify name that replaces the visible optional text (the text stays as `.sr-only`). |
| `:field-has-error` | `boolean` | `false` | Rendered as `data-invalid`. Styling hook only. |
| `:input-variant` | `"normal" \| "outlined" \| "underlined"` | `"normal"` | Rendered as `data-input-variant`. Styling hook only. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the `<label>`, reacts to prop changes. |

## Slots

| Slot | Notes |
|------|-------|
| `htmlLabel` | Rich markup (e.g. a required marker). Rendered first. Phrasing content only: it's inside a `<label>`, so no interactive elements. |
| `textLabel` | Plain label text. |

Both render directly inside the `<label>`, no wrapper elements. Don't hardcode a required
asterisk in a slot: use the indicator below.

---

## Required / optional indicator

Resolution for every indicator prop: **explicit prop → `app.config` `srcdev.inputLabel.*` → fallback**.
Consumers normally set it once site-wide and never touch the props:

```ts
// consumer app.config.ts
export default defineAppConfig({
  srcdev: { inputLabel: { indicator: "required", requiredIcon: "mdi:asterisk" } },
});
```

- `"required"` mode: a marker on fields with `required`; `"optional"` mode: a marker on fields
  without it; `"none"`: nothing (default, so existing sites are unchanged).
- `InputTextWithLabel`, `InputTextAsNumberWithLabel`, `InputNumberField`, `InputSelectWithLabel`,
  `InputTextareaWithLabel` and `InputRangeDefault` forward `:required`.
  `ToggleSwitchWithLabel`/`ToggleSwitchWithLabelInline` pass `indicator="none"`: a switch always
  has a value, so neither marker means anything there.
- The wrappers don't expose the indicator props per field; use `app.config`.
- Text props are the i18n hook: pass translated `optionalText`/`requiredText` (or set them in
  `app.config`).

---

## Accessibility

- The `for`/`id` pairing is the accessible name for the control. If the ids don't match, the
  control has no name and clicking the label does nothing; check this whenever the control
  component derives its own id from the one you pass it.
- The required marker is `aria-hidden`: the control's own `required` attribute is what screen
  readers announce, so the control must actually carry it. The optional marker is announced, and
  keeps its text as `.sr-only` when an icon replaces it.

---

## Styling

Full token table in `app/components/05.forms/input-label/CONSUMER-STYLING.md`. Public tokens:
`--input-label-color` (defaults to `inherit`),
`--input-label-font-size`, `--input-label-font-weight`, `--input-label-line-height`,
`--input-label-margin-block`, `--input-label-margin-inline`; indicator:
`--input-label-indicator-color[-required|-optional]`, `--input-label-indicator-font-size[-required|-optional]`,
`--input-label-indicator-font-weight`, `--input-label-indicator-gap`, `--input-label-indicator-icon-size`.
Hooks: `data-input-variant`, `data-invalid`, `.input-label-indicator[data-indicator]`.

---

## History

**Migrated 2026-09-26** (1/5 → full compliance):

- Removed props that were never read: `name` and `theme`. Wrappers stopped passing them.
- Wrappers also passed a non-prop `:for`, which fell through and overrode the `for` built from
  `id`. For the text/number/select/textarea/range wrappers it was the same value (dropped). For
  `ToggleSwitchWithLabel`/`ToggleSwitchWithLabelInline` it was the only thing pointing the label
  at the real input (`toggle-switch-<id>`); they now pass `:id="toggleSwitchId"` explicitly.
- `inputVariant` moved from a bare class (`.normal`/`.underlined`, whose rules were duplicates of
  the base rule) to `data-input-variant`. `fieldHasError` (accepted but unused) now renders
  `data-invalid`.
- Colour, font size, font weight, line height and margins are public tokens with the old values
  as defaults. The colour used to read `--form-label-color`, never declared in this library;
  replaced by `--input-label-color` (defaults to `inherit`, same visual result).
- Removed the unused `--field-label-*`, `--field-description-*`, `--field-error-*` and
  `--input-line-height` globals from `04.elements/forms/02.typography.css`, left over from before
  the per-component token pattern.
- `styleClassPassthrough` now reacts to prop changes.

**2026-09-27**: added the required/optional indicator (`required`, `indicator`, `requiredText`,
`optionalText`, `requiredIcon`, `optionalIcon`, all app.config-backed under `srcdev.inputLabel`),
with wrappers forwarding `:required`.
