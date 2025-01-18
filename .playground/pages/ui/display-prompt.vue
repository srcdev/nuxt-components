<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Display Prompts</h2>

          <DisplayPromptCore theme="error" :dismissible="true" :style-class-passthrough="['mbe-20', 'mbs-20']">
            <template #icon>
              <Icon name="akar-icons:circle-alert" class="icon" />
            </template>
            <template #title>Error Prompt Title with content (Dismissable)</template>
            <template #content>This is prompt content, it can contain html or plain text.</template>
          </DisplayPromptCore>
          <p class="body-normal">This text sit beneath the prompt.</p>
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
  title: 'UI Display Prompts',
  meta: [{ name: 'description', content: 'Examples of UI Display Prompts' }],
});
</script>
