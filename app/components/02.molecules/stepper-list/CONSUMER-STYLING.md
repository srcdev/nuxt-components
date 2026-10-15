# StepperList — Consumer Styling Guide

## Public token API

All `--stepper-list-*` tokens are the stable override surface. Set them globally in a theme
file, scoped to a page wrapper, or per-instance via `styleClassPassthrough`.

### Layout & sizing

| Token | Default | Controls |
|---|---|---|
| `--stepper-list-padding-block` | `1.2rem` | Vertical padding for each list item |
| `--stepper-list-gap` | `2.2rem` | Horizontal gap between indicator and content |
| `--stepper-list-counter-size` | prop `indicatorSize` (`3rem`) | Width and height of the counter bubble or custom icon |
| `--stepper-list-counter-font-size` | `1.4rem` | Counter number font size |
| `--stepper-list-counter-font-weight` | `600` | Counter number font weight |
| `--stepper-list-connector-width` | `0.2rem` | Connector line thickness |
| `--stepper-list-connector-gap` | `0` | Space between each end of the connector line and the indicators it joins. A gap larger than half the space between two indicators hides that line |

### Colours

| Token | Default | Controls |
|---|---|---|
| `--stepper-list-connector-color` | `currentColor` | Connector line colour |
| `--stepper-list-connector-image` | `none` | Image painted over the connector colour, e.g. a `repeating-linear-gradient()` for a dashed or dotted line (set the colour to `transparent` underneath) |
| `--stepper-list-icon-color` | `currentColor` | Icon colour for custom `indicator-icon` elements |

### Circle indicator

| Token | Default | Controls |
|---|---|---|
| `--stepper-list-counter-circle-background` | `transparent` | Bubble fill |
| `--stepper-list-counter-circle-text` | `currentColor` | Counter number colour |
| `--stepper-list-counter-circle-border` | `currentColor` | Bubble border colour |
| `--stepper-list-counter-circle-border-radius` | `100vw` | Bubble corner rounding |

### Disc indicator

| Token | Default | Controls |
|---|---|---|
| `--stepper-list-counter-disc-background` | `transparent` | Bubble fill |
| `--stepper-list-counter-disc-text` | `currentColor` | Counter number colour |
| `--stepper-list-counter-disc-border` | `transparent` | Bubble border colour |
| `--stepper-list-counter-disc-border-radius` | `100vw` | Bubble corner rounding |

### Square indicator

| Token | Default | Controls |
|---|---|---|
| `--stepper-list-counter-square-background` | `transparent` | Bubble fill |
| `--stepper-list-counter-square-text` | `currentColor` | Counter number colour |
| `--stepper-list-counter-square-border` | `transparent` | Bubble border colour |
| `--stepper-list-counter-square-border-radius` | `0.25rem` | Bubble corner rounding |

The defaults above are the component's own fallbacks. The library's default theme
(`app/assets/styles/setup/03.theming/_default.css`) sets blue values for the colour tokens on
`:root`, so that's what you see unless your app replaces that theme file or overrides them.

> Changed 2026-09-27: the default theme set `--stepper-list-icon`, a name the component never
> reads, so custom indicator icons fell back to `currentColor`. It now sets
> `--stepper-list-icon-color`.

Private (not public API): `--_counter-size` and `--_padding-block`, plus `--_connector-left`,
`--_connector-top` and `--_connector-height`, which script measures and sets inline on each `<li>`.

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `.has-connectors` | root | `connected` is on (default) |
| `.has-indicator` | `<li>` | That item has an `indicator-{n}` slot |
| `.indicator-top`, `.indicator-center` | `<li>` | `indicator-alignment` |
| `.indicator-disc`, `.indicator-square`, `.indicator-circle` | `<li>` | `indicator-variant` |

Inner classes: `.stepper-list-item` (each `<li>`), `.stepper-list__indicator-counter`
(auto-numbered bubble) or `.stepper-list__indicator-custom` (wraps a custom `indicator-{n}` slot),
and `.stepper-list-content` (wraps the `item-{n}` slot).

> Changed 2026-10-15: `<li>` gained `.stepper-list-item` and the content wrapper gained
> `.stepper-list-content` (it had no class). The content column is now `minmax(0, 1fr)` with
> `overflow-wrap: anywhere`, so an unbroken string or long URL wraps instead of widening the list.
> The root carries `role="list"`, since `list-style: none` drops list semantics in Safari.

---

## Global theming

Create `assets/styles/setup/07.components/stepper-list.css` in the consuming app and set
tokens on `:root`. This applies to every `StepperList` across the site.

```css
/* assets/styles/setup/07.components/stepper-list.css */
:root {
  --stepper-list-counter-disc-background: var(--brand-primary);
  --stepper-list-counter-disc-text: var(--brand-primary-contrast);
  --stepper-list-counter-disc-border: transparent;

  --stepper-list-counter-circle-text: var(--brand-primary);
  --stepper-list-counter-circle-border: var(--brand-primary);

  --stepper-list-counter-square-background: var(--brand-primary);
  --stepper-list-counter-square-text: var(--brand-primary-contrast);
  --stepper-list-counter-square-border: transparent;

  --stepper-list-connector-color: var(--brand-border);
  --stepper-list-icon-color: var(--brand-primary);
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### Page or section

Override tokens for a specific section by scoping them under the page or layout wrapper.
No `:deep()` is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.how-it-works {
  .stepper-list {
    --stepper-list-padding-block: 2rem;
    --stepper-list-gap: 3.2rem;
    --stepper-list-counter-size: 4rem;
    --stepper-list-counter-font-size: 1.6rem;
    --stepper-list-connector-color: var(--brand-border-subtle);
  }
}
```

### One instance

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct
visual style, pass a modifier class:

```vue
<StepperList
  :style-class-passthrough="['completed-steps']"
  indicator-variant="circle"
  :item-count="3"
>
  ...
</StepperList>
```

```css
.stepper-list.completed-steps {
  --stepper-list-counter-circle-background: var(--color-success);
  --stepper-list-counter-circle-text: white;
  --stepper-list-counter-circle-border: transparent;
  --stepper-list-connector-color: var(--color-success);
  --stepper-list-icon-color: var(--color-success);
}
```

---

## Recipe: per-step states and dashed connectors

The component has no "done / current / upcoming" prop. Put a state class on the content you pass
to each `#indicator-{n}` slot, then set tokens on the matching `.stepper-list-item` with `:has()`.
Each connector belongs to the item above it, so it takes that item's state.

```css
.onboarding-steps {
  --stepper-list-connector-color: transparent;
  --stepper-list-connector-image: repeating-linear-gradient(to bottom, #3a3d45 0 0.2rem, transparent 0.2rem 0.6rem);

  .stepper-list-item:has(.step-marker.is-done) {
    --stepper-list-connector-image: repeating-linear-gradient(to bottom, #00c8d7 0 0.4rem, transparent 0.4rem 0.7rem);
  }
}
```

Shapes such as diamonds go in the indicator slot (a rotated square). The connector is centred on
whatever the slot renders, so it needs no adjustment. The "Timeline (styled demo)" story shows the
full pattern.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `<ul>`/`<ol>`. Tokens set on a passthrough class
land for the whole list. Reactive after mount.

---

## Notes

- `--stepper-list-counter-size` takes precedence over the `indicatorSize` prop. Use the prop
  for programmatic/template control; use the CSS token for pure-CSS theme overrides.
- The connector line is positioned by JS (`ResizeObserver`) on each `<li>` as
  `--_connector-left`, `--_connector-top` and `--_connector-height`, centred on the measured
  indicator, so it lines up under a custom indicator wider than `--stepper-list-counter-size`.
  These are internal — do not set them.
- `--stepper-list-connector-color` defaults to `currentColor`, inheriting from the nearest
  ancestor's text colour. Set it explicitly when that behaviour is undesirable.
- All border tokens (`--stepper-list-counter-*-border`) control the **colour** only — the
  border is always `2px solid`. Override the border shorthand directly on `.stepper-list li
  .stepper-list__indicator-counter::before` if you need a different width.
