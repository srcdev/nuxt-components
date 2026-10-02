# ServicesCard Component

## Overview

`ServicesCard` renders a single service as a portrait card: image, subtitle (eyebrow), title, short description, an optional duration/price meta row, and an `actions` slot for any CTA content. The component owns the layout and data display; all routing and button decisions are delegated to the consumer via the slot.

## Props

| Prop                    | Type                              | Default     | Required |
| ----------------------- | ---------------------------------- | ----------- | -------- |
| `serviceData`           | `Service`                          | —           | **yes**  |
| `tag`                   | `"div" \| "section" \| "article"` | `"div"`     | no       |
| `href`                  | `string`                           | `undefined` | no       |
| `external`              | `boolean`                          | `false`     | no       |
| `titlesWithinImageWrapper` | `boolean`                       | `false`     | no       |
| `eyebrowConfig`         | `ServicesCardEyebrowConfig`                    | `{}`        | no       |
| `heroConfig`            | `ServicesCardHeroConfig`                       | `{}`        | no       |
| `durationText`          | `string`                           | `undefined` | no       |
| `priceText`             | `string`                           | `undefined` | no       |
| `styleClassPassthrough` | `string \| string[]`               | `[]`        | no       |

### Meta row (`durationText` / `priceText`)

A row below the description shows duration (left) and price (right), separated by a top divider. It defaults to `serviceData.duration`/`serviceData.price` — `durationText`/`priceText` props override that text, and the `duration`/`price` slots (see Slots below) fully replace the content (e.g. to add an icon). The row is omitted entirely when there's no duration/price text and no slot content on either side.

### Whole-card clickable (`href`)

When `href` is set **and no `actions` slot content is provided**, the root element switches from `tag` to a link (`NuxtLink` for an internal href starting with `/`, a plain `a` otherwise) and the whole card becomes clickable — matching `InputButton`'s link-resolution pattern. `external` forces a plain `a` tag even for an internal-looking href (e.g. a Nitro server route like `/api/auth/github`).

If an `actions` slot is provided, the card stays as a static `tag` element (no href rendered) even when `href` is set — this avoids nesting another interactive element (e.g. a button/link in `actions`) inside the card's own anchor, which would be invalid HTML. Use the `href` mode for a plain "whole card links out" card with no separate CTA, and the `actions`-slot mode (see Basic usage below) when the card needs its own button/link.

`is-clickable` is added to the root class list when whole-card-clickable mode is active, giving `cursor: pointer` and removing default link colour/underline. It's also what gates the border/outline hover/focus interaction-state tokens — see "Interaction states (whole-card-clickable only)" in `CONSUMER-STYLING.md`; they're a no-op when the card isn't clickable, since only `.is-clickable` has a `:hover`/`:focus-visible` rule.

### Titles over the image (`titlesWithinImageWrapper`)

When `true`, the eyebrow and title move out of `.details-wrapper` and sit over the bottom of the image instead. The image wrapper is a `GridStack`: the image is layer 1, and `.image-wrapper-details` (eyebrow + title) is layer 2. The description, meta row and actions stay below the image.

- A gradient scrim behind the text keeps it readable. Its colour comes from `--image-wrapper-details-scrim-colour` (default black), and `--image-wrapper-details-scrim` replaces the whole background (`none` removes it).
- Text colour uses `contrast-color()` against the scrim colour where supported (black or white, whichever reads better), falling back to white. It reads the scrim colour only, not the photo, so if you remove the scrim, set `--image-wrapper-details-text-colour` yourself.
- The eyebrow's gradient fill is turned off over the image; it takes the text colour (or `--image-wrapper-details-eyebrow-text-colour`).
- The eyebrow's default `fontSize` is `"medium"` in this mode (vs `"large"` below the image). `eyebrowConfig`/`heroConfig` still apply.

See "Titles over the image" in `CONSUMER-STYLING.md` for the token list.

### EyebrowConfig

Exported as `ServicesCardEyebrowConfig` (and `ServicesCardHeroConfig` below) from `srcdev-nuxt-components` since 2026-09-28.

| Key        | Type                              | Default   |
| ---------- | ---------------------------------- | --------- |
| `tag`      | `"p" \| "div" \| "span"`          | `"div"`   |
| `fontSize` | `"large" \| "medium" \| "small"`  | `"large"` (`"medium"` with `titlesWithinImageWrapper`) |

### HeroConfig

| Key        | Type                                                            | Default     |
| ---------- | ----------------------------------------------------------------- | ----------- |
| `tag`      | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"`                  | `"h2"`      |
| `fontSize` | `"display" \| "title" \| "heading" \| "subheading" \| "label"` | `"heading"` |

Config objects are partial — only specify the keys you want to override. Unset keys fall back to the defaults shown above.

## Slots

| Slot       | Slot props                 | Purpose                                                                                                 |
| ---------- | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `duration` | `{ serviceData: Service }` | Replaces the duration (left) side of the meta row; defaults to `durationText`/`serviceData.duration` |
| `price`    | `{ serviceData: Service }` | Replaces the price (right) side of the meta row; defaults to `priceText`/`serviceData.price`         |
| `actions`  | `{ serviceData: Service }` | CTA area below the meta row — buttons, links, or any action content                                    |

All three slots receive `serviceData` as a scoped prop so the consumer can construct routes, labels, or formatted text from the service data without additional props.

## CSS custom properties

Prefer the `--services-card-*`/`--image-wrapper-*`/`--details-wrapper-*`/`--description-*`/`--meta-*`/`--footer-*`
CSS custom properties documented in `CONSUMER-STYLING.md` (in the component's own folder) over
raw class overrides — it lists every token, its default, which ones have a global `:root`
fallback vs. page-scoped-only, and worked examples for global theming, page-scoped overrides,
and per-instance overrides via `styleClassPassthrough`. For anything the tokens don't cover,
scaffold a style block using `styleClassPassthrough` instead — see
[component-local-style-override.md](../component-local-style-override.md) for the general pattern.

## Basic usage

```vue
<ServicesCard :service-data="service">
  <template #actions="{ serviceData }">
    <InputButton
      variant="secondary"
      :button-text="`More about ${serviceData.title}`"
      :href="`/services/${serviceData.slug}`"
    >
      <template #right>
        <Icon name="mdi:arrow-right" class="icon" />
      </template>
    </InputButton>
  </template>
</ServicesCard>
```

## With config overrides

```vue
<ServicesCard
  :service-data="service"
  :eyebrow-config="{ fontSize: 'small' }"
  :hero-config="{ tag: 'h3', fontSize: 'title' }"
>
  <template #actions="{ serviceData }">
    <InputButton variant="secondary" :button-text="`Enquire`" :href="`/services/${serviceData.slug}`" />
  </template>
</ServicesCard>
```

## With custom meta row content

```vue
<ServicesCard :service-data="service">
  <template #duration="{ serviceData }">
    <Icon name="mdi:clock-time-four-outline" class="icon" />
    <span>{{ serviceData.duration }}</span>
  </template>
  <template #price="{ serviceData }">
    <Icon name="mdi:currency-gbp" class="icon" />
    <span>From {{ serviceData.price }}</span>
  </template>
  <template #actions="{ serviceData }">
    <InputButton variant="secondary" :button-text="`Enquire`" :href="`/services/${serviceData.slug}`" />
  </template>
</ServicesCard>
```

## Consumer page boilerplate

```vue
<template>
  <ServicesCard
    :service-data="service"
    :eyebrow-config="{ fontSize: 'large' }"
    :hero-config="{ tag: 'h2', fontSize: 'heading' }"
  >
    <template #actions="{ serviceData }">
      <InputButton
        variant="secondary"
        :button-text="`Enquire about ${serviceData.title}`"
        :href="`/services/${serviceData.slug}`"
        :style-class-passthrough="['mbs-24']"
      >
        <template #right>
          <Icon name="mdi:arrow-right" class="icon" />
        </template>
      </InputButton>
    </template>
  </ServicesCard>
</template>

<style lang="css">
.page-my-page {
  .services-card {
    --services-card-gap: 1.4rem;
    --description-line-clamp: 3;
    --eyebrow-text-padding-block: 0.8rem 0;
    --hero-text-padding-block: 2rem 1rem;
    --meta-border-colour: var(--brand-border);
  }
}
</style>
```

See `CONSUMER-STYLING.md` for the full token list — every token is a plain public custom property
consumed directly at its point of use (no `--_`-prefixed private indirection layer), so all of
them work both globally (`:root`) and scoped like the example above.

## Titles over the image usage

```vue
<ServicesCard :service-data="service" titles-within-image-wrapper>
  <template #actions="{ serviceData }">
    <InputButton variant="secondary" button-text="Enquire" :href="`/services/${serviceData.slug}`" />
  </template>
</ServicesCard>
```

## Whole-card clickable usage

```vue
<ServicesCard :service-data="service" :href="`/services/${service.slug}`" />
```

No `actions` slot — the entire card renders as an anchor (`NuxtLink` for the internal href here) and is clickable anywhere within it.

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`.
- Root markup is two rows (`grid-template-rows: auto 1fr`): `.image-wrapper`, then a `.details-wrapper` (`display: flex; flex-direction: column`) holding the eyebrow, title, description, and a `.footer` wrapper. Description length is controlled by `--description-line-clamp` (default effectively unclamped) rather than a fixed-height grid row.
- `.footer` groups the meta row and the `actions` slot and gets `margin-block-start: auto`, pinning them to the bottom of the card. Combined with the root's `1fr` details row, this means when `ServicesCardGrid`'s default `align-items: stretch` makes a card taller than its own content (to match a taller sibling in the same row), the extra height goes to `.footer`'s top margin rather than leaving whitespace below the actions slot — so the meta row and actions/button line up across a row of cards regardless of each card's description length. This does the visual job of CSS subgrid without needing a subgrid chain across `ServicesCard`/`ServicesCardGrid` (which would also break whenever cards in a row don't all render the same optional rows — `.meta` and `actions` are both conditional).
- Image has a `3/4` aspect ratio with a subtle scale-on-hover effect, triggered by hovering the image only (not the whole card). When the card is a whole-card link styled with its own hover effect (e.g. `--services-card-transform-hover`), set `--image-wrapper-border-image-zoom-transform: none` so the two effects don't stack; the "Dark Overlay Cards" story does this. Keep the zoom for the `actions`-slot layout, where the card itself has no hover state. The hover is on `.image-wrapper`, not the image, so it still fires when the overlaid titles cover the image. `.image-wrapper-details` is `position: relative; z-index: 1` because the image's hover `transform` would otherwise paint over it, and `.image-wrapper` sets `isolation: isolate` so that z-index stays inside the card.
- `.services-card`, `.image-wrapper`, `.details-wrapper`, and `.footer` all set `min-inline-size: 0`. Without it, an unbreakable child — most commonly a long `actions` slot button label, since `InputButton`'s `.button-text` is `white-space: nowrap` with no ellipsis — forces its content's min-content width up through the flex/grid chain and widens that one card's grid column in `ServicesCardGrid` wider than its siblings (the image just rides along on the widened column; it isn't the actual cause). If you see one card/column wider than the rest with cut-off content, check for a long unbreakable string in a slot before assuming it's an image sizing issue.
- Usually consumed via `ServicesCardGrid` rather than directly.
- The "Dark Overlay Cards" story shows a full restyle using tokens only: dark panel, flush image, titles over the image, hover lift (`--services-card-transform-hover`), and EyebrowText typography tokens (`--eyebrow-text-font-style`, `-letter-spacing`, etc.) set on the card so they inherit into its eyebrow.
