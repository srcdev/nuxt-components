<template>
  <component :is="tag" class="services-card-grid" :class="[elementClasses]">
    <ServicesCard
      v-for="(item, index) in servicesData"
      :key="index"
      :service-data="item"
      :eyebrow-config="eyebrowConfig"
      :hero-config="heroConfig"
    >
      <template #actions="{ serviceData }">
        <InputButtonCore
          variant="secondary"
          :button-text="`${buttonTextPrefix} ${serviceData.title}`"
          :href="`${hrefBase}${serviceData.slug}`"
          :style-class-passthrough="['mbs-24']"
        >
          <template #right>
            <Icon :name="buttonIcon" class="icon" aria-hidden="true" />
          </template>
        </InputButtonCore>
      </template>
    </ServicesCard>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";
import type { ServicesCardEyebrowConfig, ServicesCardHeroConfig } from "~/types/components";

interface Props {
  tag?: "div" | "section" | "main";
  servicesData: Service[];
  eyebrowConfig?: ServicesCardEyebrowConfig;
  heroConfig?: ServicesCardHeroConfig;
  hrefBase?: string;
  buttonTextPrefix?: string;
  buttonIcon?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  eyebrowConfig: () => ({}),
  heroConfig: () => ({}),
  hrefBase: "/services/",
  buttonTextPrefix: "Enquire about",
  buttonIcon: "mdi:arrow-right",
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
  .services-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(var(--services-card-grid-column-min-width, 250px), 100%), 1fr));
    gap: var(--services-card-grid-gap, 4rem);
  }
}
</style>
