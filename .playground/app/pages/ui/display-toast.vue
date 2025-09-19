<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">DisplayToast</h2>
          <p>
            <button @click.prevent="triggerToast()" class="button primary mbe-10">
              Trigger Toast (current value: {{ toastConfig.showToast }})
            </button>
          </p>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast v-model="toastConfig" :style-class-passthrough="['top', 'full-width']">
            <DisplayPromptCore
              v-model:parentOpen="toastConfig.showToast"
              theme="info"
              :dismissible="true"
              :style-class-passthrough="['your-scope-class']"
            >
              <template #customDecoratorIcon>
                <Icon name="akar-icons:info" class="icon" />
              </template>
              <template #title>Info Prompt Title with content (Dismissable)</template>
              <template #layout-content>This is prompt content, it can contain html or plain text.</template>
            </DisplayPromptCore>
          </DisplayToast>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { IToastConfig } from "@/types/display-toast"

definePageMeta({
  layout: false,
})

useHead({
  title: "DisplayToast",
  meta: [
    {
      name: "description",
      content: "DisplayToast Meta description content",
    },
  ],
  bodyAttrs: {
    class: "displayToast-page",
  },
})

const variant = ref("solid")
const hasDividers = ref(false)
const noOutline = ref(false)

const toastConfig = ref<IToastConfig>({
  showToast: false,
  variant: "success",
  revealDuration: 500,
  duration: 0,
  toastDisplayText: "Success! This is a success toast message.",
})

const triggerToast = () => {
  console.log("Triggering toast...")
  toastConfig.value.showToast = true
}

onMounted(() => {
  // Trigger a toast on mount for demonstration purposes
  // triggerToast()
})
</script>

<style lang="css">
.displayToast-page {
  /* CSS styles */
}
</style>
