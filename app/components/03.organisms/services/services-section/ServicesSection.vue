<template>
  <component :is="tag" class="services-section" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
    <div class="services-section__grid" :class="{ 'services-section__grid--reverse': reverse }">
      <div class="services-section__image-wrapper">
        <NuxtImg
          :src="serviceData.image"
          :alt="serviceData.title"
          :loading="imageLoading"
          :fetchpriority="imageFetchPriority"
          class="services-section__image"
        />
      </div>
      <div class="services-section__info-wrapper" :class="infoWrapperClasses">
        <EyebrowText font-size="large" :text-content="serviceData.subtitle" />
        <HeroText
          :id="headingId"
          :tag="headerTag"
          font-size="title"
          :text-content="[
            {
              text: serviceData.title,
              styleClass: 'normal',
            },
          ]"
          :style-class-passthrough="['mb-20']"
        />

        <div class="services-section__price-duration">
          <div class="flex-row">
            <Icon :name="durationIcon" class="services-section__decorator" />
            <span>{{ serviceData.duration }}</span>
          </div>
          <div class="flex-row">
            <Icon :name="priceIcon" class="services-section__decorator" />
            <span>{{ serviceData.price }}</span>
          </div>
        </div>

        <p v-if="!isSummary" class="page-body-normal">{{ serviceData.longDescription }}</p>

        <HeroText
          v-if="!isSummary"
          :tag="headerTag"
          axis="horizontal"
          font-size="subheading"
          :text-content="serviceData.heroHeading"
          :style-class-passthrough="['mb-20']"
        />
        <p class="page-body-normal">
          {{ serviceData.whatIsIt }}
        </p>

        <slot v-if="isSummary" name="summary-link" :service-data="serviceData"></slot>

        <HeroText
          v-if="!isSummary"
          :tag="headerTag"
          axis="horizontal"
          font-size="subheading"
          :text-content="[{ text: processHeading, styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <StepperList
          v-if="!isSummary"
          tag="ol"
          indicator-alignment="top"
          indicator-variant="circle"
          :show-connectors="true"
          :item-count="serviceData.process.length"
        >
          <template v-for="(item, i) in serviceData.process" :key="i" #[`item-${i}`]>
            <p class="page-body-normal">{{ item }}</p>
          </template>
        </StepperList>

        <HeroText
          v-if="!isSummary"
          :tag="headerTag"
          axis="horizontal"
          font-size="subheading"
          :text-content="[{ text: idealForHeading, styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <StepperList v-if="!isSummary" :connected="false" :item-count="serviceData.idealFor.length">
          <template v-for="(_, i) in serviceData.idealFor" :key="i" #[`indicator-${i}`]>
            <Icon name="mdi:checkbox-marked-circle-outline" class="indicator-icon" />
          </template>
          <template v-for="(item, i) in serviceData.idealFor" :key="i" #[`item-${i}`]>
            <p class="page-body-normal">{{ item }}</p>
          </template>
        </StepperList>

        <HeroText
          v-if="!isSummary"
          :tag="headerTag"
          axis="horizontal"
          font-size="subheading"
          :text-content="[{ text: maintenanceHeading, styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <p v-if="!isSummary" class="page-body-normal">{{ serviceData.maintenance }}</p>

        <HeroText
          v-if="!isSummary"
          :tag="headerTag"
          axis="horizontal"
          font-size="subheading"
          :text-content="[{ text: faqsHeading, styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <AccordianCore
          v-if="!isSummary"
          id="faq"
          :item-count="serviceData.faqs.length"
          :name="`faq-${useId()}`"
          :style-class-passthrough="['services-section__faq']"
        >
          <template v-for="(_, key) in serviceData.faqs" :key="`summary-${key}`" #[`accordian-${key}-summary`]>
            {{ serviceData.faqs[key]?.question }}
          </template>
          <template v-for="(_, key) in serviceData.faqs" :key="`icon-${key}`" #[`accordian-${key}-icon`]>
            <Icon name="mdi:chevron-down" />
          </template>
          <template v-for="(_, key) in serviceData.faqs" :key="`content-${key}`" #[`accordian-${key}-content`]>
            <p class="services-section__faq-answer">{{ serviceData.faqs[key]?.answer }}</p>
          </template>
        </AccordianCore>

        <slot
          v-if="!isSummary"
          name="cta-panel"
          :service-data="serviceData"
          :cta-heading="ctaHeading"
          :cta-body="ctaBody"
        >
          <GlassPanel :style-class-passthrough="['services-section__glass-panel', 'p-24']">
            <HeroText
              tag="h2"
              axis="horizontal"
              font-size="subheading"
              :text-content="[{ text: ctaHeading, styleClass: 'normal' }]"
              :style-class-passthrough="['mbs-0', 'mbe-20']"
            />
            <p class="page-body-normal">{{ ctaBody }}</p>
            <slot name="cta" :service-data="serviceData"></slot>
          </GlassPanel>
        </slot>
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
  isSummary?: boolean;
  summaryAlignment?: "start" | "center" | "end";
  reverse?: boolean;
  durationIcon?: string;
  priceIcon?: string;
  processHeading?: string;
  idealForHeading?: string;
  maintenanceHeading?: string;
  faqsHeading?: string;
  ctaHeading?: string;
  ctaBody?: string;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  headerTag: "h2",
  index: 0,
  isSummary: false,
  summaryAlignment: "center",
  durationIcon: "mdi:clock-time-four-outline",
  priceIcon: "mdi:currency-gbp",
  processHeading: "The Process",
  idealForHeading: "Ideal For",
  maintenanceHeading: "Aftercare & Maintenance",
  faqsHeading: "Frequently Asked Questions",
  ctaHeading: "Ready to book your appointment?",
  ctaBody: "Get in touch to book your appointment.",
  styleClassPassthrough: () => [],
});

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);

const infoWrapperClasses = computed(() => {
  return {
    "services-section__info-wrapper--summary": props.isSummary,
    "services-section__info-wrapper--align-start": props.isSummary && props.summaryAlignment === "start",
    "services-section__info-wrapper--align-center": props.isSummary && props.summaryAlignment === "center",
    "services-section__info-wrapper--align-end": props.isSummary && props.summaryAlignment === "end",
  };
});

// Computed to return loading="lazy" if index is greater than 1, so that the first two sections prioritise image loading, but if there are more than 2 sections, the rest will lazy load their images to improve performance.
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
  .services-section {
    container-type: inline-size;
    container-name: services-section;

    .services-section__grid {
      --_grid-gap: var(--services-section-grid-gap, 2rem);

      display: grid;
      grid-template-columns: 1fr;
      gap: var(--_grid-gap);

      @media (width >= 768px) {
        --_grid-gap: var(--services-section-grid-gap-desktop, 3rem);

        grid-template-columns: repeat(auto-fit, minmax(446px, 1fr));

        &.services-section__grid--reverse {
          .services-section__image-wrapper {
            /* The order: 2 on .services-section__image-wrapper pushes it after the content div, since by default both children have order: 0 and source order wins — so the content div naturally sits first. */
            order: 2;
          }
        }
      }

      .services-section__info-wrapper {
        &.services-section__info-wrapper--summary {
          display: grid;

          &.services-section__info-wrapper--align-start {
            align-content: start;
          }
          &.services-section__info-wrapper--align-center {
            align-content: center;
          }
          &.services-section__info-wrapper--align-end {
            align-content: end;
          }
        }
      }

      .services-section__image-wrapper {
        align-self: start;
        border-radius: var(--services-section-image-border-radius, 0.8rem);
        overflow: hidden;

        .services-section__image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .services-section__price-duration {
        display: flex;
        flex-direction: row;
        gap: var(--services-section-price-duration-gap, 3rem);
        align-items: center;
        margin-block-end: var(--services-section-price-duration-margin-block-end, 2rem);

        > div {
          display: flex;
          flex-direction: row;
          gap: var(--services-section-price-duration-item-gap, 0.8rem);
          align-items: center;

          .services-section__decorator {
            width: var(--services-section-decorator-size, 2rem);
            height: var(--services-section-decorator-size, 2rem);
          }
        }
      }

      .services-section__faq {
        margin-block-end: var(--services-section-faq-margin-block-end, 2.4rem);

        &.display-accordian {
          max-width: none;

          .accordian-item.expanding-panel {
            border-block-end: 1px solid var(--services-section-faq-divider-color, currentColor);
            opacity: var(--services-section-faq-divider-opacity, 0.7);

            &:first-child {
              border-block-start: 1px solid var(--services-section-faq-divider-color, currentColor);
            }

            .expanding-panel-details .expanding-panel-summary {
              padding-block: 1.2rem;
            }

            .expanding-panel-content .inner {
              .services-section__faq-answer {
                line-height: var(--services-section-faq-answer-line-height, 1.6);
              }
            }
          }
        }
      }
    }
  }
}
</style>
