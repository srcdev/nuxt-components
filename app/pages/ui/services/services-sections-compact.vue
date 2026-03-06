<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <EyebrowText font-size="large" text-content="Services" />
          <HeroText
            :tag="'h1'"
            font-size="display"
            axis="vertical"
            :text-content="[
              { text: 'Expert colour & ' },
              { text: 'styling', styleClass: 'accent' },
              { text: ' at your door' },
            ]"
            :style-class-passthrough="['mbe-20']"
          />
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <p class="page-body-medium">
            I'm a mobile hair artist bringing bold, custom hair transformations straight to your doorstep in Bath. From
            lived-in balayage and dimensional lowlights to face-framing highlights and precision cuts — salon-quality
            results, zero hassle.
          </p>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ServicesSectionGrid
            :services-data="servicesData ?? []"
            :use-alternate-reverse="true"
            summary-alignment="center"
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
