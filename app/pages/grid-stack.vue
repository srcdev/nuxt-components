<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <!-- Demo 3: BannerVideo + overlay -->
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-48']">
          <GridStack :tag="tag" class="grid-stack-video-demo">
            <template #layer-1>
              <BannerVideo
                src="/images/banners/video/lake-banner.mp4"
                poster="/images/banners/video/lake-banner.jpg"
                alt="A serene lake landscape"
                aspect-ratio="4/3"
                object-fit="cover"
                vertical-position="center"
                horizontal-position="center"
              />
            </template>
            <template #layer-2>
              <div class="video-overlay">
                <div class="video-overlay__content">
                  <p class="video-overlay__eyebrow">GridStack layer-2</p>
                  <h2 class="video-overlay__heading">Content over video</h2>
                  <p class="video-overlay__body">
                    This layer sits on top of the BannerVideo without
                    <code>position: absolute</code>
                    .
                  </p>
                </div>
              </div>
            </template>
          </GridStack>
        </LayoutRow>

        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-32']">
          <h1 class="page-heading-1">GridStack</h1>
          <p class="page-body-normal">
            Stacks slot content in the z-axis using
            <code>grid-template-areas</code>
            — no
            <code>position: absolute</code>
            . Layers share a single grid area; DOM order determines z-order (last slot is on top).
          </p>
        </LayoutRow>

        <!-- Demo 1: Two layers -->
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-48']">
          <h2 class="page-heading-2 mbe-16">Two layers</h2>
          <GridStack class="grid-stack-demo">
            <template #layer-1>
              <div class="demo-layer demo-layer--base">layer-1 (base)</div>
            </template>
            <template #layer-2>
              <div class="demo-layer demo-layer--overlay">layer-2 (overlay)</div>
            </template>
          </GridStack>
        </LayoutRow>

        <!-- Demo 2: Three layers -->
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-48']">
          <h2 class="page-heading-2 mbe-16">Three layers</h2>
          <GridStack class="grid-stack-demo">
            <template #layer-1>
              <div class="demo-layer demo-layer--base">layer-1 (base)</div>
            </template>
            <template #layer-2>
              <div class="demo-layer demo-layer--mid">layer-2 (mid)</div>
            </template>
            <template #layer-3>
              <div class="demo-layer demo-layer--overlay">layer-3 (overlay)</div>
            </template>
          </GridStack>
        </LayoutRow>

        <!-- Controls -->
        <LayoutRow tag="div" variant="full-width">
          <div class="grid-stack-demo-controls">
            <p class="demo-controls__heading">Props (video demo)</p>
            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="tag"
                v-model:field-data="tagData"
                name="tag"
                label="tag"
                legend="tag"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>
          </div>
        </LayoutRow>
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
  title: "GridStack",
  meta: [{ name: "description", content: "GridStack component demo" }],
  bodyAttrs: { class: "grid-stack-page" },
});

const tag = ref<"div" | "section" | "article" | "main">("div");

const tagData = ref<IFormMultipleOptions>({
  data: [
    { id: "tag-div", name: "tag", value: "div", label: "div" },
    { id: "tag-section", name: "tag", value: "section", label: "section" },
    { id: "tag-article", name: "tag", value: "article", label: "article" },
    { id: "tag-main", name: "tag", value: "main", label: "main" },
  ],
  total: 4,
  skip: 0,
  limit: 4,
});
</script>

<style lang="css">
.grid-stack-page {
  code {
    font-family: monospace;
    font-size: 0.9em;
    background: var(--slate-02);
    padding: 0.1em 0.4em;
    border-radius: 0.3rem;
  }

  .mbe-16 {
    margin-block-end: 1.6rem;
  }
  .mbe-48 {
    margin-block-end: 4.8rem;
  }

  /* Colored layer demos */
  .grid-stack-demo {
    border-radius: 0.8rem;
    overflow: hidden;
  }

  .demo-layer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-block-size: 20rem;
    font-size: 1.4rem;
    font-weight: 600;
    border-radius: 0.8rem;
  }

  .demo-layer--base {
    background: var(--slate-03);
    color: var(--slate-09);
  }

  .demo-layer--mid {
    background: color-mix(in srgb, var(--orange-06) 40%, transparent);
    color: var(--orange-10);
    margin: 2rem;
    border-radius: 0.6rem;
    border: 2px dashed var(--orange-07);
  }

  .demo-layer--overlay {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 1.6rem;
    background: linear-gradient(to top, color-mix(in srgb, var(--slate-10) 60%, transparent) 0%, transparent 60%);
    color: white;
    border-radius: 0.8rem;
    pointer-events: none;
  }

  /* Video overlay demo */
  .video-overlay {
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .video-overlay__content {
    text-align: center;
    padding: 2.4rem;
    pointer-events: auto;
  }

  .video-overlay__eyebrow {
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: white;
    margin-block-end: 0.8rem;
    opacity: 0.8;
  }

  .video-overlay__heading {
    font-size: 4rem;
    font-weight: 700;
    color: white;
    margin-block-end: 1.2rem;
    text-shadow: 0 2px 12px rgba(0 0 0 / 0.5);
  }

  .video-overlay__body {
    font-size: 1.6rem;
    color: white;
    opacity: 0.9;
    text-shadow: 0 1px 6px rgba(0 0 0 / 0.4);
  }

  .video-overlay__body code {
    background: rgba(0 0 0 / 0.3);
    color: white;
  }

  /* Controls */
  .grid-stack-demo-controls {
    padding: 1.6rem;
    border: 1px solid var(--slate-06);
    border-radius: 0.8rem;

    .demo-controls__heading {
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--slate-08);
      margin-block-end: 1.2rem;
    }

    .demo-controls__row {
      margin-block-end: 1.2rem;

      &:last-child {
        margin-block-end: 0;
      }
    }
  }
}
</style>
