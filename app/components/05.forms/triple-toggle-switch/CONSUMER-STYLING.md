# TripleToggleSwitch — Consumer Styling Guide

> **Renamed 2026-09-27**: `TripleToggleSwitchCore` → `TripleToggleSwitch`. The root class was
> already `.triple-toggle-switch`, and no token names changed.

## Public token API

Colour tokens fall back to the shared `--theme-*` tokens every other themed component uses, so
leave them unset to follow the site theme. See `theming-component-token-pattern.md`.

### Wrapper

| Token | Default | Controls |
|---|---|---|
| `--triple-toggle-switch-surface` | `var(--theme-input-surface)` | Wrapper background |
| `--triple-toggle-switch-border` | `var(--theme-border)` | Wrapper border colour |
| `--triple-toggle-switch-ring-focus` | `var(--theme-ring)` | Wrapper outline colour while a radio has `:focus-visible` |
| `--triple-toggle-switch-padding` | `0.6rem` | Wrapper padding |
| `--triple-toggle-switch-gap` | `1rem` | Gap between the three options (also drives the marker's position) |

### Selected-option marker

| Token | Default | Controls |
|---|---|---|
| `--triple-toggle-switch-marker-surface` | `var(--theme-input-surface)` | Marker background when the selected value isn't `system`/`light`/`dark` |
| `--triple-toggle-switch-marker-border` | `var(--slate-10)` | Marker border colour |
| `--triple-toggle-switch-marker-gradient-system` | green `radial-gradient(...)` | Marker `background-image` when `system` is selected |
| `--triple-toggle-switch-marker-gradient-light` | red/orange `radial-gradient(...)` | Marker `background-image` when `light` is selected |
| `--triple-toggle-switch-marker-gradient-dark` | black/grey `radial-gradient(...)` | Marker `background-image` when `dark` is selected |

> **Changed 2026-09-27**: the three marker gradients were hardcoded literals with no override hook.
> They're now public tokens; the defaults are unchanged. Any `<image>` value works
> (`linear-gradient(...)`, `url(...)`, `none`).

### Options

| Token | Default | Controls |
|---|---|---|
| `--triple-toggle-switch-option-padding` | `0.5rem` | Padding inside each option circle |
| `--triple-toggle-switch-icon-size` | `2rem` | Icon `font-size` (and the hidden radio's hit area) |
| `--triple-toggle-switch-option-border` | `#00000025` | Each option's resting border colour |
| `--triple-toggle-switch-option-border-hover` | `var(--slate-10)` | Option outline colour on icon hover |
| `--triple-toggle-switch-option-ring-focus` | `var(--theme-ring)` | Option outline colour on `:focus-visible` |
| `--triple-toggle-switch-option-icon-color` | `var(--slate-10)` | Icon colour, resting |
| `--triple-toggle-switch-option-icon-color-active` | `var(--slate-00)` | Icon colour, selected |

Also read (shared, not component-specific): `--form-element-border-width`,
`--form-element-outline-width`, `--theme-form-transition-duration`. See
`theming-form-geometry-tokens.md`.

Private tokens (not public API): `--_form-items-gap`, `--_scheme-icon-font-size` (each used twice,
fed by the public gap/icon-size tokens) and `--_select-scheme-group-background-color`/
`--_select-scheme-group-background-image` (swapped per selected value).

## State hooks

- **Selected value**: the marker gradients key off `:has(input[value="system" | "light" | "dark"]:checked)`
  on the root. These three values are hardcoded, a legacy of the one real consumer
  (`DisplayThemeSwitch`). Any other value shows `--triple-toggle-switch-marker-surface` instead.
- **Option icon classes**: each `.option-icon` carries the option's `id` as a class (e.g.
  `.option-icon.light`) plus `.active` when selected.
- **Marker**: `.selected-option-marker` gains `.show` roughly 250ms after mount (it's positioned
  from a measured option width, so it stays hidden until measured).
- **Theme**: `data-theme` on the root, from the `theme` prop.
- **Inner classes**: `.triple-toggle-switch-wrapper`, `.selected-option-marker-wrapper`,
  `.selected-option-marker`, `.option-group-wrapper` (the `role="radiogroup"`), `.option-group`
  (each `<label>`), `.option-icon`, `.option-input`.

## Motion

The marker slides between options over the `stepAnimationDuration` prop (default `250ms`). Under
`prefers-reduced-motion: reduce` the slide transition is removed and the marker jumps.

## Global theming

```css
:where(html) {
  --triple-toggle-switch-surface: var(--rose-09);
  --triple-toggle-switch-option-ring-focus: var(--rose-04);
}
```

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** when used through `DisplayThemeSwitch`, that wrapper re-declares the four sizing tokens
(`--triple-toggle-switch-gap`, `-padding`, `-option-padding`, `-icon-size`) on the root element, so
setting them on an ancestor has no effect there. Set them on the component itself (via
`style` or a passthrough class) instead. Used directly, `TripleToggleSwitch` re-declares nothing.

## Class passthrough

`style-class-passthrough` adds classes to the root `.triple-toggle-switch` element, alongside
`data-theme`. `DisplayThemeSwitch` uses it for its `colour-scheme-select` and `small` classes.
