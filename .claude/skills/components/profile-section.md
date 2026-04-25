---
name: ProfileSection
description: ProfileSection molecule — props, dynamic profile-info slots, eyebrowText/heroText/profileLinks slots, layout, accessibility
type: reference
---

# ProfileSection

## Overview

`ProfileSection` is a molecule that renders a practitioner/author profile: a header area (eyebrow + heading), a profile picture, and a flexible set of bio/info blocks alongside optional profile links. It is landmark-aware — the root element automatically gets `aria-labelledby` wired to the heading inside the `#heroText` slot.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `profilePicture` | `{ src: string; alt: string }` | — | **Required.** Path and alt text for the profile image. Rendered via `NuxtImg`. |
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | HTML element rendered as the root. |
| `profileInfoCount` | `number` | `3` | Number of `profile-info-N` slots to generate when none are explicitly provided. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Description |
|------|-------------|
| `#eyebrowText` | Optional eyebrow label above the heading. Use `EyebrowText`. |
| `#heroText` | Heading slot. Receives `headingId` as a slot prop — bind it to the heading's `id` for accessible `aria-labelledby`. |
| `#profile-info-1` … `#profile-info-N` | Bio / info blocks. Provide as many numbered slots as needed. They are rendered in ascending numeric order. |
| `#profileLinks` | Links / actions shown at the bottom-right of the info column (e.g. social icons, booking CTA). |

## Basic usage

```vue
<ProfileSection
  tag="section"
  :profile-picture="{ src: '/images/profile/mel.jpg', alt: 'Mel Stafford, reflexologist' }"
>
  <template #eyebrowText>
    <EyebrowText font-size="large" text="About Mel" />
  </template>

  <template #heroText="{ headingId }">
    <HeroText
      tag="h2"
      :id="headingId"
      font-size="title"
      :text-content="[
        { text: 'Mel Stafford', styleClass: 'normal' },
        { text: 'Reflexologist', styleClass: 'accent' },
      ]"
    />
  </template>

  <template #profile-info-1>
    <p>With over a decade of practice…</p>
  </template>

  <template #profile-info-2>
    <p>Mel is based in Lichfield…</p>
  </template>

  <template #profileLinks>
    <SocialIconsList :items="socialLinks" />
  </template>
</ProfileSection>
```

## Dynamic profile-info slots

The `profile-info-N` slots are discovered at runtime by filtering `useSlots()` for keys matching `/^profile-info-\d+$/`. The slots are rendered in ascending numeric order.

- If you provide `#profile-info-1`, `#profile-info-2`, `#profile-info-3` — all three render in order.
- If you provide no `profile-info-*` slots, the component generates `profileInfoCount` empty placeholder blocks.
- Gaps are supported — you can provide `#profile-info-1` and `#profile-info-3` without `#profile-info-2`; they sort correctly.

## heroText slot prop

The `#heroText` slot exposes `headingId` as a slot prop. Bind it to the heading's `id` prop so the component's `aria-labelledby` attribute points to the heading automatically:

```vue
<template #heroText="{ headingId }">
  <HeroText tag="h2" :id="headingId" ... />
</template>
```

If you use a different heading component, bind `headingId` to whatever prop renders the `id` attribute on the heading element.

## Layout

- **Mobile**: single column — picture stacked above info.
- **768px+**: two columns — `384px` picture column, `1fr` info column, `4rem` gap.
- Picture frame: `aspect-ratio: 3/4`, `border-radius: 8px`, `overflow: hidden`. The `NuxtImg` fills the frame with `object-fit: cover`.
- Profile links: `align-items: end; justify-content: flex-end` — right-aligned to the bottom of the info column.

## CSS notes

- The `.profile-section-header` element has **no default margin-block-end**. If you need spacing between the header and the picture/info grid, add it via a consuming-page style:

```css
.my-page {
  .profile-section-header {
    margin-block-end: 3.2rem;
  }
}
```

- Accent-coloured text within `.location` or `.services` info blocks can use the `.highlight` class for `var(--colour-text-accent)` or `var(--colour-link-default)` colouring respectively.

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
    .profile-section-header {
      margin-block-end: 3.2rem;
    }
  }
}
</style>
```

## Notes

- `NuxtImg` is used for the profile picture — provide a real `src` path. A placeholder (grey box) is shown if the image 404s.
- The component does not expose `imgWidth` / `imgHeight` props for the picture. If IPX optimisation is critical, use a fixed-dimension image and rely on the `384px` column cap as the natural size constraint.
- Component is auto-imported in Nuxt — no import needed.
