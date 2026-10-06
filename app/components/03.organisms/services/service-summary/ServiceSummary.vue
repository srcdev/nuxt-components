<template>
  <component :is="tag" class="service-summary" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
    <div class="service-summary__grid" :class="{ 'service-summary__grid--reverse': reverse }">
      <div class="service-summary__image-wrapper">
        <NuxtImg
          :src="serviceData.image"
          :alt="serviceData.title"
          width="1080"
          height="1080"
          :loading="imageLoading"
          :fetchpriority="imageFetchPriority"
          class="service-summary__image"
        />
      </div>
      <div class="service-summary__info-wrapper" :class="infoWrapperClasses">
        <EyebrowText v-if="serviceData.subtitle" font-size="large" :text-content="serviceData.subtitle" />
        <HeroText
          v-if="serviceData.title"
          :id="headingId"
          :tag="headerTag"
          font-size="title"
          :text-content="[{ text: serviceData.title, styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <div v-if="serviceData.duration || serviceData.price" class="service-summary__pills">
          <DisplayPill v-if="serviceData.duration" :label="serviceData.duration" size="md" variant="neutral" />
          <DisplayPill v-if="serviceData.price" :label="priceLabel" size="md" variant="neutral" />
        </div>

        <p v-if="serviceData.whatIsIt" class="page-body-normal">{{ serviceData.whatIsIt }}</p>

        <slot name="summary-link" :service-data="serviceData"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";

interface Props {
  tag?: "div" | "section" | "article" | "main";
  headerTag?: "h1" | "h2" | "h3";
  index?: number;
  serviceData: Service;
  alignment?: "start" | "center" | "end";
  reverse?: boolean;
  /** Text before the price in its pill, e.g. "From £95". Override for localisation; "" shows the price alone. */
  pricePrefix?: string;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  headerTag: "h2",
  index: 0,
  alignment: "center",
  reverse: false,
  pricePrefix: "From",
  styleClassPassthrough: () => [],
});

// No title means no heading to point at, so don't label the landmark from one.
const { headingId, ariaLabelledby } = useAriaLabelledById(() => (props.serviceData.title ? props.tag : "div"));

const priceLabel = computed(() => `${props.pricePrefix} ${props.serviceData.price}`.trim());

const infoWrapperClasses = computed(() => ({
  [`service-summary__info-wrapper--align-${props.alignment}`]: true,
}));

// Computed to return loading="lazy" if index is greater than 1, so that the first two summaries prioritise image loading, but if there are more than 2 summaries, the rest will lazy load their images to improve performance.
const imageLoading = computed(() => (props.index !== undefined && props.index > 1 ? "lazy" : "eager"));

// Only the first image (LCP candidate) gets fetchpriority="high" to reduce resource load delay.
const imageFetchPriority = computed(() => (props.index === 0 ? "high" : "auto"));

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
  .service-summary {
    container-type: inline-size;
    container-name: service-summary;
    height: var(--service-summary-height-mobile, auto);

    @container service-summary (width >= 768px) {
      height: var(--service-summary-height-tablet, var(--service-summary-height-mobile, auto));
    }

    @container service-summary (width >= 1024px) {
      height: var(
        --service-summary-height-desktop,
        var(--service-summary-height-tablet, var(--service-summary-height-mobile, auto))
      );
    }

    .service-summary__grid {
      --_grid-gap: var(--service-summary-grid-gap, 2rem);

      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--_grid-gap);
      height: 100%;

      @container service-summary (width >= 768px) {
        --_grid-gap: var(--service-summary-grid-gap-desktop, 3rem);

        grid-template-columns: repeat(
          auto-fit,
          minmax(min(var(--service-summary-column-min-width, 246px), 100%), 1fr)
        );

        &.service-summary__grid--reverse {
          .service-summary__image-wrapper {
            /* The order: 2 on .service-summary__image-wrapper pushes it after the content div, since by default both children have order: 0 and source order wins — so the content div naturally sits first. */
            order: 2;
          }
        }
      }

      .service-summary__info-wrapper {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        min-inline-size: 0;
        overflow-wrap: anywhere;

        .page-body-normal {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: var(--service-summary-body-line-clamp, none);
          line-clamp: var(--service-summary-body-line-clamp, none);
        }

        &.service-summary__info-wrapper--align-start {
          align-content: start;
        }
        &.service-summary__info-wrapper--align-center {
          align-content: center;
        }
        &.service-summary__info-wrapper--align-end {
          align-content: end;
        }
      }

      .service-summary__image-wrapper {
        height: 100%;
        aspect-ratio: var(--service-summary-image-aspect-ratio, 1 / 1);
        padding-block: var(--service-summary-image-padding-block-mobile, 0);
        padding-inline: var(--service-summary-image-padding-inline-mobile, 0);
        border-radius: var(--service-summary-image-border-radius, 0.8rem);
        overflow: hidden;

        @container service-summary (width >= 768px) {
          padding-block: var(
            --service-summary-image-padding-block-tablet,
            var(--service-summary-image-padding-block-mobile, 0)
          );
          padding-inline: var(
            --service-summary-image-padding-inline-tablet,
            var(--service-summary-image-padding-inline-mobile, 0)
          );
        }

        @container service-summary (width >= 1024px) {
          padding-block: var(
            --service-summary-image-padding-block-desktop,
            var(--service-summary-image-padding-block-tablet, var(--service-summary-image-padding-block-mobile, 0))
          );
          padding-inline: var(
            --service-summary-image-padding-inline-desktop,
            var(--service-summary-image-padding-inline-tablet, var(--service-summary-image-padding-inline-mobile, 0))
          );
        }

        .service-summary__image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .service-summary__pills {
        display: flex;
        flex-wrap: wrap;
        gap: var(--service-summary-pills-gap, 0.8rem);
        min-inline-size: 0;
        margin-block-end: var(--service-summary-pills-margin-block-end, 2rem);

        --display-pill-background: var(--service-summary-pill-bg, transparent);
        --display-pill-text-colour: var(--service-summary-pill-colour, currentColor);
        --display-pill-border-colour: var(--service-summary-pill-border-colour, currentColor);
      }
    }
  }
}
</style>
