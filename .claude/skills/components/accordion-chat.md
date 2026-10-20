---
name: AccordionChat
description: AccordionChat renders an accordion as a chat conversation, question bubbles on the right and rich answer bubbles with an optional avatar on the left
type: reference
---

# AccordionChat

## Overview

`AccordionChat` is an accordion drawn as a chat: each panel's summary is a question bubble on the
right, and its content is an answer bubble on the left, with an optional avatar. Use it for FAQs or
"ask us" sections where a conversational look suits the site. It's purely presentational: the only
interaction is the normal accordion open and close. Built on `ExpandingPanelClassic` (works and
animates in every browser), with the same slot names as `AccordionGroup`, so the two swap easily.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | `undefined` | Shared `<details>` name: only one answer open at a time. |
| `animationDuration` | `number` | `300` | Row-height animation in ms, passed to every panel. |
| `avatarLabel` | `string` | `""` | Initials for the avatar circle; trimmed, then cut to the first two graphemes (emoji stay whole). |
| `showAvatar` | `boolean` | `true` | `false` removes the avatar column even when an avatar slot is filled. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root. |

## Slots

| Slot | Purpose |
|---|---|
| `item-{n}-summary` | Question text. **Its presence creates panel `n`** (prefixed slot inference, same as `AccordionGroup`). |
| `item-{n}-content` | Answer bubble content, any markup. Without it the panel has no answer bubble. |
| `item-{n}-icon` | Optional; replaces the default `+` circle for that panel. |
| `item-{n}-avatar` | Optional; the avatar for that panel only. |
| `avatar` | Optional; the avatar for every panel (logo image, `<Icon>`). |

Avatar precedence per panel: `item-{n}-avatar`, then `#avatar`, then `avatarLabel`, then none (no
avatar column; the bubble sits flush left).

## Basic usage

```vue
<AccordionChat name="faq" avatar-label="AM">
  <template #item-0-summary>Do you offer gift vouchers?</template>
  <template #item-0-content><p>Yes, in any amount, valid for twelve months.</p></template>

  <template #item-1-summary>Is there parking nearby?</template>
  <template #item-1-content><p>Free on-street parking on Northtown Road.</p></template>
</AccordionChat>
```

With a logo avatar:

```vue
<AccordionChat name="faq">
  <template #avatar><NuxtImg src="/logo-mark.svg" alt="" width="30" height="30" /></template>
  ...
</AccordionChat>
```

## Behaviour

- One panel per `item-{n}-summary` slot, in numeric order, gaps allowed; panels follow slots added
  or removed after mount.
- The summary renders in the question bubble and the content in the answer bubble; a panel without
  a content slot has no answer bubble.
- The default icon is a `+` in a circle that rotates to `×` when open; `item-{n}-icon` replaces it.
- Avatar precedence is panel slot, group slot, label, none; `showAvatar=false` removes the column.
- The avatar label is cut to two graphemes.
- A shared `name` keeps one answer open at a time.
- `aria-expanded`, `aria-controls`/`aria-labelledby` and unique ids come from
  `ExpandingPanelClassic` unchanged.
- The avatar is always `aria-hidden`: it repeats beside every answer, so it's decoration.
- The question bubble shows a focus ring on keyboard focus.
- Reduced motion turns off the answer entrance animation and the icon rotation transition.
- Every colour, size, radius, font and duration is a token, so a fully different look (the Dark
  Theme story) needs no extra CSS.
- Long unbroken text, long copy, emoji, HTML-like text, RTL (tails and sides flip), an over-wide
  image, a long or emoji avatar label, a panel with no content and many panels all hold their layout
  (`StressTest` story).

## Styling

All tokens are `--accordion-chat-*`, defaulting to `--theme-*` colours; see `CONSUMER-STYLING.md`
(includes a dark serif recipe). The bubble is a wrapper inside the panel's `#content` slot, never the
panel's `.inner`.

## Stories

**Molecules/Expandable/AccordionChat**: Default, Theme Defaults, Dark Theme, Logo Avatar, Icon
Avatar, No Avatar, Per-Panel Avatar Override, Exclusive Open, Rich Answer Content, Stress Test.

## Notes

- Brief: a chat-styled accordion with question/answer bubbles. A typing indicator was considered and
  dropped (2026-10-20): the component has no interactions beyond open and close.
- The question bubble restyles `ExpandingPanelClassic`'s `summary` with a deeper selector
  (`.accordion-chat .accordion-chat-item.expanding-panel-classic .expanding-panel-classic-summary`)
  so it beats the panel's own rules without editing the panel.
