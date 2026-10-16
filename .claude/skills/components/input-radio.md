# MultipleRadiobuttons Component

## Overview

`MultipleRadiobuttons` (folder `05.forms/input-radio`) renders a single-choice group: a
`FormFieldset` with `role="radiogroup"` and a legend, an optional description, one radio per
option in `fieldData.data`, and an `InputError`. It's the single-choice sibling of
`MultipleCheckboxes` (see `input-checkbox.md`) and takes the same shape of props and data.

```vue
<MultipleRadiobuttons
  v-model="state.enquiryType"
  v-model:field-data="enquiryTypeOptions"
  name="enquiryType"
  legend="What's your enquiry about?"
  :required="true"
  :error-message="errors.enquiryType ?? ''"
  :field-has-error="Boolean(errors.enquiryType)"
  options-layout="inline"
>
  <template #descriptionText>Pick the closest match.</template>
</MultipleRadiobuttons>
```

---

## Props reference

> **Hyphenation rule**: write camelCase props hyphenated in templates: `:field-has-error`, `:is-button`, `:is-pill`, `:options-layout`, `:input-variant`, `:style-class-passthrough`.

| Prop (template form) | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | (required) | Shared `name` of every radio (so they form one native group: arrow-key navigation, one tab stop), and the base for the description/error ids. |
| `legend` | `string` | (required) | Fieldset `<legend>` text. |
| `:error-message` | `string \| object` | (required) | Pass `""` when there's no error. |
| `:field-has-error` | `boolean` | `false` | Shows the error and links it from each radio's `aria-describedby`. |
| `:required` | `boolean` | `false` | Native `required` on every radio. |
| `:is-button` | `boolean` | `false` | Button-style options (`InputCheckboxRadioButton`) instead of radio + label. |
| `:is-pill` | `boolean` | `false` | Pill shape, only with `is-button`. |
| `:direction` | `"row" \| "row-reverse"` | `"row"` | Icon/label order, only with `is-button`. |
| `:options-layout` | `OptionsLayout` | `"equal-widths"` | `"equal-widths"` (auto-fit grid sized to the longest label), `"inline"` (wrapping row) or `"block"` (column). Rendered as `data-options-layout` on the items container. |
| `:theme` | `FormUiTheme` | `"default"` | Passed to each radio. |
| `:input-variant` | `InputUiVariant` | `"normal"` | Passed to each radio, the description and the error. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Classes on the root `<fieldset>`; updates when the prop changes. |
| `data-testid` | `string` | `"multiple-radio-buttons"` | On the root `<fieldset>`. |

### v-model

- `v-model`: the selected option's `value`, **required**. Start it at `""` (or `undefined`) for no selection.
- `v-model:field-data`: `IFormMultipleOptions` (`{ data: [{ id, name, value, label }], ... }`), **required**. Keep it a plain `ref`, not a `computed`, since it's a two-way model. Each item's `name` is ignored: the group `name` prop is used for every radio.

### Slots

| Slot | Notes |
|---|---|
| `descriptionText` / `descriptionHtml` | Help text between the legend and the options, linked via `aria-describedby`. Nothing renders without them. |
| `checkedIcon` | Icon inside the checked radio. |
| `itemIcon` | Icon in button-style options (default `material-symbols:add-2`). |

---

## Accessibility

- `role="radiogroup"` on the fieldset, named by its `<legend>`.
- All radios share one `name`, so the browser treats them as one group: a single tab stop and
  arrow keys to move the selection.
- Each radio is labelled by its option label (`label[for]`). Description and error ids are on
  every radio's `aria-describedby`.
- No hardcoded copy: legend, labels, description and error text all come from props, data or slots.

---

## Styling

Full detail in `app/components/05.forms/input-radio/CONSUMER-STYLING.md`. Public tokens:
`--multiple-radiobuttons-gap`, `--multiple-radiobuttons-margin-block-start`. Hook:
`.multiple-radiobuttons-items[data-options-layout]`. Radio visuals are `--input-checkbox-*`
tokens from `input-checkbox-radio`.

---

## History

**Migrated 2026-09-27** (1/5 → full compliance):

- Each radio's `name` was `${name}-${item.name}`, so grouping (single tab stop, arrow keys,
  `required` validation) only worked when every data item repeated the same `name`. It's now
  the group `name` prop for every radio. Native form submissions see `name` instead of the old
  doubled value (e.g. `enquiryType` rather than `enquiryType-enquiryType`).
- Removed props that were never read: `label` (was required), `placeholder`, `multipleOptions`,
  `equalCols`, `displayAsLozenge`. Consumers still passing `label` should drop it.
- `options-layout` moved from a bare class (`.inline`/`.block`/`.equal-widths`, collision-prone)
  to `data-options-layout`; `MultipleCheckboxes` and `SingleCheckbox` got the same change.
- Gap and top margin are public tokens. The label-width measurement no longer includes a
  selector for a class that doesn't exist. `fieldData` is a typed required model.

**Stress pass 2026-10-16**:

- Button-mode radio ids were `${name}-${item.value}`, so two groups sharing a `name` got duplicate
  ids and a value with spaces made an invalid one (CLAUDE.md pitfall 30). `MultipleRadiobuttons`
  no longer passes an `id`; `InputCheckboxRadioButton` generates one with `useId()`.
- The root fieldset sets `min-inline-size: 0` and `overflow-wrap: anywhere`, and equal-width
  columns are capped at `min(100%, ...)`, so long legends, labels and errors wrap inside a narrow
  column (same fix as `MultipleCheckboxes`). No line-clamp tokens: the legend, option labels and
  error must stay readable.
- `styleClassPassthrough` is watched instead of read once at mount.
- The spec unmounts every wrapper in `afterEach`; the story moved to `StoryObj` with Docs
  descriptions, `CanvasSwitcher` and a `StressTest` story, and its gap control is labelled as a
  story-only CSS token.
