<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h1 class="page-heading-3">Masonry Grid Ordered</h1>
          <p class="page-body-normal">Masonry grid ordered displaying dummy posts data</p>
          <CanvasSwitcher v-model:canvasName="canvasName" />
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <div v-if="status === 'success'" class="masonry-columns">
            <div
              v-for="(item, index) in quotesData?.quotes.slice(0, displayCount)"
              class="p-10 border border-1 border-grey-dark border-r-4"
            >
              <p class="text-normal wght-700">{{ index + 1 }}: {{ item.author }}</p>
              <p class="text-normal">{{ item.quote }}</p>
            </div>
          </div>
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
.masonry-columns {
  /* column-count: 3; */
  columns: 300px;
}
</style>
