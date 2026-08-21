# AccordianCore Component

## Overview

`AccordianCore` renders a group of `ExpandingPanel` components (or `ExpandingPanelClassic`, via the `variant` prop). When a shared `name` prop is supplied, the native `<details>` behaviour ensures only one panel can be open at a time. Content is filled via **indexed dynamic slots** — one set per panel, driven by `itemCount`.

---

## Dynamic slot pattern

For `itemCount="3"` the following slots exist:

| Slot | Purpose |
|------|---------|
| `#accordian-0-summary` | Clickable label for panel 0 |
| `#accordian-0-icon` | Custom toggle icon for panel 0 (optional) |
| `#accordian-0-content` | Expandable content for panel 0 |
| `#accordian-1-summary` | Clickable label for panel 1 |
| `#accordian-1-icon` | Custom toggle icon for panel 1 (optional) |
| `#accordian-1-content` | Expandable content for panel 1 |
| … | … |

**Rules:**
- Slots are **zero-indexed**: first panel = `accordian-0-*`, last = `accordian-{itemCount - 1}-*`.
- `accordian-{n}-summary` and `accordian-{n}-content` are the primary slots — always provide these.
- `accordian-{n}-icon` is optional. When omitted, the default `ExpandingPanel` caret icon is used.
- Always keep `itemCount` in sync with the number of slot sets you provide.

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | `string` | `undefined` | Shared `name` passed to every `ExpandingPanel`. When set, native `<details>` grouping means only one panel can be open at a time. Omit for independent panels. |
| `itemCount` | `number` | `0` | Number of `ExpandingPanel` components to render. |
| `animationDuration` | `number` | `300` | Expand/collapse animation duration in ms, forwarded to every panel. |
| `variant` | `"modern" \| "classic"` | `"modern"` | `"modern"` renders each panel as `ExpandingPanel` (`::details-content`-based, Baseline "newly available" Sept 2025 — the animation itself only runs where `interpolate-size` is supported, Chromium only as of 2026). `"classic"` renders `ExpandingPanelClassic` instead (`grid-template-rows`-based, animates identically in every browser). Applies to every panel in the group — mixing variants within one `AccordianCore` isn't supported. See [expanding-panel-classic.md](expanding-panel-classic.md). |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `.display-accordian` element. |

---

## Usage examples

### Basic accordion (exclusive open)

```vue
<AccordianCore name="faq" :item-count="3" :animation-duration="300">
  <template #accordian-0-summary><span>What is your returns policy?</span></template>
  <template #accordian-0-content>
    <p>You can return any item within 30 days of purchase.</p>
  </template>

  <template #accordian-1-summary><span>How long does delivery take?</span></template>
  <template #accordian-1-content>
    <p>Standard delivery takes 3–5 working days.</p>
  </template>

  <template #accordian-2-summary><span>Do you ship internationally?</span></template>
  <template #accordian-2-content>
    <p>Yes — we ship to over 40 countries.</p>
  </template>
</AccordianCore>
```

Passing `name="faq"` groups all panels so only one can be open at a time.

### Independent panels (no name — each opens freely)

```vue
<AccordianCore :item-count="2">
  <template #accordian-0-summary><span>Panel A</span></template>
  <template #accordian-0-content><p>Content A</p></template>

  <template #accordian-1-summary><span>Panel B</span></template>
  <template #accordian-1-content><p>Content B</p></template>
</AccordianCore>
```

### Custom icons per panel

```vue
<AccordianCore :item-count="2">
  <template #accordian-0-summary><span>Section one</span></template>
  <template #accordian-0-icon><span>＋</span></template>
  <template #accordian-0-content><p>Content one</p></template>

  <template #accordian-1-summary><span>Section two</span></template>
  <template #accordian-1-icon><span>＋</span></template>
  <template #accordian-1-content><p>Content two</p></template>
</AccordianCore>
```

### Classic variant (animation must run in every browser)

```vue
<AccordianCore name="faq" :item-count="2" variant="classic">
  <template #accordian-0-summary><span>Question one?</span></template>
  <template #accordian-0-content><p>Answer one.</p></template>

  <template #accordian-1-summary><span>Question two?</span></template>
  <template #accordian-1-content><p>Answer two.</p></template>
</AccordianCore>
```

### Programmatic slot rendering (many items)

```vue
<AccordianCore :item-count="items.length">
  <template v-for="(item, i) in items" #[`accordian-${i}-summary`] :key="i">
    <span>{{ item.title }}</span>
  </template>
  <template v-for="(item, i) in items" #[`accordian-${i}-content`] :key="i">
    <p>{{ item.body }}</p>
  </template>
</AccordianCore>
```

---

## CSS custom properties

`AccordianCore` has no `--accordian-*` tokens of its own — its panels are `ExpandingPanel`
(or `ExpandingPanelClassic`, per `variant`) underneath, so `--expanding-panel-*` tokens apply
directly. See `CONSUMER-STYLING.md` in the component directory for the full override reference,
including the `.accordian-item` hook and the variant-dependent root class.

Override in a consuming component or theme block:

| Property | Effect |
|----------|--------|
| Applied via `accordian-item` class on each panel | Panels animate `margin-block-end` and `border-radius` alongside the expand transition — duration follows `animationDuration`. |

---

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. Delete the block if unused.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<AccordianCore :style-class-passthrough="['my-accordian']" :item-count="3">
  ...
</AccordianCore>

<style>
/* ─── AccordianCore local overrides ────────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.display-accordian {
  &.my-accordian {
    /* Geometry */
    /* max-width: none; */ /* default is 600px — remove the width cap */

    /* Panel-level overrides via the .accordian-item hook — .expanding-panel is the
       root class rendered by the default "modern" variant; swap in
       .expanding-panel-classic if this instance uses variant="classic" */
    .accordian-item.expanding-panel {
      /* Border */
      /* border-block-end: 1px solid currentColor; */

      /* Geometry */
      /* border-radius: 0.8rem; */
    }
  }
}
</style>
```

---

## Notes

- `AccordianCore` always passes `style-class-passthrough="['accordian-item']"` to every inner panel — use `.accordian-item` as the hook for per-panel styling overrides.
- `variant` applies to the whole group — every panel in a given `AccordianCore` renders as the same component. Switching `variant` at runtime swaps every panel's underlying component (via `<component :is>`), which resets each panel's open/closed state.
- For a single standalone expand/collapse panel, use `ExpandingPanel` (or `ExpandingPanelClassic`) directly instead.
- Auto-imported in Nuxt — no manual import needed.
- File: `app/components/02.molecules/expandable/accordian/AccordianCore.vue`
