<template>
  <component :is="tag" class="services-grid" :class="[elementClasses]">
    <ServicesCard v-for="(item, index) in servicesData" :key="index" :service-data="item" />
  </component>
</template>

<script setup lang="ts">
export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  whatIsIt: string;
  process: string[];
  idealFor: string[];
  maintenance: string;
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
}

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
.services-grid {
  /* Component styles */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 4rem;
}
</style>
