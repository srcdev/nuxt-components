<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h1 class="heading-3">Simple Grid</h1>
          <p class="body-normal">Simple grid displaying dummy posts data</p>

          <DisplayGridCore v-if="status === 'success'" :gridData="postsData?.posts.slice(0, displayCount) ?? <Posts>{}" :style-class-passthrough="['display-posts']">
            <template v-for="(item, index) in postsData?.posts.slice(0, displayCount)" v-slot:[item.id]>
              <div class="display-post-item">
                <div>Views: {{ item.views }}</div>
                <div>{{ index + 1 }}: {{ item.title }}</div>
                <div>{{ item.body }}</div>
              </div>
            </template>
          </DisplayGridCore>

          <p v-else class="body-normal">&hellip;Loading</p>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { Posts } from '@/types/types.posts';

definePageMeta({
  layout: false,
});

useHead({
  title: 'Simple Grid',
  meta: [{ name: 'description', content: 'Simple Grid' }],
  bodyAttrs: {
    class: '',
  },
});

const displayCount = 12;
const { data: postsData, status, error, refresh } = await useFetch<Posts>('https://dummyjson.com/posts');
</script>

<style lang="css">
.display-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  gap: 2rem;

  .display-post-item {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
    gap: 1.2rem;
    outline: 0.1rem solid green;
    border-radius: 0.4rem;
    padding: 1.2rem;
  }
}
</style>
