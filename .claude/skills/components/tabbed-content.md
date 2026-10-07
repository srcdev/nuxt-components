---
name: TabbedContent
description: TabbedContent tab list/panel widget (was TabsCore) — indexed dynamic slots, arrow-key navigation, moving hover/active/underline indicators, CSS tokens
type: reference
---

# TabbedContent

> **Renamed 2026-10-07:** `TabsCore` → `TabbedContent`, moved from `01.atoms/navigation/tabs/` to
> `01.atoms/tabbed-content/`. Root class `.tabs-core` → `.tabbed-content`; inner classes
> `.tabs-list` → `.tabbed-content-list`, `.tabs-list-item` → `.tabbed-content-trigger`,
> `.nav__hovered`/`.nav__active`/`.nav__active-indicator` → `.tabbed-content-indicator-hover`/
> `-active`/`-underline`, `.tab-content-wrapper` → `.tabbed-content-panels`, `.tab-content` →
> `.tabbed-content-panel`. Tokens keep their `--tabs-*` names. Slot names are unchanged.

## Overview

`TabbedContent` renders a WAI-ARIA tablist and its panels from indexed slots. The number of tabs is
set via `itemCount`; each tab's trigger and content come from `tab-{n}-trigger`/`tab-{n}-content`
slots. Indexed slots (rather than named dynamic slots) are used deliberately: `itemCount` is needed
for ARIA linking across the two parallel loops (triggers and panels), not just the slot loop itself.

Moving decorators track pointer/keyboard state: a hover highlight, an active-tab highlight, a
thick underline/sideline under the active tab, and a thin one (`--tabs-hover-underline-indicator-height`,
default `0.1rem`, added 2026-10-07) following the hovered tab. `trackHover` / `trackActive` /
`trackIndicator` turn them off; the hover underline needs both `trackHover` and `trackIndicator`.

Not navigation: for page/site navigation use `ResponsiveHeader` (which replaced `TabNavigation`).

**Location**: `app/components/01.atoms/tabbed-content/`

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `itemCount` | `number` | — | **Required.** Number of tabs; drives both slot loops. Rounded down; 0, negative or `NaN` renders no tabs. Can change after mount (the active tab is kept if it still exists, otherwise the first tab becomes active). |
| `axis` | `"x" \| "y"` | `"x"` | Horizontal row or vertical column. Also sets `aria-orientation` and which arrow keys move between tabs. Reactive. |
| `transitionDuration` | `number` | `200` | ms duration of the moving indicators. Negative values clamp to 0. Reactive. |
| `trackHover` | `boolean` | `true` | Moving hover highlight. Reactive. |
| `trackActive` | `boolean` | `true` | Moving active-tab highlight. Reactive. |
| `trackIndicator` | `boolean` | `true` | Moving underline/sideline. Reactive. |
| `overflowMode` | `"menu" \| "scroll"` | `"menu"` | `axis="x"` only. `menu`: tabs that don't fit collapse from the end into a "More" button and menu (added 2026-10-07). `scroll`: the tab row scrolls sideways inside itself. Reactive. |
| `ariaLabel` | `string` | `"Tabs"` | `aria-label` on the tablist; override for localisation. |
| `moreLabel` | `string` | `"More tabs"` | Accessible name of the More button and its menu; override for localisation. |
| `moreIcon` | `string` | `"lucide:ellipsis"` | Icon on the More button. |
| `moreActiveIcon` | `string` | `"lucide:chevron-down"` | Icon after the active tab's label on the More button while that tab is collapsed. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Classes on the root `.tabbed-content` (was the tab list before 2026-10-07). |

## Slots

For each index `0..itemCount-1`:

- `tab-{n}-trigger` — content of the tab button. May contain icons or other elements; a click
  anywhere inside the button activates the tab.
- `tab-{n}-content` — content of that tab's panel.

```vue
<TabbedContent :item-count="2" aria-label="Product details">
  <template #tab-0-trigger>Overview</template>
  <template #tab-0-content>Overview content…</template>
  <template #tab-1-trigger>Specs</template>
  <template #tab-1-content>Specs content…</template>
</TabbedContent>
```

## Accessibility behaviour

- `role="tablist"` is a `<div>` that owns the `role="tab"` buttons directly (it used to be a
  `<ul>` with plain `<li>`s in between, an ARIA required-children violation, with the indicator
  `<div>`s injected into the list by JS). Indicators are `aria-hidden` `<span>`s rendered by the
  template.
- `aria-orientation` follows `axis`.
- Each trigger has `aria-controls` pointing at its panel; each panel has `aria-labelledby` pointing
  at its trigger. IDs are prefixed with `useId()`, so several instances on one page don't clash
  (before 2026-10-07 every instance used `tab-0-trigger` etc.).
- Inactive panels carry the `hidden` attribute; the first panel is visible in the SSR markup.
  Panels have `tabindex="0"` so keyboard users can reach scrollable panel content.
- Roving tabindex: only the active trigger has `tabindex="0"`.
- Arrow keys move focus and activate the target tab (automatic activation): `ArrowLeft`/`ArrowRight`
  on `axis="x"`, `ArrowUp`/`ArrowDown` on `axis="y"`, wrapping at the ends; `Home`/`End` jump to
  the first/last tab. Not mirrored for RTL.
- Focus ring: `--tabs-focus-ring-colour` (default `--theme-border-focus`) on triggers and panels.

## Overflow menu (`overflowMode="menu"`, default, since 2026-10-07)

- On `axis="x"`, a ResizeObserver on the bar and the tablist measures the tabs (widths cached
  while each is visible) and collapses the ones that don't fit, from the end, into a "More" button
  at the end of the tab row (`--tabs-more-margin-inline-start: auto`; `0` puts it straight after
  the last visible tab). Collapsed triggers get `hidden`, so they leave the tablist; the menu lists
  them as `role="menuitemradio"` rows (re-rendering each tab's own `tab-{n}-trigger` slot), with
  `aria-checked` on the active one. Picking one activates that tab and returns focus to the
  More button.
- The More button is outside `role="tablist"` (`aria-haspopup="menu"`, `aria-label` from
  `moreLabel`). While nothing has overflowed it stays in the DOM but idle (invisible,
  `tabindex="-1"`) so its width can be measured.
- When the active tab is collapsed, the More button shows that tab's own trigger slot plus a
  chevron (instead of `⋯`), gets `.is-active` and the active/hover indicators sit on it. A
  ResizeObserver on the button re-measures, so if the wider button no longer fits, the tab before
  it moves into the menu (and comes back when a visible tab is picked). The button has no
  `aria-label`: `moreLabel` is visually hidden text inside it, so its name ("Shipping, More tabs")
  always contains the visible label (WCAG 2.5.3). Trigger slot content renders up to three times
  (tab, menu row, More button), so don't put `id`s in it.
- Indicators sit on the More button while the active tab is collapsed (`useTabs` swaps any
  hidden tab for `[data-more-trigger]` when positioning). Arrow keys move between visible tabs only, and the first visible tab keeps `tabindex="0"` so
  the tablist stays reachable with Tab.
- The popover uses `useAnchoredPopover` (Popover API + anchor positioning, with the Safari 16/17
  fallbacks), like `SelectMenu` and `ActionMenu`. Menu keys: Arrow Up/Down (wrapping),
  Home/End, Escape (light dismiss), Tab closes.
- Not on `axis="y"`: a column doesn't run out of width.

## Layout under hostile data

- With `overflowMode="scroll"` the tab row scrolls sideways inside itself; the indicators scroll
  with it. In both modes triggers never shrink, and wrap their label past
  `--tabs-list-item-max-inline-size` (`24rem`).
- On `axis="y"` the tab column is capped at `--tabs-axis-y-list-max-inline-size` (`50%`).
- Panels wrap unbroken strings (`overflow-wrap: anywhere`).
- No line-clamp token: trigger and panel text is consumer slot markup, so the consumer controls it.

## CSS custom properties

See `CONSUMER-STYLING.md` in the component folder for the full `--tabs-*` token API. Colour
defaults come from the `--theme-*` slots (changed 2026-10-07, were fixed `--slate-*` steps with a
dark panel).

## useTabs

`app/composables/useTabs.ts` drives the behaviour and is only used by this component. Its nav ref
is `.tabbed-content-bar` (the indicators' positioning box); it also exposes `activeIndex` and
`activateTabByIndex()` for the More menu. It takes
`axis`, `transitionDuration` and `trackHover` as getters (read at use time, so prop changes apply),
and exposes `refreshTabs()`, which the component calls on mount and after any change to the tab
count, axis or indicator props. Click/hover handlers use `event.currentTarget` (the button), not
`event.target`, so clicking an icon inside a trigger works. Panels are matched to triggers by
`data-tab-index`, not by position in the `v-for` ref array, since Vue doesn't keep that array in
source order when the list changes.

## Indicator motion: edge insets (2026-10-08)

`useTabs.placeIndicator(kind, animate)` writes each indicator's two edges as insets from the
bar's start/end along the axis (`--_{kind}-start` / `--_{kind}-end`), and the CSS transitions
`left`/`right` (or `top`/`bottom`) separately. Moving forward, the start edge gets a delay of one
duration (`--_{kind}-start-delay`); moving back, the end edge does. So the leading edge moves first
and the trailing edge catches up: the same stretch effect as before, symmetric both ways, with no
settle timer. CSS retargets each edge from its current position, so a quick second move can't
pull an edge backwards. Hover and active have separate duration/delay variables.

This replaced a `translate` + `scale` model (a bar-wide box translated to the tab's left and
scaled to its width, plus a timeout to settle after a stretch, and one shared
`--_transition-duration`). Rightward moves animated both properties together in the settle step,
and the indicator visibly stepped back mid-move (reported for hover, then n to n+x clicks); the
computed values were always correct, the composition wasn't. Avoid reintroducing a transform
pair for this.

## Label colour under the sliding highlight (2026-10-08)

With `trackActive`, `useTabs` re-checks every animation frame while the active indicator
transitions (`trackCoverage`, for `transitionDuration` + 50ms) which visible tabs and the More
button the indicator (`[data-active-indicator]`) covers by at least half, and toggles
`data-under-active` on them (an attribute, not a class, so Vue's own class binding on the More
button can't wipe it). CSS under `.tracks-active` colours by that attribute rather than
`aria-selected`. The coverage window only ever extends (`coverageUntil`): a refresh landing
mid-move (e.g. the More button resizing straight after a click) used to restart it with zero
length, cancelling the per-frame checks while the highlight was still sliding and leaving stale
colours (dark selected label, invisible neighbour). A More-button resize also re-places both
indicators (`syncIndicators(true)`), since its box moves even when no tab changes sides, and an
overflow change refreshes with `refreshTabs(true)` so an in-flight move retargets instead of
snapping. This replaces the per-component timing trick `TripleToggleSwitch` uses (swap
colour at half the slide), which only works for single-step moves; a tab jump passes under
several labels.

## Migration note (2026-10-07)

Fixed during the compliance pass that renamed it:

- Duplicate IDs across instances (above).
- `event.target` in the click handler: clicking an element inside a trigger set the active tab to
  that inner element, so no panel matched and every panel was hidden.
- `axis`, `transitionDuration` and the `track*` flags were read once at setup, and a changed
  `itemCount` was never picked up (new tabs had no roving tabindex and weren't navigable).
- Dark-on-dark panel content by default, near-invisible focus ring, `styleClassPassthrough` on
  the wrong element, unprefixed inner class names (pitfall #16).
- A long label or many tabs pushed the page sideways.

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

## Performance notes (2026-09-15)

`useTabs` had a few real perf issues, fixed alongside the migration:

- **Layout thrashing**: `moveActiveIndicator`/`moveHoveredIndicator`/`setFinalActivePositions`/
  `setFinalHoveredPositions` used to interleave `offsetLeft`/`offsetWidth`/etc. reads with
  `style.setProperty` writes, forcing a synchronous reflow between each pair. All layout reads are
  now batched into local variables before any writes happen.
- **`@mouseover` → `@mouseenter`**: the hover trigger listener used `mouseover`, which bubbles and
  re-fires as the pointer crosses any child element inside the button. `mouseenter` fires exactly
  once per tab entered.
- **Debounced settle timers**: `moveActiveIndicator`/`moveHoveredIndicator` schedule a `setTimeout`
  to snap the indicator to its exact final position once the CSS transition ends. Previously each
  call scheduled a new timeout without clearing the last one, so moving the pointer quickly across
  several tabs stacked up redundant pending timeouts. Now the previous timeout is cleared before
  scheduling the next, and both are cleared in `onUnmounted`.
- `handleTransitioningClass` called `.indexOf()` on the same two tabs repeatedly inside its loop
  condition and body — now computed once per call.
- `previousActiveTab` used `useState("previousActiveTab", ...)` with a fixed, unscoped key — every
  `TabsCore` instance on a page would have shared that one piece of state. Not actually a
  performance issue, but a correctness bug found while auditing this file; fixed by switching to a
  plain per-instance `ref`, since this state doesn't need SSR/hydration sharing.

## Fixed: hover/active label text could become unreadable against the indicator (2026-09-15)

`--tabs-hover-indicator-text-colour` and `--tabs-active-indicator-text-colour` were set as `color`
on `.nav__hovered`/`.nav__active` — decorative, empty, absolutely-positioned divs with no text
content, so that `color` was dead CSS with no visible effect. The actual tab label
(`.tabs-list-item`) used one shared `--tabs-list-item-colour-selected` token for hover, active,
*and* transitioning alike, regardless of which of the two (potentially differently-coloured)
indicator backgrounds was actually behind it at that moment. A consumer overriding only the hover
indicator's background (or the active one) had no working lever to keep the label readable against
it, and could end up with text the same colour as the background sliding behind it — this was the
original defect noticed during this component's initial authoring, reported as "the button text
became the same colour as the track item background and became invisible."

Fixed by removing the dead `color` declarations from the two decorator divs and splitting
`.tabs-list-item`'s combined `:hover, [aria-selected="true"], .transitioning` rule so hover uses
`--tabs-hover-indicator-text-colour` and active uses `--tabs-list-item-colour-selected` falling
back to `--tabs-active-indicator-text-colour` — each state's text colour now tracks the background
actually behind it. See `CONSUMER-STYLING.md`'s "Tab-label text colour tracks the indicator behind
it" section: overriding an indicator background without its matching text-colour token can still
produce poor contrast (same tradeoff as any two independently-set colour tokens) — the fix makes
the tokens functional, it doesn't auto-compute contrast.

## Fixed: intermediate tab labels could go invisible during a multi-tab jump (2026-09-15)

The first fix above wasn't the whole story. The exact repro that surfaced the rest of it: with tab
1 active, hover then click tab 5 — the tabs in between briefly lost all visible text. Going the
other direction (tab 5 active, hover then click tab 1) looked fine.

Cause: `useTabs` had a `handleTransitioningClass` helper that added a `.transitioning` class to
every tab spanned by a jump (previously shared by the `[aria-selected="true"]` colour rule fixed
above), on the assumption the sliding indicator visually covers every spanned tab for the whole
transition — so it force-applied the active text colour to all of them, for the full
`transitionDuration`. It doesn't cover them the whole time: the indicator's "grow from anchor" CSS
transition (see `moveActiveIndicator`/`moveHoveredIndicator`) keeps the box's leading edge pinned
at the *old* tab's position on a forward move and only grows its width, so it only gradually sweeps
across later tabs — a tab several positions away isn't actually covered until *late* in the
transition. Recolouring it to the active text colour from the very start meant its label matched
neither its own background nor the not-yet-arrived indicator, going invisible. A backward move
animates position and width toward their final values together, so the box's rendered coverage is
more consistent throughout — which is why that direction looked fine and made the bug easy to miss
without a specific repro.

Fixed by removing `handleTransitioningClass` and the `.transitioning` class entirely — it had no
other purpose. Tabs spanned by a jump now keep their normal (inactive) styling throughout; only the
newly-active tab (`[aria-selected="true"]`) and the currently-hovered tab (`:hover`) get their
special colours. See `CONSUMER-STYLING.md`'s "Tabs spanned by a jump keep their normal styling".

## Fixed: passed-over tab text still invisible under the active indicator specifically (2026-09-15)

Removing `.transitioning` (previous fix) uncovered a second, pre-existing defect that
`.transitioning`'s forced recolour had been accidentally masking the whole time: a non-active tab's
normal text colour (`--tabs-list-item-colour`) was **exactly the same value** as the active
indicator's background (`--tabs-active-indicator-colour`, same default) — this collision existed in
the very first authored version of this component, not something introduced by any migration
change. So whenever the active pill visually passes under (or briefly sits under) any tab that
isn't itself marked active — which happens on every transition, single-step or distant, in either
direction — that tab's text became literally the same colour as the background sliding beneath it.
`--tabs-hover-indicator-colour`'s default never had this problem since it doesn't coincide with the
inactive text default.

Fixed by changing `--tabs-active-indicator-colour`'s default to one step in from the extreme,
still clearly the boldest of the three indicator colours, but no longer numerically identical to
`--tabs-list-item-colour`'s default. `--tabs-active-indicator-text-colour`/
`--tabs-list-item-colour-selected` (used by the truly active tab) still contrast fine against the
new value. See `CONSUMER-STYLING.md` for the note on keeping these two tokens from colliding again
if you override either one.

## Colour token defaults (2026-10-07)

Colour defaults were flat `--slate-*` steps from 2026-09-15 (when `light-dark()` pairs were
dropped) until 2026-10-07, when they moved to the `--theme-*` slots. Light-only, like the rest of
the library.
