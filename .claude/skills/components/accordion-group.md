---
name: AccordionGroup
description: AccordionGroup renders a group of expanding panels from item-{n}-summary/content/icon slots, optionally exclusive-open via a shared name
type: reference
---

# AccordionGroup

> **Renamed 2026-10-20:** `AccordianCore` → `AccordionGroup` (also fixes the "Accordian"
> misspelling); root class `.display-accordian` → `.accordion-group`; panel class `.accordian-item`
> → `.accordion-group-item`; slots `accordian-{n}-*` → `item-{n}-*`. The `itemCount` prop is
> gone: the group counts its `item-{n}-summary` slots itself. Folder
> `02.molecules/expandable/accordion-group/`.

## Overview

`AccordionGroup` renders one expanding panel per `item-{n}-summary` slot: `ExpandingPanelClassic`
by default, or `ExpandingPanel` with `variant="modern"`. Pass `name` to make it exclusive (the
browser keeps one `<details>` in a shared-name group open). Typical use: FAQs, product details,
terms sections.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | `undefined` | Shared `name` on every panel's `<details>`; makes the group exclusive-open. Unset, each panel gets its own generated name and opens independently. |
| `animationDuration` | `number` | `300` | Milliseconds, passed to every panel and to the group's own margin/radius transition. |
| `variant` | `"classic" \| "modern"` | `"classic"` | `modern` relies on `::details-content`, which WebKit lacks (pitfall #19); keep `classic` unless you've confirmed your audience. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root. |

## Slots

Prefixed slot inference (`component-dynamic-slots.md`, pattern 3): no count prop.

| Slot | Purpose |
|---|---|
| `item-{n}-summary` | The panel's clickable summary. **Its presence creates panel `n`.** |
| `item-{n}-content` | The panel's content. |
| `item-{n}-icon` | Optional. Replaces the panel's default caret; omit it to keep the caret. |

`n` is any non-negative integer. Panels render in numeric order, and gaps are fine (`item-0`,
`item-2`, `item-10`). An `item-{n}-content` or `-icon` slot with no matching summary renders
nothing.

## Basic usage

```vue
<AccordionGroup name="faq">
  <template #item-0-summary>How long does a first appointment take?</template>
  <template #item-0-content><p>About an hour.</p></template>

  <template #item-1-summary>Can I change a booking?</template>
  <template #item-1-content><p>Yes, up to 24 hours before.</p></template>
</AccordionGroup>
```

From data:

```vue
<AccordionGroup name="faq">
  <template v-for="(faq, i) in faqs" :key="`s${i}`" #[`item-${i}-summary`]>{{ faq.question }}</template>
  <template v-for="(faq, i) in faqs" :key="`c${i}`" #[`item-${i}-content`]><p>{{ faq.answer }}</p></template>
</AccordionGroup>
```

## Behaviour

- One panel per `item-{n}-summary` slot, in numeric order; adding or removing a summary slot after
  mount adds or removes its panel (slots are read per render, not in a `computed`).
- With `name`, opening a panel closes the others; without it, panels open independently.
- Every panel has its own unique ids (`useId()`), so `aria-controls`/`aria-labelledby` pair each
  summary with its own content region even when the panels share a `name`.
- A panel with no `item-{n}-icon` slot keeps its default caret.
- Only props the panels declare are passed to them (no stray attributes on panel roots).
- `variant` is group-wide; every panel renders the same component.
- Long unbroken summaries and content wrap rather than overflowing or pushing the caret out; RTL,
  emoji and HTML-like text render correctly; an empty group renders an empty wrapper
  (`StressTest` story).

## Styling

One token of its own, `--accordion-group-max-width` (default `60rem`); everything else is the
active panel's tokens. See `CONSUMER-STYLING.md`.

## Stories

**Molecules/Expandable/AccordionGroup**: Default, ExclusiveOpen, ModernVariant, CustomIcons,
SlowAnimation, NoPanels, StressTest.

## Notes

- 2026-10-20 migration fixes, beyond the rename: the group passed `icon-size="medium"`, which
  neither panel declares, so it landed on every panel root as an HTML attribute; it always filled
  the panel's `#icon` slot, so the default caret vanished unless every item had an icon slot; it had
  no `styleClassPassthrough` watch; the `600px` width is now a token. The same pass fixed two
  bugs in the panels themselves: ids built from `name` (shared-name panels all had the same
  `id-{name}-trigger`/`-content`, which also affected ResponsiveHeader's overflow groups) and a plain
  `1fr` summary track that let a long word push the caret out.
