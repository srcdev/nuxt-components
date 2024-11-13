<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <PageRow :isFullWidth="false">
          <template #default>
            <h1>Row 1</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </template>
        </PageRow>

        <hr />

        <PageRow :isFullWidth="false">
          <template #default>
            <MasonryGrid :gridData="quotesData?.quotes.slice(0, qoutesDisplayCount) ?? <IQuotes>{}">
              <template v-for="(item, index) in quotesData?.quotes.slice(0, qoutesDisplayCount)" v-slot:[item.id]>
                <div class="">
                  <p class="">{{ index + 1 }}: {{ item.author }}</p>
                  <p class="">{{ item.quote }}</p>
                </div>
              </template>
            </MasonryGrid>
          </template>
        </PageRow>
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
</script>
