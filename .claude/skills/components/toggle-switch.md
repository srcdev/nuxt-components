# ToggleSwitch Component

> **Renamed 2026-10-16**: `ToggleSwitchCore` → `ToggleSwitch`, `ToggleSwitchWithLabel` →
> `ToggleSwitchField`; `ToggleSwitchWithLabelInline` was removed in favour of
> `layout="inline"` on `ToggleSwitchField`. DOM classes `.toggle-switch-core` → `.toggle-switch`,
> `.toggle-switch-with-label` → `.toggle-switch-field` (full list in CONSUMER-STYLING.md). Skill
> doc renamed from `toggle-switch-core.md`. Consumer apps use `ToggleSwitchWithLabel`; list their
> edits privately and apply them when each upgrades.

## Overview

`ToggleSwitch` is the low-level on/off switch for the `05.forms` toggle family: a visually hidden
native `<input type="checkbox" role="switch">` (real keyboard and form semantics) plus a
decorative track and thumb (`aria-hidden`), with optional icon slots inside the thumb. It has no
label, description or error rendering of its own; that's `ToggleSwitchField` below.

Most consumers should reach for **ToggleSwitchField**.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`, `:true-value`, `:false-value`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Builds the native input's id: `toggle-switch-${id}`. Point your own `<label for>` at that. |
| `:name` | `string` | (required) | Applied to the native checkbox. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:field-has-error` | `boolean` | `false` | `aria-invalid="true"` on the checkbox (omitted otherwise), `data-invalid` on the root, and `data-theme="error"` whatever `theme` says. |
| `:true-value` / `:false-value` | `string \| number \| boolean` | `true` / `false` | The two values `v-model` toggles between. A model value equal to neither shows as off. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra classes on the root. Reacts to changes. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the root (unless `field-has-error`). |
| `:round` | `boolean` | `true` | Pill (`100vw` radius) or rounded square (`0.4rem`); `--toggle-switch-border-radius` overrides both. |
| `:aria-describedby` | `string` | `""` | Forwarded to the checkbox; omitted when empty. |

### v-model

- `v-model` — `string | number | boolean`, **required** (`defineModel({ required: true })`).

### Slots

- `iconOn` / `iconOff` — replace the default `material-symbols:circle-outline` icon shown inside
  the thumb in each state. Decorative: the whole track is `aria-hidden`.

### Interaction

Clicking the track toggles the value. Clicks that land on the input itself (a label click, Space,
or a click on the input) are left to `v-model`, so each action toggles exactly once.

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/toggle-switch/CONSUMER-STYLING.md) for the
full table with defaults and the state hooks.

**Common tokens:**

- `--toggle-switch-surface` / `-surface-hover` — track background resting/hover
- `--toggle-switch-border` / `-border-focus` — track border, and the `:focus-visible` outline
- `--toggle-switch-symbol-surface-off` / `-symbol-surface-on` — thumb background per state
- `--toggle-switch-border-radius`, `--toggle-switch-track-width` — shape and width overrides
- `--toggle-switch-field-inline-gap` — space between label and switch in the inline layout

**State hooks** (on `.toggle-switch`): `data-checked`, `data-invalid`, `data-theme`. On
`.toggle-switch-field`: `data-layout`, `data-invalid`, `data-theme`.

The thumb's slide respects `prefers-reduced-motion`.

---

## Changed 2026-10-16: rename, switch role, inline layout

- Renamed to the Control/Field convention (note at the top). `ToggleSwitchWithLabelInline` was
  folded into `ToggleSwitchField` as `layout="inline"`, which also gives the inline row
  description, error and `required` support it never had.
- The checkbox now has `role="switch"`, so screen readers announce "switch, on/off" rather than
  a checkbox. The decorative track is `aria-hidden`.
- `aria-invalid="false"` was rendered on every switch without an error; now omitted.
- Generic inner classes (`.symbol-wrapper`, `.symbol`, `.symbol-icon`, `.icon-on`/`.icon-off`,
  state classes `.checked`/`.active`, the unused `.use-default-icons`) became
  `.toggle-switch-track`, `-thumb`, `-icon`, `-icon-on`/`-icon-off` and `[data-checked]`
  (pitfall #16). The input got `.toggle-switch-input`; the default icon lost its `.icon` class.
- The Fields' label passthrough used `input-switch-label`, so the `.toggle-switch-label` rules
  never matched; the label now gets `.toggle-switch-label`. The inline variant's `nowrap` (dead
  for the same reason) is gone: long labels wrap.
- Clicking the input bubbled to the wrapper's click handler as well as updating `v-model`; it
  happened to land on the right value. The wrapper handler now ignores clicks on the input.
- Removed a redundant `:checked` binding next to `v-model`, and a duplicate `outline` in the
  track's transition list.
- `styleClassPassthrough` reacts to prop changes on both components.

## Fixed 2026-09-23

Migrated from a score-3/5 state: the `round` prop was never declared on the control (added, with
`--toggle-switch-border-radius`); `fieldHasError` didn't switch `data-theme`; an invalid `for` on
a `<div>` was removed; `defineModel` got `{ required: true }`; dead `--_transition-duration`
tokens were removed; `line-height: 0` on the icon holder keeps slotted icons square; story theme
options were corrected to `FormUiTheme`.

---

## Variants

### ToggleSwitchField

`ToggleSwitchField` composes `ToggleSwitch` with `InputLabel` (no required/optional indicator), an
optional description (`InputDescription`, class `.toggle-switch-description`) and `InputError`.
DOM order is label, description, switch, error in both layouts. Root `.toggle-switch-field`.

**Additional props over ToggleSwitch** (it takes no `id`; ids come from `useId()`):

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:label` | `string` | (required) | Rendered via `InputLabel` (class `.toggle-switch-label`). |
| `:layout` | `"stacked" \| "inline"` | `"stacked"` | `stacked`: label, description, switch, error in one column. `inline`: label and switch on one row (a grid, `data-layout="inline"`), description and error below. |
| `:label-weight` | `LabelWeight` | bold when stacked, normal when inline | `body-normal` / `body-normal-semibold` / `body-normal-bold` class on the label. |
| `:error-message` | `object \| string` | `""` | Rendered via `InputError` when `field-has-error` is true. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Applied to the root only. |

`name`, `required`, `field-has-error`, `true-value`, `false-value`, `theme` and `round` are
forwarded. The root's `data-theme` switches to `error` with `field-has-error`, like the control's.

**Slots**: `descriptionText` / `descriptionHtml` (via `InputDescription`), `iconOn`, `iconOff`.
The switch's `aria-describedby` lists the description id when a description slot is filled and the
error id when `field-has-error` is true.

```vue
<ToggleSwitchField
  v-model="notificationsEnabled"
  name="notifications"
  label="Enable notifications"
  :error-message="errors.notifications"
  :field-has-error="!!errors.notifications"
>
  <template #descriptionText>Sends at most one email a week.</template>
</ToggleSwitchField>

<ToggleSwitchField v-model="darkMode" name="darkMode" label="Dark mode" layout="inline" />
```

The `description` slot was removed on 2026-09-29; use `descriptionText` or `descriptionHtml`.
