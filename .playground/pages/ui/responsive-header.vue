<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow
          tag="div"
          variant="full-width"
          :style-class-passthrough="['mbe-20']"
        >
          <h2 class="heading-2">ResponsiveHeader</h2>

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
  title: 'ResponsiveHeader',
  meta: [
    {
      name: 'description',
      content: 'ResponsiveHeader Meta description content',
    },
  ],
  bodyAttrs: {
    class: 'responsiveHeader-page',
  },
});
</script>

<style lang="css">
  .responsiveHeader-page {
    /* CSS styles */
  }
</style>
