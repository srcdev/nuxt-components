<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout">
          <h1 class="heading-2">Display Prompts</h1>

          <section class="prompt-examples">
            <DisplayPromptCore theme="success" :dismissible="true" :use-local-style-overrides="true" :style-class-passthrough="['your-scope-class']">
              <template #customDecoratorIcon>
                <Icon name="akar-icons:info" class="icon" />
              </template>
              <template #title>Success Prompt Title with content (Dismissable)</template>
              <template #layout-content>This is prompt content, it can contain html or plain text.</template>
              <template #customCloseIcon>
                <Icon name="material-symbols:close-small" class="icon" />
              </template>
              <template #customTitle>Dismiss</template>
            </DisplayPromptCore>

            <DisplayPromptCore theme="secondary" :dismissible="true" :style-class-passthrough="['your-scope-class']">
              <template #customDecoratorIcon>
                <Icon name="akar-icons:info" class="icon" />
              </template>
              <template #title>Secondary Prompt Title with content (Dismissable)</template>
              <template #layout-content>This is prompt content, it can contain html or plain text.</template>
            </DisplayPromptCore>

            <DisplayPromptCore theme="info" :dismissible="true" :style-class-passthrough="['your-scope-class']">
              <template #customDecoratorIcon>
                <Icon name="akar-icons:info" class="icon" />
              </template>
              <template #title>Info Prompt Title with content (Dismissable)</template>
              <template #layout-content>This is prompt content, it can contain html or plain text.</template>
            </DisplayPromptCore>

            <DisplayPromptCore theme="error" :dismissible="true" :style-class-passthrough="['your-scope-class']">
              <template #customDecoratorIcon>
                <Icon name="akar-icons:circle-alert" class="icon" />
              </template>
              <template #title>Error Prompt Title with content (Dismissable)</template>
              <template #layout-content>This is prompt content, it can contain html or plain text.</template>
            </DisplayPromptCore>

            <DisplayPromptCore theme="warning" :dismissible="true" :style-class-passthrough="['your-scope-class']">
              <template #customDecoratorIcon>
                <Icon name="akar-icons:circle-alert" class="icon" />
              </template>
              <template #title>Warning Prompt Title with content (Dismissable)</template>
              <template #layout-content>This is prompt content, it can contain html or plain text.</template>
            </DisplayPromptCore>
          </section>
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

<style lang="css">
.prompt-examples {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
