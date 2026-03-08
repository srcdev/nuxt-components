<template>
  <component :is="tag" class="services-card-grid" :class="[elementClasses]">
    <ServicesCard v-for="(item, index) in servicesData" :key="index" :service-data="item">
      <template #actions="{ serviceData }">
        <InputButtonCore
          variant="secondary"
          :button-text="`Enquire about ${serviceData.title}`"
          :href="`/services/${serviceData.slug}`"
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

interface Props {
  tag?: "div" | "section" | "main";
  servicesData: Service[];
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
@layer components {
  .services-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 4rem;
  }
}
</style>
