<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h1 class="page-heading-3">Masonry Grid Ordered</h1>
          <p class="page-body-normal">Masonry grid ordered displaying dummy posts data</p>
          <CanvasSwitcher v-model:canvasName="canvasName" />
        </LayoutRow>

        <LayoutRow tag="div" variant="full-content" :styleClassPassthrough="['mbe-20']">
          <MasonryGridOrderedGridExperiment
            v-if="status === 'success'"
            :gridData="quotesData?.quotes?.slice(0, displayCount).map((q) => ({ ...q, id: String(q.id) })) ?? []"
            :gap="12"
            :min-tile-width="300"
            :fixed-width="useFixedWidth"
            :styleClassPassthrough="[canvasName, 'mi-auto']"
          >
            <template v-for="(item, index) in quotesData?.quotes.slice(0, displayCount)" v-slot:[item.id]>
              <div class="demo-grid-item-content">
                <p class="text-normal wght-700">{{ index + 1 }}: {{ item.author }}</p>
                <p class="text-normal">{{ item.quote }}</p>
              </div>
            </template>
          </MasonryGridOrderedGridExperiment>
          <p v-else class="page-body-normal">&hellip;Loading</p>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { IQuotes } from "~/types/types.quotes"
import type { MediaCanvas } from "~/types/components"

definePageMeta({
  layout: false,
})

useHead({
  title: "Masonry Grid Ordered",
  meta: [{ name: "description", content: "Masonry Grid Ordered" }],
  bodyAttrs: {
    class: "",
  },
})
const canvasName = ref<MediaCanvas>("desktopCanvas")

const useFixedWidth = true
const displayCount = 12
const { data: quotesData, status } = await useFetch<IQuotes>("https://dummyjson.com/quotes")
</script>

<style lang="css">
.mi-auto {
  --_border-color: light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%));

  &.masonry-grid-ordered {
    .masonry-grid-ordered-wrapper {
      background-color: blueviolet;

      .masonry-grid-ordered-item {
        background-color: darkcyan;

        .masonry-grid-ordered-content {
          background-color: brown;

          .demo-grid-item-content {
            outline: 0.1rem solid var(--_border-color);
            padding: 1.2rem;
          }
        }
      }
    }
  }
}
</style>
