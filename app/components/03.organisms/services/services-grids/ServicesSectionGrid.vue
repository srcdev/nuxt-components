<template>
  <component :is="tag" class="services-grid" :class="[elementClasses]">
    <ServicesSection v-for="(item, index) in servicesData" :key="index" :service-data="item" :is-summary="true" />
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
  .services-grid {
    /* Component styles */
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
  }
}
</style>
