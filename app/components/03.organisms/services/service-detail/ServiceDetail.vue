<template>
  <component :is="tag" class="service-detail" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
    <GridStack tag="div" class="service-detail__hero">
      <template #image>
        <PageRow tag="div" :variant="heroImageVariant" class="service-detail__hero-image-row">
          <NuxtImg
            :src="serviceData.image"
            :alt="serviceData.title"
            :loading="imageLoading"
            :fetchpriority="imageFetchPriority"
            class="service-detail__hero-image"
          />
        </PageRow>
      </template>
      <template #content>
        <PageRow tag="div" :variant="heroContentVariant" class="service-detail__hero-overlay">
          <div class="service-detail__hero-content">
            <Breadcrumb :items="resolvedBreadcrumbItems" class="service-detail__breadcrumb" />
            <EyebrowText font-size="large" :text-content="serviceData.subtitle" />
            <HeroText
              :id="headingId"
              :tag="headerTag"
              font-size="display"
              :text-content="[{ text: serviceData.title, styleClass: 'normal' }]"
              :style-class-passthrough="['mb-20']"
            />
            <div class="service-detail__hero-pills">
              <DisplayPill :label="serviceData.duration" size="md" variant="neutral" />
              <DisplayPill :label="`From ${serviceData.price}`" size="md" variant="neutral" />
            </div>
          </div>
        </PageRow>
      </template>
    </GridStack>

    <PageRow tag="div" :variant="bodyVariant" class="service-detail__body-row">
      <div class="service-detail__body">
        <div class="service-detail__main">
          <p class="page-body-normal">{{ serviceData.longDescription }}</p>

          <HeroText
            :tag="subheadingTag"
            axis="horizontal"
            font-size="subheading"
            :text-content="serviceData.heroHeading"
            :style-class-passthrough="['mb-20']"
          />
          <p class="page-body-normal">{{ serviceData.whatIsIt }}</p>

          <HeroText
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

          <HeroText
            :tag="subheadingTag"
            axis="horizontal"
            font-size="subheading"
            :text-content="[{ text: idealForHeading, styleClass: 'normal' }]"
            :style-class-passthrough="['mb-20']"
          />
          <ul class="service-detail__ideal-for">
            <li v-for="(item, i) in serviceData.idealFor" :key="i" class="service-detail__ideal-for-item">
              <Icon name="mdi:diamond-stone" class="service-detail__ideal-for-icon" />
              <p class="page-body-normal">{{ item }}</p>
            </li>
          </ul>

          <HeroText
            :tag="subheadingTag"
            axis="horizontal"
            font-size="subheading"
            :text-content="[{ text: maintenanceHeading, styleClass: 'normal' }]"
            :style-class-passthrough="['mb-20']"
          />
          <p class="page-body-normal">{{ serviceData.maintenance }}</p>

          <HeroText
            :tag="subheadingTag"
            axis="horizontal"
            font-size="subheading"
            :text-content="[{ text: faqsHeading, styleClass: 'normal' }]"
            :style-class-passthrough="['mb-20']"
          />
          <div class="service-detail__faqs">
            <div v-for="(faq, i) in serviceData.faqs" :key="i" class="service-detail__faq">
              <h3 class="service-detail__faq-question">{{ faq.question }}</h3>
              <p class="page-body-normal">{{ faq.answer }}</p>
            </div>
          </div>
        </div>

        <aside class="service-detail__sidebar">
          <GlassPanel :style-class-passthrough="['service-detail__booking-card']">
            <p class="service-detail__sidebar-label">{{ bookingHeading }}</p>

            <div class="service-detail__sidebar-row">
              <span>{{ priceLabel }}</span>
              <span>{{ serviceData.price }}</span>
            </div>
            <div class="service-detail__sidebar-row">
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
            <p class="service-detail__sidebar-label">{{ relatedServicesHeading }}</p>

            <div class="service-detail__related-items">
              <div
                v-for="(related, i) in relatedServices"
                :key="related.slug"
                class="service-detail__related-item-slot"
              >
                <slot name="related-service" :service="related" :index="i">
                  <div class="service-detail__related-item">
                    <NuxtImg
                      :src="related.image"
                      :alt="related.title"
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
            :tag="subheadingTag"
            axis="horizontal"
            font-size="subheading"
            :text-content="[{ text: finalCtaHeading, styleClass: 'normal' }]"
            :style-class-passthrough="['mbs-0', 'mbe-8']"
          />
          <p class="page-body-normal">{{ finalCtaBody }}</p>
        </div>
        <slot name="final-cta" :service-data="serviceData"></slot>
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

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);

// Falls back to a plain, non-linked breadcrumb built from the service's own category/title
// when the consumer doesn't pass real routes — routing is always the consumer's decision.
const resolvedBreadcrumbItems = computed<BreadcrumbItem[]>(
  () => props.breadcrumbItems ?? [{ label: props.serviceData.category }, { label: props.serviceData.title }]
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
    container-type: inline-size;
    container-name: service-detail;

    .service-detail__hero {
      border-radius: var(--service-detail-hero-border-radius, 0.8rem);
      overflow: hidden;
      height: var(--service-detail-hero-min-height-mobile, 32rem);

      @container (width >= 768px) {
        height: var(--service-detail-hero-min-height-tablet, 36rem);
      }

      @container (width >= 1024px) {
        height: var(--service-detail-hero-min-height-desktop, 42rem);
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
          object-fit: contain;
          object-position: var(--service-detail-hero-image-position-medium, center);
        }
      }

      .service-detail__hero-overlay {
        display: grid;
        height: 100%;
        align-content: var(--service-detail-hero-content-align, end);
        padding-block: var(--service-detail-hero-padding, 3.2rem);
        background: var(
          --service-detail-hero-scrim,
          linear-gradient(0deg, rgb(0 0 0 / 70%) 0%, rgb(0 0 0 / 10%) 60%, transparent 100%)
        );

        .service-detail__hero-content {
          .service-detail__breadcrumb {
            --breadcrumb-colour: var(--service-detail-hero-text-colour, white);
            margin-block-end: var(--service-detail-breadcrumb-margin-block-end, 0.8rem);
          }

          .eyebrow-text,
          .hero-text {
            color: var(--service-detail-hero-text-colour, white);
          }

          .service-detail__hero-pills {
            display: flex;
            flex-wrap: wrap;
            gap: var(--service-detail-hero-pills-gap, 0.8rem);

            --theme-pill-bg: var(--service-detail-hero-pill-bg, transparent);
            --theme-pill-color: var(--service-detail-hero-text-colour, white);
            --theme-pill-border-color: var(--service-detail-hero-pill-border-colour, currentColor);
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
          background-color: var(--service-detail-ideal-for-item-background, var(--slate-09));
          border: 1px solid var(--service-detail-ideal-for-item-border-colour, var(--slate-06));
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
      display: flex;
      flex-direction: column;
      gap: var(--service-detail-sidebar-gap, 2rem);
      position: sticky;
      top: var(--service-detail-sidebar-sticky-offset, 2rem);

      .service-detail__sidebar-label {
        margin: 0 0 var(--service-detail-sidebar-label-margin-block-end, 1.6rem);
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

        span:first-child {
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
            background-color: var(--service-detail-related-item-background, var(--slate-09));
            padding: var(--service-detail-related-item-padding, 1rem);
            border: 1px solid var(--service-detail-related-item-border-colour, var(--slate-06));
            border-radius: var(--service-detail-related-item-border-radius, 0.4rem);

            .service-detail__related-item {
              display: grid;
              grid-template-columns: auto 1fr;
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
        }

        .service-detail__final-cta-copy {
          p {
            margin: 0;
            opacity: var(--service-detail-muted-opacity, 0.7);
          }
        }
      }
    }
  }
}
</style>
