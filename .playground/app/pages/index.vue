<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="inset-content" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">PopOver component 1</h2>
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

        <LayoutRow tag="div" variant="inset-content" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">PopOver component 2</h2>
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

        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Masonry Grid</h2>
          <MasonryGrid :gridData="quotesData?.quotes.slice(0, qoutesDisplayCount) ?? <IQuotes>{}">
            <template v-for="(item, index) in quotesData?.quotes.slice(0, qoutesDisplayCount)" v-slot:[item.id]>
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
import type { IQuotes } from '@/types/types.quotes';

definePageMeta({
  layout: false,
});

useHead({
  title: 'Home',
  meta: [{ name: 'description', content: 'Nuxt Components Layer extending a Nuxt project' }],
  bodyAttrs: {
    class: 'home',
  },
});

const qoutesDisplayCount = 21;
const { data: quotesData, status, error, refresh } = await useFetch<IQuotes>('https://dummyjson.com/quotes');

const popoverSupported = computed(() => {
  return 'anchorName' in document.documentElement.style;
});
</script>

<style lang="css">
.justify-end {
  display: flex;
  justify-content: flex-end;
}
</style>
