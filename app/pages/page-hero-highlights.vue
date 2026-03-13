<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageHeroHighlights
          max-width="800px"
          content-align="center"
          :highlights-equal-widths="false"
          highlights-justify="start"
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
              <h3 class="page-heading-3 mbe-8">Key Metrics</h3>
              <p class="page-body-normal">Your most important stats at a glance.</p>
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
  /* CSS styles */
  .page-hero-highlights {
    --phl-header-bg: darkblue;
    --phl-content-bg: white;
    --phl-content-inner: white;

    .header {
      background-color: var(--phl-header-bg);

      .header-inner {
        .some-header-content {
          padding-block: 4rem 3rem;
        }
      }
    }

    .highlights {
      padding-inline: 1.2rem;

      .highlight {
        background-color: white;
        border: 1px solid black;
        border-radius: 8px;
        color: black;

        padding: 1.2rem;
      }
    }

    .content {
      background-color: var(--phl-content-bg);

      .content-column {
        background-color: white;
        border: 1px solid var(--slate-06);
        outline: 1px solid var(--slate-02);
        margin-top: 1.2rem;
        border-radius: 0.8rem;

        .content-inner {
          background-color: var(--phl-content-inner);
          color: black;
          min-height: 75svh;

          background-color: var(--phl-content-inner);
          margin: 1.2rem;

          .some-class {
          }
        }
      }
    }
  }
}
</style>
