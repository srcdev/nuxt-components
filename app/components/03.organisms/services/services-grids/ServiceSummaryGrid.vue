<template>
  <component :is="tag" class="service-summary-grid" :class="[elementClasses]">
    <ServiceSummary
      v-for="(item, index) in servicesData"
      :key="index"
      :index="index"
      :service-data="item"
      :reverse="props.useAlternateReverse ? index % 2 !== 0 : false"
      :alignment="alignment"
    >
      <template #summary-link="{ serviceData }">
        <slot name="summary-link" :service-data="serviceData"></slot>
      </template>
    </ServiceSummary>
  </component>
</template>

<script setup lang="ts">
import type { Service } from "~/types/types.services";

interface Props {
  tag?: "div" | "section" | "main";
  servicesData: Service[];
  useAlternateReverse?: boolean;
  alignment?: "start" | "center" | "end";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  useAlternateReverse: false,
  alignment: "center",
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
  .service-summary-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--service-summary-grid-row-gap, 4rem);
  }
}
</style>
