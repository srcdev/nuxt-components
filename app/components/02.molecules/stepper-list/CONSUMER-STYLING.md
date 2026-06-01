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

### Colours

| Token | Default | Controls |
|---|---|---|
| `--stepper-list-connector-color` | `currentColor` | Connector line colour |
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

---

## Global theming — recommended approach

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

## Page-scoped overrides

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

---

## Per-instance overrides via styleClassPassthrough

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

## Notes

- `--stepper-list-counter-size` takes precedence over the `indicatorSize` prop. Use the prop
  for programmatic/template control; use the CSS token for pure-CSS theme overrides.
- The connector line is positioned by JS (`ResizeObserver`) on each `<li>` as
  `--_connector-top` and `--_connector-height`. These are internal — do not set them.
- `--stepper-list-connector-color` defaults to `currentColor`, inheriting from the nearest
  ancestor's text colour. Set it explicitly when that behaviour is undesirable.
- All border tokens (`--stepper-list-counter-*-border`) control the **colour** only — the
  border is always `2px solid`. Override the border shorthand directly on `.stepper-list li
  .stepper-list__indicator-counter::before` if you need a different width.
