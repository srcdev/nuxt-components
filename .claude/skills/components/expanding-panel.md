# ExpandingPanel Component

## Overview

`ExpandingPanel` is a single expand/collapse panel built on the native `<details>`/`<summary>` element. It animates open/close by styling the `::details-content` pseudo-element (the browser's own anonymous box wrapping everything after `<summary>`) where supported, supports `v-model` for controlled state, and can be locked open with `forceOpened`. Multiple panels can be grouped into a native accordion by sharing the same `name` prop (see `AccordianCore`).

**WebKit (Safari/iOS) does not support `::details-content`** as of 2026-08, confirmed via real-device testing — Chrome's device-emulation mode cannot catch this, since it's still the Blink engine underneath regardless of which browser UI it's simulating. WebKit silently drops the whole rule block: no animation and (more seriously) `content-is-on-top`'s `position: absolute` never applying, so an overlay panel renders in normal document flow and can break the surrounding layout. An `@supports not selector(::details-content)` CSS-only fallback was tried (2026-08-22) but didn't reliably kick in on real devices either and was reverted the same day — **do not reintroduce that approach**.

**The actual fix is component-level, not CSS-level**: every consumer that gave `ExpandingPanel` a choice of implementation now defaults to `ExpandingPanelClassic` instead — see `AccordianCore`'s `variant` prop (default `"classic"`), `ContentDocs`'s `panelVariant` prop (default `"classic"`), and `ResponsiveHeader`/`NavigationItems`'s `panelVariant` prop (default `"classic"`). `ExpandingPanel` itself is unchanged (still `::details-content`-only, no fallback) and logs a `console.warn` in dev mode on every mount warning about this. Reach for `ExpandingPanel` directly, or pass `variant`/`panelVariant: "modern"` to one of the above, only once you've confirmed it's acceptable for your actual audience — it is **not** the safe default anywhere in this library anymore. See pitfall #19 in the repo's `CLAUDE.md` for the full history.

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | `string` | `useId()` | Identifies the panel. Used in ARIA attributes (`id-{name}-trigger`, `id-{name}-content`). If omitted, a unique id is generated automatically. |
| `animationDuration` | `number` | `400` | Expand/collapse transition duration in milliseconds. Pass `0` to disable animation. |
| `forceOpened` | `boolean` | `false` | When `true`, the panel is always open. The toggle icon is hidden and clicks do not close the panel. |
| `contentIsOnTop` | `boolean` | `false` | When `true`, the content region is taken out of flow and absolutely positioned directly below the summary, raised above surrounding page content via `z-index` — instead of pushing layout down when it opens. Applies a `content-is-on-top` class to the root `.expanding-panel` element (not the content div). Also enables click-outside-to-close (see below) — not applied when `forceOpened` is `true`. |
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

`background-color`, `padding`, and a shadow can be set directly on `.expanding-panel-content` (or on a wrapper inside the `#content` slot — either works): the clipping boundary is `::details-content` itself (`overflow: clip`, animated `height`), and `.expanding-panel-content` is a *child* of that box, so its own box is correctly clipped regardless of where the styling lives.

If this needs to work correctly on WebKit too, use `ExpandingPanelClassic` instead (see the Overview section above) — its equivalent guidance lives in its own `CONSUMER-STYLING.md`, and its `.expanding-panel-classic-content > .inner` structure differs slightly.

---

## Constraint: don't stack contentIsOnTop panels as direct siblings

`contentIsOnTop` takes the content out of document flow (`position: absolute`) specifically so opening the panel does **not** push whatever comes after it down the page — that's the entire point of the prop. The tradeoff: the panel's own container still only occupies the height of its `<summary>` row, so a *sibling* element positioned directly after it in the DOM sits exactly where the overlay renders. When that sibling is another `ExpandingPanel`, opening the first one visually covers the second one's summary — this happens whether or not the two are grouped via a shared `name` (linked accordion) or opened simultaneously; it isn't specific to linking.

`contentIsOnTop` is designed for a **single** panel overlaying unrelated trailing page content (e.g. a promo banner, a footer strip) — not for stacking multiple `contentIsOnTop` panels beside each other expecting normal accordion behaviour. If you need several linked/stacked panels, leave `contentIsOnTop` off (the default, in-flow layout handles that case correctly).

---

## Click-outside-to-close (contentIsOnTop only)

When `contentIsOnTop` is `true` and the panel is open, clicking anywhere outside the panel's root element closes it (via `@vueuse/core`'s `onClickOutside`, sets `v-model` to `false`) — matching the dismissal behaviour of a native `<select>` or dropdown menu, since that's what an overlay panel functionally is. This does **not** apply to ordinary in-flow panels (`contentIsOnTop: false`, the default) — an inline accordion staying open when you click elsewhere on the page is expected, not a bug. It also never applies when `forceOpened` is `true`, regardless of `contentIsOnTop` — a forced-open panel isn't dismissible by any interaction.

If you also want the panel to close when something *inside* it is activated (e.g. a nav link) — clicking outside doesn't cover that case — set `v-model` to `false` from that element's own click handler, same as any other controlled usage. See `ContentDocs`' `docsNav`/`docsPageNav` panels for a real example: both are `contentIsOnTop` on mobile, and each nav link closes its panel on click in addition to relying on click-outside.

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

- The open/close animation targets `::details-content` (`height: 0 → auto`, `overflow: clip`) — no JS height measurement needed. Requires `interpolate-size: allow-keywords` for the height transition itself (Chromium only as of 2026; other browsers with `::details-content` support still toggle correctly, just instantly). WebKit has neither, and there is no automatic fallback — use `ExpandingPanelClassic` (see the Overview section above) for anything that needs to work correctly there.
- `content-is-on-top` is applied to the root `.expanding-panel` element, not `.expanding-panel-content` — style overrides must scope through it, e.g. `.expanding-panel.my-panel .expanding-panel-content { ... }`.
- When `forceOpened` is `true`, `open` stays `true` regardless of `v-model`, but `v-model` still updates internally on clicks (useful if you later set `forceOpened` back to `false`).
- Group panels into a native accordion (only one open at a time) by passing the same `name` to multiple panels or use `AccordianCore` which handles this automatically.
- Auto-imported in Nuxt — no manual import needed.
- File: `app/components/02.molecules/expandable/expanding-panel/ExpandingPanel.vue`
