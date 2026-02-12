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
          <form class="form-wrapper">
            <p>
              <InputButtonCore
                ref="firstToastButton"
                :readonly="firstToastActive"
                button-text="Trigger First Toast (current value: {{ firstToastActive }})"
                theme="primary"
                :style-class-passthrough="['mbe-10']"
                @click.prevent="triggerFirstToast()"
              />
            </p>
            <hr class="mbe-20" />
            <p class="page-body-normal">Trigger ERROR prompt as toast with auto dismiss</p>
            <p>
              <InputButtonCore
                ref="secondToastButton"
                :readonly="secondToastActive"
                button-text="Trigger Second Toast (current value: {{ secondToastActive }})"
                theme="primary"
                :style-class-passthrough="['mbe-10']"
                @click.prevent="triggerSecondToast()"
              />
            </p>
            <hr class="mbe-20" />
            <p class="page-body-normal">Trigger SUCCESS prompt as toast with manual dismiss</p>
            <p>
              <InputButtonCore
                ref="thirdToastButton"
                :readonly="thirdToastActive"
                button-text="Trigger Third Toast (current value: {{ thirdToastActive }})"
                theme="primary"
                :style-class-passthrough="['mbe-10']"
                @click.prevent="triggerThirdToast()"
              />
            </p>
            <hr class="mbe-20" />
            <p class="page-body-normal">Trigger INFO prompt as toast with auto dismiss (full-width)</p>
            <p>
              <InputButtonCore
                ref="fourthToastButton"
                :readonly="fourthToastActive"
                button-text="Trigger Fourth Toast (current value: {{ fourthToastActive }})"
                theme="primary"
                :style-class-passthrough="['mbe-10']"
                @click.prevent="triggerFourthToast()"
              />
            </p>
            <hr class="mbe-20" />
            <p class="page-body-normal">New config-based positioning examples:</p>
            <div class="button-grid">
              <InputButtonCore
                ref="bottomLeftToastButton"
                :readonly="bottomLeftToastActive"
                button-text="Bottom Left Toast"
                theme="primary"
                @click.prevent="triggerBottomLeftToast()"
              />
              <InputButtonCore
                ref="bottomCenterToastButton"
                :readonly="bottomCenterToastActive"
                button-text="Bottom Center Toast"
                theme="primary"
                @click.prevent="triggerBottomCenterToast()"
              />
              <InputButtonCore
                ref="customIconToastButton"
                :readonly="customIconToastActive"
                button-text="Custom Icon Toast"
                theme="primary"
                @click.prevent="triggerCustomIconToast()"
              />
            </div>
            <hr class="mbe-20" />
            <p class="page-body-normal">Toast with title and content slots:</p>
            <p>
              <InputButtonCore
                ref="slottedToastButton"
                :readonly="slottedToastActive"
                button-text="Trigger Slotted Toast (current value: {{ slottedToastActive }})"
                theme="primary"
                :style-class-passthrough="['mbe-10']"
                @click.prevent="triggerSlottedToast()"
              />
            </p>
          </form>
        </LayoutRow>

        <DisplayToast
          v-model="firstToastActive"
          :config="{
            appearance: { theme: 'warning', position: 'top', alignment: 'right' },
            behavior: { autoDismiss: false, returnFocusTo: firstToastButton },
            content: {
              title: 'Warning Alert',
              description: 'This is a toast notification message with structured content.',
            },
          }"
        />

        <DisplayToast
          v-model="secondToastActive"
          :config="{
            appearance: { theme: 'error', position: 'top', alignment: 'right' },
            behavior: { returnFocusTo: secondToastButton },
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

        <DisplayToast
          v-model="thirdToastActive"
          :config="{
            appearance: { theme: 'success', position: 'top', alignment: 'right' },
            behavior: { autoDismiss: false, returnFocusTo: thirdToastButton },
          }"
        >
          <DisplayPromptCore
            v-model="thirdToastActive"
            theme="success"
            :dismissible="true"
            :style-class-passthrough="['dark', 'outlined']"
            :use-auto-focus="true"
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

        <DisplayToast
          v-model="fourthToastActive"
          :config="{
            appearance: { theme: 'info', position: 'top', fullWidth: true },
            behavior: { returnFocusTo: fourthToastButton },
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

        <DisplayToast
          v-model="bottomLeftToastActive"
          :config="{
            appearance: { theme: 'primary', position: 'bottom', alignment: 'left' },
            behavior: { autoDismiss: true, duration: 3000, returnFocusTo: bottomLeftToastButton },
            content: {
              title: 'Warning Alert',
              description: 'This is a toast notification message with structured content.',
            },
          }"
        />

        <DisplayToast
          v-model="bottomCenterToastActive"
          :config="{
            appearance: { theme: 'secondary', position: 'bottom', alignment: 'center' },
            behavior: { autoDismiss: true, duration: 4000, returnFocusTo: bottomCenterToastButton },
            content: {
              title: 'Warning Alert',
              description: 'This is a toast notification message with structured content.',
            },
          }"
        />

        <DisplayToast
          v-model="customIconToastActive"
          :config="{
            appearance: { theme: 'success', position: 'top', alignment: 'left' },
            behavior: { autoDismiss: false, returnFocusTo: customIconToastButton },
            content: {
              title: 'Warning Alert',
              description: 'This is a toast notification message with structured content.',
            },
          }"
        />

        <DisplayToast
          v-model="slottedToastActive"
          :config="{
            appearance: { theme: 'info', position: 'top', alignment: 'right' },
            behavior: { autoDismiss: false, returnFocusTo: slottedToastButton },
          }"
        >
          <template #title>
            <strong>New Feature Available!</strong>
          </template>
          <template #description>
            You can now use title and content slots to create more structured toast notifications with better typography
            and layout.
          </template>
        </DisplayToast>
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
 * 5. Return focus functionality for accessibility
 *
 * The new config system groups props into logical sections:
 * - appearance: theme, position, alignment, fullWidth
 * - behavior: autoDismiss, duration, revealDuration, returnFocusTo
 * - content: text, customIcon
 *
 * The returnFocusTo property accepts an HTMLElement or ComponentPublicInstance
 * and will focus that element when the toast is dismissed, improving accessibility.
 */

definePageMeta({
  layout: false,
});

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
});

// Toast state variables
const firstToastActive = ref(false);
const secondToastActive = ref(false);
const thirdToastActive = ref(false);
const fourthToastActive = ref(false);
const bottomLeftToastActive = ref(false);
const bottomCenterToastActive = ref(false);
const customIconToastActive = ref(false);
const slottedToastActive = ref(false);

// Template refs for focus return
const firstToastButton = useTemplateRef<HTMLButtonElement>("firstToastButton");
const secondToastButton = useTemplateRef<HTMLButtonElement>("secondToastButton");
const thirdToastButton = useTemplateRef<HTMLButtonElement>("thirdToastButton");
const fourthToastButton = useTemplateRef<HTMLButtonElement>("fourthToastButton");
const bottomLeftToastButton = useTemplateRef<HTMLButtonElement>("bottomLeftToastButton");
const bottomCenterToastButton = useTemplateRef<HTMLButtonElement>("bottomCenterToastButton");
const customIconToastButton = useTemplateRef<HTMLButtonElement>("customIconToastButton");
const slottedToastButton = useTemplateRef<HTMLButtonElement>("slottedToastButton");

const triggerFirstToast = () => {
  firstToastActive.value = true;
};

const triggerSecondToast = () => {
  secondToastActive.value = true;
};

const triggerThirdToast = () => {
  thirdToastActive.value = true;
};

const triggerFourthToast = () => {
  fourthToastActive.value = true;
};

const triggerBottomLeftToast = () => {
  bottomLeftToastActive.value = true;
};

const triggerBottomCenterToast = () => {
  bottomCenterToastActive.value = true;
};

const triggerCustomIconToast = () => {
  customIconToastActive.value = true;
};

const triggerSlottedToast = () => {
  slottedToastActive.value = true;
};
</script>

<style scoped lang="css">
.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
