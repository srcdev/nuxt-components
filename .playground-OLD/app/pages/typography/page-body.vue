<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Typography - Body Text</h1>
          <p class="page-body-normal">Page body styles</p>
          <p class="page-body-normal">Use within main body content</p>

          <div class="demo-row">
            <strong>page-body-large-light</strong>
            <div class="class-demo page-body-large-light">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-large</strong>
            <div class="class-demo page-body-large">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-large-semibold</strong>
            <div class="class-demo page-body-large-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-large-bold</strong>
            <div class="class-demo page-body-large-bold">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-medium-light</strong>
            <div class="class-demo page-body-medium-light">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-medium</strong>
            <div class="class-demo page-body-medium">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-medium-semibold</strong>
            <div class="class-demo page-body-medium-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-medium-bold</strong>
            <div class="class-demo page-body-medium-bold">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-medium-semibold</strong>
            <div class="class-demo page-body-medium-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-medium-bold</strong>
            <div class="class-demo page-body-medium-bold">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-normal-light</strong>
            <div class="class-demo page-body-normal-light">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-normal</strong>
            <div class="class-demo page-body-normal">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-normal-semibold</strong>
            <div class="class-demo page-body-normal-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-normal-bold</strong>
            <div class="class-demo page-body-normal-bold">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-small-light</strong>
            <div class="class-demo page-body-small-light">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-small</strong>
            <div class="class-demo page-body-small">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-small-semibold</strong>
            <div class="class-demo page-body-small-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-small-bold</strong>
            <div class="class-demo page-body-small-bold">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-xsmall-light</strong>
            <div class="class-demo page-body-xsmall-light">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-xsmall</strong>
            <div class="class-demo page-body-xsmall">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
          </div>

          <div class="demo-row">
            <strong>page-body-xsmall-semibold</strong>
            <div class="class-demo page-body-xsmall-semibold">
              Lorum ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>

          <div class="demo-row">
            <strong>page-body-xsmall-bold</strong>
            <div class="class-demo page-body-xsmall-bold">Lorum ipsum dolor sit amet, consectetur adipiscing elit.</div>
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
    class: "page-typography-body",
  },
})
</script>

<style lang="css">
.page-typography-body {
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
