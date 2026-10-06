<template>
  <component :is="tag" class="service-detail" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
    <GridStack tag="div" class="service-detail__hero">
      <template #image>
        <PageRow tag="div" :variant="heroImageVariant" class="service-detail__hero-image-row">
          <NuxtImg
            :src="serviceData.image"
            :alt="serviceData.title"
            width="1920"
            height="1080"
            :loading="imageLoading"
            :fetchpriority="imageFetchPriority"
            class="service-detail__hero-image"
          />
        </PageRow>
      </template>
      <template #content>
        <PageRow tag="div" :variant="heroContentVariant" class="service-detail__hero-overlay">
          <div class="service-detail__hero-content">
            <Breadcrumb
              v-if="resolvedBreadcrumbItems.length"
              :items="resolvedBreadcrumbItems"
              :aria-label="breadcrumbAriaLabel"
              class="service-detail__breadcrumb"
            />
            <EyebrowText v-if="serviceData.subtitle" font-size="large" :text-content="serviceData.subtitle" />
            <HeroText
              v-if="serviceData.title"
              :id="headingId"
              :tag="headerTag"
              font-size="display"
              :text-content="[{ text: serviceData.title, styleClass: 'normal' }]"
            />
            <div v-if="serviceData.duration || serviceData.price" class="service-detail__hero-pills">
              <DisplayPill v-if="serviceData.duration" :label="serviceData.duration" size="md" variant="neutral" />
              <DisplayPill v-if="serviceData.price" :label="heroPriceLabel" size="md" variant="neutral" />
            </div>
          </div>
        </PageRow>
      </template>
    </GridStack>

    <PageRow tag="div" :variant="bodyVariant" class="service-detail__body-row">
      <div class="service-detail__body">
        <div class="service-detail__main">
          <p v-if="serviceData.longDescription" class="page-body-normal">{{ serviceData.longDescription }}</p>

          <HeroText
            v-if="hasHeroHeading"
            :tag="subheadingTag"
            axis="horizontal"
            font-size="subheading"
            :text-content="serviceData.heroHeading"
            :style-class-passthrough="['mb-20']"
          />
          <p v-if="serviceData.whatIsIt" class="page-body-normal">{{ serviceData.whatIsIt }}</p>

          <template v-if="serviceData.process?.length">
            <HeroText
              v-if="processHeading"
              :tag="subheadingTag"
              axis="horizontal"
              font-size="subheading"
              :text-content="[{ text: processHeading, styleClass: 'normal' }]"
              :style-class-passthrough="['mb-20']"
            />
            <StepperList
              tag="ol"
            indicator-alignment="top"
            indicator-variant="circle"
            :connected="true"
            :item-count="serviceData.process.length"
            class="service-detail__process"
          >
              <template v-for="(step, i) in serviceData.process" :key="i" #[`item-${i}`]>
                <p class="page-body-normal">{{ step }}</p>
              </template>
            </StepperList>
          </template>

          <template v-if="serviceData.idealFor?.length">
            <HeroText
              v-if="idealForHeading"
              :tag="subheadingTag"
              axis="horizontal"
              font-size="subheading"
              :text-content="[{ text: idealForHeading, styleClass: 'normal' }]"
              :style-class-passthrough="['mb-20']"
            />
            <ul class="service-detail__ideal-for">
              <li v-for="(item, i) in serviceData.idealFor" :key="i" class="service-detail__ideal-for-item">
                <Icon :name="idealForIcon" class="service-detail__ideal-for-icon" aria-hidden="true" />
                <p class="page-body-normal">{{ item }}</p>
              </li>
            </ul>
          </template>

          <template v-if="serviceData.maintenance">
            <HeroText
              v-if="maintenanceHeading"
              :tag="subheadingTag"
              axis="horizontal"
              font-size="subheading"
              :text-content="[{ text: maintenanceHeading, styleClass: 'normal' }]"
              :style-class-passthrough="['mb-20']"
            />
            <p class="page-body-normal">{{ serviceData.maintenance }}</p>
          </template>

          <template v-if="serviceData.faqs?.length">
            <HeroText
              v-if="faqsHeading"
              :tag="subheadingTag"
              axis="horizontal"
              font-size="subheading"
              :text-content="[{ text: faqsHeading, styleClass: 'normal' }]"
              :style-class-passthrough="['mb-20']"
            />
            <div class="service-detail__faqs">
              <div v-for="(faq, i) in serviceData.faqs" :key="i" class="service-detail__faq">
                <component :is="faqQuestionTag" v-if="faq.question" class="service-detail__faq-question">
                  {{ faq.question }}
                </component>
                <p v-if="faq.answer" class="page-body-normal">{{ faq.answer }}</p>
              </div>
            </div>
          </template>
        </div>

        <aside class="service-detail__sidebar">
          <GlassPanel :style-class-passthrough="['service-detail__booking-card']">
            <p v-if="bookingHeading" class="service-detail__sidebar-label">{{ bookingHeading }}</p>

            <div v-if="serviceData.price" class="service-detail__sidebar-row">
              <span>{{ priceLabel }}</span>
              <span>{{ serviceData.price }}</span>
            </div>
            <div v-if="serviceData.duration" class="service-detail__sidebar-row">
              <span>{{ durationLabel }}</span>
              <span>{{ serviceData.duration }}</span>
            </div>
            <div v-if="location" class="service-detail__sidebar-row">
              <span>{{ locationLabel }}</span>
              <span>{{ location }}</span>
            </div>

            <div v-if="$slots['book-cta']" class="service-detail__sidebar-row book-cta">
              <slot name="book-cta" :service-data="serviceData"></slot>
            </div>

            <div class="service-detail__sidebar-note">
              <slot name="sidebar-note"></slot>
            </div>
          </GlassPanel>

          <div v-if="relatedServices.length" class="service-detail__related">
            <p v-if="relatedServicesHeading" class="service-detail__sidebar-label">{{ relatedServicesHeading }}</p>

            <div class="service-detail__related-items">
              <div
                v-for="(related, i) in relatedServices"
                :key="`${i}-${related.slug}`"
                class="service-detail__related-item-slot"
              >
                <slot name="related-service" :service="related" :index="i">
                  <div class="service-detail__related-item">
                    <NuxtImg
                      :src="related.image"
                      :alt="related.title"
                      width="640"
                      height="640"
                      loading="lazy"
                      class="service-detail__related-image"
                    />
                    <div class="service-detail__related-details">
                      <p class="service-detail__related-title">{{ related.title }}</p>
                      <p class="service-detail__related-price">{{ related.price }}</p>
                    </div>
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageRow>

    <PageRow tag="div" :variant="finalCtaVariant" class="service-detail__final-cta-row">
      <div class="service-detail__final-cta">
        <div class="service-detail__final-cta-copy">
          <HeroText
            v-if="finalCtaHeading"
            :tag="subheadingTag"
            axis="horizontal"
            font-size="subheading"
            :text-content="[{ text: finalCtaHeading, styleClass: 'normal' }]"
          />
          <p v-if="finalCtaBody" class="page-body-normal">{{ finalCtaBody }}</p>
        </div>
        <div v-if="$slots['final-cta']" class="service-detail__final-cta-action">
          <slot name="final-cta" :service-data="serviceData"></slot>
        </div>
      </div>
    </PageRow>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";
import type { BreadcrumbItem } from "~/types/components/breadcrumb";

interface Props {
  tag?: "div" | "section" | "article" | "main";
  headerTag?: "h1" | "h2" | "h3";
  subheadingTag?: "h2" | "h3";
  serviceData: Service;
  breadcrumbItems?: BreadcrumbItem[];
  /** aria-label on the breadcrumb nav. Defaults to Breadcrumb's own label; override for localisation. */
  breadcrumbAriaLabel?: string;
  /** Text before the price in the hero pill, e.g. "From £95". Override for localisation; "" shows the price alone. */
  pricePrefix?: string;
  idealForIcon?: string;
  heroImageVariant?: "full" | "popout" | "content" | "inset-content";
  heroContentVariant?: "full" | "popout" | "content" | "inset-content";
  bodyVariant?: "full" | "popout" | "content" | "inset-content";
  finalCtaVariant?: "full" | "popout" | "content" | "inset-content";
  processHeading?: string;
  idealForHeading?: string;
  maintenanceHeading?: string;
  faqsHeading?: string;
  bookingHeading?: string;
  priceLabel?: string;
  durationLabel?: string;
  locationLabel?: string;
  location?: string;
  relatedServicesHeading?: string;
  relatedServices?: Service[];
  finalCtaHeading?: string;
  finalCtaBody?: string;
  imageLoading?: "eager" | "lazy";
  imageFetchPriority?: "high" | "auto" | "low";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  headerTag: "h1",
  subheadingTag: "h2",
  breadcrumbItems: undefined,
  breadcrumbAriaLabel: undefined,
  pricePrefix: "From",
  idealForIcon: "mdi:diamond-stone",
  heroImageVariant: "full",
  heroContentVariant: "content",
  bodyVariant: "content",
  finalCtaVariant: "content",
  processHeading: "The Process",
  idealForHeading: "Ideal For",
  maintenanceHeading: "Aftercare & Maintenance",
  faqsHeading: "Frequently Asked Questions",
  bookingHeading: "Book This Service",
  priceLabel: "Price",
  durationLabel: "Duration",
  locationLabel: "Location",
  location: undefined,
  relatedServicesHeading: "You May Also Like",
  relatedServices: () => [],
  finalCtaHeading: "Ready to book your appointment?",
  finalCtaBody: "Get in touch to book your appointment.",
  imageLoading: "eager",
  imageFetchPriority: "high",
  styleClassPassthrough: () => [],
});

// No title means no heading to point at, so don't label the landmark from one.
const { headingId, ariaLabelledby } = useAriaLabelledById(() => (props.serviceData.title ? props.tag : "div"));

const heroPriceLabel = computed(() => `${props.pricePrefix} ${props.serviceData.price}`.trim());
const hasHeroHeading = computed(() => Boolean(props.serviceData.heroHeading?.some((item) => item.text)));
const faqQuestionTag = computed(() => (props.subheadingTag === "h2" ? "h3" : "h4"));

// Falls back to a plain, non-linked breadcrumb built from the service's own category/title
// when the consumer doesn't pass real routes — routing is always the consumer's decision.
const resolvedBreadcrumbItems = computed<BreadcrumbItem[]>(
  () =>
    (props.breadcrumbItems ?? [{ label: props.serviceData.category }, { label: props.serviceData.title }]).filter(
      (item) => item.label
    )
);

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
  .service-detail {
    --_clip-allowance: 0.2em;

    container-type: inline-size;
    container-name: service-detail;

    .service-detail__hero {
      border-radius: var(--service-detail-hero-border-radius, 0.8rem);
      overflow: hidden;
      min-block-size: var(--service-detail-hero-min-height-mobile, 32rem);

      @container (width >= 768px) {
        min-block-size: var(--service-detail-hero-min-height-tablet, 36rem);
      }

      @container (width >= 1024px) {
        min-block-size: var(--service-detail-hero-min-height-desktop, 42rem);
      }

      .grid-stack__layer {
        height: 100%;
        overflow: hidden;

        .service-detail__hero-image-row,
        .service-detail__hero-overlay {
          height: 100%;
          grid-template-rows: 100%;
        }
      }

      .service-detail__hero-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: var(--service-detail-hero-image-position-small, bottom);

        @container (width >= 768px) {
          object-position: var(--service-detail-hero-image-position-medium, center);
        }
      }

      .service-detail__hero-overlay {
        display: grid;
        height: 100%;
        padding-block: var(--service-detail-hero-padding, 3.2rem);
        background: var(
          --service-detail-hero-scrim,
          linear-gradient(0deg, rgb(0 0 0 / 70%) 0%, rgb(0 0 0 / 10%) 60%, transparent 100%)
        );

        .service-detail__hero-content {
          display: grid;
          min-inline-size: 0;
          overflow-wrap: anywhere;
          align-content: var(--service-detail-hero-content-align, end);

          .service-detail__breadcrumb {
            --breadcrumb-colour: var(--service-detail-hero-text-colour, white);
            margin-block-end: var(--service-detail-breadcrumb-margin-block-end, 0.8rem);
          }

          .eyebrow-text,
          .hero-text {
            color: var(--service-detail-hero-text-colour, white);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            /* Room for descenders and italic overhang inside the clip, cancelled by the margins. */
            padding-block-end: var(--_clip-allowance);
            padding-inline-end: var(--_clip-allowance);
            margin-inline-end: calc(-1 * var(--_clip-allowance));
          }

          .eyebrow-text {
            margin-block-end: calc(-1 * var(--_clip-allowance));
            -webkit-line-clamp: var(--service-detail-hero-eyebrow-line-clamp, none);
            line-clamp: var(--service-detail-hero-eyebrow-line-clamp, none);
          }

          .hero-text {
            margin-block: 2rem calc(2rem - var(--_clip-allowance));
            -webkit-line-clamp: var(--service-detail-hero-title-line-clamp, none);
            line-clamp: var(--service-detail-hero-title-line-clamp, none);
          }

          .service-detail__hero-pills {
            display: flex;
            flex-wrap: wrap;
            gap: var(--service-detail-hero-pills-gap, 0.8rem);

            --display-pill-background: var(--service-detail-hero-pill-bg, transparent);
            --display-pill-text-colour: var(--service-detail-hero-text-colour, white);
            --display-pill-border-colour: var(--service-detail-hero-pill-border-colour, currentColor);
          }
        }
      }
    }

    .service-detail__body {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--service-detail-body-gap, 3rem);
      margin-block-start: var(--service-detail-body-margin-block-start, 3rem);

      @container (width >= 900px) {
        grid-template-columns: minmax(0, 1fr) minmax(28rem, 34rem);
        align-items: start;
      }

      .service-detail__main {
        min-inline-size: 0;
        overflow-wrap: anywhere;
        display: flex;
        flex-direction: column;
        gap: var(--service-detail-main-section-gap, 2.4rem);
      }

      .service-detail__process {
        --stepper-list-gap: var(--service-detail-process-step-gap, 1.6rem);
        --stepper-list-padding-block: var(--service-detail-process-step-padding-block, 1.6rem);
        --stepper-list-connector-color: var(--service-detail-process-divider-colour, currentColor);
        --stepper-list-counter-circle-text: var(--service-detail-process-index-colour, var(--colour-text-accent));
        --stepper-list-counter-circle-border: var(--service-detail-process-index-colour, var(--colour-text-accent));
        --stepper-list-counter-font-size: var(--service-detail-process-index-font-size, 1.4rem);
      }

      .service-detail__ideal-for {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--service-detail-ideal-for-gap, 1.2rem);

        @container (width >= 500px) {
          grid-template-columns: 1fr 1fr;
        }

        .service-detail__ideal-for-item {
          display: flex;
          align-items: flex-start;
          gap: var(--service-detail-ideal-for-item-gap, 1rem);
          padding: var(--service-detail-ideal-for-item-padding, 1.6rem);
          background-color: var(--service-detail-ideal-for-item-background, var(--theme-surface-subtle));
          border: 1px solid var(--service-detail-ideal-for-item-border-colour, transparent);
          border-radius: var(--service-detail-ideal-for-item-border-radius, 0.4rem);

          .service-detail__ideal-for-icon {
            flex-shrink: 0;
            width: var(--service-detail-ideal-for-icon-size, 1.6rem);
            height: var(--service-detail-ideal-for-icon-size, 1.6rem);
            color: var(--service-detail-ideal-for-icon-colour, var(--colour-text-accent));
            transform: var(--service-detail-ideal-for-icon-transform, translateY(0.4rem));
          }

          p {
            margin: 0;
            min-inline-size: 0;
          }
        }
      }

      .service-detail__faqs {
        display: flex;
        flex-direction: column;

        .service-detail__faq {
          padding-block: var(--service-detail-faq-padding-block, 1.6rem);
          border-block-end: 1px solid var(--service-detail-faq-divider-colour, currentColor);

          &:first-child {
            padding-block-start: 0;
          }
          &:last-child {
            border-block-end: none;
          }

          .service-detail__faq-question {
            margin: 0 0 var(--service-detail-faq-question-margin-block-end, 0.8rem);
            font-size: var(--service-detail-faq-question-font-size, 1.6rem);
          }
        }
      }
    }

    .service-detail__sidebar {
      min-inline-size: 0;
      overflow-wrap: anywhere;
      display: flex;
      flex-direction: column;
      gap: var(--service-detail-sidebar-gap, 2rem);
      position: sticky;
      top: var(--service-detail-sidebar-sticky-offset, 2rem);

      .service-detail__sidebar-label {
        margin: 0 0 var(--service-detail-sidebar-label-margin-block-end, 1.6rem);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: var(--service-detail-sidebar-label-line-clamp, none);
        line-clamp: var(--service-detail-sidebar-label-line-clamp, none);
        font-size: var(--service-detail-sidebar-label-font-size, 1.2rem);
        text-transform: uppercase;
        letter-spacing: var(--service-detail-sidebar-label-letter-spacing, 0.05em);
        opacity: var(--service-detail-muted-opacity, 0.7);
      }

      .service-detail__booking-card {
        padding: var(--service-detail-booking-card-padding, 2.4rem);
      }

      .service-detail__sidebar-row {
        display: flex;
        justify-content: space-between;
        gap: var(--service-detail-sidebar-row-gap, 1rem);
        padding-block: var(--service-detail-sidebar-row-padding-block, 1rem);
        border-block-start: 1px solid var(--service-detail-sidebar-row-divider-colour, currentColor);

        &.book-cta {
          padding-block: var(--service-detail-sidebar-row-book-cta-padding-block, 2rem);
          border-block-start: none;
          justify-content: var(--service-detail-sidebar-row-book-cta-justify-content, end);
        }

        span:last-child {
          flex: 1 1 0;
          min-inline-size: 0;
          text-align: end;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: var(--service-detail-sidebar-value-line-clamp, none);
          line-clamp: var(--service-detail-sidebar-value-line-clamp, none);
        }

        span:first-child {
          flex: 0 0 auto;
          max-inline-size: 50%;
          overflow-wrap: break-word;
          text-transform: uppercase;
          font-size: var(--service-detail-sidebar-row-label-font-size, 1.2rem);
          opacity: var(--service-detail-muted-opacity, 0.7);
        }
      }

      .service-detail__sidebar-note {
        margin-block-start: var(--service-detail-sidebar-note-margin-block-start, 1.2rem);
        font-size: var(--service-detail-sidebar-note-font-size, 1.2rem);
        opacity: var(--service-detail-muted-opacity, 0.7);

        &:empty {
          display: none;
        }
      }

      .service-detail__related {
        .service-detail__related-items {
          display: grid;
          gap: var(--service-detail-related-items-gap, 1rem);

          .service-detail__related-item-slot {
            background-color: var(--service-detail-related-item-background, var(--theme-surface-subtle));
            padding: var(--service-detail-related-item-padding, 1rem);
            border: 1px solid var(--service-detail-related-item-border-colour, transparent);
            border-radius: var(--service-detail-related-item-border-radius, 0.4rem);

            .service-detail__related-item {
              display: grid;
              grid-template-columns: auto minmax(0, 1fr);
              gap: var(--service-detail-related-item-gap, 1.2rem);
              align-items: center;

              .service-detail__related-image {
                width: var(--service-detail-related-image-size, 5.6rem);
                height: var(--service-detail-related-image-size, 5.6rem);
                border-radius: var(--service-detail-related-image-border-radius, 0.4rem);
                object-fit: cover;
                display: block;
              }

              .service-detail__related-title,
              .service-detail__related-price {
                margin: 0;
              }

              .service-detail__related-title {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: var(--service-detail-related-title-line-clamp, none);
                line-clamp: var(--service-detail-related-title-line-clamp, none);
              }

              .service-detail__related-price {
                margin-block-start: var(--service-detail-related-price-margin-block-start, 0.6rem);
                font-size: var(--service-detail-related-price-font-size, 1.2rem);
                opacity: var(--service-detail-muted-opacity, 0.7);
              }
            }
          }
        }
      }
    }

    .service-detail__final-cta-row {
      .service-detail__final-cta {
        display: flex;
        flex-direction: column;
        gap: var(--service-detail-final-cta-gap, 1.6rem);
        align-items: flex-start;
        justify-content: space-between;
        margin-block-start: var(--service-detail-final-cta-margin-block-start, 3.2rem);
        padding-block: var(--service-detail-final-cta-padding-block, 3.2rem 3.2rem);
        border-block-start: 1px solid var(--service-detail-final-cta-divider-colour, currentColor);

        @container (width >= 700px) {
          flex-direction: row;
          align-items: center;

          .service-detail__final-cta-copy {
            flex: 1 1 0;
          }
        }

        .service-detail__final-cta-action {
          flex-shrink: 0;
          max-inline-size: 100%;
        }

        .service-detail__final-cta-copy {
          min-inline-size: 0;
          overflow-wrap: anywhere;

          .hero-text {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            padding-block-end: var(--_clip-allowance);
            padding-inline-end: var(--_clip-allowance);
            margin-block: 0 calc(0.8rem - var(--_clip-allowance));
            margin-inline-end: calc(-1 * var(--_clip-allowance));
            -webkit-line-clamp: var(--service-detail-final-cta-heading-line-clamp, none);
            line-clamp: var(--service-detail-final-cta-heading-line-clamp, none);
          }

          p {
            margin: 0;
            opacity: var(--service-detail-muted-opacity, 0.7);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: var(--service-detail-final-cta-body-line-clamp, none);
            line-clamp: var(--service-detail-final-cta-body-line-clamp, none);
          }
        }
      }
    }
  }
}
</style>
