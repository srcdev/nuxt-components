<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Typography - Heading Text</h1>
          <p class="page-body-normal">Page heading styles</p>
          <p class="page-body-normal">Use within main body content</p>

          <div class="demo-row">
            <strong>page-heading-1</strong>
            <div class="class-demo page-heading-1">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-heading-2</strong>
            <div class="class-demo page-heading-2">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-heading-3</strong>
            <div class="class-demo page-heading-3">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit. Lorum ipsum dolor sit amet, consectetur
              adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-heading-4</strong>
            <div class="class-demo page-heading-4">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-heading-5</strong>
            <div class="class-demo page-heading-5">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-heading-6</strong>
            <div class="class-demo page-heading-6">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>
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
    class: "page-typography-heading",
  },
})
</script>

<style lang="css">
.page-typography-heading {
  .demo-row {
    margin-block-end: 1rem;
    strong {
      display: block;
      margin-block: 0;
    }
    .class-demo {
      display: block;
      margin-block-end: 1rem;
    }
  }
}
</style>
