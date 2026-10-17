# SegmentedControl — Consumer Styling Guide

> **Renamed 2026-10-17**: `TripleToggleSwitch` → `SegmentedControl`, since it handles any number
> of options. Every class and token changed prefix: `.triple-toggle-switch*` → `.segmented-control*`
> and `--triple-toggle-switch-*` → `--segmented-control-*`, with the rest of each name unchanged.
>
> **Renamed 2026-09-27**: `TripleToggleSwitchCore` → `TripleToggleSwitch`. The root class was
> already `.triple-toggle-switch`, and no token names changed.

## Public token API

Colour tokens fall back to the shared `--theme-*` tokens every other themed component uses, so
leave them unset to follow the site theme. See `theming-component-token-pattern.md`.

### Wrapper

| Token | Default | Controls |
|---|---|---|
| `--segmented-control-surface` | `var(--theme-input-surface)` | Wrapper background |
| `--segmented-control-border` | `var(--theme-border)` | Wrapper border colour |
| `--segmented-control-border-hover` | the resolved border | 1px wrapper outline colour on hover |
| `--segmented-control-shadow` | `var(--form-element-shadow-colour, var(--colour-theme-2))` | Resting shadow ring outside the border (on the wrapper). Width is the global `--form-element-shadow-width` (`0.2rem`; `0` removes it) |
| `--segmented-control-ring-focus` | `var(--theme-ring)` | Wrapper outline colour while a radio has `:focus-visible` |
| `--segmented-control-padding` | `0.6rem` | Wrapper padding |
| `--segmented-control-gap` | `1rem` | Gap between the options (also drives the marker's position) |

### Selected-option marker

| Token | Default | Controls |
|---|---|---|
| `--segmented-control-marker-surface` | `var(--theme-surface)` | Marker background when the selected value isn't `system`/`light`/`dark` |
| `--segmented-control-marker-border` | `var(--theme-text)` | Marker border colour |
| `--segmented-control-marker-gradient-system` | green `radial-gradient(...)` | Marker `background-image` when `system` is selected |
| `--segmented-control-marker-gradient-light` | red/orange `radial-gradient(...)` | Marker `background-image` when `light` is selected |
| `--segmented-control-marker-gradient-dark` | black/grey `radial-gradient(...)` | Marker `background-image` when `dark` is selected |

> **Changed 2026-09-27**: the three marker gradients were hardcoded literals with no override hook.
> They're now public tokens; the defaults are unchanged. Any `<image>` value works
> (`linear-gradient(...)`, `url(...)`, `none`).

### Options

| Token | Default | Controls |
|---|---|---|
| `--segmented-control-option-padding` | `0.5rem` | Padding inside each option circle |
| `--segmented-control-icon-size` | `2rem` | Icon `font-size` (and the hidden radio's hit area) |
| `--segmented-control-option-border` | `#00000025` | Each option's resting border colour |
| `--segmented-control-option-border-hover` | `var(--theme-text)` | Option outline colour on hover |
| `--segmented-control-option-ring-focus` | `var(--theme-ring)` | Option outline colour on `:focus-visible` |
| `--segmented-control-option-icon-color` | `var(--theme-text)` | Icon colour, resting |
| `--segmented-control-option-icon-color-active` | `var(--theme-on-surface)` | Icon colour, selected |

> **Changed 2026-10-17**: the marker surface defaulted to `--theme-input-surface` (white) while
> the selected icon defaulted to white too, so any value other than `system`/`light`/`dark` showed
> a white icon on a white marker. The marker now defaults to `--theme-surface` and the icons to
> `--theme-text`/`--theme-on-surface`, replacing the raw `--slate-10`/`--slate-00` palette tokens
> (close to the same colours on the default theme).

Also read (shared, not component-specific): `--form-element-border-width`,
`--form-element-outline-width`, `--theme-form-transition-duration`. See
`theming-form-geometry-tokens.md`.

Private tokens (not public API): `--_form-items-gap`, `--_scheme-icon-font-size` (each read in
several places, fed by the public gap/icon-size tokens) and `--_select-scheme-group-background-color`/
`--_select-scheme-group-background-image` (swapped per selected value).

> **Changed 2026-10-17**: bordered controls carry a light shadow ring (`box-shadow`, theme step 2,
> so red when invalid), and hover draws a 1px outline in the border colour with no offset, over the
> ring's inner edge. Hover used to draw a 2px outline at a 2px offset in the focus colour. Focus is
> unchanged and sits just outside the ring.

## State hooks

- **Selected value**: the marker gradients key off `:has(input[value="system" | "light" | "dark"]:checked)`
  on the root. These three values are hardcoded, a legacy of the one real consumer
  (`DisplayThemeSwitch`). Any other value shows `--segmented-control-marker-surface` instead.
- **Each option** (`.segmented-control-option`, the `<label>`) carries `data-value` (the
  option's value) and `data-checked` when selected. Target one with
  `.segmented-control-option[data-value="light"]`.
- **Root** has `data-has-selection` when the value matches an option; without it the marker is
  hidden.
- **Theme**: `data-theme` on the root, from the `theme` prop.
- **Inner classes**: `.segmented-control-wrapper`, `.segmented-control-marker-layer`,
  `.segmented-control-marker`, `.segmented-control-options` (the `role="radiogroup"`),
  `.segmented-control-option`, `.segmented-control-option-icon`,
  `.segmented-control-option-input`.

> **Changed 2026-10-17**: the inner classes were generic (`.selected-option-marker-wrapper`,
> `.selected-option-marker`, `.option-group-wrapper`, `.option-group`, `.option-icon`,
> `.option-input`) and collided with consumer CSS. State moved too: `.option-icon.active` →
> `.segmented-control-option[data-checked]`, `.option-icon.light` (the option id as a class)
> → `.segmented-control-option[data-value="light"]`, and `.selected-option-marker.show` is gone:
> the marker is positioned in CSS from the first paint, no measuring.

## Motion

The marker slides between options over the `stepAnimationDuration` prop (default `250ms`). Under
`prefers-reduced-motion: reduce` the slide transition is removed and the marker jumps.

## Global theming

```css
:where(html) {
  --segmented-control-surface: var(--rose-09);
  --segmented-control-option-ring-focus: var(--rose-04);
}
```

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** when used through `DisplayThemeSwitch`, that wrapper re-declares the four sizing tokens
(`--segmented-control-gap`, `-padding`, `-option-padding`, `-icon-size`) on the root element, so
setting them on an ancestor has no effect there. Set them on the component itself (via
`style` or a passthrough class) instead. Used directly, `SegmentedControl` re-declares nothing.

## Class passthrough

`style-class-passthrough` adds classes to the root `.segmented-control` element, alongside
`data-theme`. `DisplayThemeSwitch` uses it for its `colour-scheme-select` and `small` classes.
