# InputLabel — Consumer Styling Guide

`InputLabel` is the `<label>` rendered by every labelled field wrapper (`InputTextWithLabel`,
`InputTextAsNumberWithLabel`, `InputNumberField`, `InputSelectWithLabel`,
`InputTextareaWithLabel`, `InputRangeDefault`, `ToggleSwitchWithLabel`,
`ToggleSwitchWithLabelInline`).

## Public token API

Every token is consumed as `var(--input-label-*, {default})` and none is declared on the element
itself, so set them on any ancestor (or `:root`) and they inherit down.

### Label (root `.input-label`)

| Token | Default | Controls |
|---|---|---|
| `--input-label-color` | `inherit` | Text colour |
| `--input-label-font-size` | `var(--step-5)` | Font size |
| `--input-label-font-weight` | `normal` | Font weight |
| `--input-label-line-height` | `1.5` | Line height |
| `--input-label-margin-block` | `0.8rem` | Space above and below the label |
| `--input-label-margin-inline` | `0` | Inline margin |

### Indicator (`.input-label-indicator`)

Only rendered when the `indicator` mode marks this field (see **Required / optional indicator** below).

| Token | Default | Controls |
|---|---|---|
| `--input-label-indicator-color` | `inherit` | Marker colour, both states |
| `--input-label-indicator-color-required` | `--input-label-indicator-color` | Marker colour on required fields |
| `--input-label-indicator-color-optional` | `--input-label-indicator-color` | Marker colour on optional fields |
| `--input-label-indicator-font-size` | `inherit` | Marker font size, both states |
| `--input-label-indicator-font-size-required` | `--input-label-indicator-font-size` | Marker font size on required fields |
| `--input-label-indicator-font-size-optional` | `--input-label-indicator-font-size` | Marker font size on optional fields |
| `--input-label-indicator-font-weight` | `inherit` | Marker font weight |
| `--input-label-indicator-gap` | `0.4rem` | Space between the label text and the marker |
| `--input-label-indicator-icon-size` | `1em` | Icon size when an icon replaces the text (`font-size` on the icon, see pitfall #24) |

Private (not public API): `--_indicator-color` and `--_indicator-font-size`, which only hold the
shared fallback so the per-state tokens don't repeat it.

> **Changed 2026-09-26**: the colour used to read `--form-label-color`, which nothing in this
> library declares, so it always inherited. Use `--input-label-color` instead. Font size, weight, line height and margin were hardcoded and are now tokens with the same
> defaults.

---

## State hooks

| Attribute on `.input-label` | When |
|---|---|
| `data-input-variant="normal" \| "outlined" \| "underlined"` | Always, mirrors the field's `input-variant` (`InputRangeDefault` and the toggle switches always pass `normal`) |
| `data-invalid` | The field has an error (not passed by `ToggleSwitchWithLabelInline`) |

| Attribute on `.input-label-indicator` | When |
|---|---|
| `data-indicator="required" \| "optional"` | Which kind of marker this is |

Inner elements: slot content renders directly inside the `<label>`, followed by
`.input-label-indicator` (span) when a marker applies, which holds either the text or an
`.input-label-indicator-icon` (plus `.sr-only` text for an optional icon).

---

## Required / optional indicator

The `indicator` mode decides which fields get a marker: `"required"` marks required fields,
`"optional"` marks the rest, `"none"` (default) marks nothing. Set it once for the whole site in
your `app.config.ts`; the labelled wrappers forward their own `required` prop, so every field
follows it automatically (the toggle switches opt out, since a switch always has a value):

```ts
export default defineAppConfig({
  srcdev: {
    inputLabel: {
      indicator: "optional",
      optionalText: "(optional)",
      // requiredText: "*", requiredIcon: "mdi:asterisk", optionalIcon: "...",
    },
  },
});
```

A required marker is `aria-hidden` (the control's `required` attribute is what's announced). An
optional marker is announced; with an icon, its text stays as `.sr-only` text.

> **Changed 2026-09-26**: the variant used to be a bare class (`.input-label.normal`,
> `.input-label.underlined`). Select on `[data-input-variant]` instead.

---

## Global theming

```css
:where(html) {
  --input-label-font-weight: 600;
  --input-label-margin-block: 0 0.4rem;
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat**: the field wrappers don't forward your `style-class-passthrough` to the label, so for a
single field put a plain `class` on the wrapper instead (it lands on the wrapper's root, an
ancestor of the label).

```css
.contact-page {
  --input-label-font-weight: 700;
  --input-label-indicator-color-required: var(--theme-error-border);

  .input-label[data-invalid] {
    --input-label-color: var(--theme-error-border);
  }
}
```

---

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the `<label>`. It's only
reachable when you render `InputLabel` directly in a custom field wrapper: the library's wrappers
pass their own hook classes (`input-text-label`, `input-number-label`, `input-select-label`,
`input-textarea-label`, `input-switch-label`) and don't forward yours.
