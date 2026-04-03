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
          :button-text="`Enquire about ${serviceData.title}`"
          :href="`/ui/services/services-section/${serviceData.slug}`"
          :style-class-passthrough="['mbs-24']"
        >
          <template #right>
            <Icon name="mdi:arrow-right" class="icon" />
          </template>
        </InputButtonCore>
      </template>
    </ServicesCard>
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
  tag?: "div" | "section" | "main";
  servicesData: Service[];
  eyebrowConfig?: EyebrowConfig;
  heroConfig?: HeroConfig;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  eyebrowConfig: () => ({}),
  heroConfig: () => ({}),
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
    /* Consumer definable css tokens */
    --_gap: 4rem;
    --_column-min-width: 250px;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--_column-min-width), 1fr));
    gap: var(--_gap);
  }
}
</style>
