<template>
  <component :is="tag" class="services-grid" :class="[elementClasses]">
    <ServicesSection
      v-for="(item, index) in servicesData"
      :key="index"
      :index="index"
      :service-data="item"
      :is-summary="true"
      :reverse="props.useAlternateReverse ? index % 2 !== 0 : false"
      :summary-alignment="summaryAlignment"
    >
      <template #summary-link="{ serviceData }">
        <LinkText
          :to="`/services/${serviceData.slug}`"
          :link-text="`More about ${serviceData.title}`"
          :style-class-passthrough="['mb-20']"
        />
      </template>
      <template #cta="{ serviceData }">
        <InputButtonCore
          variant="secondary"
          :button-text="`Enquire about ${serviceData.title}`"
          href="#"
          :style-class-passthrough="['mbs-24']"
        >
          <template #right>
            <Icon name="mdi:arrow-right" class="icon" />
          </template>
        </InputButtonCore>
      </template>
    </ServicesSection>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";

interface Props {
  tag?: "div" | "section" | "main";
  servicesData: Service[];
  useAlternateReverse?: boolean;
  summaryAlignment?: "start" | "center" | "end";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  useAlternateReverse: false,
  summaryAlignment: "center",
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
@layer components {
  .services-grid {
    /* Component styles */
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
  }
}
</style>
