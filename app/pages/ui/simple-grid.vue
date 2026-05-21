<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="popout" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-3">Simple Grid</h1>
          <p class="page-body-normal">Simple grid displaying dummy posts data</p>

          <LayoutGridByWidth v-if="status === 'success'" column-width="300px" gap="2rem">
            <template v-for="(item, index) in postsData?.posts.slice(0, displayCount)" :key="item.id" #[item.id]>
              <div class="display-post-item">
                <div>Views: {{ item.views }}</div>
                <div>{{ index + 1 }}: {{ item.title }}</div>
                <div>{{ item.body }}</div>
              </div>
            </template>
          </LayoutGridByWidth>

          <p v-else class="page-body-normal">&hellip;Loading</p>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { Posts } from "~/types/types.posts";

definePageMeta({
  layout: false,
});

useHead({
  title: "Simple Grid",
  meta: [{ name: "description", content: "Simple Grid" }],
  bodyAttrs: {
    class: "",
  },
});

const displayCount = 12;
const { data: postsData, status } = await useFetch<Posts>("https://dummyjson.com/posts");
</script>

<style lang="css">
.display-post-item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  gap: 1.2rem;
  outline: 0.1rem solid green;
  border-radius: 0.4rem;
  padding: 1.2rem;
}
</style>
