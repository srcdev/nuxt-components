---
name: TabsCore
description: TabsCore tab list/panel widget — indexed dynamic slots, arrow-key navigation, moving hover/active/underline indicators, CSS tokens
type: reference
---

# TabsCore

## Overview

`TabsCore` renders a WAI-ARIA tablist from indexed slots. The number of tabs is set via
`itemCount`; each tab's trigger and content come from `tab-{n}-trigger`/`tab-{n}-content` slots.
Indexed slots (rather than named dynamic slots) are used here deliberately — `itemCount` is needed
for ARIA linking across the two parallel loops (triggers and panels), not just the slot loop
itself.

Three independent moving-highlight decorators track pointer/keyboard state: a hover highlight, an
active-tab highlight, and an underline/sideline indicator — each can be turned off individually.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `itemCount` | `number` | — | **yes** — number of tabs; drives both slot loops |
| `axis` | `"x" \| "y"` | `"x"` | no — horizontal row or vertical column layout |
| `transitionDuration` | `number` | `200` | no — ms duration of the moving indicators |
| `trackHover` | `boolean` | `true` | no — shows the moving hover highlight |
| `trackActive` | `boolean` | `true` | no — shows the moving active-tab highlight |
| `trackIndicator` | `boolean` | `true` | no — shows the moving underline/sideline indicator |
| `ariaLabel` | `string` | `"Tabs"` | no — override for localisation |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

## Slots

For each index `0..itemCount-1`:

- `tab-{n}-trigger` — content of the tab button.
- `tab-{n}-content` — content of that tab's panel.

```vue
<TabsCore :item-count="2">
  <template #tab-0-trigger>Overview</template>
  <template #tab-0-content>Overview content…</template>
  <template #tab-1-trigger>Specs</template>
  <template #tab-1-content>Specs content…</template>
</TabsCore>
```

## Accessibility behaviour

- Renders `role="tablist"` (with `aria-label`), `role="tab"` triggers (`type="button"`), and
  `role="tabpanel"` panels (`aria-labelledby` pointing at their trigger, `tabindex="0"` so keyboard
  users can scroll into panel content per the WAI-ARIA Tabs Pattern).
  Fixed 2026-09-15 — panels previously used `role="region"` and were hardcoded
  `aria-hidden="true"` permanently, even the visible one, hiding all tab content from assistive
  tech at all times.
- Roving tabindex: only the active trigger has `tabindex="0"`; the rest are `-1`.
- Arrow keys move focus and activate the target tab (automatic activation): `ArrowLeft`/`ArrowRight`
  on `axis="x"`, `ArrowUp`/`ArrowDown` on `axis="y"`, wrapping at the ends; `Home`/`End` jump to the
  first/last tab. Fixed 2026-09-15 — previously there was no keyboard navigation at all beyond
  native Tab-key focus and click/Enter/Space activation on individual buttons.
- Focus is visible via `:focus-visible` on both triggers and panels.

## CSS custom properties

See `CONSUMER-STYLING.md` in this component's folder for the full `--tabs-*` token API (indicator
colours, list-item spacing/typography, content-panel border/background, axis-y gap). Whether each
indicator renders at all is controlled by `trackHover`/`trackActive`/`trackIndicator`, not tokens.

## Migration note (2026-09-15)

Previously lived at `tabs/TabsCore.vue` with options-style `defineProps`, no tier folder, and
several defects fixed in this pass:

- `querySelectorAll("[data-nav-item")` was missing its closing `]` — an invalid selector that
  some browsers tolerate but that throws in strict DOM implementations (including this repo's test
  environment). Fixed to `"[data-nav-item]"`.
- `aria-labelledby="channel-name"` was hardcoded on the tablist, pointing at an id that doesn't
  exist anywhere in this library. Replaced with the new `ariaLabel` prop.
- `border-bottom`/`border-left` on the tab list referenced `--_tabs-border-bottom`, a private CSS
  variable that was never set anywhere (dead reference — the border never rendered). Promoted to
  the public `--tabs-nav-border` token with a real default.
- `tag`, `trackHover`, `trackActive`, and `trackIndicator` were all declared props with no effect
  anywhere in the component or its composable (`useTabs`). `tag` had no coherent purpose (triggers
  were always hardcoded `<button>`s) and was removed; the three `track*` flags were wired up to
  actually gate their respective decorator elements, since removing them would have been a bigger
  behavioural change than making them work as their names already implied.
- Almost every colour/spacing/typography value in the `<style>` block was hardcoded with no
  override hook at all (not even a private token) — promoted to public `--tabs-*` tokens.
