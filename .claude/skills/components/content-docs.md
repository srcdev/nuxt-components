# ContentDocs Component

## Overview

`ContentDocs` is a docs-page layout shell: a primary nav column, a main content column, and an "on this page" nav column, arranged via CSS `@container` queries (not viewport breakpoints) so the layout adapts to the space actually available — correct even when a consumer page has its own decoration (e.g. a site-wide left nav) eating into the viewport.

`docsNav` and `docsPageNav` are **not** slots — they're rendered internally as `ExpandingPanel` accordions driven by `docsNavItems`/`docsPageNavItems` props. Only `docsContent` remains a slot, since it's arbitrary page content. The two side panels auto force-open/collapse based on the component's own measured width via `useContainerBreakpoints`, and share a native `<details name>` accordion group only on mobile (see "Breakpoint behaviour" below).

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | Root element tag. |
| `docsNavItems` | `DocsNavItem[]` | `[]` | Items rendered in the `docsNav` panel. Panel (and its `.docs-nav` wrapper) is omitted entirely when empty. |
| `docsPageNavItems` | `DocsNavItem[]` | `[]` | Items rendered in the `docsPageNav` panel. Panel omitted entirely when empty. |
| `docsNavLabel` | `string` | `"Navigation"` | Heading text for the `docsNav` panel's `#summary`. |
| `docsPageNavLabel` | `string` | `"On this page"` | Heading text for the `docsPageNav` panel's `#summary`. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `.content-docs` element. |

`DocsNavItem` (from `~/types/components`):

```ts
interface DocsNavItem {
  label: string;
  to: string;
  icon?: string; // Icon name, e.g. "lucide:rocket"
}
```

## Model

| Model | Type | Default | Notes |
|-------|------|---------|-------|
| `v-model:activeNavItem` | `string \| undefined` | `undefined` | The `to` of the currently-active `docsNav` item. Updates automatically on click; bind externally (e.g. to route matching) to control it. |
| `v-model:activePageNavItem` | `string \| undefined` | `undefined` | Same, for `docsPageNav`. |

Open/expanded state of the two panels is **not** exposed as a model to `ContentDocs`' own consumers — externally it's driven entirely by the container-width breakpoint logic (see below), not user-controllable. Internally, each panel is still a controlled `ExpandingPanel` (`v-model`, not left uncontrolled) so it can be closed programmatically — see "Mobile overlay dismissal" below.

---

## Slots

| Slot | Purpose |
|------|---------|
| `#docsContent` | Main page content. Only slot this component exposes. |

---

## Usage example

```vue
<script setup lang="ts">
import type { DocsNavItem } from "~/types/components";

const docsNavItems: DocsNavItem[] = [
  { label: "Getting started", to: "/docs", icon: "lucide:rocket" },
  { label: "Installation", to: "/docs/install" },
];
const docsPageNavItems: DocsNavItem[] = [
  { label: "Overview", to: "/docs#overview" },
];

const activeNavItem = ref<string | undefined>(docsNavItems[0]?.to);
const activePageNavItem = ref<string | undefined>(undefined);
</script>

<template>
  <ContentDocs
    v-model:active-nav-item="activeNavItem"
    v-model:active-page-nav-item="activePageNavItem"
    :docs-nav-items="docsNavItems"
    :docs-page-nav-items="docsPageNavItems"
  >
    <template #docsContent>
      <h1>Page title</h1>
      <p>Page content.</p>
    </template>
  </ContentDocs>
</template>
```

---

## Breakpoint behaviour

Widths are measured on the component's own root element (`useContainerBreakpoints`, container-name `contentDocs`), **not** the viewport — this is deliberate, so nested page decoration (nav rails, sidebars) that shrinks the actual available space is correctly accounted for. Thresholds: `tablet: 768px`, `desktop: 1024px`, matching the `@container contentDocs` queries in this component's own `<style>` block. If you change one, change the other.

| Width | `docsNav` | `docsPageNav` |
|-------|-----------|----------------|
| < 768px (mobile) | collapsible, closed by default | collapsible, closed by default |
| 768–1023px (tablet) | collapsible, closed by default | **forced open**, no toggle icon |
| ≥ 1024px (desktop) | **forced open**, no toggle icon | **forced open**, no toggle icon |

Below 1024px (i.e. whenever a panel isn't `forceOpened`), it's also `contentIsOnTop` — an overlay, not in-flow — since a collapsible nav panel pushing page content down/up as it opens reads as janky on mobile/tablet. See "Mobile overlay dismissal" below for how these are closed.

### Mobile overlay dismissal

Below 1024px, `docsNav`/`docsPageNav` are `contentIsOnTop` `ExpandingPanel`s (see the breakpoint table above), so they need an explicit way to close again beyond just toggling the summary:

- **Click outside** — inherited for free from `ExpandingPanel`'s own `contentIsOnTop` behaviour (see `expanding-panel.md`), no extra wiring in `ContentDocs` itself.
- **Clicking a nav link inside the open panel** — `ContentDocs` does not leave either `ExpandingPanel` uncontrolled: it holds its own `docsNavPanelOpen`/`docsPageNavPanelOpen` refs, bound via `v-model`, and each nav link's click handler sets its panel's ref to `false` in addition to updating `activeNavItem`/`activePageNavItem`. Without this, selecting a link would leave the overlay open on top of the page it just navigated to.

Both are no-ops at desktop/tablet where a panel is `forceOpened` — `open` there is `forceOpened || isPanelOpen`, so `forceOpened` wins regardless of what these refs are set to.

### DOM order vs visual order (accessibility)

In the template, `docsContent` is placed **before** `docsNav`/`docsPageNav` — the reverse of their left-to-right visual position at desktop. This is deliberate: `docsNav`/`docsPageNav` each render an `<h3>` heading (`docsNavLabel`/`docsPageNavLabel`), and if they came first in the DOM, a screen-reader user navigating by heading would hit one of those h3s *before* the consuming page's own `h1` inside `docsContent` — a broken heading outline. Visual position is unaffected because layout comes from `grid-template-areas` (see the `<style>` block), not source order. The trade-off: default Tab order now reaches main content before the side nav — an accepted consequence, not a regression to "fix" back by reverting the order.

### Why the two panels share a `name` only on mobile

Both panels are `ExpandingPanel`s using the native `<details name="...">` grouping feature, which makes same-named panels mutually exclusive (browser force-closes one when the other opens). That's the wanted behaviour on mobile (accordion — only one open at a time), but at tablet/desktop both panels must be open **simultaneously** — a shared name there would make the browser silently force-close one of them the moment both try to be open. So the component computes distinct names (`"docsNav"` / `"docsPageNav"`) once past mobile, and a shared name (`"docsPanelGroup"`) only while mobile.

### Related fix in ExpandingPanel.vue

Building this component's forced-open/forced-closed cycling surfaced a real bug in `ExpandingPanel.vue`: `forceOpened` driving the native `open` attribute fires the element's own `toggle` event, which — before the fix — leaked into `isPanelOpen` (the user-click model), leaving the panel permanently "remembered open" even after `forceOpened` reverted to `false`. Fixed by ignoring toggle events while `forceOpened` is `true`. See `expanding-panel.md` and the `ExpandingPanel.spec.ts` regression test ("does not leak forceOpened into isPanelOpen...").

---

## Icons

`DocsNavItem.icon` is optional (any icon name resolvable by `<Icon>`, e.g. Lucide set: `"lucide:rocket"`). Items without an icon still align correctly with icon-bearing items — the link is `display: grid` with a fixed-width icon column (`--docs-nav-link-icon-size`), not `flex`, so an absent icon doesn't collapse the label leftward.

To move the icon to the end of the link instead of the start, set `--docs-nav-link-icon-order` (or `--docs-page-nav-link-icon-order`) to `rtl` (default `ltr`). This uses a `direction` flip to mirror which physical side the fixed-width column renders on, rather than swapping `grid-column` values directly — swapping columns would put the label into the icon-sized track and squeeze it. The icon and label content reset `direction: ltr` internally so text/glyphs don't visually mirror.

---

## CSS Token Customization

All `--content-docs-*` tokens can be overridden at global, page, or instance scope. Each has a **shared** version (applies to both `docsNav` and `docsPageNav`) and a **per-side** override (`content-docs-nav-*` / `content-docs-page-nav-*`) that falls back to the shared token if unset.

**Heading tokens** (shared: `--content-docs-heading-*`, per-side: `--content-docs-{nav,page-nav}-heading-*`):
- `-font-size`, `-font-weight`, `-color`, `-bg`, `-margin`, `-padding-block`, `-padding-inline`

**Panel tokens** (shared: `--content-docs-panel-*`, per-side: `--content-docs-{nav,page-nav}-panel-bg`):
- `-bg` (default: `light-dark(var(--slate-00), var(--slate-10))`, the project's standard card-surface token), `-padding-block`, `-padding-inline`, `-border-radius`

**Link tokens** (shared: `--content-docs-link-*`, per-side: `--content-docs-{nav,page-nav}-link-*`):
- `-font-size`, `-padding-block`, `-padding-inline`, `-margin-block`, `-border-radius`, `-color`, `-bg`, `-hover-bg`, `-hover-color`, `-active-bg`, `-active-color`

**Column-width tokens** (fixed-width grid tracks at tablet/desktop):
- `--content-docs-nav-column-width` (default `23rem`, desktop `docsNav` track)
- `--content-docs-page-nav-column-width` (default `22rem`, desktop `docsPageNav` track)
- `--content-docs-page-nav-column-width-tablet` (default `20rem`, tablet's single fixed track — `docsNav` is full-width at tablet)

**Icon tokens** (not `content-docs-` prefixed — shared with the link, not per-side by default):
- `--docs-nav-link-icon-gap`, `--docs-nav-link-icon-size`, `--docs-nav-link-icon-order` (`ltr`/`rtl`), `--docs-page-nav-link-icon-order`

---

## Local style override scaffold

```vue
<ContentDocs :style-class-passthrough="['my-docs']" ...>
  ...
</ContentDocs>

<style>
.content-docs {
  &.my-docs {
    --content-docs-panel-bg: var(--surface-2);
    --content-docs-link-active-bg: var(--brand-01);
    --content-docs-link-active-color: var(--brand-10);
  }
}
</style>
```

---

## Notes

- `docsContent` visibility is slot-detected (`useSlots().docsContent`); `docsNav`/`docsPageNav` visibility is item-array-length-detected (`docsNavItems.length > 0`) — different mechanisms, since only `docsContent` is still a real slot.
- `NuxtLink` resolved via `resolveComponent("NuxtLink")`, not imported from `#components` — required so this component works inside Storybook (see `feedback_no_components_import_storybook`).
- Auto-imported in Nuxt — no manual import needed.
- File: `app/components/01.atoms/content-wrappers/docs-pages/ContentDocs.vue`
- Types: `app/types/components/content-docs.d.ts` (`DocsNavItem`)
- Tests: `app/components/01.atoms/content-wrappers/docs-pages/tests/ContentDocs.spec.ts`
- Demo page: `app/pages/ui/layout-content-docs.vue`
