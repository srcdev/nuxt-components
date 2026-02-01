<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Typography</h1>
          <h2 class="page-heading-2">Example styles used within page content</h2>
          <p class="page-body-normal">Use within main body content</p>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: "Typography",
  meta: [{ name: "description", content: "Typography" }],
  bodyAttrs: {
    class: "page-typography",
  },
})
</script>

<style lang="css">
.page-typography {
  .class-demo {
    margin-block-end: 1rem;
    pre {
      display: block;
      margin-block: 0;
    }
  }
}
</style>
