# InputSelectCore — Consumer Styling Guide

## Two override paths

Same public/private split as `InputTextCore` (see that component's `CONSUMER-STYLING.md` for the
full rationale) — `.input-select-wrapper` now exposes local tokens, one indirection step below the
global `--theme-*` ones they default from:

```css
--_input-select-surface: var(--theme-input-surface);
--_input-select-surface-hover: var(--theme-input-surface-hover);
--_input-select-border: var(--theme-border);
--_input-select-border-focus: var(--theme-border-focus);
--_input-select-outline-color: var(--_input-select-border-focus);
```

- **Global override**: redeclare `--theme-input-surface` / `--theme-border` / `--theme-border-focus`
  / `--theme-input-surface-hover` wherever you'd normally set theme tokens.
- **Local override** (this component only, guaranteed to win):

```css
.input-select-wrapper {
  --_input-select-border: var(--slate-06);
  --_input-select-border-focus: var(--slate-04);
  --_input-select-surface: var(--slate-01);
}
```

## Note on `--_input-select-outline-color`

Before 2026-08-22 this was referenced (on the open-picker outline) but never declared anywhere —
a dangling private token that silently resolved to the property's initial value (same failure mode
as the `--theme-button-surface` typo documented in the layer's `CLAUDE.md`, pitfall list). It's now
properly defined, defaulting to `--_input-select-border-focus`.

---

## Other tokens

Generic form-geometry tokens (`--input-padding-inline`, `--input-min-height`, `--input-font-size`,
`--form-element-border-width`, `--form-input-border-radius`, etc.) are shared across every
`05.forms` component and declared in `setup/04.elements/forms/*.css` — not component-local.
