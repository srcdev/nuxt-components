<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Masonry Grid</h1>
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <MasonryGrid
            :grid-data="quotesData?.quotes.slice(0, qoutesDisplayCount) ?? []"
            :item-min-width="350"
            :gap="3.2"
            unit="rem"
            :style-class-passthrough="[canvasName, 'mi-auto']"
          >
            <template
              v-for="(item, index) in quotesData?.quotes.slice(0, qoutesDisplayCount)"
              :key="item.id"
              #[item.id]
            >
              <div class="">
                <p class="">{{ index + 1 }}: {{ item.author }}</p>
                <p class="">{{ item.quote }}</p>
              </div>
            </template>
          </MasonryGrid>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { IQuotes } from "~/types/types.quotes";
import type { MediaCanvas } from "~/types/components";

definePageMeta({
  layout: false,
});

useHead({
  title: "Masonry Grid",
  meta: [{ name: "description", content: "Masonry Grid - Nuxt Components Layer extending a Nuxt project" }],
  bodyAttrs: {
    class: "home",
  },
});

const canvasName = ref<MediaCanvas>("desktopCanvas");

const qoutesDisplayCount = 21;
const { data: quotesData } = await useFetch<IQuotes>("https://dummyjson.com/quotes");
</script>
