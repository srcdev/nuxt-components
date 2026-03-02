<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Treatment Consultant</h2>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <TreatmentConsultant />
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
  title: "Treatment Consultant - ColourFinder",
  meta: [
    {
      name: "description",
      content: "Treatment Consultant Meta description content",
    },
  ],
  bodyAttrs: {
    class: "treatment-consultant-page",
  },
});
</script>

<style lang="css">
.treatment-consultant-page {
  .colour-finder {
    max-inline-size: 800px;
    margin-inline: auto;
  }
}
</style>
