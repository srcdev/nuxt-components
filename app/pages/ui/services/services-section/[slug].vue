<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <EyebrowText font-size="large" text-content="Services" />

          <HeroHeading
            tag="h1"
            axis="vertical"
            font-size="large"
            :text-content="[
              { text: 'Expert colour & ', styleClass: 'normal' },
              { text: 'styling', styleClass: 'accent' },
              { text: 'at your door', styleClass: 'normal' },
            ]"
            :style-class-passthrough="['mb-20']"
          />

          <p class="page-body-normal"><NuxtLink to="/ui/services/services-card">Back to Services</NuxtLink></p>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ServicesSection v-if="servicesData.length > 0 && serviceData" :service-data="serviceData!" />
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Services Section",
  meta: [{ name: "description", content: "Services Section" }],
  bodyAttrs: {
    class: "page-services-section",
  },
});

const route = useRoute();
const slug = route.params.slug as string;

const store = useServicesStore();
const { servicesData } = storeToRefs(store);

if (servicesData.value.length === 0) {
  await store.fetchServicesData();
}
const serviceData = store.serviceDataBySlug(slug);
</script>

<style lang="css">
.page-services-section {
}
</style>
