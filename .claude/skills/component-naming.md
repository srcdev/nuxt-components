# Component naming: Control / Field convention

Adopted 2026-09-25. `input-number` is the first component converted; everything else is backlog
(see the table below). Apply this convention to every component migrated from now on, and convert
previously migrated components retrospectively, one family at a time.

## The rule

| Role | Name | Root DOM class | Example |
|------|------|----------------|---------|
| Bare control (native element + its slots, no label/description/error) | `<Name>` | `.<kebab-name>` | `InputNumber` → `.input-number` |
| Labelled field (label + description + control + error) | `<Name>Field` | `.<kebab-name>-field` | `InputNumberField` → `.input-number-field` |

- **No `Core` suffix.** It only ever existed to tell the bare control apart from its wrapper; once
  the wrapper is named `Field`, the control doesn't need a suffix. Components with no wrapper
  sibling at all (`CardCore`, `TabsCore`, ...) never needed it.
- **No `Default` / `WithLabel` suffix on wrappers.** `Default` says nothing about what the wrapper
  adds; `WithLabel` undersells it (it also renders description and error). "Field" is the
  established term (Material, Radix, Ark UI, Chakra) for "control plus its label and messages".
- **Layout variations of a Field** are a prop on the Field (e.g. `layout="inline"`), not a new
  suffix, unless the markup genuinely diverges; then `<Name>Field<Variant>`.
- **Files, stories, tests, skill doc follow the name**: `InputNumber.vue`, `stories/InputNumber.stories.ts`,
  `tests/InputNumber.spec.ts`, `.claude/skills/components/input-number.md` (the Field is documented
  in its control's skill doc under "Variants"). Snippet file stays `srcdev-component-<family>.code-snippets`
  and covers both.
- **CSS custom properties don't change** on rename; they're already `--<family>-*` (e.g.
  `--input-number-border`). Only the component name and its root/base DOM class change.

## Never a single word that is (or could become) a native HTML element

Stripping a suffix must never leave a single-word name that matches a native element: `Dialog`,
`Button`, `Select`, `Input`, `Details`, `Summary`, `Menu`, `Header`, `Footer`, `Nav`, `Form`,
`Label`, `Table`, `Option`, `Search`, `Slot`, `Template`, and so on. Vue refuses built-in/reserved tag
names as component names, and templates match tags case-insensitively, so `<Dialog>` can resolve to the
native `<dialog>` instead of the component. Also watch for names that *could become* an element (the
HTML spec keeps adding them: `<search>` and `<selectedcontent>` are recent), so don't rely on "it isn't one
today".

This is where the `Core` suffix originally crept in. The fix is a meaningful prefix, not a suffix:
`DisplayDialog` (not `DialogCore`), and the `Input*` prefix on form controls already covers
`InputButton`/`InputSelect`/`InputText`. Multi-word names are enforced: `eslint.config.mjs` turns on
`vue/multi-word-component-names` as an error for `app/components/**/*.vue` (added 2026-09-25; Nuxt's
base config leaves it off). `Breadcrumb` is the one existing single-word component and sits in that
rule's `ignores` list; it's not an element, so it's grandfathered, but don't add to that list; pick a
multi-word name instead. `vue/no-reserved-component-names` (already on via the Nuxt base config)
separately rejects exact native element names.

## Collision caveat (Nuxt layer)

This library is a Nuxt layer with `pathPrefix: false`. A consuming app's own component with the same
name **silently replaces the layer's**, including every place the layer uses it internally. Dropping
a prefix/suffix makes a name shorter and more generic, so more collision-prone. `InputNumber`,
`InputSelect` etc. are distinctive enough. A bare common word (`Card`, `Tabs`, `Accordion`) is the
risky case: marked **decide** in the backlog; consider a more specific name rather than just
stripping `Core`.

## How to rename a family

1. `git mv` the `.vue` files, their stories and tests (and the skill doc if it's named after the old
   control name).
2. `sed` the old names across `app/`, `.claude/`, `.vscode/`, `MIGRATION.md` and `Claude.md`:
   component names, `import` paths, story titles/`*StoryArgs` interfaces, `describe()` names, and the
   root/base DOM class (update `CONSUMER-STYLING.md` and test selectors that use it).
3. Add a "Renamed YYYY-MM-DD" note at the top of the skill doc listing old → new names and classes.
4. Grep consumer repos (`/check-component-usage`) and update any that use the old names. All
   consumers are the user's own apps, so no deprecated aliases are needed: update the consumers
   directly, and bump the layer's major version in the release notes if a live consumer used an old
   name.
5. Tick the row off below.

## Backlog

Consumer column = repos under `~/websites` using the name as of 2026-09-25 (excluding this repo and
the retired `nuxt-extend-nuxt-forms`/`nuxt-forms`). `-` = no external consumer, free to rename.

| Current | Proposed | Consumers |
|---------|----------|-----------|
| ~~InputNumberCore~~ | ✅ `InputNumber` (2026-09-25) | - |
| ~~InputNumberDefault~~ | ✅ `InputNumberField` (2026-09-25) | - |
| InputTextCore | `InputText` | guidemyhair, nuxt3-pinia-i18n-storybook |
| InputTextWithLabel | `InputTextField` | cnv-hairdressing, guidemyhair, luxury-locs-by-natasha-nuxt3, srcdev-design-system |
| InputPasswordWithLabel | `InputPasswordField` | srcdev-design-system |
| InputTextAsNumberWithLabel | `InputTextAsNumberField` | - |
| InputRangeCore | `InputRange` | - |
| InputRangeDefault | `InputRangeField` | - |
| InputTextareaCore | `InputTextarea` | - |
| InputTextareaWithLabel | `InputTextareaField` | guidemyhair, luxury-locs-by-natasha-nuxt3, srcdev-design-system |
| InputSelectCore | `InputSelect` | guidemyhair |
| InputSelectWithLabel | `InputSelectField` | guidemyhair, srcdev-design-system |
| ToggleSwitchCore | `ToggleSwitch` | guidemyhair |
| ToggleSwitchWithLabel | `ToggleSwitchField` | cnv-hairdressing, guidemyhair |
| ToggleSwitchWithLabelInline | `layout` prop on `ToggleSwitchField`, or `ToggleSwitchFieldInline` | - |
| TripleToggleSwitchCore | `TripleToggleSwitch` | srcdev-design-system |
| InputButtonCore | `InputButton` | cnv-hairdressing, guidemyhair, luxury-locs-by-natasha-nuxt3, nuxt3-pinia-i18n-storybook |
| InputCheckboxRadioCore | `InputCheckboxRadio` (review family first) | - |
| InputCheckboxRadioButton | review: button-style variant, not a Field | - |
| InputCheckboxRadioWithLabel | `InputCheckboxRadioField` (review family first) | - |
| ActionMenuItemCore | `ActionMenuItem` (child of `ActionMenu`, not a wrapper pair) | - |
| AlertMaskCore | `AlertMask` | - |
| CardCore | **decide**: `Card` is single-word and collision-prone; prefer a prefixed name (`Display*`, `Content*`) | instepreflexology |
| AccordianCore | **decide**: also fixes the "Accordian" misspelling; bare `Accordion` is single-word and collision-prone, and it is built on `<details>`/`<summary>` | srcdev-design-system |
| TabsCore | **decide**: `Tabs` is single-word and collision-prone | - |

The `input-checkbox` family also has `MultipleCheckboxes`/`SingleCheckbox` on top of the Core; look
at how the four relate before choosing names there.
