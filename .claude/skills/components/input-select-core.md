# InputSelectCore Component

## Overview

`InputSelectCore` is the low-level native `<select>` primitive for the `05.forms` select family.
It renders a native select with a data-driven list of `<option>`s (each optionally decorated with
an icon), an optional placeholder option, and adopts the modern CSS Customizable Select API
(`appearance: base-select`) for a fully styleable open-picker state where supported, with a
graceful CSS fallback (see "Browser support" below). It has no label, description, or
error-message rendering of its own — that's composed by the `InputSelectWithLabel` variant below.

Most consumers should reach for **InputSelectWithLabel** rather than `InputSelectCore` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Applied to the native select. |
| `:name` | `string` | (required) | Applied to the native select. |
| `:placeholder` | `string` | `""` | Renders a disabled placeholder `<option>` (selected when `modelValue` is empty). No option rendered at all when unset. |
| `:title` | `string` | `"Please select an option"` | Native `title` attribute (tooltip). |
| `:required` | `boolean` | `false` | Native `required`. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the wrapper. |
| `:input-variant` | `InputUiVariant` | `"normal"` | Adds the variant name as a class on the wrapper — `"normal"` (bordered box) and `"underlined"` (bottom-border only) have CSS; `"outlined"` doesn't (see CONSUMER-STYLING.md). Same prop/behaviour as `InputTextCore`. |
| `:field-has-error` | `boolean` | `false` | Drives `data-invalid` on the wrapper and `aria-invalid` on the select. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the select element. |
| `:aria-describedby` | `string` | `""` | Forwarded to the native select. |

### v-models

- `v-model` — `string | number | readonly number[]`, **required** (`defineModel({ required: true })`, satisfying `vue/require-default-prop` — see `project_ledger_eslint_issues_column` in memory).
- `v-model:field-data` — `IFormMultipleOptions` (`{ data: IOptionsConfig[]; total; skip; limit }`), **required**. The `data` array drives the rendered `<option>`s. The template dereferences `fieldData.data` unconditionally, so a consumer that doesn't bind `v-model:field-data` will crash on render — `required: true` documents that constraint (it's a dev-time warning only, not a runtime guard).
- `v-model:is-dirty` — `boolean`. Set to `true` on the native `change` event (never reset to `false` by this component).
- `v-model:is-active` — `boolean`. Tracks native focus/blur (`focusin`/`focusout`), toggling `.active` on the wrapper.

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/input-select/CONSUMER-STYLING.md) for the
full table with defaults.

**Common tokens:**
- `--input-select-surface` / `-surface-hover` — wrapper/select background and option-row hover background, fall back to `--theme-input-surface`/`-surface-hover`
- `--input-select-border` / `-border-hover` / `-border-focus` — border colour resting, mouse-hover outline, and `:focus-visible` outline (also the open-picker's own border/outline), fall back to `--theme-border`/`--theme-border-focus`

---

## Browser support: `appearance: base-select`

The open-picker styling (`&::picker(select)`, `:open`/`:not(:open)` states, the transition/opacity
`@starting-style` reveal) relies on the CSS Customizable Select API
(`appearance: base-select`/`::picker(select)`), a very new feature not yet supported everywhere.
The component degrades gracefully in non-supporting browsers rather than breaking: `appearance:
none` is set first (unconditionally), then overridden by `appearance: base-select` only where the
browser recognizes that value — an unsupported value is simply ignored by the CSS parser, so the
select falls back to the browser's native (unstyled) dropdown instead of losing functionality.
Per pitfall #19's general lesson (checking WebKit support specifically for load-bearing use of a
very new CSS feature, since Chrome's device-emulation mode can't catch a WebKit-only gap): this
fallback is CSS-only degradation, not a functional break like `ExpandingPanel`'s `::details-content`
case was, so it's lower risk — but the open-picker's custom border/outline/transition styling
should still be spot-checked on a real Safari session before treating it as visually final.

---

## Fixed 2026-09-22: dead functionality and prop-shape bugs

`InputSelectCore` migrated to full compliance from a `variants:true`, `eslint_issues:true`,
score-2/5 state (no tests, no skill doc, no snippet).

- **`required` prop was declared but never bound to the native `<select>`** — native HTML
  `required` validation was completely inert regardless of the prop's value. Fixed by adding
  `:required` to the select.
- **`styleClassPassthrough` prop was declared but never consumed** — no `useStyleClassPassthrough`
  call existed anywhere in the script, and the select's `class` was a hardcoded static string.
  The prop was entirely dead; a consumer passing it had no effect. Fixed by wiring up
  `useStyleClassPassthrough` and binding `elementClasses` alongside the static class.
- **`isDirty`/`isActive` models were declared and read in the wrapper's CSS class bindings
  (`{ dirty: isDirty }`, `{ active: isActive }`), but nothing ever set them** — no `focusin`/
  `focusout`/`change` handlers existed at all, unlike `InputTextareaCore`'s `updateFocus`
  pattern. The `.dirty`/`.active` CSS states could never trigger. Fixed by adding
  `@focusin`/`@focusout` (toggling `isActive`) and `@change` (setting `isDirty = true`) directly
  on the select.
- **The placeholder `<option>` used `readonly`**, which is not a valid/supported HTML attribute
  on `<option>` — a silent no-op, leaving the placeholder fully selectable as a real answer
  (defeating its purpose). Fixed by switching to `disabled`, the correct native pattern for a
  non-selectable placeholder option.
- **`theme`/`inputVariant` were typed as inline unions** (`"default" | "success" | "error" |
  "warning"` / `"normal" | "outlined" | "underlined"`) instead of importing the shared
  `FormUiTheme`/`InputUiVariant` types — aligned with the rest of `05.forms`.
- **`fieldData`'s `defineModel` used an untyped `defineModel("fieldData") as Ref<T>` cast**
  instead of the proper generic `defineModel<T>("fieldData")` call, and had no default — the
  `as` cast also hid the prop from ESLint's `vue/require-default-prop` detection entirely (it
  didn't fire on `InputSelectCore.vue`, only on `InputSelectWithLabel.vue`'s correctly-typed
  equivalent). Fixed by using the proper generic form with `{ required: true }` on both files —
  see the `v-model:field-data` note above for why `required` is the meaningful fix here (the
  template would otherwise crash on `fieldData.data` with no data bound).
- **Dead commented-out CSS** (~8 lines, a "legacy support - eg, Safari" `::after` arrow
  fallback that was never active) and a **redundant duplicate declaration**
  (`&.underlined { background-color: var(--_surface); }`, re-setting a value the unscoped base
  rule already applied unconditionally) were removed.
- **CSS token cleanup**: `--_surface`, `--_surface-hover`, `--_border-hover`, and
  `--_outline-color` were each used at exactly one point with no composition or state-swap
  behind them (`--_outline-color` was a bare alias for `--_border-focus`, per pitfall #20) — all
  four inlined directly to their public `var(--input-select-*, {default})` form at their point of
  use. `--_border` (reused across `.normal`/`.underlined`/open-picker) and `--_border-focus`
  (used directly once, plus now the open-picker's outline too) correctly stayed private.

---

## Variants

### InputSelectWithLabel

`InputSelectWithLabel` (`variants/InputSelectWithLabel.vue`) composes `InputSelectCore` with
`InputLabel`, `InputDescription` (positioned before or after the field depending on
`inputVariant === "outlined"`, matching `InputTextWithLabel`'s exact placement rule), and
`InputError`.

**Additional props over InputSelectCore:**

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:data-testid` | `string` | `"input-select-with-label"` | Sets `data-testid` on the wrapper — used for the wrapper element specifically (`:data-testid` shorthand resolves to the camelCase `dataTestid` prop, same convention as `:aria-describedby`). |
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:error-message` | `object \| string` | (required) | Rendered via `InputError` when `field-has-error` is true. |

**Slots**: `descriptionHtml`, `descriptionText` (both forwarded to `InputDescription`).

```vue
<InputSelectWithLabel
  name="colour"
  label="Favourite colour"
  v-model="colour"
  v-model:field-data="colourOptions"
  placeholder="Choose a colour"
  :error-message="errors.colour"
  :field-has-error="!!errors.colour"
>
  <template #descriptionText>Pick the colour you like best</template>
</InputSelectWithLabel>
```

`v-model` and `v-model:field-data` are both **required** — same as `InputSelectCore` above. Note
this wrapper passes `:theme="FormUiTheme"` (a local `computed`, not the raw `theme` prop) down to
`InputSelectCore`, so the theme automatically switches to `"error"` whenever `fieldHasError` is
true, regardless of the `theme` prop's own value.
