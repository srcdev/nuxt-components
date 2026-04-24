<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <BannerVideo
          src="/images/banners/video/lake-banner.mp4"
          poster="/images/banners/video/lake-banner.jpg"
          alt="A serene lake landscape"
          :depth="depth"
          :aspect-ratio="aspectRatio"
          :tag="tag"
          :object-fit="objectFit"
          :vertical-position="verticalPosition"
          :horizontal-position="horizontalPosition"
          :style-class-passthrough="['mbe-32']"
        />

        <LayoutRow tag="div" variant="full-width">
          <div class="banner-video-demo-controls">
            <p class="demo-controls__heading">Props</p>

            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="depth"
                v-model:field-data="depthData"
                name="depth"
                label="depth"
                legend="depth"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>

            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="aspectRatio"
                v-model:field-data="aspectRatioData"
                name="aspectRatio"
                label="aspectRatio"
                legend="aspectRatio"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>

            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="objectFit"
                v-model:field-data="objectFitData"
                name="objectFit"
                label="objectFit"
                legend="objectFit"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>

            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="verticalPosition"
                v-model:field-data="verticalPositionData"
                name="verticalPosition"
                label="verticalPosition"
                legend="verticalPosition"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>

            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="horizontalPosition"
                v-model:field-data="horizontalPositionData"
                name="horizontalPosition"
                label="horizontalPosition"
                legend="horizontalPosition"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>

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
  title: "BannerVideo",
  meta: [{ name: "description", content: "BannerVideo component demo" }],
  bodyAttrs: { class: "banner-video-page" },
});

const depth = ref<"xs" | "sm" | "md" | "lg" | "xl">("md");
const aspectRatio = ref("21/9");
const tag = ref<"section" | "div" | "header" | "main" | "article">("section");
const objectFit = ref<"cover" | "contain" | "fill" | "none" | "scale-down">("cover");
const verticalPosition = ref<"start" | "center" | "end">("center");
const horizontalPosition = ref<"start" | "center" | "end">("center");

const depthData = ref<IFormMultipleOptions>({
  data: [
    { id: "depth-xs", name: "depth", value: "xs", label: "xs" },
    { id: "depth-sm", name: "depth", value: "sm", label: "sm" },
    { id: "depth-md", name: "depth", value: "md", label: "md" },
    { id: "depth-lg", name: "depth", value: "lg", label: "lg" },
    { id: "depth-xl", name: "depth", value: "xl", label: "xl" },
  ],
  total: 5,
  skip: 0,
  limit: 5,
});

const aspectRatioData = ref<IFormMultipleOptions>({
  data: [
    { id: "ar-16-9", name: "aspectRatio", value: "16/9", label: "16/9" },
    { id: "ar-21-9", name: "aspectRatio", value: "21/9", label: "21/9" },
    { id: "ar-4-3", name: "aspectRatio", value: "4/3", label: "4/3" },
    { id: "ar-1-1", name: "aspectRatio", value: "1/1", label: "1/1" },
  ],
  total: 4,
  skip: 0,
  limit: 4,
});

const tagData = ref<IFormMultipleOptions>({
  data: [
    { id: "tag-section", name: "tag", value: "section", label: "section" },
    { id: "tag-div", name: "tag", value: "div", label: "div" },
    { id: "tag-header", name: "tag", value: "header", label: "header" },
    { id: "tag-main", name: "tag", value: "main", label: "main" },
    { id: "tag-article", name: "tag", value: "article", label: "article" },
  ],
  total: 5,
  skip: 0,
  limit: 5,
});

const objectFitData = ref<IFormMultipleOptions>({
  data: [
    { id: "fit-cover", name: "objectFit", value: "cover", label: "cover" },
    { id: "fit-contain", name: "objectFit", value: "contain", label: "contain" },
    { id: "fit-fill", name: "objectFit", value: "fill", label: "fill" },
    { id: "fit-none", name: "objectFit", value: "none", label: "none" },
    { id: "fit-scale-down", name: "objectFit", value: "scale-down", label: "scale-down" },
  ],
  total: 5,
  skip: 0,
  limit: 5,
});

const verticalPositionData = ref<IFormMultipleOptions>({
  data: [
    { id: "vp-start", name: "verticalPosition", value: "start", label: "start (top)" },
    { id: "vp-center", name: "verticalPosition", value: "center", label: "center" },
    { id: "vp-end", name: "verticalPosition", value: "end", label: "end (bottom)" },
  ],
  total: 3,
  skip: 0,
  limit: 3,
});

const horizontalPositionData = ref<IFormMultipleOptions>({
  data: [
    { id: "hp-start", name: "horizontalPosition", value: "start", label: "start (left)" },
    { id: "hp-center", name: "horizontalPosition", value: "center", label: "center" },
    { id: "hp-end", name: "horizontalPosition", value: "end", label: "end (right)" },
  ],
  total: 3,
  skip: 0,
  limit: 3,
});
</script>

<style lang="css">
.banner-video-page {
  .banner-video-demo-controls {
    padding: 1.6rem;
    border: 1px solid var(--slate-06);
    border-radius: 0.8rem;
    /* background: var(--slate-01); */

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
