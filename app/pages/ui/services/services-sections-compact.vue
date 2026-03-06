<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Services Section Grid</h1>
          <p class="page-body-normal">Example of a services section grid component.</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ServicesSectionGrid :services-data="servicesData ?? []" />
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
  title: "Services Section Grid",
  meta: [{ name: "description", content: "Services Section Grid" }],
  bodyAttrs: {
    class: "page-services-section-grid",
  },
});

const store = useServicesStore();
const { servicesData } = storeToRefs(store);

if (servicesData.value.length === 0) {
  await store.fetchServicesData();
}
</script>

<style lang="css">
.page-services-section-grid {
}
</style>
