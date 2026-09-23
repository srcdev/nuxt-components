# ToggleSwitchCore Component

## Overview

`ToggleSwitchCore` is the low-level pill-shaped (or square, via `round`) toggle switch primitive
for the `05.forms` toggle family. It renders a visually-hidden native `<input type="checkbox">`
(kept in the DOM for real keyboard/checkbox semantics) plus a styled track/thumb visual, with
optional icon slots shown inside the thumb for the on/off states. It has no label, description, or
error-message rendering of its own — that's composed by the `ToggleSwitchWithLabel` and
`ToggleSwitchWithLabelInline` variants below.

Most consumers should reach for **ToggleSwitchWithLabel** or **ToggleSwitchWithLabelInline** rather
than `ToggleSwitchCore` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`, `:true-value`, `:false-value`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Combined with a fixed prefix to build the native input's `id` (`toggle-switch-${id}`). |
| `:name` | `string` | (required) | Applied to the native checkbox. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:field-has-error` | `boolean` | `false` | Drives `aria-invalid` on the checkbox, and switches `data-theme` to `"error"` regardless of the `theme` prop's own value. |
| `:true-value` / `:false-value` | `string \| number \| boolean` | `true` / `false` | The two values `v-model` toggles between. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root element. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the root (superseded by `"error"` when `field-has-error` is true — see above). |
| `:round` | `boolean` | `true` | `true` renders a pill-shaped track/thumb (`border-radius: 100vw`); `false` renders a rounded-square shape (`border-radius: 0.4rem`). See the `--toggle-switch-border-radius` token in CONSUMER-STYLING.md to override the exact value either state produces. |
| `:aria-describedby` | `string` | `""` | Forwarded to the native checkbox. |

### v-model

- `v-model` — `string | number | boolean`, **required** (`defineModel({ required: true })`, satisfying `vue/require-default-prop` — see `project_ledger_eslint_issues_column` in memory).

### Slots

- `iconOn` / `iconOff` — replace the default `material-symbols:circle-outline` icon shown inside the thumb for each state. Providing either slot switches off the `use-default-icons` wrapper class (checked via `useSlots()`, so this only reacts to slot *presence*, not conditional slot content).

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/toggle-switch/CONSUMER-STYLING.md) for the
full table with defaults.

**Common tokens:**
- `--toggle-switch-surface` / `-surface-hover` — track background resting/hover, fall back to `--theme-checkbox-symbol-surface`/`--theme-surface-subtle`
- `--toggle-switch-border` / `-border-focus` — track border colour, and `:focus-visible` outline colour, fall back to `--theme-border`/`--theme-border-focus`
- `--toggle-switch-symbol-surface-off` / `-symbol-surface-on` — thumb background unchecked/checked
- `--toggle-switch-border-radius` — track and thumb shape; see the `round` prop above

---

## Fixed 2026-09-23: dead functionality and story bugs

`ToggleSwitchCore` (and its two variants) migrated to full compliance from a `variants:true`,
`eslint_issues:true`, score-3/5 state (no tests, no skill doc).

- **`round` prop was completely dead** — both variants declared and forwarded it to
  `ToggleSwitchCore`, and Storybook's `SquareShape` story existed specifically to demonstrate
  `round: false`, but `ToggleSwitchCore` never declared the prop at all, so it silently fell
  through as an inert `round` DOM attribute on the root `<div>` and the track/thumb stayed pill-shaped
  regardless. Fixed by adding `round` to `ToggleSwitchCore` and wiring it to a new
  `--toggle-switch-border-radius` token (100vw when round, 0.4rem when square).
- **`fieldHasError` didn't switch the component's theme** — `ToggleSwitchCore` and
  `ToggleSwitchWithLabel` both computed an error-aware theme value but bound `data-theme` to the
  raw `theme` prop instead of that computed, so this library's `[data-theme="error"]` global
  token overrides never applied when a consumer set `fieldHasError`. Fixed by binding `data-theme`
  to the computed value in both files.
- **An invalid `for` attribute on a `<div>`** (`.toggle-switch-wrapper`) was removed — `for` is
  only a valid HTML attribute on `<label>`/`<output>`, so it was inert dead markup; the real
  label association is via `InputLabel`'s own `for`/`id` wiring in the variants.
- **`defineModel` had no default**, tripping `vue/require-default-prop` (a known false-positive
  for `defineModel` — see `project_ledger_eslint_issues_column` in memory) — fixed with
  `{ required: true }` across `ToggleSwitchCore` and both variants, since a checkbox genuinely
  can't be meaningfully empty.
- **Two dead, unread `--_transition-duration` private tokens** (one per variant) were removed —
  nothing in either variant's own CSS or `ToggleSwitchCore`'s ever read them; the actual
  transition durations are hardcoded `0.4s` literals inside `ToggleSwitchCore`.
- **Custom `iconOn`/`iconOff` slot content could render as a non-square box, throwing off
  centering** — `.symbol-icon` is `display: grid; place-content: center;`, and its single
  auto-sized track shrink-wraps to the slotted content's own box. A plain inline element (e.g. a
  `<span>` wrapping a 16×16 SVG, as in the `WithCustomIcons` stories) sizes to its line box's
  leading rather than its intrinsic height, rendering as ~16×20 instead of 16×16. Fixed by adding
  `line-height: 0` to `.symbol-icon`, which collapses that leading for whatever markup a consumer
  slots in. The default icon (`@nuxt/icon`'s `Icon` component) wasn't affected, since iconify sets
  its own sizing/`vertical-align` internally.
- **All three story files' `theme` control listed the wrong option set**
  (`["primary", "secondary", "tertiary", "ghost", "error", "success", "warning"]`, none of which
  match `FormUiTheme`) — fixed to the real `["default", "success", "error", "warning"]`.
  `ToggleSwitchWithLabelInline.stories.ts`'s `InlineFormExample` story also passed the now-invalid
  `theme="secondary"` directly — fixed to `"default"`.

---

## Variants

### ToggleSwitchWithLabel

`ToggleSwitchWithLabel` (`variants/ToggleSwitchWithLabel.vue`) composes `ToggleSwitchCore` with
`InputLabel`, an optional `description` slot, and `InputError`.

**Additional props over ToggleSwitchCore:**

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:error-message` | `object \| string` | `""` | Rendered via `InputError` when `field-has-error` is true. |

Note this wrapper passes `id`/`name`/`required`/`field-has-error`/`true-value`/`false-value`/
`theme`/`round`/`aria-describedby` straight through to `ToggleSwitchCore`; `id` is a self-generated
`useId()` value, not a prop — consumers don't set it directly.

**Slots**: `description`, `iconOn`, `iconOff` (the latter two forwarded to `ToggleSwitchCore`).

```vue
<ToggleSwitchWithLabel
  name="notifications"
  label="Enable notifications"
  v-model="notificationsEnabled"
  :error-message="errors.notifications"
  :field-has-error="!!errors.notifications"
>
  <template #description>Turn this on to receive notifications</template>
</ToggleSwitchWithLabel>
```

### ToggleSwitchWithLabelInline

`ToggleSwitchWithLabelInline` (`variants/ToggleSwitchWithLabelInline.vue`) composes
`ToggleSwitchCore` with `InputLabel` laid out inline (label and switch side by side, no
description/error-message support — this variant is for compact settings-row usage).

**Additional props over ToggleSwitchCore:**

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:label-weight` | `LabelWeight` (`"normal" \| "semi-bold" \| "bold"`) | `"normal"` | Maps to a `body-normal`/`body-normal-semibold`/`body-normal-bold` class on the label. |

This variant has no `required`/`field-has-error`/`error-message` props — it never claimed error-state
support, unlike `ToggleSwitchWithLabel`.

**Slots**: `iconOn`, `iconOff` (forwarded to `ToggleSwitchCore`).

```vue
<ToggleSwitchWithLabelInline name="darkMode" label="Dark mode" v-model="darkModeEnabled" />
```
