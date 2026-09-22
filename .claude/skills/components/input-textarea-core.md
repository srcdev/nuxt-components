# InputTextareaCore Component

## Overview

`InputTextareaCore` is the low-level native `<textarea>` primitive for the `05.forms` multi-line
text family. It renders a single native textarea with left/right decorative slots. It has no
label, description, or error-message rendering of its own — that's composed by the
`InputTextareaWithLabel` variant below.

Most consumers should reach for **InputTextareaWithLabel** rather than `InputTextareaCore`
directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Applied to the native textarea. |
| `:name` | `string` | (required) | Applied to the native textarea. |
| `:maxlength` | `number` | `255` | Native `maxlength`. |
| `:placeholder` | `string` | `""` | Native `placeholder`. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the wrapper. |
| `:input-variant` | `InputUiVariant` | `"normal"` | Adds the variant name as a class on the wrapper — `"normal"` (bordered box) and `"underlined"` (bottom-border only) have CSS; `"outlined"` doesn't (see CONSUMER-STYLING.md). Same prop/behaviour as `InputTextCore`. |
| `:field-has-error` | `boolean` | `false` | Drives `data-invalid` on the wrapper and `aria-invalid` on the textarea. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the textarea element. |
| `:aria-describedby` | `string` | `""` | Forwarded to the native textarea. |

### v-models

- `v-model` — `string | number | readonly string[] | null | undefined`, **required**
  (`defineModel({ required: true })`, satisfying `vue/require-default-prop` the same way as
  `InputRangeCore`/`InputNumberCore` — see `project_ledger_eslint_issues_column` in memory).
  "Required" here means a consumer must bind `v-model`, not that the value can't be an empty
  string — `""` is a perfectly valid textarea value.
- `v-model:is-dirty` — `boolean`. Set once by `InputTextareaWithLabel` the first time the value
  becomes non-empty (never reset back to `false` by this component).
- `v-model:is-active` — `boolean`. Tracks native focus/blur (`focusin`/`focusout`), toggling
  `.active` on the wrapper and textarea.

---

## Slots

| Slot | Notes |
|------|-------|
| `left` | Rendered before the textarea (decorative — e.g. an icon). Adds `has-left-slot` to the wrapper. |
| `right` | Rendered after the textarea (decorative). Adds `has-right-slot` to the wrapper. |

Unlike `InputNumberCore`/`InputRangeCore`, these slots have no built-in `InputButtonCore`
divider/embedded-button styling — they're plain decorative content (see the Storybook stories,
which use emoji), not a stepper control.

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/input-textarea/CONSUMER-STYLING.md) for
the full table with defaults.

**Common tokens:**
- `--input-textarea-surface` — wrapper background, falls back to `--theme-input-surface`
- `--input-textarea-border` / `-border-hover` / `-border-focus` — border colour resting, mouse-hover outline, and `:focus-visible` outline, fall back to `--theme-border`/`--theme-border-focus`
- `--input-textarea-text-color` — textarea text colour, falls back to `--theme-input-text-color-normal`
- `--input-textarea-placeholder-color` — placeholder text colour, falls back to `--theme-input-placeholder`

---

## Fixed 2026-09-22: undefined tokens and dead code

`InputTextareaCore` migrated to full compliance from a `variants:true`, `eslint_issues:true`,
score-1/5 state (no public tokens, no CONSUMER-STYLING.md, no tests, no skill doc, no snippet).

- **Silently broken styling from undefined CSS custom properties** (same bug class as pitfall #21
  and `InputRangeCore`'s dead `--theme-form-range-accent-color`): the wrapper's `padding-inline`
  read `--element-decorator-padding-inline`, and the placeholder's `font-size`/`font-style`/
  `line-height`/`font-weight` read `--input-placeholder-font-size`/`-font-style`/`-line-height`/
  `-font-weight` — **none of these five custom properties were declared anywhere in the
  codebase**. Per the CSS spec, an undefined `var()` with no fallback makes the whole declaration
  invalid, so all five silently fell back to the browser/inherited default instead of the intended
  design. Fixed by switching to the tokens `InputTextCore` actually uses for the same purpose:
  `--input-padding-inline` for the wrapper padding, and `--theme-input-placeholder-font-size` +
  hardcoded `italic`/`1`/`normal` for the placeholder (matching `InputTextCore`'s placeholder rule
  exactly — those three placeholder sub-properties aren't tokenized there either).
- **Zero public `--input-textarea-*` tokens existed at all** — every colour value read a
  `--theme-*` global directly, with no component-level override point (the exact gap pitfall #14
  describes for early `05.forms` components). Added the full set matching `InputTextCore`'s shape:
  `--input-textarea-surface`, `-border`, `-border-hover`, `-border-focus`, `-text-color`,
  `-placeholder-color`.
- **Dead code**: both `InputTextareaCore` and `InputTextareaWithLabel` declared
  `const FormUiTheme = computed(() => props.fieldHasError ? "error" : props.theme);` — a value
  binding that shadows the imported `FormUiTheme` *type* import of the same name, and is never
  referenced anywhere in either file (the template's `:theme` shorthand resolves straight from
  `defineProps`). Removed both. `InputTextareaWithLabel` also had ~5 lines of commented-out dead
  code (an old, hand-rolled `id`/`errorId`/`ariaDescribedby` implementation, superseded by
  `useAriaDescribedById` right below it) — removed. (The identical dead `FormUiTheme` computed
  still exists in `InputTextCore`/`InputTextWithLabel` themselves — out of scope for this pass
  since those weren't being touched, but worth cleaning up next time either is migrated.)
- **`InputTextareaWithLabel` passed `:label` down to `InputTextareaCore`**, which has no `label`
  prop (matching `InputTextCore`, which doesn't have one either) — it fell through as a
  meaningless raw `label="..."` HTML attribute on the wrapper `<div>`. Removed the pass-through;
  `InputLabel` (which does have a real `label` concept) already renders it correctly. Covered by
  a regression test.
- **`defineModel()` had no default**, tripping `vue/require-default-prop` in both files — fixed
  with `{ required: true }`, same pattern as `InputRangeCore`/`InputNumberCore` (see the v-model
  note above for why this is still correct even though an empty string is a valid value here).
- **`InputTextareaWithLabel.stories.ts` used `reactive()` in two render functions
  (`AllVariants`/`FormExamples`) without importing it** — only `computed` was imported from
  `"vue"`. This library's `.ts` Storybook files need Vue reactivity APIs imported explicitly (no
  Nuxt auto-import outside `.vue` files) — a real runtime `ReferenceError` waiting to happen the
  first time either story rendered. Fixed by adding `reactive` to the existing `computed` import.

---

## Variants

### InputTextareaWithLabel

`InputTextareaWithLabel` (`variants/InputTextareaWithLabel.vue`) composes `InputTextareaCore` with
`InputLabel`, `InputDescription` (positioned before or after the field depending on
`inputVariant === "outlined"`, matching `InputTextWithLabel`'s exact placement rule), and
`InputError`.

**Additional props over InputTextareaCore:**

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:error-message` | `object \| string` | (required) | Rendered via `InputError` when `field-has-error` is true. |

**Slots**: `descriptionHtml`, `descriptionText` (both forwarded to `InputDescription`), plus
`left`/`right` (forwarded straight through to the underlying `InputTextareaCore`).

```vue
<InputTextareaWithLabel
  name="message"
  label="Message"
  v-model="message"
  placeholder="How can we help you?"
  :maxlength="500"
  :error-message="errors.message"
  :field-has-error="!!errors.message"
>
  <template #descriptionText>Please describe your inquiry in detail</template>
</InputTextareaWithLabel>
```

`v-model` is `string | number | readonly string[] | null | undefined`, **required** — same as
`InputTextareaCore` above. `isDirty`/`isActive` are managed internally (not exposed as props) —
`isDirty` flips to `true` the first time the value becomes a non-empty string (checked on mount
and on every change), and never resets.
