# TripleToggleSwitchCore — Consumer Styling Guide

## Public token API

Every colour token below is `var(--triple-toggle-switch-*, {default})` — set the
`--triple-toggle-switch-*` name to override just this component; leave it unset and it inherits
the shared `--theme-*` token every other themed component also falls back to. See
`theming-component-token-pattern.md` for why this two-tier shape exists.

| Token | Falls back to | Controls |
|---|---|---|
| `--triple-toggle-switch-surface` | `var(--theme-input-surface)` | Wrapper background |
| `--triple-toggle-switch-border` | `var(--theme-border)` | Wrapper border colour |
| `--triple-toggle-switch-ring-focus` | `var(--theme-ring)` | Wrapper outline colour on `:focus-visible` |
| `--triple-toggle-switch-marker-surface` | `var(--theme-input-surface)` | Selected-option marker background, when none of the `system`/`light`/`dark` `:has()` overrides below match |
| `--triple-toggle-switch-marker-border` | `light-dark(var(--slate-10), var(--slate-00))` | Selected-option marker border colour |
| `--triple-toggle-switch-option-border` | `light-dark(#00000025, #ffffff50)` | Each option's resting border colour |
| `--triple-toggle-switch-option-border-hover` | `light-dark(var(--slate-10), var(--slate-00))` | Each option's outline colour on hover |
| `--triple-toggle-switch-option-ring-focus` | `var(--theme-ring)` | Each option's outline colour on `:focus-visible` |
| `--triple-toggle-switch-option-icon-color` | `light-dark(var(--slate-10), var(--slate-03))` | Option icon colour, resting (shared by the `.system`/`.light`/`.dark` selectors — see note) |
| `--triple-toggle-switch-option-icon-color-active` | `var(--slate-00)` | Option icon colour, selected |

> **Two bugs fixed in this migration**:
>
> 1. `--triple-toggle-switch-marker-surface` replaces a reference to `--theme-form-checkbox-bg`, a
>    token declared nowhere in this layer at all — an undefined `var()` with no fallback silently
>    resolves to the property's initial value, so the marker had no visible background whenever
>    none of the value-specific `:has()` overrides matched. Two more dead tokens
>    (`--theme-form-radio-border`, `--theme-form-radio-outline`, both also undeclared anywhere)
>    fed two further-unused private locals and were removed outright.
> 2. The `.system`/`.light`/`.dark` `:has(input[value="..."])` selectors and matching
>    `.option-icon.system/.light/.dark` classes used to say `"auto"` instead of `"system"` — but
>    the only known consumer, `DisplayThemeSwitch`, has only ever emitted `id`/`value: "system"`
>    (matching `useSettingsStore`'s `colourScheme` type, which the presentational side has to
>    track). `"auto"` never matched anything real, so the system option's green gradient marker
>    had never actually fired. Renamed the selectors to `"system"` rather than the data, since the
>    data value is a real external contract (`useSettingsStore.setColourScheme` applies it as a
>    literal CSS class on `<html>` elsewhere in the app) and the selectors are this component's own
>    presentational-only concern.
>
> **`.system`/`.light`/`.dark` selectors**: the component hardcodes these three option *values* as
> CSS class selectors rather than being value-agnostic — a legacy of its one real consumer,
> `DisplayThemeSwitch`'s light/dark/system theme picker. All three already shared identical colour
> values before this migration; only the repeated literal values became tokens here, the selectors
> themselves are otherwise unchanged (so anything already targeting them by their corrected names
> keeps working). Making the component genuinely value-agnostic would be a larger, separate change.

Geometry (`--_form-*` sizing locals, `--form-element-*`) is shared/component-internal and untouched
by this — see `theming-form-geometry-tokens.md` for the shared half.

---

## Global theming — app-level CSS file

```css
:where(html) {
  --triple-toggle-switch-surface: var(--rose-09);
  --triple-toggle-switch-option-ring-focus: var(--rose-04);
}
```

---

## Per-instance overrides

```vue
<TripleToggleSwitchCore
  v-model="scheme"
  v-model:field-data="options"
  style="--triple-toggle-switch-marker-surface: var(--gold-06);"
/>
```
