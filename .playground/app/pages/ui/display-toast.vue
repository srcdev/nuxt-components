<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">DisplayToast</h2>
          <p>
            <button @click.prevent="triggerFirstToast()" class="button primary mbe-10">
              Trigger First Toast (current value: {{ firstToastActive }})
            </button>
          </p>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast v-model="firstToastActive" :duration="0" :style-class-passthrough="['top', 'full-width']">
            <DisplayPromptCore
              v-model:parentOpen="firstToastActive"
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

const firstToastActive = ref(false)
const secondToastActive = ref(false)
const thirdToastActive = ref(false)

const triggerFirstToast = () => {
  console.log("Triggering toast...")
  firstToastActive.value = true
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
