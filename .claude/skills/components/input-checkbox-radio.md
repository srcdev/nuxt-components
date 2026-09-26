# InputCheckboxRadio Component

> **Renamed 2026-09-27**: `InputCheckboxRadioCore` → `InputCheckboxRadio`,
> `InputCheckboxRadioWithLabel` → `InputCheckboxRadioField`; `InputCheckboxRadioButton` kept its
> name. Root classes: `.input-checkbox-radio-wrapper` → `.input-checkbox-radio`,
> `.input-checkbox-radio-with-label` → `.input-checkbox-radio-field`,
> `.input-checkbox-radio-options-button` → `.input-checkbox-radio-button` (full list in
> CONSUMER-STYLING.md). Tokens unchanged.

## Overview

The single checkbox or radio control that every checkbox and radio in `05.forms` is built from.
Consumers normally use the group components instead:

- `MultipleCheckboxes` / `SingleCheckbox` (`input-checkbox.md`)
- `MultipleRadiobuttons` (`input-radio.md`)

Use these three directly only for a custom group or layout:

| Component | Renders | Used by |
|---|---|---|
| `InputCheckboxRadio` | The visual square/circle stacked over a hidden native `<input>`. No label. | The other two |
| `InputCheckboxRadioField` | `<label>` with the control and a text label | `SingleCheckbox`, non-button `MultipleCheckboxes`/`MultipleRadiobuttons` |
| `InputCheckboxRadioButton` | `<label>` drawn as a button/pill: control, centred label, decorator icon | `is-button` mode of the group components |

```vue
<InputCheckboxRadioField v-model="state.rememberMe" type="checkbox" name="rememberMe" label="Remember me" />

<InputCheckboxRadioButton
  v-for="option in options"
  :id="`service-${option.value}`"
  :key="option.value"
  v-model="state.services"
  type="checkbox"
  name="services"
  :label="option.label"
  :true-value="option.value"
  :multiple-options="true"
  :is-pill="true"
/>
```

---

## InputCheckboxRadio (the control)

> **Hyphenation rule**: write camelCase props hyphenated: `:true-value`, `:false-value`, `:multiple-options`, `:field-has-error`, `:aria-describedby`, `:display-as-disc`, `:is-button`, `:input-variant`, `:style-class-passthrough`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `"checkbox" \| "radio"` | required | Can change at runtime: the input is keyed on it, so it's recreated with the right v-model handling. |
| `id` | `string` | required | Native input id; pair it with a `label[for]`. |
| `name` | `string` | required | Share one `name` across a radio group. |
| `:true-value` / `:false-value` | `string \| number \| boolean` | `true` / `false` | Checked / unchecked value. `trueValue` is also the native `value`. |
| `:multiple-options` | `boolean` | `false` | Part of a checkbox group (array model). Also drops native `required` (a group can't require every box). |
| `:required` | `boolean` | `false` | Native `required` (unless `multiple-options`). |
| `:field-has-error` | `boolean` | `false` | `aria-invalid="true"` on the input, `data-invalid` on the root. |
| `:aria-describedby` | `string` | `""` | On the input, omitted when empty. |
| `theme` | `FormUiTheme` | `"default"` | `data-theme`. |
| `:input-variant` | `InputUiVariant` | `"normal"` | `data-input-variant`; `underlined` squares off a checkbox. |
| `:is-button` | `boolean` | `false` | Set by `InputCheckboxRadioButton`: no focus outline of its own, enables `display-as-disc`. |
| `:display-as-disc` | `boolean` | `false` | Rounds a checkbox, button mode only. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | On the root, reacts to changes. |

`v-model` (**required**): a single value, or an array for a checkbox group (the control toggles its
`trueValue` in and out of the array).

Slot: `checkedIcon` replaces the default icon (`material-symbols:check-small`, or
`material-symbols:circle` for radios) shown when checked.

---

## Variants

### InputCheckboxRadioField

Same props as the control minus `id`, `isButton`; plus `label?: string` (`""`). Generates its own
id with `useId()` and links the `<label for>` to it. Slots: `checkedIcon` (forwarded),
`labelContent` (replaces the `label` text, e.g. a label containing a terms link). Root
`<label class="input-checkbox-radio-field">` with `data-invalid`.

### InputCheckboxRadioButton

Same props as the control minus `isButton` (always on), plus:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | required | Used for both the input and `label[for]`. |
| `label` | `string` | `""` | Replaced by the `labelContent` slot when given. |
| `:options-layout` | `OptionsLayout` | `"equal-widths"` | `data-options-layout`; `inline` stops the label wrapping. |
| `direction` | `"row" \| "row-reverse"` | `"row"` | `data-direction`; `row-reverse` puts the control on the right. Reacts to changes. |
| `:is-pill` | `boolean` | `false` | `data-pill`, fully rounded. |
| `:item-icon` | `string` | `"material-symbols:add-2"` | Decorator icon name. The `itemIcon` slot replaces it entirely. |

Slots: `checkedIcon`, `labelContent`, `itemIcon`.

---

## Accessibility

- A real native `<input type="checkbox|radio">` does the work: native checked state, keyboard
  (Space; arrow keys within a same-`name` radio group), form validation. It's visually hidden with
  `opacity: 0` and sized to the visible box, so it's still what gets clicked and focused.
- No `aria-checked` on the input: it's a native checkbox/radio, and ARIA in HTML forbids
  `aria-checked` there (the native state is what's announced).
- Focus: the control draws an outline on `:has(input:focus-visible)`; the button draws its own
  background and outline change instead.
- The Field and Button are `<label>` elements, so the whole row is clickable and labels the input.
  The decorator icon is `aria-hidden`.
- Transitions are off under `prefers-reduced-motion: reduce`.
- No hardcoded copy; the icon names are props or slots.

---

## Styling

Full detail in `app/components/05.forms/input-checkbox-radio/CONSUMER-STYLING.md`. Tokens:
`--input-checkbox-*` (control colours, label colour/padding, transition duration) and
`--input-checkbox-button-*` (button colours, radius, pill radius, gap, paddings); shared geometry
`--input-checked-element-size`, `--input-checked-icon-size`, `--input-checked-icon-gap`,
`--input-checkbox-decorator-icon-size`. Hooks: `data-type`, `data-input-variant`, `data-theme`,
`data-button`, `data-display-as-disc`, `data-invalid`, `data-pill`, `data-direction`,
`data-options-layout`.

---

## History

**Migrated 2026-09-27** (3/5 → full compliance):

- Renamed (see top). Every state class became a data attribute (`.error`, `.button`, `.checkbox`,
  `.inline` etc. collided with common consumer CSS).
- A runtime `type` switch left the checkbox v-model handler attached to the input, so a radio kept
  toggling values in the old array; the input is now keyed on `type`.
- Removed `aria-checked` from the native input (and the `isChecked` computed that only fed it) and
  the `is-button` input class, which nothing styled.
- `direction` on the button was copied into a plain `ref` at setup, so changing it did nothing; now
  `data-direction`.
- The decorator icon and the button's checked icon were sized with `width`/`height` (ignored,
  pitfall #24); now `font-size`, so they change size for the first time.
- The Field no longer takes `id` or `optionsLayout` (its id is always generated; the layout class
  set a variable nothing read); the group components stopped passing them, so the id no longer
  falls through onto the `<label>`. Removed its non-existent `body-normal*` utility classes.
  `label` is optional on both Field and Button.
- The button forwards `inputVariant` (the group components already passed it, but it fell through
  as an attribute). New `itemIcon` prop.
- Button radius, gap, paddings and the Field label colour became tokens; label colour default moved
  from `--colour-text-default` to `--theme-text`. Removed an undeclared `--_box-shadow` and an
  invalid unitless `min-height`.
