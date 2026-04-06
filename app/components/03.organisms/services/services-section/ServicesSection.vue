<template>
  <component :is="tag" class="services-section" :class="[elementClasses]" :aria-labelledby="ariaLabelledby">
    <div class="services-section__grid" :class="{ 'services-section__grid--reverse': reverse }">
      <div class="image-wrapper">
        <NuxtImg :src="serviceData.image" :alt="serviceData.title" :loading="imageLoading" class="image" />
      </div>
      <div class="info-wrapper" :class="infoWrapperClasses">
        <EyebrowText font-size="large" :text-content="serviceData.subtitle" />
        <HeroText
          tag="h1"
          font-size="title"
          :text-content="[
            {
              text: serviceData.title,
              styleClass: 'normal',
            },
          ]"
          :style-class-passthrough="['mb-20']"
        />

        <div class="price-duration">
          <div class="flex-row">
            <Icon name="mdi:clock-time-four-outline" class="decorator" />
            <span>{{ serviceData.duration }}</span>
          </div>
          <div class="flex-row">
            <Icon name="mdi:currency-gbp" class="decorator" />
            <span>{{ serviceData.price }}</span>
          </div>
        </div>

        <p v-if="!isSummary" class="page-body-normal">{{ serviceData.longDescription }}</p>

        <HeroText
          v-if="!isSummary"
          tag="h2"
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
          tag="h2"
          axis="horizontal"
          font-size="subheading"
          :text-content="[{ text: 'The Process ', styleClass: 'normal' }]"
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
          tag="h2"
          axis="horizontal"
          font-size="subheading"
          :text-content="[{ text: 'Ideal For', styleClass: 'normal' }]"
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
          tag="h2"
          axis="horizontal"
          font-size="subheading"
          :text-content="[{ text: 'Aftercare &amp; Maintenance', styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <p v-if="!isSummary" class="page-body-normal">{{ serviceData.maintenance }}</p>

        <HeroText
          v-if="!isSummary"
          tag="h2"
          axis="horizontal"
          font-size="subheading"
          :text-content="[{ text: 'Frequently Asked Questions', styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <AccordianCore
          v-if="!isSummary"
          id="faq"
          :item-count="serviceData.faqs.length"
          :name="`faq-${useId()}`"
          :style-class-passthrough="['services-faq']"
        >
          <template v-for="(_, key) in serviceData.faqs" :key="`summary-${key}`" #[`accordian-${key}-summary`]>
            {{ serviceData.faqs[key]?.question }}
          </template>
          <template v-for="(_, key) in serviceData.faqs" :key="`icon-${key}`" #[`accordian-${key}-icon`]>
            <Icon name="mdi:chevron-down" />
          </template>
          <template v-for="(_, key) in serviceData.faqs" :key="`content-${key}`" #[`accordian-${key}-content`]>
            <p>{{ serviceData.faqs[key]?.answer }}</p>
          </template>
        </AccordianCore>

        <GlassPanel v-if="!isSummary" :style-class-passthrough="['p-24']">
          <HeroText
            tag="h2"
            axis="horizontal"
            font-size="subheading"
            :text-content="[{ text: 'Ready to book your highlights appointment?', styleClass: 'normal' }]"
            :style-class-passthrough="['mbs-0', 'mbe-20']"
          />
          <p class="page-body-normal">Mobile service across Bath — I come to you.</p>
          <slot name="cta" :service-data="serviceData"></slot>
        </GlassPanel>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";

interface Props {
  tag?: "div" | "section" | "article" | "main";
  index?: number;
  serviceData: Service;
  isSummary?: boolean;
  summaryAlignment?: "start" | "center" | "end";
  reverse?: boolean;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  index: 0,
  isSummary: false,
  summaryAlignment: "center",
  styleClassPassthrough: () => [],
});

const { ariaLabelledby } = useAriaLabelledById(() => props.tag);

const infoWrapperClasses = computed(() => {
  return {
    "is-summary": props.isSummary,
    "align-start": props.isSummary && props.summaryAlignment === "start",
    "align-center": props.isSummary && props.summaryAlignment === "center",
    "align-end": props.isSummary && props.summaryAlignment === "end",
  };
});

// Computed to return loading="lazy" if index is greater than 1, so that the first two sections prioritise image loading, but if there are more than 2 sections, the rest will lazy load their images to improve performance.
const imageLoading = computed(() => (props.index !== undefined && props.index > 1 ? "lazy" : "eager"));

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
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;

      @media (width >= 768px) {
        grid-template-columns: repeat(auto-fit, minmax(446px, 1fr));
        gap: 3rem;

        &.services-section__grid--reverse {
          .image-wrapper {
            /* The order: 2 on .image-wrapper pushes it after the content div, since by default both children have order: 0 and source order wins — so the content div naturally sits first. */
            order: 2;
          }
        }
      }

      .info-wrapper {
        &.is-summary {
          display: grid;

          &.align-start {
            align-content: start;
          }
          &.align-center {
            align-content: center;
          }
          &.align-end {
            align-content: end;
          }
        }
      }

      .image-wrapper {
        align-self: start;
        border-radius: 8px;
        overflow: hidden;

        .image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .price-duration {
        display: flex;
        flex-direction: row;
        gap: 3rem;
        align-items: center;
        margin-block-end: 2rem;

        > div {
          display: flex;
          flex-direction: row;
          gap: 0.8rem;
          align-items: center;

          .decorator {
            width: 2rem;
            height: 2rem;
          }
        }
      }

      .glass-card {
        background: rgba(255, 255, 255, 0.6);
        border-radius: 1rem;
        backdrop-filter: blur(10px);
      }

      .services-faq {
        margin-block-end: 24px;

        &.display-accordian {
          max-width: none;
          /* margin: 0; */

          .accordian-item.expanding-panel {
            border-block-end: 1px solid currentColor;
            opacity: 0.7;

            &:first-child {
              border-block-start: 1px solid currentColor;
            }

            .expanding-panel-details .expanding-panel-summary {
              padding-block: 1.2rem;
            }

            .expanding-panel-content .inner {
              /* padding-block-end: 1.2rem; */
            }
          }
        }
      }
    }
  }
}
</style>
