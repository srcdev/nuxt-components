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

## Colour token defaults are flat values, not light-dark() (2026-09-15)

Every colour token's default was originally a `light-dark(lightValue, darkValue)` pair (as most of
this library's other components use). Deliberately changed to a single flat `--slate-*` value per
token for this component — it doesn't bake in automatic light/dark scheme-switching for its own
defaults; a consumer who wants a token to adapt to `color-scheme` wraps their own override value in
`light-dark()`. See `CONSUMER-STYLING.md`'s "Colour tokens are flat values, not light-dark() pairs".
