# InputSelect Component

> **Renamed 2026-10-16**: `InputSelectCore` → `InputSelect`, `InputSelectWithLabel` →
> `InputSelectField` (DOM classes `.input-select-core` → `.input-select`,
> `.input-select-with-label` → `.input-select-field`; full class list in CONSUMER-STYLING.md).
> Skill doc renamed from `input-select-core.md`. A consumer app uses both old names; list its edits
> privately and apply them when it upgrades.

## Overview

`InputSelect` is the low-level native `<select>` primitive for the `05.forms` select family.
It renders a native select with a data-driven list of `<option>`s (each optionally decorated with
an icon), an optional placeholder option, and adopts the modern CSS Customizable Select API
(`appearance: base-select`) for a fully styleable open-picker state where supported, with a
graceful CSS fallback (see "Browser support" below). It has no label, description, or
error-message rendering of its own — that's composed by the `InputSelectField` variant below.

Most consumers should reach for **InputSelectField** rather than `InputSelect` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Applied to the native select. |
| `:name` | `string` | (required) | Applied to the native select. |
| `:placeholder` | `string` | `""` | Renders a disabled placeholder `<option>`, selected while `modelValue` is `""`, `null` or `undefined` (not `0`). No option rendered at all when unset. |
| `:title` | `string` | `"Please select an option"` | Native `title` attribute (tooltip). Visitor-facing copy: pass a translated string. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the wrapper. |
| `:input-variant` | `InputUiVariant` | `"normal"` | Sets `data-input-variant` on the wrapper. `"normal"` (bordered box) and `"underlined"` (bottom border only) have CSS; `"outlined"` doesn't. |
| `:field-has-error` | `boolean` | `false` | `data-invalid` on the wrapper and `aria-invalid="true"` on the select. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the select element. Reacts to changes. |
| `:aria-describedby` | `string` | `""` | Forwarded to the native select; omitted when empty. |

### v-models

- `v-model` — `string | number | readonly number[]`, **required** (`defineModel({ required: true })`, satisfying `vue/require-default-prop` — see `project_ledger_eslint_issues_column` in memory).
- `v-model:field-data` — `IFormMultipleOptions` (`{ data: IOptionsConfig[]; total; skip; limit }`), **required**. The `data` array drives the rendered `<option>`s; only `data` is read. The template dereferences `fieldData.data` unconditionally, so a consumer that doesn't bind it crashes on render. A one-way `:field-data` works too: the component never writes it.
- `v-model:is-dirty` — `boolean`. Set to `true` on the native `change` event (never reset to `false` by this component). Reflected as `data-dirty` on the wrapper.
- `v-model:is-active` — `boolean`. Tracks native focus/blur (`focusin`/`focusout`). Reflected as `data-active` on the wrapper.

### Option icons

An `IOptionsConfig` item with `icon` renders an `<Icon class="input-select-option-icon">`
(`aria-hidden`) before its label. It only shows where `appearance: base-select` is supported; a
native dropdown renders option text only. Labels render as text, never as markup.

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/input-select/CONSUMER-STYLING.md) for the
full table with defaults and the state hooks.

**Common tokens:**

- `--input-select-surface` / `-surface-hover` — wrapper/select background and option-row hover background
- `--input-select-text-color` — select text colour
- `--input-select-border` / `-border-hover` / `-border-focus` — border colour resting, mouse-hover outline, and `:focus-visible` outline (also the open picker's border/outline)
- `--input-select-option-gap` / `-option-icon-size` — option icon spacing and size

**State hooks** (on `.input-select-wrapper`): `data-input-variant`, `data-theme`, `data-invalid`,
`data-dirty`, `data-active`.

---

## Browser support: `appearance: base-select`

The open-picker styling (`&::picker(select)`, `:open`/`:not(:open)` states, the transition/opacity
`@starting-style` reveal) relies on the CSS Customizable Select API
(`appearance: base-select`/`::picker(select)`), a very new feature not yet supported everywhere.
`appearance: none` is set first, then overridden by `appearance: base-select` only where the
browser recognises that value, so elsewhere (including Safari 16) the select falls back to the
browser's native dropdown with full functionality. This is decorative degradation, not a
functional break like `ExpandingPanel`'s `::details-content` case (pitfall #19), but the
open-picker styling should still be spot-checked on a real Safari session before treating it as
visually final.

---

## Changed 2026-10-16: rename, state hooks, stress fixes

- Renamed to the Control/Field convention (see the note at the top).
- State classes (`.normal`/`.underlined`/`.outlined`, `.dirty`, `.active`, `.error`) became data
  attributes, so a consumer's unlayered `.error` rule can't restyle the field.
- The placeholder option used `:selected="!modelValue"`, so a model value of `0` also marked the
  placeholder selected. It now checks for an empty value only.
- `aria-describedby=""` was rendered when no description id was passed; it's now omitted.
- `styleClassPassthrough` now reacts to prop changes (it was read once at setup).
- `InputSelectField` applied its passthrough to the inner select; it now applies it to its own
  root only. It also gained a `title` prop (forwarded), and its root is `.input-select-field`
  itself rather than an unclassed outer `<div>` around it.
- New public tokens: `--input-select-text-color`, `--input-select-option-gap`,
  `--input-select-option-icon-size`.
- Long option labels wrap in the open picker, and the Field wraps long label, description and
  error copy. `StressTest` stories on both components.

## Fixed 2026-09-22: dead functionality and prop-shape bugs

Migrated from a `variants:true`, `eslint_issues:true`, score-2/5 state.

- `required` and `styleClassPassthrough` were declared but never bound.
- `isDirty`/`isActive` were read but nothing set them; `@focusin`/`@focusout`/`@change` added.
- The placeholder option used `readonly` (not valid on `<option>`); switched to `disabled`.
- `theme`/`inputVariant` moved to the shared `FormUiTheme`/`InputUiVariant` types; `fieldData`
  moved from an `as Ref<T>` cast to `defineModel<T>("fieldData", { required: true })`.
- Dead commented-out CSS and single-use private tokens removed (pitfall #20).

---

## Variants

### InputSelectField

`InputSelectField` (`InputSelectField.vue`) composes `InputSelect` with `InputLabel`,
`InputDescription` (before the control, or after the control and error when
`inputVariant === "outlined"`, matching `InputTextWithLabel`'s placement rule), and `InputError`.
Ids for the label, description and error come from `useAriaDescribedById`.

**Additional props over InputSelect** (it takes no `id`; the id is generated):

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:data-testid` | `string` | `"input-select-field"` | Sets `data-testid` on the root. (Was `"input-select-with-label"` until 2026-10-16.) |
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:error-message` | `object \| string` | (required) | Rendered via `InputError` when `field-has-error` is true. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Applied to the `.input-select-field` root only, not the inner select. |

`name`, `placeholder`, `title`, `required`, `field-has-error`, `theme` and `input-variant` are
forwarded. While `field-has-error` is set, the inner `InputSelect` gets `theme="error"` whatever
the `theme` prop says; the Field root's own `data-theme` keeps the prop value.

**Slots**: `descriptionHtml`, `descriptionText` (both forwarded to `InputDescription`).

```vue
<InputSelectField
  v-model="colour"
  v-model:field-data="colourOptions"
  name="colour"
  label="Favourite colour"
  placeholder="Choose a colour"
  :error-message="errors.colour"
  :field-has-error="!!errors.colour"
>
  <template #descriptionText>Pick the colour you like best</template>
</InputSelectField>
```

`v-model` and `v-model:field-data` are both **required**, same as `InputSelect` above.
