<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Typography - Link Text</h1>
          <p class="page-body-normal">Page link styles</p>
          <p class="page-body-normal">Use within main body content</p>

          <div class="demo-row">
            <strong>page-link-large</strong>
            <a href="#" class="class-demo page-link-large">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</a>
          </div>

          <div class="demo-row">
            <strong>page-link-large-semibold</strong>
            <a href="#" class="class-demo page-link-large-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </a>
          </div>

          <div class="demo-row">
            <strong>page-link-medium</strong>
            <a href="#" class="class-demo page-link-medium">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</a>
          </div>

          <div class="demo-row">
            <strong>page-link-medium-semibold</strong>
            <a href="#" class="class-demo page-link-medium-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </a>
          </div>

          <div class="demo-row">
            <strong>page-link-normal</strong>
            <a href="#" class="class-demo page-link-normal">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</a>
          </div>

          <div class="demo-row">
            <strong>page-link-normal-semibold</strong>
            <a href="#" class="class-demo page-link-normal-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </a>
          </div>

          <div class="demo-row">
            <strong>page-link-small</strong>
            <a href="#" class="class-demo page-link-small">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</a>
          </div>

          <div class="demo-row">
            <strong>page-link-small-semibold</strong>
            <a href="#" class="class-demo page-link-small-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </a>
          </div>

          <div class="demo-row">
            <strong>page-link-xsmall</strong>
            <a href="#" class="class-demo page-link-xsmall">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</a>
          </div>

          <div class="demo-row">
            <strong>page-link-xsmall-semibold</strong>
            <a href="#" class="class-demo page-link-xsmall-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </a>
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
    class: "page-typography-link",
  },
})
</script>

<style lang="css">
.page-typography-link {
  .demo-row {
    margin-block-end: 1rem;
    strong {
      display: block;
      margin-block: 0;
    }
    .class-demo {
      display: inline-block;
      margin-block-end: 1rem;
    }
  }
}
</style>
