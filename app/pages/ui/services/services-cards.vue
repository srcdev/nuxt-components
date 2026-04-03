<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Services Card Grid</h1>
          <p class="page-body-normal">Example of a services card grid component.</p>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ServicesCardGrid
            :services-data="servicesData ?? []"
            :eyebrow-config="{ fontSize: 'large' }"
            :hero-config="{ tag: 'h2', fontSize: 'heading' }"
          />
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
  title: "Services Card Grid",
  meta: [{ name: "description", content: "Services Card Grid" }],
  bodyAttrs: {
    class: "page-services-card-grid",
  },
});

const store = useServicesStore();
const { servicesData } = storeToRefs(store);

if (servicesData.value.length === 0) {
  await store.fetchServicesData();
}
</script>

<style lang="css">
.page-services-card-grid {
  /* Page specific styles here */
  .services-card-grid {
    --_gap: 4rem;
    --_column-min-width: 250px;

    .services-card {
      --_eyebrow-text-margin-block: 0.8rem 0;
      --_hero-text-margin-block: 2rem 1rem;
      --_description-text-colour: var(--colour-text-secondary);
    }
  }
}
</style>
