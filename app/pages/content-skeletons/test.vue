<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <PageHeroHighlights>
            <template #header>
              <p class="page-heading-1">Header section</p>
              <p class="page-body-normal">
                Lorum ipsum dolor sit amet, consectetur adipiscing elit. Lorum ipsum dolor sit amet, consectetur
                adipiscing elit.
              </p>
            </template>

            <template #highlights>
              <div class="highlight">
                <p class="page-heading-2">Highlight 1</p>
                <p class="page-body-normal">Details here</p>
              </div>
              <div class="highlight">
                <p class="page-heading-2">Highlight item 2</p>
                <p class="page-body-normal">Details here</p>
              </div>
            </template>

            <template #content>
              <p class="page-heading-2">Content section</p>
              <p class="page-body-normal">
                Lorum ipsum dolor sit amet, consectetur adipiscing elit. Lorum ipsum dolor sit amet, consectetur
                adipiscing elit.
              </p>
            </template>
          </PageHeroHighlights>
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
  title: "Test",
  meta: [
    {
      name: "description",
      content: "Test Meta description content",
    },
  ],
  bodyAttrs: {
    class: "test-page",
  },
});
</script>

<style lang="css">
.test-page {
  .page-hero-highlights {
    > div {
      outline: 1px solid red;
    }

    .header {
      background-color: blueviolet;

      .header-inner {
        background-color: violet;
      }
    }

    .highlights {
      .highlight {
        grid-row: 1 / -1;
        border: 1px solid black;
        border-radius: 12px;
        background-color: darkblue;
        color: white;
        padding: 1rem;
      }
    }

    .content {
      background-color: lightgray;
      min-height: 400px;
    }
  }
}
</style>
