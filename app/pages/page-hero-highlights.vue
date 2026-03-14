<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageHeroHighlights
          max-width="1064px"
          content-align="start"
          :highlights-equal-widths="false"
          highlights-justify="start"
          :highlight-title-baseline="true"
          :style-class-passthrough="['mbe-32']"
        >
          <template #header>
            <div class="some-header-content">
              <p class="page-heading-1">Dashboard</p>
              <p class="page-body-normal">Overview of your account activity and key metrics.</p>
            </div>
          </template>
          <template #highlights>
            <div class="highlight">
              <div class="title"><h3 class="page-heading-3 m-0">Key Metrics</h3></div>
              <div class="body">
                <p class="page-body-normal">Your most important stats at a glance.</p>
                <p class="page-body-normal">Your most important stats at a glance.</p>
              </div>
            </div>
          </template>
          <template #content>
            <div class="some-class">
              <p class="page-heading-2">Recent Activity</p>
              <p class="page-body-normal">Your most recent transactions and events will appear here.</p>
            </div>
          </template>
        </PageHeroHighlights>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Page Hero Highlights",
  meta: [
    {
      name: "description",
      content: "Page Hero Highlights Meta description content",
    },
  ],
  bodyAttrs: {
    class: "page-hero-highlights-page",
  },
});
</script>

<style lang="css">
.page-hero-highlights-page {
  .page-hero-highlights {
    .header-row {
      .header-slot {
        .some-header-content {
          padding-block: 4rem 3rem;
        }
      }
    }

    .content-row {
      .content-slot {
        color: black;

        .some-class {
          min-height: 40svh;
        }
      }
    }
  }
}
</style>
