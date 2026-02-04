<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Nuxt3 Components Layer</h1>
          <p>
            A collection of hand rolled UI components for Nuxt3 that can be added as a layer (extended into another
            Nuxt3 app)
          </p>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">PopOver component 1</h2>
          <ClientOnly>
            <p>popoverSupported({{ popoverSupported }})</p>
          </ClientOnly>

          <PopOver popovertarget="profile1">
            <template #trigger>
              <img class="profile-image" src="https://ui-avatars.com/api/name=1?background=0A8A0A&color=fff" alt="" />
            </template>
            <template #popoverCotent>
              <h2>Popover content 1</h2>
            </template>
          </PopOver>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">PopOver component 2</h2>
          <div class="justify-end">
            <PopOver popovertarget="profile2">
              <template #trigger>
                <img class="profile-image" src="https://ui-avatars.com/api/name=2?background=0A8A0A&color=fff" alt="" />
              </template>
              <template #popoverCotent>
                <h2>Popover content 2</h2>
              </template>
            </PopOver>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Masonry Grid</h2>
          <MasonryGrid :grid-data="quotesData?.quotes.slice(0, qoutesDisplayCount) ?? {}">
            <template
              v-for="(item, index) in quotesData?.quotes.slice(0, qoutesDisplayCount)"
              :key="item.id"
              #[item.id]
            >
              <div>
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

definePageMeta({
  layout: false,
});

useHead({
  title: "Home",
  meta: [{ name: "description", content: "Nuxt Components Layer extending a Nuxt project" }],
  bodyAttrs: {
    class: "home",
  },
});

const qoutesDisplayCount = 21;
const { data: quotesData } = await useFetch<IQuotes>("https://dummyjson.com/quotes");

const popoverSupported = computed(() => {
  return "anchorName" in document.documentElement.style;
});
</script>

<style lang="css">
.justify-end {
  display: flex;
  justify-content: flex-end;
}

.qr-code {
  width: 250px;
  height: 250px;
}
</style>
