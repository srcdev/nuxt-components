<template>
  <component :is="tag" class="services-section" :class="[elementClasses]">
    <div class="services-section__grid">
      <div class="image-wrapper">
        <NuxtImg :src="serviceData.image" :alt="serviceData.title" class="image" />
      </div>
      <div>
        <EyebrowText :text-content="serviceData.subtitle" />
        <HeroHeading
          tag="h1"
          font-size="medium"
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

        <p class="page-body-normal">{{ serviceData.longDescription }}</p>

        <HeroHeading
          tag="h2"
          axis="horizontal"
          font-size="smaller"
          :text-content="serviceData.heroHeading"
          :style-class-passthrough="['mb-20']"
        />
        <p class="page-body-normal">
          {{ serviceData.whatIsIt }}
        </p>

        <HeroHeading
          tag="h2"
          axis="horizontal"
          font-size="smaller"
          :text-content="[{ text: 'The Process ', styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />
        <IndicatorList tag="ol" :item-count="serviceData.process.length">
          <template v-for="(item, index) in serviceData.process" #[`item-${index}`]>
            {{ item }}
          </template>
        </IndicatorList>

        <HeroHeading
          tag="h2"
          axis="horizontal"
          font-size="smaller"
          :text-content="[{ text: 'Ideal For', styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <IndicatorList :item-count="serviceData.idealFor.length">
          <template v-for="(_, index) in serviceData.idealFor" :key="index" #[`indicator-${index}`]>
            <Icon name="mdi:checkbox-marked-circle-outline" class="indicator-icon" />
          </template>
          <template v-for="(item, index) in serviceData.idealFor" #[`item-${index}`]>
            {{ item }}
          </template>
        </IndicatorList>

        <HeroHeading
          tag="h2"
          axis="horizontal"
          font-size="smaller"
          :text-content="[{ text: 'Aftercare &amp; Maintenance', styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <p class="page-body-normal">{{ serviceData.maintenance }}</p>

        <HeroHeading
          tag="h2"
          axis="horizontal"
          font-size="smaller"
          :text-content="[{ text: 'Frequently Asked Questions', styleClass: 'normal' }]"
          :style-class-passthrough="['mb-20']"
        />

        <AccordianCore
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

        <GlassPanel :style-class-passthrough="['p-24']">
          <HeroHeading
            tag="h2"
            axis="horizontal"
            font-size="smaller"
            :text-content="[{ text: 'Ready to book your highlights appointment?', styleClass: 'normal' }]"
            :style-class-passthrough="['mbs-0', 'mbe-20']"
          />
          <p class="text-muted-foreground font-light text-sm mb-6">Mobile service across Bath — I come to you.</p>
          <a
            href="/#contact"
            class="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase hover:bg-primary/90 transition-all duration-300 glow-rose"
          >
            Get in Touch
          </a>
        </GlassPanel>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";

interface Props {
  tag?: "div" | "section" | "article" | "main";
  serviceData: Service;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
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
.services-section {
  container-type: inline-size;
  container-name: services-section;

  .services-section__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(446px, 1fr));
    gap: 3rem;
  }

  .image-wrapper {
    align-self: start;

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
</style>
