# InputRange / InputRangeField — Consumer Styling Guide

> **Renamed 2026-10-16**: `InputRangeCore` → `InputRange`, `InputRangeDefault` → `InputRangeField`.
> Classes changed with them, see **State hooks**. Token names are unchanged.

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--input-range-accent-colour` | `var(--theme-accent)` | Native `accent-color` of the range input (track/thumb tint) |
| `--input-range-marker-background-colour` | `var(--theme-input-surface)` | Background colour of each `markers` slot dot |
| `--input-range-marker-padding` | `0.5rem` | Space around the icon in each marker dot (dot size = icon size + 2 × this) |
| `--input-range-marker-border-radius` | `50%` | Corner radius of each marker dot |
| `--input-range-marker-outline-width` | `0.1rem` | Marker dot outline width |
| `--input-range-marker-outline-colour` | `var(--theme-border)` | Marker dot outline colour |
| `--input-range-marker-icon-size` | `2rem` | Font size of the marker icon (`.input-range-marker-icon`) |
| `--input-range-marker-icon-colour` | `var(--input-range-accent-colour, var(--theme-accent))` | Marker icon colour |
| `--input-range-marker-track-colour` | `var(--theme-border)` | The line joining the markers, drawn behind them |
| `--input-range-marker-track-width` | `0.2rem` | Thickness of that line |
| `--input-range-marker-selected-colour` | `var(--input-range-accent-colour, var(--theme-accent))` | Ring drawn around the selected marker (the restyled range thumb) |
| `--input-range-marker-selected-width` | `0.3rem` | Thickness of that ring |
| `--input-range-datalist-font-size` | `1.4rem` | Font size of the `datalist` slot's option labels |
| `--input-range-datalist-font-weight` | `500` | Font weight of the `datalist` slot's option labels |

Geometry (thumb/track height, step-button size, border radius) comes from the shared global
form-geometry tokens (`--input-range-button-size`, `--form-input-border-radius`), not from this
component's own tokens: see `theming-form-geometry-tokens.md`.

Private (not public API): `--_input-range-marker-size`, the dot size worked out from the icon size
and padding, shared by the markers, the selected ring and the line inset.

> **Changed 2026-10-16**: the marker dot defaults assumed a dark page (`hsl(0, 29%, 3%)`
> background, `--slate-04` outline). They now default to `--theme-input-surface` and
> `--theme-border`. Set the two marker tokens if you relied on the dark dots.
>
> **Changed 2026-10-16**: markers mode was broken: the range line was drawn across the icons and
> nothing showed the selected value (the thumb was hidden), and only the thin line was clickable.
> The line now sits behind the markers, the whole marker row is the slider, and the thumb is a ring
> the size of a marker that circles the selected one. Markers get an explicit size
> (`--input-range-marker-icon-size` + 2 × `--input-range-marker-padding`) so the ring lines up.

---

## State hooks

| Attribute | On | When |
|---|---|---|
| `data-theme` | `.input-range-wrapper`, `.input-range-field` | Always, mirrors `theme` |
| `data-invalid` | `.input-range-wrapper`, `.input-range-field` | `field-has-error` (the input also gets `aria-invalid="true"`) |
| `data-has-markers` | `.input-range-wrapper` | The `markers` slot is filled: the line moves behind the markers, the input becomes a transparent layer over the whole row, and the thumb becomes a ring around the selected marker |

Inner elements: `.input-range` (the native input), `.input-range-container`, `.input-range-slot`
(both step-button holders), `.input-range-slot-left`, `.input-range-slot-right`,
`.input-range-label` (the Field's `InputLabel`). Pre-styled classes for your `markers` slot
markup: `.input-range-markers` (the row), `.input-range-marker` (each dot),
`.input-range-marker-icon`; and `.input-range-datalist` for a slotted `<datalist>`.

> **Changed 2026-10-16**:
>
> - Classes renamed: `.input-range-core` → `.input-range`, `.input-range-with-label` →
>   `.input-range-field`, `.slot.left` / `.slot.right` → `.input-range-slot-left` /
>   `.input-range-slot-right`, markers-slot `.marker` / `.marker-icon` → `.input-range-marker` /
>   `.input-range-marker-icon` (update your slot markup).
> - `.has-markers` on the input → `[data-has-markers]` on the wrapper; the Field's `.error` class →
>   `[data-invalid]`. The Field's label class was the number field's `input-number-label`; it's
>   now `input-range-label`.
> - Long label, description and error copy wraps (`overflow-wrap: anywhere` on
>   `.input-range-field`), and the slider shrinks between its step buttons instead of overflowing.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`InputRange`'s `:style-class-passthrough` lands on the native `<input class="input-range">`.
`InputRangeField`'s lands on its root `.input-range-field` only. Both react to prop changes.

> **Changed 2026-10-16**: `InputRangeField` also forwarded its passthrough classes to the inner
> input, so a class meant for the field matched two elements. If you styled the input through the
> Field's passthrough, select `.your-class .input-range` instead.

---

## Notes

- `accent-color` was previously read from `--theme-form-range-accent-color`, a custom property
  never declared anywhere in the codebase (no fallback either). Per the CSS spec that made the
  whole `accent-color` declaration invalid at computed-value time, so it silently fell back to the
  browser's native default accent colour. Fixed 2026-09-21; see the skill doc for detail.
- The `weight` prop (`FormWeight`) generates an `input-range--{weight}` class on the input, but no
  CSS in this component (or elsewhere in the library) styles that class: it's a no-op today.
