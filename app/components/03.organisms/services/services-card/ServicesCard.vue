<template>
  <component
    :is="resolvedTag()"
    :href="isClickable() ? props.href : undefined"
    class="services-card"
    :class="[elementClasses, { 'is-clickable': isClickable() }]"
  >
    <GridStack tag="div" :style-class-passthrough="['services-card-image-wrapper']">
      <template #layer-1>
        <NuxtImg
          :src="serviceData.image"
          :alt="serviceData.title"
          width="640"
          height="853"
          loading="lazy"
          class="services-card-image"
        />
      </template>
      <template #layer-2>
        <div
          v-if="props.titlesWithinImageWrapper && (serviceData.subtitle || serviceData.title)"
          class="services-card-image-details"
        >
          <EyebrowText
            v-if="serviceData.subtitle"
            :font-size="eyebrowConfig.fontSize ?? 'medium'"
            :tag="eyebrowConfig.tag ?? 'div'"
            :text-content="serviceData.subtitle"
          />
          <HeroText
            v-if="serviceData.title"
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

    <div class="services-card-details">
      <EyebrowText
        v-if="!props.titlesWithinImageWrapper && serviceData.subtitle"
        :font-size="eyebrowConfig.fontSize ?? 'large'"
        :tag="eyebrowConfig.tag ?? 'div'"
        :text-content="serviceData.subtitle"
      />
      <HeroText
        v-if="!props.titlesWithinImageWrapper && serviceData.title"
        :tag="heroConfig.tag ?? 'h2'"
        :font-size="heroConfig.fontSize ?? 'heading'"
        :text-content="[
          {
            text: serviceData.title,
            styleClass: 'normal',
          },
        ]"
      />
      <div v-if="serviceData.shortDescription" class="services-card-description">
        {{ serviceData.shortDescription }}
      </div>
      <div v-if="hasFooter()" class="services-card-footer">
        <div v-if="hasMeta()" class="services-card-meta">
          <div class="services-card-meta-duration">
            <slot name="duration" :service-data="serviceData">{{ durationText }}</slot>
          </div>
          <div class="services-card-meta-price">
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
    padding-block: var(--services-card-padding-block, 0);
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
        outline-color: var(--services-card-outline-colour-hover, var(--services-card-outline-colour, transparent));
        outline-offset: var(--services-card-outline-offset-hover, var(--services-card-outline-offset, 0px));
        transform: var(--services-card-transform-hover, none);
      }

      &:focus-visible {
        outline-color: var(
          --services-card-outline-colour-focus,
          var(--services-card-outline-colour-hover, var(--theme-ring, currentColor))
        );
      }

      @media (prefers-reduced-motion: reduce) {
        &:hover,
        &:focus-visible {
          transform: none;
        }
      }
    }

    .services-card-image-wrapper {
      aspect-ratio: var(--services-card-image-aspect-ratio, 3/4);
      border-radius: var(--services-card-image-border-radius, 8px);
      overflow: hidden;
      isolation: isolate;
      min-inline-size: 0;
      padding-block: var(--services-card-image-padding-block, 0 0);
      padding-inline: var(--services-card-image-padding-inline, 0 0);

      .services-card-image {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-in-out;
      }

      &:hover .services-card-image {
        transform: var(--services-card-image-zoom-transform, scale(1.05));
      }

      .services-card-image-details {
        --_scrim-colour: var(--services-card-image-details-scrim-colour, #000);

        position: relative;
        z-index: 1;
        display: grid;
        grid-auto-flow: row;
        align-content: end;
        gap: var(--services-card-image-details-gap, 0.5rem);
        height: 100%;
        overflow-wrap: anywhere;
        color: var(--services-card-image-details-text-colour, #fff);
        background: var(--services-card-image-details-scrim, linear-gradient(to top, rgb(0 0 0 / 0.75), transparent 70%));

        @supports (color: color-mix(in oklab, red, transparent)) {
          background: var(
            --services-card-image-details-scrim,
            linear-gradient(to top, color-mix(in oklab, var(--_scrim-colour) 75%, transparent), transparent 70%)
          );
        }

        @supports (color: contrast-color(red)) {
          color: var(--services-card-image-details-text-colour, contrast-color(var(--_scrim-colour)));
        }

        .eyebrow-text {
          --eyebrow-text-bg-img: none;
          color: var(--services-card-image-details-eyebrow-colour, inherit);
          padding-block: var(--services-card-image-details-eyebrow-padding-block, 0);
          padding-inline: var(--services-card-image-details-eyebrow-padding-inline, 2.2rem);
        }

        .hero-text {
          padding-block: var(--services-card-image-details-title-padding-block, 1.2rem 2.2rem);
          padding-inline: var(--services-card-image-details-title-padding-inline, 2.2rem);
        }
      }
    }

    .services-card-details {
      display: flex;
      flex-direction: column;
      gap: var(--services-card-details-gap, 1rem);
      min-inline-size: 0;
      overflow-wrap: anywhere;

      padding-block: var(--services-card-details-padding-block, 0);
      padding-inline: var(--services-card-details-padding-inline, 0);

      .eyebrow-text {
        padding-block: var(--services-card-eyebrow-padding-block, 0.8rem 0);
      }

      .hero-text {
        padding-block: var(--services-card-title-padding-block, 1.2rem 1rem);
      }

      .services-card-description {
        color: var(--services-card-description-text-colour, inherit);
        font-weight: var(--services-card-description-font-weight, inherit);
        line-height: var(--services-card-description-line-height, 1.4);
        padding-block: var(--services-card-description-padding-block, 0 0);

        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: var(--services-card-description-line-clamp, none);
        line-clamp: var(--services-card-description-line-clamp, none);
      }

      .services-card-footer {
        display: flex;
        flex-direction: column;
        gap: var(--services-card-footer-gap, 1rem);
        margin-block-start: auto;
        min-inline-size: 0;
        padding-block: var(--services-card-footer-padding-block, 0);

        .services-card-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--services-card-meta-gap, 1rem);
          padding-block: var(--services-card-meta-padding-block, 1.6rem 0);
          border-block-start: 1px solid var(--services-card-meta-border-colour, var(--theme-border));
          color: var(--services-card-meta-text-colour, inherit);
          font-size: var(--services-card-meta-font-size, 1.4rem);
          letter-spacing: var(--services-card-meta-letter-spacing, inherit);
          text-transform: var(--services-card-meta-text-transform, uppercase);

          .services-card-meta-duration,
          .services-card-meta-price {
            min-inline-size: 0;
          }

          .services-card-meta-duration {
            color: var(--services-card-meta-duration-text-colour, inherit);
            font-weight: var(--services-card-meta-duration-font-weight, 500);
          }

          .services-card-meta-price {
            color: var(--services-card-meta-price-text-colour, inherit);
            font-weight: var(--services-card-meta-price-font-weight, 700);
          }
        }
      }
    }
  }
}
</style>
