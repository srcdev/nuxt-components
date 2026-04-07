<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageHeroHighlights
          tag="section"
          :width-constrained="widthConstrained"
          :content-align="contentAlign"
          :content-panel="contentPanel"
          :highlights-equal-widths="highlightsEqualWidths"
          :highlights-justify="highlightsJustify"
          :highlight-title-baseline="highlightTitleBaseline"
          :style-class-passthrough="['mbe-32']"
        >
          <template #header="{ headingId }">
            <PageHeroHighlightsHeader>
              <template #start>
                <h1 :id="headingId" class="page-heading-1">Dashboard</h1>
                <p class="page-body-normal">Overview of your account activity and key metrics.</p>
              </template>
              <template #end>
                <h1 :id="headingId" class="page-heading-1">Dashboard</h1>
                <p class="page-body-normal">Overview of your account activity and key metrics.</p>
              </template>
            </PageHeroHighlightsHeader>
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

            <div class="demo-controls">
              <p class="demo-controls__heading">Props</p>
              <div class="demo-controls__toggles">
                <ToggleSwitchWithLabelInline
                  v-model="widthConstrained"
                  name="widthConstrained"
                  label="widthConstrained"
                />
                <ToggleSwitchWithLabelInline v-model="contentPanel" name="contentPanel" label="contentPanel" />
                <ToggleSwitchWithLabelInline
                  v-model="highlightsEqualWidths"
                  name="highlightsEqualWidths"
                  label="highlightsEqualWidths"
                />
                <ToggleSwitchWithLabelInline
                  v-model="highlightTitleBaseline"
                  name="highlightTitleBaseline"
                  label="highlightTitleBaseline"
                />
              </div>
              <div class="demo-controls__selects">
                <MultipleRadiobuttons
                  v-model="contentAlign"
                  v-model:field-data="contentAlignData"
                  name="contentAlign"
                  legend="contentAlign"
                  label="contentAlign"
                  error-message=""
                  :is-button="true"
                  :is-pill="true"
                  :field-has-error="false"
                  options-layout="inline"
                />
                <MultipleRadiobuttons
                  v-model="highlightsJustify"
                  v-model:field-data="highlightsJustifyData"
                  name="highlightsJustify"
                  legend="highlightsJustify"
                  label="highlightsJustify"
                  error-message=""
                  :is-button="true"
                  :is-pill="true"
                  :field-has-error="false"
                  options-layout="inline"
                />
              </div>
            </div>
          </template>
        </PageHeroHighlights>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { IFormMultipleOptions } from "~/types/forms/types.forms";

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

const widthConstrained = ref(false);
const contentAlign = ref<"start" | "center">("start");
const contentPanel = ref(true);
const highlightsEqualWidths = ref(false);
const highlightsJustify = ref<"start" | "center" | "end" | "space-between" | "space-around">("start");
const highlightTitleBaseline = ref(true);

const contentAlignData = ref<IFormMultipleOptions>({
  data: [
    { id: "align-start", name: "contentAlign", value: "start", label: "start" },
    { id: "align-center", name: "contentAlign", value: "center", label: "center" },
  ],
  total: 2,
  skip: 0,
  limit: 2,
});

const highlightsJustifyData = ref<IFormMultipleOptions>({
  data: [
    { id: "justify-start", name: "highlightsJustify", value: "start", label: "start" },
    { id: "justify-center", name: "highlightsJustify", value: "center", label: "center" },
    { id: "justify-end", name: "highlightsJustify", value: "end", label: "end" },
    { id: "justify-space-between", name: "highlightsJustify", value: "space-between", label: "space-between" },
    { id: "justify-space-around", name: "highlightsJustify", value: "space-around", label: "space-around" },
  ],
  total: 5,
  skip: 0,
  limit: 5,
});
</script>

<style lang="css">
.page-hero-highlights-page {
  .page-hero-highlights {
    /* Layout tokens */
    --max-width: 1064px;
    --page-hero-highlights-gutter-mobile: 16px;
    --page-hero-highlights-gutter-tablet: 40px;
    --page-hero-highlights-gutter-desktop: 32px;

    .page-hero-highlights-header {
      /* User themable tokens */
      --phh-padding-block-mobile: 1.6rem 6rem;
      --phh-padding-block-tablet: 2.4rem 6rem;
      --phh-padding-block-desktop: 4.2rem 7.4rem;
    }

    .content-row {
      .content-slot {
        color: black;

        .some-class {
          padding-block-end: 2.4rem;
        }
      }
    }
  }

  .demo-controls {
    margin-block-start: 2.4rem;
    padding: 1.6rem;
    border: 1px solid var(--slate-06);
    border-radius: 0.8rem;
    background: var(--slate-01);

    &__heading {
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--slate-08);
      margin-block-end: 1.2rem;
    }

    &__toggles {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 2.4rem;
      margin-block-end: 1.6rem;
    }

    &__selects {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
  }
}
</style>
