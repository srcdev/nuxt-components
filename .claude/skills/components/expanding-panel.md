# ExpandingPanel Component

## Overview

`ExpandingPanel` is a single expand/collapse panel built on the native `<details>`/`<summary>` element. It animates open/close via a CSS grid-template-rows trick, supports `v-model` for controlled state, and can be locked open with `forceOpened`. Multiple panels can be grouped into a native accordion by sharing the same `name` prop (see `AccordianCore`).

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | `string` | `useId()` | Identifies the panel. Used in ARIA attributes (`id-{name}-trigger`, `id-{name}-content`). If omitted, a unique id is generated automatically. |
| `animationDuration` | `number` | `400` | Expand/collapse transition duration in milliseconds. Pass `0` to disable animation. |
| `forceOpened` | `boolean` | `false` | When `true`, the panel is always open. The toggle icon is hidden and clicks do not close the panel. |
| `contentIsOnTop` | `boolean` | `false` | When `true`, the content region is taken out of flow and absolutely positioned directly below the summary, raised above surrounding page content via `z-index` — instead of pushing layout down when it opens. Applies a `content-is-on-top` class to the root `.expanding-panel` element (not the content div). |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `.expanding-panel` element. |

## Model

| Model | Type | Default | Notes |
|-------|------|---------|-------|
| `v-model` | `boolean` | `false` | Controls open/closed state. Bind to a `ref<boolean>` to manage state externally. |

---

## Slots

| Slot | Purpose |
|------|---------|
| `#summary` | Content rendered inside the clickable `<summary>` row (label area). |
| `#icon` | Custom toggle icon. Defaults to a `bi:caret-down-fill` icon that flips on open. Hidden when `forceOpened` is `true`. |
| `#content` | Content revealed when the panel is open. Can contain any markup. |

---

## Usage examples

### Basic uncontrolled panel

```vue
<ExpandingPanel name="delivery">
  <template #summary>
    <span>Delivery &amp; Returns</span>
  </template>
  <template #content>
    <p>Free standard delivery on orders over £50.</p>
  </template>
</ExpandingPanel>
```

### Controlled via v-model

```vue
<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
  <ExpandingPanel name="faq-1" v-model="isOpen">
    <template #summary><span>What is your returns policy?</span></template>
    <template #content><p>You can return any item within 30 days.</p></template>
  </ExpandingPanel>
  <button @click="isOpen = !isOpen">Toggle externally</button>
</template>
```

### Force opened (always visible, no toggle)

```vue
<ExpandingPanel name="notice" :force-opened="true">
  <template #summary><strong>Important notice</strong></template>
  <template #content>
    <p>This panel cannot be collapsed.</p>
  </template>
</ExpandingPanel>
```

### Custom icon

```vue
<ExpandingPanel name="custom-icon">
  <template #summary><span>Section title</span></template>
  <template #icon>
    <svg width="12" height="12" viewBox="0 0 12 12">
      <path d="M6 9L1 3h10z" fill="currentColor" />
    </svg>
  </template>
  <template #content><p>Content here.</p></template>
</ExpandingPanel>
```

### Slow animation

```vue
<ExpandingPanel name="slow" :animation-duration="800">
  <template #summary><span>Slow panel</span></template>
  <template #content><p>Opens and closes over 800 ms.</p></template>
</ExpandingPanel>
```

### Content on top (overlay instead of pushing layout)

```vue
<ExpandingPanel name="overlay" :content-is-on-top="true" :style-class-passthrough="['my-overlay-panel']">
  <template #summary><span>Open me — content overlays what's below</span></template>
  <template #content>
    <!-- Wrapper INSIDE the slot carries the visual styling — see
         "Styling the content when contentIsOnTop" below for why it can't go on .inner -->
    <div class="my-overlay-panel-body">
      <p>Positioned absolutely below the summary, doesn't push page content down.</p>
    </div>
  </template>
</ExpandingPanel>

<style>
.my-overlay-panel-body {
  background-color: white;
  padding: 1rem;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}
</style>
```

---

## ARIA / accessibility

The component wires ARIA automatically from the `name` prop:

| Element | Attribute | Value |
|---------|-----------|-------|
| `<summary>` | `id` | `id-{name}-trigger` |
| `<summary>` | `aria-controls` | `id-{name}-content` |
| `<summary>` | `aria-expanded` | `true` / `false` |
| content div | `id` | `id-{name}-content` |
| content div | `aria-labelledby` | `id-{name}-trigger` |
| content div | `role` | `region` |

Always supply a meaningful `name` prop when using multiple panels on the same page to avoid duplicate IDs.

---

## Styling the content when contentIsOnTop

When `contentIsOnTop` is `true`, the component deliberately does **not** set `background-color`, `padding`, or a shadow on `.inner` — and consumers must not set them on `.inner` either. Always style a wrapper element placed *inside* the `#content` slot (see example above).

Why: `.expanding-panel-content` collapses via `grid-template-rows: 0fr → 1fr`, and `.inner` relies on `overflow: hidden` on its own box to clip its *children* to 0px when collapsed. `overflow: hidden` clips overflow content, but does not shrink the element's own padding/border/background — those are part of `.inner`'s own box model and still render at full size even while the row track is `0fr` and the panel is closed, producing a visible gap under the summary. A wrapper placed inside the slot is a *child* of `.inner`, so its box — including any padding/background/shadow — is correctly clipped to 0px by `.inner`'s `overflow: hidden` while closed. Baking styling into `.inner` itself would require also gating it on the open state (e.g. `.expanding-panel-details[open] ~ .expanding-panel-content .inner`), which is unnecessary complexity — styling the slot content is the correct fix, not a workaround.

---

## Constraint: don't stack contentIsOnTop panels as direct siblings

`contentIsOnTop` takes the content out of document flow (`position: absolute`) specifically so opening the panel does **not** push whatever comes after it down the page — that's the entire point of the prop. The tradeoff: the panel's own container still only occupies the height of its `<summary>` row, so a *sibling* element positioned directly after it in the DOM sits exactly where the overlay renders. When that sibling is another `ExpandingPanel`, opening the first one visually covers the second one's summary — this happens whether or not the two are grouped via a shared `name` (linked accordion) or opened simultaneously; it isn't specific to linking.

`contentIsOnTop` is designed for a **single** panel overlaying unrelated trailing page content (e.g. a promo banner, a footer strip) — not for stacking multiple `contentIsOnTop` panels beside each other expecting normal accordion behaviour. If you need several linked/stacked panels, leave `contentIsOnTop` off (the default, in-flow layout handles that case correctly).

---

## CSS Token Customization

All `--expanding-panel-*` tokens can be overridden at global, page, or instance scope. See `CONSUMER-STYLING.md` in the component directory for full token documentation and examples.

**Tokens:**

- `--expanding-panel-summary-gap` — gap between summary label and icon
- `--expanding-panel-summary-padding-block` — summary row vertical padding
- `--expanding-panel-icon-size` — toggle icon size
- `--expanding-panel-content-z-index` — stacking order when `contentIsOnTop` is `true`
- `--expanding-panel-content-gap` — space between summary and content when `contentIsOnTop` is `true`

---

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. Delete the block if unused.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<ExpandingPanel name="my-item" :style-class-passthrough="['my-panel']">
  ...
</ExpandingPanel>

<style>
/* ─── ExpandingPanel local overrides ───────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.expanding-panel {
  &.my-panel {
    /* Border */
    /* border-block-end: 1px solid currentColor; */

    /* Summary row geometry */
    /* .expanding-panel-details .expanding-panel-summary { padding-block: 1.2rem; } */
  }
}
</style>
```

---

## Notes

- The open/close animation uses `grid-template-rows: 0fr → 1fr` — no JS height measurement needed.
- `content-is-on-top` is applied to the root `.expanding-panel` element, not `.expanding-panel-content` — style overrides must scope through it, e.g. `.expanding-panel.my-panel .expanding-panel-content .inner { ... }`.
- When `forceOpened` is `true`, `open` stays `true` regardless of `v-model`, but `v-model` still updates internally on clicks (useful if you later set `forceOpened` back to `false`).
- Group panels into a native accordion (only one open at a time) by passing the same `name` to multiple panels or use `AccordianCore` which handles this automatically.
- Auto-imported in Nuxt — no manual import needed.
- File: `app/components/02.molecules/expandable/expanding-panel/ExpandingPanel.vue`
