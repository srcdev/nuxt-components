# ToggleSwitch — Consumer Styling Guide

> **Renamed 2026-10-16**: `ToggleSwitchCore` → `ToggleSwitch`, `ToggleSwitchWithLabel` →
> `ToggleSwitchField`, `ToggleSwitchWithLabelInline` → `ToggleSwitchField layout="inline"`. Class
> changes are listed under "State hooks" below.

## Public token API

Every colour token below is `var(--toggle-switch-*, {default})` — set the `--toggle-switch-*`
name to override just this component; leave it unset and it inherits the shared `--theme-*` token
every other themed component also falls back to. See `theming-component-token-pattern.md` for why
this two-tier shape exists.

### Track and thumb

| Token | Default | Controls |
|---|---|---|
| `--toggle-switch-surface` | `var(--theme-checkbox-symbol-surface)` | Track background (resting) |
| `--toggle-switch-surface-hover` | `var(--theme-surface-subtle)` | Track background on hover |
| `--toggle-switch-border` | `var(--theme-border)` | Track border colour |
| `--toggle-switch-border-focus` | `var(--theme-border-focus)` | Track outline colour on `:focus-visible` |
| `--toggle-switch-symbol-border` | `var(--theme-text)` | Thumb border colour |
| `--toggle-switch-symbol-surface-off` | `var(--theme-on-surface)` | Thumb background, off |
| `--toggle-switch-symbol-surface-on` | `var(--theme-surface)` | Thumb background, on |
| `--toggle-switch-icon-on-color` | `var(--theme-on-surface)` | "On" icon colour |
| `--toggle-switch-icon-off-color` | `var(--theme-surface)` | "Off" icon colour |
| `--toggle-switch-border-radius` | `100vw` (`round`), `0.4rem` (`round: false`) | Track and thumb shape |
| `--toggle-switch-track-width` | derived from the thumb size | Track width (see below) |

### Field

| Token | Default | Controls |
|---|---|---|
| `--toggle-switch-field-inline-gap` | `1.2rem` | Space between label and switch with `layout="inline"` |

Geometry (`--input-toggle-*`, `--form-element-*`) is shared across every `05.forms` component and
untouched by this — see `theming-form-geometry-tokens.md`.

Private (not public API): `--_border-radius` (from `round` and the token above, read by track and
thumb) and `--_track-width` (the derived width).

### Track width

Left unset, the track width is worked out from the shared `--input-toggle-*`/`--form-element-*`
geometry tokens, so it scales with `--input-toggle-symbol-size`:

```css
.my-compact-toggle {
  --input-toggle-symbol-size: 2.2rem;
}
```

Only set `--toggle-switch-track-width` for a width the formula doesn't produce.

---

## State hooks

| Attribute | On | When |
|---|---|---|
| `data-checked` | `.toggle-switch` | The value equals `true-value` |
| `data-invalid` | `.toggle-switch`, `.toggle-switch-field` | `field-has-error` |
| `data-theme` | `.toggle-switch`, `.toggle-switch-field` | Always; `error` while `field-has-error` is set |
| `data-layout="stacked" \| "inline"` | `.toggle-switch-field` | Always, mirrors `layout` |

Inner elements: `.toggle-switch-wrapper`, `.toggle-switch-input` (the hidden checkbox),
`.toggle-switch-track`, `.toggle-switch-thumb`, `.toggle-switch-icon`, `.toggle-switch-icon-on`,
`.toggle-switch-icon-off`, `.toggle-switch-label` (the Field's `InputLabel`),
`.toggle-switch-description` (the Field's `InputDescription`).

The thumb slide is turned off under `prefers-reduced-motion: reduce`.

> **Changed 2026-10-16**: inner classes were generic names that a consumer's own CSS could hit,
> and state was a class. Use the new names:
>
> - `.toggle-switch-core` → `.toggle-switch`; `.toggle-switch-with-label` → `.toggle-switch-field`;
>   `.toggle-switch-with-label-inline` → `.toggle-switch-field[data-layout="inline"]`
> - `.symbol-wrapper` → `.toggle-switch-track`; `.symbol` → `.toggle-switch-thumb`;
>   `.symbol-icon` → `.toggle-switch-icon`; `.icon-on` / `.icon-off` → `.toggle-switch-icon-on` /
>   `.toggle-switch-icon-off`; the bare `input` → `.toggle-switch-input`
> - `.symbol.checked` and `.symbol-icon.active` → `.toggle-switch[data-checked]`
> - the unused `.use-default-icons` class and the default icon's `.icon` class are gone
> - the Field's label class `input-switch-label` → `toggle-switch-label`
>
> Also: the inline layout's label wraps instead of `nowrap`, and the inline row now supports a
> description, an error and `required`.

---

## Description

`ToggleSwitchField`'s `descriptionText` / `descriptionHtml` slots render through
`InputDescription`, so they're styled by its `--input-description-*` tokens (see
`input-description/CONSUMER-STYLING.md`). Scope an override to toggles with
`.toggle-switch-description`:

```css
.toggle-switch-description {
  --input-description-slot-margin-block-end: 1.2rem;
}
```

---

## Global theming

```css
:where(html) {
  --toggle-switch-symbol-surface-on: var(--rose-05);
  --toggle-switch-border-focus: var(--rose-03);
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

```vue
<ToggleSwitchField
  v-model="notifications"
  name="notifications"
  label="Notifications"
  style="--toggle-switch-symbol-surface-on: var(--gold-06);"
/>
```

---

## Class passthrough

`ToggleSwitch`'s `:style-class-passthrough` lands on its root `.toggle-switch`, and
`ToggleSwitchField`'s on its root `.toggle-switch-field`.
