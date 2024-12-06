<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Tabs</h2>
        </LayoutRow>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <Tabs></Tabs>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: 'UI Tabs',
  meta: [{ name: 'description', content: 'Examples of UI Component Tabs' }],
  bodyAttrs: {
    class: 'home',
  },
});
</script>
