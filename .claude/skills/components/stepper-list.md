# StepperList Component

## Overview

`StepperList` is a numbered/stepped list component where each item has a visual indicator (a counter bubble or custom icon) and a content area. Indicators can optionally be connected by a vertical line between them. The number of items is controlled by the `itemCount` prop — content is filled via **dynamic named slots**.

---

## Dynamic slot pattern

`StepperList` generates slots based on `itemCount`. For `itemCount="3"` the following slots exist:

| Slot | Purpose |
|------|---------|
| `#item-0` | Content of the first list item |
| `#item-1` | Content of the second list item |
| `#item-2` | Content of the third list item |
| `#indicator-0` | Custom indicator replacing the default counter bubble for item 0 |
| `#indicator-1` | Custom indicator replacing the default counter bubble for item 1 |
| … | … |

**Rules:**
- Slots are always **zero-indexed**: first item = `item-0`, last item = `item-{itemCount - 1}`.
- `item-{n}` slots are required if you want content in each row.
- `indicator-{n}` slots are **optional**. When omitted, a CSS counter bubble is rendered automatically. When provided, the custom content replaces the counter entirely — the CSS counter is hidden for that item only.
- You can mix custom indicators and counter bubbles across items in the same list.
- Always set `itemCount` to match the number of `#item-*` slots you provide.

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `itemCount` | `number` | — | **Required.** Controls how many `<li>` elements are rendered and which slots exist. |
| `tag` | `"ul" \| "ol"` | `"ul"` | Use `"ol"` for sequentially meaningful content (recipes, instructions). |
| `indicatorAlignment` | `"top" \| "center"` | `"top"` | Vertical alignment of the indicator relative to each item's content. `"center"` suits single-line items; `"top"` suits multi-line content. |
| `indicatorVariant` | `"disc" \| "circle" \| "square"` | `"disc"` | Visual style of the auto-generated counter bubble. |
| `indicatorSize` | `string` | `"3rem"` | Any valid CSS length — controls the width/height of the indicator bubble. |
| `connected` | `boolean` | `true` | Draws a vertical connector line between indicators. JS measures indicator positions to calculate the line height precisely. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root element. |

---

## Usage examples

### Basic counter list (no indicator slots)

```vue
<StepperList :itemCount="3" indicatorVariant="disc">
  <template #item-0><p>Plan your project goals</p></template>
  <template #item-1><p>Set up your development environment</p></template>
  <template #item-2><p>Ship and monitor</p></template>
</StepperList>
```

Counter bubbles are rendered automatically via CSS — no `#indicator-*` slots needed.

### Ordered list with connectors

```vue
<StepperList tag="ol" :itemCount="4" :connected="true" indicatorVariant="circle">
  <template #item-0><p>Preheat the oven to 180°C</p></template>
  <template #item-1><p>Sift together the flour and baking powder</p></template>
  <template #item-2><p>Cream the butter and sugar until fluffy</p></template>
  <template #item-3><p>Bake for 25–30 minutes</p></template>
</StepperList>
```

### Custom indicator icons (SVG)

```vue
<StepperList :itemCount="3">
  <template #indicator-0>
    <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </template>
  <template #item-0><p>Identity verified</p></template>

  <template #indicator-1>
    <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </template>
  <template #item-1><p>Payment confirmed</p></template>

  <template #indicator-2>
    <svg class="indicator-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  </template>
  <template #item-2><p>Awaiting email confirmation</p></template>
</StepperList>
```

Custom indicator SVGs should use the `indicator-icon` class — it applies `color: var(--stepper-list-icon)` and sizes the icon to match `indicatorSize`.

### Mixed — custom icons for completed steps, counters for pending

```vue
<StepperList :itemCount="4" :connected="true">
  <!-- Completed steps: custom checkmark icon -->
  <template #indicator-0>
    <svg class="indicator-icon" ...>...</svg>
  </template>
  <template #item-0><p>Account created</p></template>

  <template #indicator-1>
    <svg class="indicator-icon" ...>...</svg>
  </template>
  <template #item-1><p>Email verified</p></template>

  <!-- Pending steps: no indicator slot → CSS counter bubble shown -->
  <template #item-2><p>Choose a plan</p></template>
  <template #item-3><p>Start building</p></template>
</StepperList>
```

### Rich item content (heading + body)

```vue
<StepperList tag="ol" :itemCount="3">
  <template #item-0>
    <div>
      <strong>Create your account</strong>
      <p style="margin: 0.25rem 0 0">Enter your email and choose a password.</p>
    </div>
  </template>
  <template #item-1>
    <div>
      <strong>Verify your email</strong>
      <p style="margin: 0.25rem 0 0">Click the link we sent to your inbox.</p>
    </div>
  </template>
  <template #item-2>
    <div>
      <strong>Start building</strong>
      <p style="margin: 0.25rem 0 0">You're all set — open your dashboard.</p>
    </div>
  </template>
</StepperList>
```

---

## CSS custom properties

Override these in your consuming component or theme to restyle the indicators and connectors:

| Property | Used by |
|----------|---------|
| `--stepper-list-counter-disc-background` | Disc variant counter bubble background |
| `--stepper-list-counter-disc-text` | Disc variant counter number colour |
| `--stepper-list-counter-disc-border` | Disc variant counter border colour |
| `--stepper-list-counter-circle-background` | Circle variant counter bubble background |
| `--stepper-list-counter-circle-text` | Circle variant counter number colour |
| `--stepper-list-counter-circle-border` | Circle variant counter border colour |
| `--stepper-list-counter-square-background` | Square variant counter bubble background |
| `--stepper-list-counter-square-text` | Square variant counter number colour |
| `--stepper-list-counter-square-border` | Square variant counter border colour |
| `--stepper-list-connector-color` | Connector line colour (defaults to `currentColor`) |
| `--stepper-list-icon` | Icon colour for custom `indicator-icon` SVGs |

---

## Connector behaviour

- Connectors are drawn as `::after` pseudo-elements on each `<li>` except the last.
- JS (`ResizeObserver`) measures the bottom of each indicator and the top of the next to set `--_connector-top` and `--_connector-height` precisely, keeping the line flush between bubbles regardless of content height.
- Before JS runs (SSR / initial paint), CSS fallback values approximate the correct position for `indicatorAlignment="top"`.
- If `connected="false"`, no connectors are rendered and JS measurement is skipped.
- Connectors recalculate automatically when `itemCount`, `connected`, or `indicatorAlignment` props change.

---

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. Delete the block if unused.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<StepperList :style-class-passthrough="['my-stepper']" :item-count="3">
  ...
</StepperList>

<style>
/* ─── StepperList local overrides ──────────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.stepper-list {
  &.my-stepper {
    /* Counter bubble — disc variant */
    /* --stepper-list-counter-disc-background: var(--brand-primary); */
    /* --stepper-list-counter-disc-text: white; */
    /* --stepper-list-counter-disc-border: transparent; */

    /* Counter bubble — circle variant */
    /* --stepper-list-counter-circle-background: transparent; */
    /* --stepper-list-counter-circle-text: var(--brand-primary); */
    /* --stepper-list-counter-circle-border: var(--brand-primary); */

    /* Counter bubble — square variant */
    /* --stepper-list-counter-square-background: var(--brand-primary); */
    /* --stepper-list-counter-square-text: white; */
    /* --stepper-list-counter-square-border: transparent; */

    /* Custom indicator icon colour */
    /* --stepper-list-icon: var(--brand-primary); */

    /* Connector line */
    /* --stepper-list-connector-color: var(--brand-primary); */
  }
}
</style>
```

---

## Notes

- Always keep `itemCount` in sync with the number of `#item-*` slots you provide — mismatches will render empty `<li>` rows.
- Slot names are **zero-indexed** — `#item-0` not `#item-1`.
- The `indicator-icon` class is defined inside the component CSS and sizes the SVG to `var(--_counter-size)` (driven by `indicatorSize`). Always add it to custom SVGs.
- Auto-imported in Nuxt — no manual import needed.
