---
name: TextBlock
description: TextBlock vertical-rhythm text wrapper — tag prop, fluid block padding tokens, heading-id slot prop for section/article aria-labelledby, styleClassPassthrough
type: reference
---

# TextBlock

## Overview

`TextBlock` wraps a block of text (typically a page lead: `EyebrowText` + `HeroText`/`HeaderBlock`
+ intro copy) and gives it consistent fluid vertical padding. It has no layout of its own; put it
inside a `PageRow` for horizontal placement.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | Root element. `section`/`article` get `aria-labelledby` (see below); `main` deliberately does not. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root. Reactive: changing the prop swaps the classes. |

## Slots

| Slot | Slot props | Description |
|------|-----------|-------------|
| `default` | `{ headingId: string }` | Content. Bind `headingId` to your heading's `id` when `tag` is `section`/`article`. |

## Basic usage

```vue
<PageRow tag="div" variant="content">
  <TextBlock :style-class-passthrough="['page-lead']">
    <EyebrowText text-content="Pricing" font-size="large" />
    <HeroText … />
  </TextBlock>
</PageRow>
```

## As a labelled landmark

With `tag="section"` or `tag="article"`, the root gets `aria-labelledby` from `useAriaLabelledById`.
Bind the `heading-id` slot prop to a real heading, or the landmark has no accessible name (a
dev-mode `console.warn` flags this):

```vue
<TextBlock tag="section" v-slot="{ headingId }">
  <HeaderBlock :id="headingId" :tag-level="2" :class-level="2">Our services</HeaderBlock>
  <p>…</p>
</TextBlock>
```

## CSS tokens

| Token | Default |
|-------|---------|
| `--text-block-padding-block-start` | `var(--fluid-space-48-96)` |
| `--text-block-padding-block-end` | `var(--fluid-space-48-96)` |

See [CONSUMER-STYLING.md](../../../app/components/01.atoms/text-block/CONSUMER-STYLING.md).

## History

- **Migrated 2026-09-25** (0/5 → 5/5): padding moved from hardcoded `--fluid-space-48-96` to the two
  public tokens above (same defaults, no visual change); `section`/`article` now get
  `aria-labelledby` plus the `heading-id` slot prop (previously an unnamed landmark);
  `styleClassPassthrough` is now reactive to prop changes. Consumer apps (cnv-hairdressing,
  luxury-locs) redeclare `.text-block { padding-block-*: var(--fluid-space-48-96) }` in their
  `price-list.vue`; that duplicates the default and can be deleted.
