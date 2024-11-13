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
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
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
</script>
