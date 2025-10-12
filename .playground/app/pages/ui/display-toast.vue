<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20', 'p-20']">
          <h2 class="page-heading-2">DisplayToast Component</h2>
          <HeaderBlock :tag-level="3" :class-level="3" :style-class-passthrough="['mbe-10']">
            Toast notification component (HeaderBlock)
          </HeaderBlock>
          <p class="page-body-normal">Trigger default toast with manual dismiss</p>
          <p>
            <button @click.prevent="triggerFirstToast()" :read-only="firstToastActive" class="button primary mbe-10">
              Trigger First Toast (current value: {{ firstToastActive }})
            </button>
          </p>
          <hr class="mbe-20" />
          <p class="page-body-normal">Trigger ERROR prompt as toast with auto dismiss</p>
          <p>
            <button @click.prevent="triggerSecondToast()" :read-only="secondToastActive" class="button primary mbe-10">
              Trigger Second Toast (current value: {{ secondToastActive }})
            </button>
          </p>
          <hr class="mbe-20" />
          <p class="page-body-normal">Trigger SUCCESS prompt as toast with manual dismiss</p>
          <p>
            <button @click.prevent="triggerThirdToast()" :read-only="thirdToastActive" class="button primary mbe-10">
              Trigger Third Toast (current value: {{ thirdToastActive }})
            </button>
          </p>
          <hr class="mbe-20" />
          <p class="page-body-normal">Trigger INFO prompt as toast with auto dismiss (full-width)</p>
          <p>
            <button @click.prevent="triggerFourthToast()" :read-only="fourthToastActive" class="button primary mbe-10">
              Trigger Fourth Toast (current value: {{ fourthToastActive }})
            </button>
          </p>
          <hr class="mbe-20" />
          <p class="page-body-normal">New config-based positioning examples:</p>
          <div class="button-grid">
            <button
              @click.prevent="triggerBottomLeftToast()"
              :read-only="bottomLeftToastActive"
              class="button secondary"
            >
              Bottom Left Toast
            </button>
            <button
              @click.prevent="triggerBottomCenterToast()"
              :read-only="bottomCenterToastActive"
              class="button secondary"
            >
              Bottom Center Toast
            </button>
            <button
              @click.prevent="triggerCustomIconToast()"
              :read-only="customIconToastActive"
              class="button secondary"
            >
              Custom Icon Toast
            </button>
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="firstToastActive"
            :config="{
              appearance: { theme: 'warning', position: 'top', alignment: 'right' },
              behavior: { autoDismiss: false },
              content: { text: 'This is a toast notification message' },
            }"
          ></DisplayToast>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="secondToastActive"
            :config="{
              appearance: { theme: 'error', position: 'top', alignment: 'right' },
            }"
          >
            <DisplayPromptCore
              v-model="secondToastActive"
              theme="error"
              :dismissible="false"
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
            :config="{
              appearance: { theme: 'success', position: 'top', alignment: 'right' },
              behavior: { autoDismiss: false },
            }"
          >
            <DisplayPromptCore
              v-model="thirdToastActive"
              theme="success"
              :dismissible="true"
              :use-auto-focus="true"
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
            :config="{
              appearance: { theme: 'info', position: 'top', fullWidth: true },
            }"
          >
            <DisplayPromptCore
              v-model="fourthToastActive"
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

        <!-- New config-based positioning examples -->
        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="bottomLeftToastActive"
            :config="{
              appearance: { theme: 'primary', position: 'bottom', alignment: 'left' },
              behavior: { autoDismiss: true, duration: 3000 },
              content: { text: 'Bottom left positioned toast!' },
            }"
          ></DisplayToast>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="bottomCenterToastActive"
            :config="{
              appearance: { theme: 'secondary', position: 'bottom', alignment: 'center' },
              behavior: { autoDismiss: true, duration: 4000 },
              content: { text: 'Bottom center positioned toast with longer duration!' },
            }"
          ></DisplayToast>
        </LayoutRow>

        <LayoutRow tag="div" variant="inset-content" :style-class-passthrough="['mbe-20']">
          <DisplayToast
            v-model="customIconToastActive"
            :config="{
              appearance: { theme: 'success', position: 'top', alignment: 'left' },
              behavior: { autoDismiss: false },
              content: { text: 'Custom icon toast (manual dismiss)', customIcon: 'akar-icons:check-box' },
            }"
          ></DisplayToast>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
/**
 * DisplayToast Playground - Updated to use new config-based props system
 *
 * This playground demonstrates:
 * 1. Legacy examples converted to new config structure
 * 2. New positioning capabilities (bottom left, bottom center)
 * 3. Custom icon support through config
 * 4. Different behavior configurations (autoDismiss, duration)
 *
 * The new config system groups props into logical sections:
 * - appearance: theme, position, alignment, fullWidth
 * - behavior: autoDismiss, duration, revealDuration
 * - content: text, customIcon
 */

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

// Toast state variables

const firstToastActive = ref(false)
const secondToastActive = ref(false)
const thirdToastActive = ref(false)
const fourthToastActive = ref(false)
const bottomLeftToastActive = ref(false)
const bottomCenterToastActive = ref(false)
const customIconToastActive = ref(false)

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

const triggerBottomLeftToast = () => {
  bottomLeftToastActive.value = true
}

const triggerBottomCenterToast = () => {
  bottomCenterToastActive.value = true
}

const triggerCustomIconToast = () => {
  customIconToastActive.value = true
}

onMounted(() => {
  // Trigger a toast on mount for demonstration purposes
  // triggerToast()
})
</script>

<style scoped lang="css">
.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
