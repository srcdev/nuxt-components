<template>
  <div>
    <NuxtLayout name="default">
      <template #content>
        <LayoutRow tag="div" variant="popout" :styleClassPassthrough="['mbe-20']">
          <h2 class="heading-2">Display Prompts</h2>

          <DisplayPromptCore theme="success" :dismissible="true" :style-class-passthrough="['mbs-20']">
            <template #icon>
              <Icon name="akar-icons:check" class="icon" />
            </template>
            <template #title>Success Prompt Title with content (Dismissable)</template>
            <template #content>This is prompt content, it can contain html or plain text.</template>
          </DisplayPromptCore>

          <DisplayPromptCore theme="info" :dismissible="true" :style-class-passthrough="['mbs-20']">
            <template #icon>
              <Icon name="akar-icons:info" class="icon" />
            </template>
            <template #title>Info Prompt Title with content (Dismissable)</template>
            <template #content>This is prompt content, it can contain html or plain text.</template>
          </DisplayPromptCore>

          <DisplayPromptCore theme="error" :dismissible="true" :style-class-passthrough="['mbs-20']">
            <template #icon>
              <Icon name="akar-icons:circle-alert" class="icon" />
            </template>
            <template #title>Error Prompt Title with content (Dismissable)</template>
            <template #content>This is prompt content, it can contain html or plain text.</template>
          </DisplayPromptCore>

          <DisplayPromptCore theme="warning" :dismissible="true" :style-class-passthrough="['mbs-20']">
            <template #icon>
              <Icon name="akar-icons:circle-alert" class="icon" />
            </template>
            <template #title>Warning Prompt Title with content (Dismissable)</template>
            <template #content>This is prompt content, it can contain html or plain text.</template>
          </DisplayPromptCore>
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
