<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">ColourFinder</h2>
        </PageRow>

        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ColourFinder />
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "ColourFinder",
  meta: [
    {
      name: "description",
      content: "ColourFinder Meta description content",
    },
  ],
  bodyAttrs: {
    class: "colour-finder-page",
  },
});
</script>

<style lang="css">
.colour-finder-page {
  .colour-finder {
    max-inline-size: 800px;
    margin-inline: auto;
  }
}
</style>
