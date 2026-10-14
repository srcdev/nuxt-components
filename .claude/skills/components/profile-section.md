---
name: ProfileSection
description: ProfileSection molecule — props, dynamic profile-info slots, eyebrowText/heroText/profileLinks slots, container-query layout, accessibility
type: reference
---

# ProfileSection

> **Changed 2026-10-14 (breaking):** New `headerPlacement` prop (`above`, `picture-bottom`, `picture-top`) can put the header over the bottom or top of the picture. `profileInfoCount` removed — only the `profile-info-N` slots you give are rendered (it used to pad with empty blocks when none were given). The two-column switch is a container query on the component's own width, not a viewport `@media` query, and both columns are `minmax(0, …)`. The `<header>` is only rendered when a header slot is given. Highlight colours go through new `--profile-section-*` tokens. An invalid `profilePicture.width`/`height` (0, negative, `NaN`) falls back to 828×1104.
>
> **Classes renamed 2026-09-27:** `.picture` → `.profile-section-picture`, `.profile-picture` → `.profile-section-image`, `.profile-info` → `.profile-section-info`, `.profile-info-content` → `.profile-section-info-content`, `.profile-info-block` → `.profile-section-info-block`, `.profile-links` → `.profile-section-links`.

## Overview

`ProfileSection` is a molecule that renders a practitioner/author profile: a header area (eyebrow + heading), a profile picture, and a flexible set of bio/info blocks alongside optional profile links. It is landmark-aware — when `tag` is `section` or `article`, the root element automatically gets `aria-labelledby` wired to the heading inside the `#heroText` slot (**you must bind `headingId` yourself, and a console warning fires if you forget** — see [component-aria-landmark.md](../component-aria-landmark.md)). `tag="main"` is never auto-labelled.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `profilePicture` | `ProfilePicture` (`{ src; alt; width?; height? }`, exported from the layer types) | — | **Required.** Rendered via `NuxtImg`. `width`/`height` default to `828`/`1104` (3:4, a Vercel-allowed width), and a missing or invalid value (0, negative, `NaN`, `Infinity`) uses the default. |
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | HTML element rendered as the root. |
| `headerPlacement` | `"above" \| "picture-bottom" \| "picture-top"` | `"above"` | Where the `#eyebrowText`/`#heroText` header goes: above the grid, or over the bottom or top of the picture on a scrim. Template form: `header-placement`. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Description |
|------|-------------|
| `#eyebrowText` | Optional eyebrow label above the heading. Use `EyebrowText`. |
| `#heroText` | Heading slot. Receives `headingId` as a slot prop — bind it to the heading's `id` for accessible `aria-labelledby`. |
| `#profile-info-1` … `#profile-info-N` | Bio / info blocks. Provide as many numbered slots as needed. They are rendered in ascending numeric order. |
| `#profileLinks` | Links / actions shown at the bottom-right of the info column (e.g. social icons, booking CTA). Wraps onto more lines when there are many. |

The `<header class="profile-section-header">` is only rendered when `#eyebrowText` or `#heroText` is given. It renders above the grid, or inside the picture when `header-placement` is `picture-bottom` or `picture-top`.

## Basic usage

```vue
<ProfileSection
  tag="section"
  :profile-picture="{ src: '/images/profile/alex.jpg', alt: 'Alex Morgan, hair stylist' }"
>
  <template #eyebrowText>
    <EyebrowText font-size="large" text-content="About Alex" />
  </template>

  <template #heroText="{ headingId }">
    <HeroText
      tag="h2"
      :id="headingId"
      font-size="title"
      :text-content="[
        { text: 'Alex Morgan', styleClass: 'normal' },
        { text: 'Hair stylist', styleClass: 'accent' },
      ]"
    />
  </template>

  <template #profile-info-1>
    <p>With over a decade of practice…</p>
  </template>

  <template #profile-info-2>
    <p class="location">Based in <span class="highlight">Northtown</span>…</p>
  </template>

  <template #profileLinks>
    <SocialIconsList :items="socialLinks" />
  </template>
</ProfileSection>
```

## Dynamic profile-info slots

The `profile-info-N` slots are discovered at runtime by filtering `useSlots()` for keys matching `/^profile-info-\d+$/`, and rendered in ascending numeric order.

- If you provide `#profile-info-1`, `#profile-info-2`, `#profile-info-3` — all three render in order.
- If you provide none, no info blocks render.
- Gaps are supported — you can provide `#profile-info-1` and `#profile-info-3` without `#profile-info-2`; `#profile-info-12` sorts after `#profile-info-2`.
- Discovery runs every render, so slots added or removed after mount (a `v-if` on the slot template) appear and disappear.

## heroText slot prop

The `#heroText` slot exposes `headingId` as a slot prop. Bind it to the heading's `id` prop so the component's `aria-labelledby` attribute points to the heading automatically:

```vue
<template #heroText="{ headingId }">
  <HeroText tag="h2" :id="headingId" ... />
</template>
```

If you use a different heading component, bind `headingId` to whatever prop renders the `id` attribute on the heading element.

## Layout

- The root is a size container named `profile-section`. Layout follows **the component's own width**, not the viewport.
- **Under 768px wide**: single column — picture stacked above info, `--profile-section-gap` (`2rem`).
- **768px wide or more**: two columns — `minmax(0, var(--profile-section-picture-width))` (`38.4rem`) picture column, `minmax(0, 1fr)` info column, `--profile-section-gap-wide` (`4rem`) gap.
- Being an inline-size container, the root can't size itself from its content: give it a width in a flex row or other shrink-to-fit context.
- The root sets `overflow-wrap: anywhere`, so unbroken text and URLs in any slot wrap rather than widening the grid.
- Picture frame (`.profile-section-picture`): `--profile-section-picture-aspect-ratio` (`3 / 4`), `--profile-section-picture-border-radius` (`0.8rem`), `overflow: hidden`. The `NuxtImg` fills the frame with `object-fit: cover`. Full token list: `CONSUMER-STYLING.md` in the component folder.
- Profile links: `flex-wrap: wrap; align-items: end; justify-content: flex-end` — right-aligned to the bottom of the info column.
- To change the picture column width, set `--profile-section-picture-width`; don't override `grid-template-columns` in a viewport `@media` query, which no longer lines up with the component's own switch.

## Header in picture

With `header-placement="picture-bottom"` or `"picture-top"`, the `<header>` renders inside `.profile-section-picture`, before the image in the DOM (so it is read first), and sits at the bottom or top of the frame on a scrim that fades away from that edge. It follows ServicesCard's `titles-within-image-wrapper`:

- Scrim and text come from `--profile-section-picture-header-*` tokens: scrim colour (`#000`) and opacity (`75%`), a solid stop (`0%`, how far the scrim stays full strength before fading) and a target colour (`transparent`, what it fades into, set it to roughly the photo's colour where the fade ends so it blends instead of leaving a grey band), text colour (`contrast-color()` of the scrim colour where supported, else `#fff`), eyebrow colour, padding (`2.4rem`), gap (`0.4rem`). Full list in `CONSUMER-STYLING.md`.
- The frame drops `overflow: hidden` in this mode, so its aspect ratio is a minimum: a long header grows the frame rather than being clipped. The image is absolutely positioned and still fills the frame.
- `aria-labelledby` still points at the heading.
- Drop spacing utilities like `mb-20` from the heading in this mode; the header's padding handles spacing.

```vue
<ProfileSection tag="section" header-placement="picture-bottom" :profile-picture="picture">
  <template #eyebrowText>
    <EyebrowText tag="p" font-size="medium" text-content="About Alex" />
  </template>
  <template #heroText="{ headingId }">
    <HeroText :id="headingId" tag="h2" font-size="heading" :text-content="[{ text: 'Alex Morgan', styleClass: 'normal' }]" />
  </template>
  ...
</ProfileSection>
```

Two stories show themes built only from tokens: `Header In Picture (Dark, Bottom)`, ServicesCard-style, and `Header In Picture (Light, Top)`. A light scrim needs a dark `--profile-section-picture-header-text-colour`; `contrast-color()` picks one where supported, but set it for older browsers. `--profile-section-info-text-colour` sets the info column's text colour for a themed background.

## Content hooks

A `.highlight` inside an element with class `location` gets `--profile-section-highlight-colour` (default `var(--colour-text-accent)`); inside `services` it gets `--profile-section-link-colour` / `--profile-section-link-colour-hover` (defaults `var(--colour-link-default)` / `var(--colour-link-hover)`). Both use `--profile-section-highlight-font-weight` (`600`). The `location`/`services` class can sit on the `<p>` itself or a wrapper.

## CSS notes

- The `.profile-section-header` element has **no default margin-block-end**. If you need spacing between the header and the picture/info grid, add it via a consuming-page style:

```css
.my-page {
  .profile-section-header {
    margin-block-end: 3.2rem;
  }
}
```

## Consumer styling scaffold

```vue
<ProfileSection
  :style-class-passthrough="['my-profile']"
  ...
>
  ...
</ProfileSection>

<style>
.profile-section {
  &.my-profile {
    --profile-section-picture-width: 32rem;

    .profile-section-header {
      margin-block-end: 3.2rem;
    }
  }
}
</style>
```

## Notes

- `NuxtImg` is used for the profile picture — provide a real `src` path. A broken image shows its alt text inside the 3:4 frame.
- Pass `width`/`height` in `profilePicture` when your image isn't 3:4 at 828px wide, so IPX/Vercel request the right size.
- The `With Social Icons` story shows a `SocialIconsList` in `#profileLinks`; size it with `--social-icons-list-icon-size` and `--social-icons-list-gap` on your own wrapper.
- The `StressTest` story covers hostile content (broken image, unbroken text, RTL, out-of-order slots, many links) at every canvas width.
- Component is auto-imported in Nuxt — no import needed.
