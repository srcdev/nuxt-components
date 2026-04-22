<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <BannerVideo
          src="/images/banners/video/lake-banner.mp4"
          poster="/images/banners/video/lake-banner.jpg"
          alt="A serene lake landscape"
          :max-height="maxHeight"
          :max-height-tablet="maxHeightTablet || undefined"
          :max-height-mobile="maxHeightMobile || undefined"
          :aspect-ratio="aspectRatio"
          :tag="tag"
          :object-fit="objectFit"
          :object-position="objectPosition"
          :style-class-passthrough="['mbe-32']"
        />

        <LayoutRow tag="div" variant="full-width">
          <div class="banner-video-demo-controls">
            <p class="demo-controls__heading">Props</p>

            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="maxHeight"
                v-model:field-data="maxHeightData"
                name="maxHeight"
                legend="maxHeight (desktop)"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>

            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="maxHeightTablet"
                v-model:field-data="maxHeightTabletData"
                name="maxHeightTablet"
                legend="maxHeightTablet (≥768px, falls back to maxHeight)"
                error-message=""
                :is-button="true"
                :is-pill="true"
                :field-has-error="false"
                options-layout="inline"
              />
            </div>

            <div class="demo-controls__row">
              <MultipleRadiobuttons
                v-model="maxHeightMobile"
                v-model:field-data="maxHeightMobileData"
                name="maxHeightMobile"
                legend="maxHeightMobile (<768px, falls back through tablet → desktop)"
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
                v-model="objectPosition"
                v-model:field-data="objectPositionData"
                name="objectPosition"
                legend="objectPosition"
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

const maxHeight = ref("56rem");
const maxHeightTablet = ref("");
const maxHeightMobile = ref("");
const aspectRatio = ref("21/9");
const tag = ref<"section" | "div" | "header" | "main" | "article">("section");
const objectFit = ref<"cover" | "contain" | "fill" | "none" | "scale-down">("cover");
const objectPosition = ref("50% 50%");

const maxHeightData = ref<IFormMultipleOptions>({
  data: [
    { id: "mh-40rem", name: "maxHeight", value: "40rem", label: "40rem" },
    { id: "mh-56rem", name: "maxHeight", value: "56rem", label: "56rem" },
    { id: "mh-80rem", name: "maxHeight", value: "80rem", label: "80rem" },
    { id: "mh-100vh", name: "maxHeight", value: "100vh", label: "100vh" },
    { id: "mh-none", name: "maxHeight", value: "none", label: "none" },
  ],
  total: 5,
  skip: 0,
  limit: 5,
});

const maxHeightTabletData = ref<IFormMultipleOptions>({
  data: [
    { id: "mht-unset", name: "maxHeightTablet", value: "", label: "unset" },
    { id: "mht-32rem", name: "maxHeightTablet", value: "32rem", label: "32rem" },
    { id: "mht-40rem", name: "maxHeightTablet", value: "40rem", label: "40rem" },
    { id: "mht-56rem", name: "maxHeightTablet", value: "56rem", label: "56rem" },
  ],
  total: 4,
  skip: 0,
  limit: 4,
});

const maxHeightMobileData = ref<IFormMultipleOptions>({
  data: [
    { id: "mhm-unset", name: "maxHeightMobile", value: "", label: "unset" },
    { id: "mhm-24rem", name: "maxHeightMobile", value: "24rem", label: "24rem" },
    { id: "mhm-32rem", name: "maxHeightMobile", value: "32rem", label: "32rem" },
    { id: "mhm-40rem", name: "maxHeightMobile", value: "40rem", label: "40rem" },
  ],
  total: 4,
  skip: 0,
  limit: 4,
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

const objectPositionData = ref<IFormMultipleOptions>({
  data: [
    { id: "pos-center", name: "objectPosition", value: "50% 50%", label: "center" },
    { id: "pos-top", name: "objectPosition", value: "50% 0%", label: "top" },
    { id: "pos-bottom", name: "objectPosition", value: "50% 100%", label: "bottom" },
    { id: "pos-left", name: "objectPosition", value: "0% 50%", label: "left" },
    { id: "pos-right", name: "objectPosition", value: "100% 50%", label: "right" },
  ],
  total: 5,
  skip: 0,
  limit: 5,
});
</script>

<style lang="css">
.banner-video-page {
  .banner-video-demo-controls {
    padding: 1.6rem;
    border: 1px solid var(--slate-06);
    border-radius: 0.8rem;
    background: var(--slate-01);

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
