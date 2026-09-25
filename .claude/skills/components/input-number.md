# InputNumber Component

> **Renamed 2026-09-25**: `InputNumberCore` → `InputNumber`, `InputNumberDefault` → `InputNumberField`
> (DOM classes `.input-number-core` → `.input-number`, `.input-number-with-label` → `.input-number-field`).
> First component moved to the Control/Field naming convention, see `.claude/skills/component-naming.md`.

## Overview

`InputNumber` is the low-level native `<input type="number">` primitive for the `05.forms`
number-input family. It renders a single native number input with left/right button slots (for
step-down/step-up controls). It has no label, description, or error-message rendering of its
own — that's composed by the `InputNumberField` variant below.

Most consumers should reach for **InputNumberField** rather than `InputNumber` directly.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:field-has-error`, `:style-class-passthrough`, `:aria-describedby`.

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:id` | `string` | (required) | Applied to the native input. |
| `:name` | `string` | (required) | Applied to the native input. |
| `:min` | `number` | (required) | Native `min`. |
| `:max` | `number` | (required) | Native `max`. |
| `:step` | `number` | `1` | Native `step`. |
| `:placeholder` | `string` | `""` | Native `placeholder`. |
| `:required` | `boolean` | `false` | Native `required`. |
| `:theme` | `FormUiTheme` | `"default"` | Sets `data-theme` on the wrapper. |
| `:weight` | `FormWeight` | `"normal"` | Adds an `input-number--{weight}` class to the input, for prop-shape consistency with sibling `05.forms` components. **No CSS in the library currently styles this class — it's a no-op today**, same convention as `InputRangeCore`'s `weight` prop. |
| `:input-variant` | `InputUiVariant` | `"normal"` | Adds the variant name as a class on the wrapper — `"normal"` (bordered box) and `"underlined"` (bottom-border only) have CSS; `"outlined"` doesn't (see CONSUMER-STYLING.md). Same prop/behaviour as `InputTextCore`. |
| `:field-has-error` | `boolean` | `false` | Drives `data-invalid` on the wrapper. |
| `:style-class-passthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the input element. |
| `:aria-describedby` | `string` | `""` | Forwarded to the native input. |

### v-model

`v-model` — `number | readonly number[]`, **required** (`defineModel({ required: true })`). Bound
directly to the native number input. Required rather than defaulted deliberately — same reasoning
as `InputRangeCore`'s `v-model` (see that skill doc) — this also satisfies `vue/require-default-prop`.

---

## Slots

| Slot | Notes |
|------|-------|
| `left` | Rendered before the input (e.g. a step-down button). Adds `has-left-slot` to the wrapper. |
| `right` | Rendered after the input (e.g. a step-up button). Adds `has-right-slot` to the wrapper. |

Any `.input-button-core` inside `.slot` gets its own border/outline stripped and is sized to
match the input (`aspect-ratio: 1`, `width: var(--input-min-height)`) regardless of which slot
it's in. The divider border is then added directly to that button element specifically when its
slot is present — `&.has-left-slot .left-slot .input-button-core { border-right: ... }` and the
right-hand mirror — so it sits flush against the button's own edge rather than around the
containing `.slot` div. This makes step buttons read as embedded segments of the same control
rather than separate floating buttons. The divider reuses the wrapper's own border colour token
(no separate divider token), same as `InputTextCore`/`InputTextAsNumberWithLabel`.

---

## CSS token API

See [CONSUMER-STYLING.md](../../app/components/05.forms/input-number/CONSUMER-STYLING.md) for the
full table with defaults.

**Common tokens:**

- `--input-number-surface` / `-surface-hover` — wrapper/input/embedded-button background, resting and hover, falls back to `--theme-input-surface`/`-surface-hover`
- `--input-number-border` / `-border-hover` / `-border-focus` — border colour resting, mouse-hover outline, and `:focus-visible` outline (also the divider colour and the embedded button's own focus outline), falls back to `--theme-border`/`--theme-border-focus`
- `--input-number-text-color` — input text colour, falls back to `--theme-input-text-color-normal`
- `--input-number-placeholder-color` — placeholder text colour, falls back to `--theme-input-placeholder`

---

## Fixed 2026-09-22: dead CSS from a missing base class and mismatched selectors

`InputNumber` migrated to full compliance from a `variants:true`, `eslint_issues:true`,
score-1/5 state. Several latent bugs were fixed alongside the standard checklist:

- The native `<input>` had no static `input-number` class — only the dynamic
  `elementClasses` passthrough — so the entire `.input-number { ... }` style block (font,
  padding, colour, focus box-shadow) never matched anything. Fixed by adding the class directly.
- `placeholder` was declared as a prop but never bound on the `<input>` — unlike `InputRangeCore`
  (where a range input genuinely has no placeholder concept and the no-op is intentional and
  documented), a number input *does* support `placeholder` meaningfully, so this was a real gap,
  not a deliberate no-op. Fixed by binding `:placeholder`.
- The left/right slot divs rendered with classes `slot left`/`slot right`, but the CSS targeted
  `.left-slot`/`.right-slot` and `.has-left-slot`/`.has-right-slot` — neither the slot divs nor
  the wrapper ever carried those exact class names, so the divider-border and flex-alignment
  rules for embedded step buttons never applied. Fixed by renaming the slot divs to
  `slot left-slot`/`slot right-slot` and adding `has-left-slot`/`has-right-slot` to the wrapper
  directly from `slots.left`/`slots.right` (Vue's own `useSlots()`), rather than a fragile,
  cross-component class-toggling relay.
- Relatedly, `InputNumberField` called `updateElementClasses(["has-left-button",
  "has-right-button"])` unconditionally on mount, which permanently added those two classes to
  its own outer `.input-number-field` wrapper — a different element than
  `InputNumber`'s `.input-number-wrapper`, so the `:has()` selector that was meant to key off
  those classes could never match (the class lived on an ancestor, not a descendant). Replaced
  entirely: `InputNumber` now detects an embedded button directly via
  `:has(.left-slot .input-button-core)` / `:has(.right-slot .input-button-core)`, so no
  JS-driven class relay is needed at all.
- `theme` was typed as an inline `"default" | "success" | "error" | "warning"` union in both
  `InputNumber` and `InputNumberField` instead of importing the shared `FormUiTheme` type —
  aligned with the rest of `05.forms`.
- `weight` was passed from `InputNumberField` to `InputNumber` but `InputNumber` had no
  matching prop, so it fell through as a raw, meaningless `weight="normal"` HTML attribute on the
  wrapper `<div>`. Fixed by declaring the prop on `InputNumber` too, matching `InputRangeCore`.
- `defineModel()` had no default, tripping `vue/require-default-prop` — fixed the same way as
  `InputRangeCore`: `defineModel({ required: true })`, not a rule disable or an artificial default.
- A single-use private token, `--_border`, was inlined to the public
  `var(--input-number-border, var(--theme-border))` directly at its point of use — it had no
  composition or state-swap behind it, just a bare pass-through (see pitfall #20). `--_surface`
  (used twice) and `--_min-width` (composed from a `v-bind()` value) correctly stayed private.

---

## Fixed 2026-09-22 (follow-up): rewritten to visually mirror InputTextCore

The first migration pass above only made `InputNumber`'s *own* (pre-existing, previously dead)
CSS active — it didn't reconsider whether that CSS was actually the right design. Once live, it
was visually inconsistent with the rest of `05.forms`: no border-radius, no hover/focus outline
state, wrong padding-token family (`--form-textarea-padding-*` instead of the shared input
padding tokens), and a box-shadow-toggle focus mechanism instead of the `:has()`-based outline
approach every other input in this library uses. `InputNumber` is meant to be a native
`<input type="number">` sibling to the text-based `InputTextAsNumberWithLabel` variant (see
`input-text-core.md`'s Variants section) — both should look and behave the same. The CSS was rewritten
to mirror `InputTextCore` directly:

- Added `:input-variant` (`"normal"` / `"outlined"` / `"underlined"`), matching `InputTextCore`'s
  prop and wrapper-class shape (`InputNumberField` forwards it the same way
  `InputTextWithLabel` forwards it to `InputTextCore`, including to `InputLabel`).
- Replaced the flat, unconditional border/radius/box-shadow with `InputTextCore`'s `.normal`
  variant shape: border + `border-radius: var(--form-input-border-radius)` (previously this read
  `var(--form-element-border-width)` — a pre-existing bug that used the *border-width* token as
  the *radius*, coincidentally invisible while the block was dead), plus `:has(input:hover)` /
  `:has(input:focus-visible)` outline states instead of the old `--_focus-box-shadow` custom
  property toggle.
  - `--input-number-border-hover` and `--input-number-border-focus` are new public tokens for
    these two states (both fall back to `--theme-border-focus`, same as `InputTextCore`).
- Padding moved from `--form-textarea-padding-*` (the wrong token family — textarea, not input)
  to the shared `--input-padding-block`/`--input-padding-inline`/`--input-min-height` tokens every
  other `05.forms` text-like input uses.
- The embedded step button now gets a hover background (`--input-number-surface-hover`, new
  public token) and a visible `:focus-visible` outline (reusing `--input-number-border-focus`) —
  previously it had neither, an accessibility gap beyond the visual mismatch (checklist item 9).
- The divider between the input and an embedded button now reuses the border colour
  (`--_border`) directly instead of a separate `--input-number-divider-color` token — removed,
  since `InputTextCore` doesn't have an equivalent separate token either (the border colour
  *is* the divider colour there too).
- `--_border-hover` and `--_surface-hover` were each used only once with no composition or
  state-swap, so per the public-token rule they were inlined directly
  (`var(--input-number-border-hover, var(--theme-border-focus))` /
  `var(--input-number-surface-hover, var(--theme-input-surface-hover))`) rather than kept as
  private wrappers. `--_border-focus` stayed private since it's now genuinely reused (the
  wrapper's own focus outline *and* the embedded button's focus outline both read it).

**Separately found in the same investigation** (not an `InputNumber` bug, but what the visual
comparison was originally checking against): `InputTextAsNumberWithLabel.vue` had its own,
unrelated pre-existing bug — see `input-text-core.md`'s Variants section for the fix.

**Correction, same day**: the first version of this rewrite still didn't visually match — the
divider border and button sizing (`aspect-ratio: 1`, `width: var(--input-min-height)`) had been
put on the `.left-slot`/`.right-slot` *wrapper divs*, not on `.input-button-core` itself, unlike
`InputTextCore`'s equivalent block. That left an unstyled gap between the button and the border
line instead of a flush edge, and the buttons weren't sized to match the input's height. Fixed by
moving the divider border and all button sizing/colour rules onto `.input-button-core` directly
(`&.has-left-slot .left-slot .input-button-core { border-right: ... }`, matching
`InputTextAsNumberWithLabel`'s `.left-slot .input-button-core { border-right: ... }` exactly)
rather than the containing `.slot` div. When mirroring another component's CSS structure, check
*which element* a rule targets, not just that an equivalent rule exists somewhere in the block —
a border/sizing rule one level off in the DOM tree produces a visually-close-but-not-matching
result that's easy to miss without a side-by-side screenshot comparison.

---

## Variants

### InputNumberField

`InputNumberField` (`InputNumberField.vue`) composes `InputNumber` with
`InputLabel`, `InputDescription`, and `InputError`, plus optional step-down/step-up buttons
(`InputButtonCore`) wired into the `left`/`right` slots.

**Additional props over InputNumber:**

| Prop (template form) | Type | Default | Notes |
|------|------|---------|-------|
| `:label` | `string` | (required) | Rendered via `InputLabel`. |
| `:error-message` | `object \| string` | (required) | Rendered via `InputError` when `field-has-error` is true. |
| `:step-down-label` | `string` | `"Step down"` | `button-text` on the step-down `InputButtonCore` — override for localisation. |
| `:step-up-label` | `string` | `"Step up"` | `button-text` on the step-up `InputButtonCore` — override for localisation. |

**Slots**: `descriptionHtml`, `descriptionText` (both forwarded to `InputDescription`), plus
`left`/`right` (forwarded straight through to the underlying `InputNumber` — the
step-down/step-up buttons only render when you use the `left`/`right` slots yourself, since the
button icon content itself is consumer-supplied).

```vue
<InputNumberField
  name="quantity"
  label="Quantity"
  v-model="quantity"
  :min="1"
  :max="10"
  error-message="Please choose a value between 1 and 10"
  :field-has-error="hasError"
>
  <template #left><Icon name="mdi:minus" /></template>
  <template #right><Icon name="mdi:plus" /></template>
</InputNumberField>
```

`v-model` is `number | readonly number[]`, **required** — same as `InputNumber` above.

Step-down is disabled (`readonly` on its `InputButtonCore`) once the value reaches `min`, and
step-up once it reaches `max`; clicking either button while at that boundary is a no-op.
