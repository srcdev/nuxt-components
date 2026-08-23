<template>
  <component
    :is="resolvedTag"
    :href="isClickable ? props.href : undefined"
    class="services-card"
    :class="[elementClasses, { 'is-clickable': isClickable }]"
  >
    <div class="image-wrapper">
      <NuxtImg :src="serviceData.image" :alt="serviceData.title" loading="lazy" class="image" />
    </div>
    <div class="details-wrapper">
      <EyebrowText
        :font-size="eyebrowConfig.fontSize ?? 'large'"
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
      <div class="description">
        {{ serviceData.shortDescription }}
      </div>
      <div v-if="hasFooter" class="footer">
        <div v-if="hasMeta" class="meta">
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

interface EyebrowConfig {
  tag?: "p" | "div" | "span";
  fontSize?: "large" | "medium" | "small";
}

interface HeroConfig {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  fontSize?: "display" | "title" | "heading" | "subheading" | "label";
}

interface Props {
  tag?: "div" | "section" | "article";
  serviceData: Service;
  href?: string;
  /**
   * Force a real browser navigation instead of client-side routing, even for a same-origin
   * href starting with "/". See InputButtonCore's `external` prop for the full rationale.
   */
  external?: boolean;
  eyebrowConfig?: EyebrowConfig;
  heroConfig?: HeroConfig;
  /** Overrides serviceData.duration. Ignored if the `duration` slot is used. */
  durationText?: string;
  /** Overrides serviceData.price. Ignored if the `price` slot is used. */
  priceText?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  href: undefined,
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
const hasMeta = computed(() => Boolean(slots.duration || slots.price || durationText.value || priceText.value));
// Groups the meta row and actions slot so they can be pushed to the bottom of the card as
// one unit — keeps them aligned across a row of cards in ServicesCardGrid regardless of how
// long each card's description is, without needing per-row CSS subgrid across components.
const hasFooter = computed(() => Boolean(hasMeta.value || slots.actions));

// Whole card is clickable only when there's no actions slot to hold its own interactive
// content (which would otherwise end up nested inside the card's own anchor) and an href is set
const isClickable = computed(() => Boolean(!slots.actions && props.href));
const isInternalLink = computed(() => isClickable.value && props.href!.startsWith("/") && !props.external);
const resolvedTag = computed(() => {
  if (!isClickable.value) return props.tag;
  if (isInternalLink.value) return NuxtLink;
  return "a";
});

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
    --_services-card-border-radius: var(--services-card-border-radius, 0);
    --_services-card-border-width: var(--services-card-border-width, 1px);
    --_services-card-border-colour: var(--services-card-border-colour, transparent);
    /* Falls back to the resting border colour (not transparent) so setting only
       --services-card-border-colour doesn't make the border vanish on hover/focus. */
    --_services-card-border-colour-hover: var(--services-card-border-colour-hover, var(--_services-card-border-colour));
    --_services-card-outline-width: var(--services-card-outline-width, 2px);
    --_services-card-outline-colour: var(--services-card-outline-colour, transparent);
    --_services-card-outline-colour-hover: var(--services-card-outline-colour-hover, transparent);

    --_services-card-outline-offset: var(--services-card-outline-offset, 0px);
    --_services-card-outline-offset-hover: var(--services-card-outline-offset-hover, 0px);
    --_services-card-gap: var(--services-card-gap, 1rem);

    --_image-wrapper-aspect-ratio: var(--image-wrapper-aspect-ratio, 3/4);
    --_image-wrapper-border-radius: var(--image-wrapper-border-radius, 8px);
    --_image-wrapper-padding-block: var(--image-wrapper-padding-block, 0 0);
    --_image-wrapper-padding-inline: var(--image-wrapper-padding-inline, 0 0);
    --_image-wrapper-border-image-zoom-transform: var(--image-wrapper-border-image-zoom-transform, scale(1.05));

    --_details-wrapper-grid-gap: var(--details-wrapper-grid-gap, 1rem);
    --_details-wrapper-padding-block: var(--details-wrapper-padding-block, 0);
    --_details-wrapper-padding-inline: var(--details-wrapper-padding-inline, 0);

    --_eyebrow-text-padding-block: 0.8rem 0;
    --_hero-text-padding-block: 2rem 1rem;
    --_description-padding-block: var(--description-padding-block, 0 0);
    --_description-text-colour: var(--colour-text-secondary);
    --_description-line-height: var(--description-line-height, 1.4);
    --_description-line-clamp: var(--description-line-clamp, 100);
    --_meta-border-colour: var(--theme-border);
    --_meta-padding-block: var(--meta-padding-block, 1.6rem 0);
    --_meta-text-colour: inherit;
    --_meta-font-size: 1.4rem;
    --_meta-text-transform: var(--meta-text-transform, uppercase);
    --_footer-padding-block: var(--footer-padding-block, 0);
    --_footer-wrapper-grid-gap: var(--footer-wrapper-grid-gap, 1rem);

    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--_services-card-gap);
    min-inline-size: 0;

    border-radius: var(--_services-card-border-radius);
    border: var(--_services-card-border-width) solid var(--_services-card-border-colour);
    outline: var(--_services-card-outline-width) solid var(--_services-card-outline-colour);
    outline-offset: var(--_services-card-outline-offset);
    overflow: hidden;

    transition:
      border-color 0.3s ease-in-out,
      outline-color 0.3s ease-in-out,
      outline-offset 0.3s ease-in-out;

    &.is-clickable {
      color: inherit;
      text-decoration: none;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        border-color: var(--_services-card-border-colour-hover);
        outline-color: var(--_services-card-outline-colour-hover);
        outline-offset: var(--_services-card-outline-offset-hover);
      }
    }

    .image-wrapper {
      aspect-ratio: var(--_image-wrapper-aspect-ratio);
      border-radius: var(--_image-wrapper-border-radius);
      overflow: hidden;
      min-inline-size: 0;
      padding-block: var(--_image-wrapper-padding-block);
      padding-inline: var(--_image-wrapper-padding-inline);

      .image {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-in-out;

        &:hover {
          transform: var(--_image-wrapper-border-image-zoom-transform);
        }
      }
    }

    .details-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--_details-wrapper-grid-gap);
      min-inline-size: 0;

      padding-block: var(--_details-wrapper-padding-block);
      padding-inline: var(--_details-wrapper-padding-inline);

      .eyebrow-text {
        padding-block: var(--_eyebrow-text-padding-block);
      }

      .hero-text {
        padding-block: var(--_hero-text-padding-block);
      }

      .description {
        color: var(--_description-text-colour);
        line-height: var(--_description-line-height);
        padding-block: var(--_description-padding-block);

        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: var(--_description-line-clamp);
        line-clamp: var(--_description-line-clamp);
        text-overflow: ellipsis;
      }

      .footer {
        display: flex;
        flex-direction: column;
        gap: var(--_footer-wrapper-grid-gap);
        margin-block-start: auto;
        min-inline-size: 0;
        padding-block: var(--_footer-padding-block);
      }

      .meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding-block: var(--_meta-padding-block);
        border-block-start: 1px solid var(--_meta-border-colour);
        color: var(--_meta-text-colour);
        font-size: var(--_meta-font-size);
        text-transform: var(--_meta-text-transform);
      }
    }
  }
}
</style>
