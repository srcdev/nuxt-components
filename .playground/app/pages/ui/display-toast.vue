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
          <p>
            <button @click.prevent="triggerSecondToast()" class="button primary mbe-10">
              Trigger Second Toast (current value: {{ secondToastActive }})
            </button>
          </p>
          <p>
            <button @click.prevent="triggerThirdToast()" class="button primary mbe-10">
              Trigger Third Toast (current value: {{ thirdToastActive }})
            </button>
          </p>
          <p>
            <button @click.prevent="triggerFourthToast()" class="button primary mbe-10">
              Trigger Fourth Toast (current value: {{ fourthToastActive }})
            </button>
          </p>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="firstToastActive"
            theme="warning"
            :duration="0"
            :reveal-duration="500"
            toast-display-text="This is a toast notification message"
            :style-class-passthrough="['top', 'right']"
          ></DisplayToast>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="secondToastActive"
            theme="error"
            :duration="2000"
            :reveal-duration="500"
            :style-class-passthrough="['top', 'full-width']"
          >
            <DisplayPromptCore
              v-model:parentComponentState="secondToastActive"
              theme="error"
              :dismissible="true"
              :style-class-passthrough="['dark', 'outlined']"
            >
              <template #customDecoratorIcon>
                <Icon name="akar-icons:info" class="icon" />
              </template>
              <template #title>Info Prompt Title with content (Dismissable)</template>
              <template #content>This is prompt content, it can contain html or plain text.</template>
            </DisplayPromptCore>
          </DisplayToast>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="thirdToastActive"
            theme="success"
            :duration="0"
            :reveal-duration="500"
            :style-class-passthrough="['top', 'full-width']"
          >
            <DisplayPromptCore
              v-model:parentComponentState="thirdToastActive"
              theme="success"
              :dismissible="true"
              :style-class-passthrough="['dark', 'outlined']"
            >
              <template #customDecoratorIcon>
                <Icon name="akar-icons:info" class="icon" />
              </template>
              <template #title>Success Prompt Title with content (Dismissable)</template>
              <template #content>This is prompt content, it can contain html or plain text.</template>
              <template #customCloseIcon>
                <Icon name="material-symbols:close-small" class="icon" />
              </template>
              <template #customTitle>Dismiss</template>
            </DisplayPromptCore>
          </DisplayToast>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="fourthToastActive"
            theme="info"
            :duration="5000"
            :reveal-duration="300"
            :style-class-passthrough="['top', 'full-width']"
          >
            <DisplayPromptCore
              v-model:parentComponentState="fourthToastActive"
              theme="info"
              :dismissible="false"
              :style-class-passthrough="['dark', 'outlined']"
            >
              <template #title>Warning Prompt Title with content (Auto Dismiss)</template>
              <template #content>This is prompt content, it can contain html or plain text.</template>
              <template #customCloseIcon>
                <Icon name="material-symbols:close-small" class="icon" />
              </template>
              <template #customTitle>Dismiss</template>
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
const fourthToastActive = ref(false)

const triggerFirstToast = () => {
  firstToastActive.value = true
}

const triggerSecondToast = () => {
  secondToastActive.value = true
}

const triggerThirdToast = () => {
  thirdToastActive.value = true
}

const triggerFourthToast = () => {
  fourthToastActive.value = true
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
