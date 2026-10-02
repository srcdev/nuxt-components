<template>
  <component
    :is="resolvedTag()"
    :href="isClickable() ? props.href : undefined"
    class="services-card"
    :class="[elementClasses, { 'is-clickable': isClickable() }]"
  >
    <GridStack tag="div" :style-class-passthrough="['image-wrapper']">
      <template #layer-1>
        <NuxtImg :src="serviceData.image" :alt="serviceData.title" loading="lazy" class="image" />
      </template>
      <template #layer-2>
        <div v-if="props.titlesWithinImageWrapper" class="image-wrapper-details">
          <EyebrowText
            :font-size="eyebrowConfig.fontSize ?? 'medium'"
            :tag="eyebrowConfig.tag ?? 'div'"
            :text-content="serviceData.subtitle"
          />
          <HeroText
            :tag="heroConfig.tag ?? 'h2'"
            :font-size="heroConfig.fontSize ?? 'heading'"
            :text-content="[
              {
                text: serviceData.title,
                styleClass: 'normal',
              },
            ]"
          />
        </div>
      </template>
    </GridStack>

    <div class="details-wrapper">
      <EyebrowText
        v-if="!props.titlesWithinImageWrapper"
        :font-size="eyebrowConfig.fontSize ?? 'large'"
        :tag="eyebrowConfig.tag ?? 'div'"
        :text-content="serviceData.subtitle"
      />
      <HeroText
        v-if="!props.titlesWithinImageWrapper"
        :tag="heroConfig.tag ?? 'h2'"
        :font-size="heroConfig.fontSize ?? 'heading'"
        :text-content="[
          {
            text: serviceData.title,
            styleClass: 'normal',
          },
        ]"
      />
      <div class="description">
        {{ serviceData.shortDescription }}
      </div>
      <div v-if="hasFooter()" class="footer">
        <div v-if="hasMeta()" class="meta">
          <div class="meta-duration">
            <slot name="duration" :service-data="serviceData">{{ durationText }}</slot>
          </div>
          <div class="meta-price">
            <slot name="price" :service-data="serviceData">{{ priceText }}</slot>
          </div>
        </div>
        <slot name="actions" :service-data="serviceData"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";
import type { ServicesCardEyebrowConfig, ServicesCardHeroConfig } from "~/types/components";

interface Props {
  tag?: "div" | "section" | "article";
  serviceData: Service;
  href?: string;
  titlesWithinImageWrapper?: boolean;
  /**
   * Force a real browser navigation instead of client-side routing, even for a same-origin
   * href starting with "/". See InputButton's `external` prop for the full rationale.
   */
  external?: boolean;
  eyebrowConfig?: ServicesCardEyebrowConfig;
  heroConfig?: ServicesCardHeroConfig;
  /** Overrides serviceData.duration. Ignored if the `duration` slot is used. */
  durationText?: string;
  /** Overrides serviceData.price. Ignored if the `price` slot is used. */
  priceText?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  href: undefined,
  titlesWithinImageWrapper: false,
  external: false,
  eyebrowConfig: () => ({}),
  heroConfig: () => ({}),
  durationText: undefined,
  priceText: undefined,
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const NuxtLink = resolveComponent("NuxtLink");

const durationText = computed(() => props.durationText ?? props.serviceData.duration);
const priceText = computed(() => props.priceText ?? props.serviceData.price);
const hasMeta = () => Boolean(slots.duration || slots.price || durationText.value || priceText.value);
// Groups the meta row and actions slot so they can be pushed to the bottom of the card as
// one unit — keeps them aligned across a row of cards in ServicesCardGrid regardless of how
// long each card's description is, without needing per-row CSS subgrid across components.
const hasFooter = () => Boolean(hasMeta() || slots.actions);

// Whole card is clickable only when there's no actions slot to hold its own interactive
// content (which would otherwise end up nested inside the card's own anchor) and an href is set
const isClickable = () => Boolean(!slots.actions && props.href);
const isInternalLink = () => isClickable() && props.href!.startsWith("/") && !props.external;
const resolvedTag = () => {
  if (!isClickable()) return props.tag;
  if (isInternalLink()) return NuxtLink;
  return "a";
};

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .services-card {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--services-card-gap, 1rem);
    min-inline-size: 0;

    background-color: var(--services-card-background-color, transparent);
    padding-block: var(--services-card-padding-block,);
    padding-inline: var(--services-card-padding-inline, 0);
    border-radius: var(--services-card-border-radius, 0);
    border: var(--services-card-border-width, 1px) solid var(--services-card-border-colour, transparent);
    outline: var(--services-card-outline-width, 2px) solid var(--services-card-outline-colour, transparent);
    outline-offset: var(--services-card-outline-offset, 0px);
    overflow: hidden;

    transition:
      background-color 0.3s ease-in-out,
      border-color 0.3s ease-in-out,
      outline-color 0.3s ease-in-out,
      outline-offset 0.3s ease-in-out,
      transform 0.3s ease-in-out;

    &.is-clickable {
      color: inherit;
      text-decoration: none;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        /* Falls back to the resting border colour (not transparent) so setting only
           --services-card-border-colour doesn't make the border vanish on hover/focus. */
        background-color: var(
          --services-card-background-color-hover,
          var(--services-card-background-color, transparent)
        );
        border-color: var(--services-card-border-colour-hover, var(--services-card-border-colour, transparent));
        outline-color: var(--services-card-outline-colour-hover, transparent);
        outline-offset: var(--services-card-outline-offset-hover, 0px);
        transform: var(--services-card-transform-hover, none);
      }

      @media (prefers-reduced-motion: reduce) {
        &:hover,
        &:focus-visible {
          transform: none;
        }
      }
    }

    .image-wrapper {
      aspect-ratio: var(--image-wrapper-aspect-ratio, 3/4);
      border-radius: var(--image-wrapper-border-radius, 8px);
      overflow: hidden;
      isolation: isolate;
      min-inline-size: 0;
      padding-block: var(--image-wrapper-padding-block, 0 0);
      padding-inline: var(--image-wrapper-padding-inline, 0 0);

      .image {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-in-out;
      }

      &:hover .image {
        transform: var(--image-wrapper-border-image-zoom-transform, scale(1.05));
      }

      .image-wrapper-details {
        --_scrim-colour: var(--image-wrapper-details-scrim-colour, #000);

        position: relative;
        z-index: 1;
        display: grid;
        grid-auto-flow: row;
        align-content: end;
        gap: var(--image-wrapper-details-gap, 0.5rem);
        height: 100%;
        color: var(--image-wrapper-details-text-colour, #fff);
        background: var(--image-wrapper-details-scrim, linear-gradient(to top, rgb(0 0 0 / 0.75), transparent 70%));

        @supports (color: color-mix(in oklab, red, transparent)) {
          background: var(
            --image-wrapper-details-scrim,
            linear-gradient(to top, color-mix(in oklab, var(--_scrim-colour) 75%, transparent), transparent 70%)
          );
        }

        @supports (color: contrast-color(red)) {
          color: var(--image-wrapper-details-text-colour, contrast-color(var(--_scrim-colour)));
        }

        .eyebrow-text {
          --eyebrow-text-bg-img: none;
          color: var(--image-wrapper-details-eyebrow-text-colour, inherit);
          padding-block: var(--image-wrapper-details-eyebrow-text-padding-block, 0);
          padding-inline: var(--image-wrapper-details-eyebrow-text-padding-inline, 2.2rem);
        }

        .hero-text {
          padding-block: var(--image-wrapper-details-hero-text-padding-block, 1.2rem 2.2rem);
          padding-inline: var(--image-wrapper-details-hero-text-padding-inline, 2.2rem);
        }
      }
    }

    .details-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--details-wrapper-grid-gap, 1rem);
      min-inline-size: 0;

      padding-block: var(--details-wrapper-padding-block, 0);
      padding-inline: var(--details-wrapper-padding-inline, 0);

      .eyebrow-text {
        padding-block: var(--eyebrow-text-padding-block, 0.8rem 0);
      }

      .hero-text {
        padding-block: var(--hero-text-padding-block, 1.2rem 1rem);
      }

      .description {
        color: var(--description-text-colour, var(--colour-text-secondary));
        font-weight: var(--description-font-weight, inherit);
        line-height: var(--description-line-height, 1.4);
        padding-block: var(--description-padding-block, 0 0);

        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: var(--description-line-clamp, 100);
        line-clamp: var(--description-line-clamp, 100);
        text-overflow: ellipsis;
      }

      .footer {
        display: flex;
        flex-direction: column;
        gap: var(--footer-wrapper-grid-gap, 1rem);
        margin-block-start: auto;
        min-inline-size: 0;
        padding-block: var(--footer-padding-block, 0);

        .meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding-block: var(--meta-padding-block, 1.6rem 0);
          border-block-start: 1px solid var(--meta-border-colour, var(--theme-border));
          color: var(--meta-text-colour, inherit);
          font-size: var(--meta-font-size, 1.4rem);
          letter-spacing: var(--meta-letter-spacing, inherit);
          text-transform: var(--meta-text-transform, uppercase);

          .meta-duration {
            color: var(--meta-duration-text-colour, inherit);
            font-weight: var(--meta-duration-font-weight, 500);
          }

          .meta-price {
            color: var(--meta-price-text-colour, inherit);
            font-weight: var(--meta-price-font-weight, 700);
          }
        }
      }
    }
  }
}
</style>
