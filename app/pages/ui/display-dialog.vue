<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-2">Display Dialog</h1>

          <div v-if="isDev" class="qa-panel">
            <details class="qa-panel__details">
              <summary class="qa-panel__summary">
                <span class="qa-panel__title">QA — DisplayDialog</span>
                <code class="qa-panel__status">
                  {{ qaVariant }} · {{ qaTheme ?? "no theme" }}
                </code>
              </summary>
              <div class="qa-panel__body">
                <div class="qa-panel__group">
                  <span class="qa-panel__label">Variant</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in variants"
                      :key="opt"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaVariant === opt }"
                      @click="qaVariant = opt"
                    >
                      {{ opt }}
                    </button>
                  </div>
                </div>

                <div class="qa-panel__group">
                  <span class="qa-panel__label">Theme</span>
                  <div class="qa-panel__chips">
                    <button
                      v-for="opt in themes"
                      :key="String(opt)"
                      class="qa-panel__chip"
                      :class="{ 'is-active': qaTheme === opt }"
                      @click="qaTheme = opt"
                    >
                      {{ opt ?? "none" }}
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <p>
            <button type="button" @click.prevent="openDialog('demo')">Open Dialog</button>
          </p>

          <DisplayDialog
            v-if="dialogsConfig['demo']"
            v-model="dialogsConfig['demo']"
            :variant="qaVariant"
            :theme="qaTheme"
            :allow-content-scroll="qaVariant === 'dialog'"
            data-dialog-id="demo"
          >
            <template #dialogTitle>
              <p class="text-normal wght-700 m-0">{{ dialogTitle }}</p>
            </template>

            <template #dialogContent>
              <div class="pt-12 pb-12">
                <p class="text-normal">{{ dialogBody }}</p>
                <template v-if="qaVariant === 'dialog'">
                  <p class="text-normal">
                    Justo molestie felis tellus tellus taciti? Ullamcorper viverra quis felis donec aliquam torquent
                    imperdiet. Curabitur vitae quis malesuada imperdiet hendrerit felis quam dictum. Aptent curabitur
                    lacus dapibus; nunc enim vestibulum finibus. Lorem commodo tortor blandit nisl curabitur interdum
                    ultricies magnis.
                  </p>
                  <p class="text-normal">
                    Lobortis efficitur enim litora dictum montes. Sagittis eget etiam curae suspendisse cubilia. Ante
                    aliquam orci mus ultricies nostra. Ad augue quam egestas ipsum sem lacus tempus. Magnis enim posuere
                    eros montes fermentum velit.
                  </p>
                  <p class="text-normal">
                    Venenatis adipiscing integer eget donec ridiculus risus. Nulla quis sollicitudin sem nam bibendum
                    ligula. Curabitur malesuada platea egestas venenatis in torquent. Eget eros euismod vehicula consequat
                    at, efficitur ullamcorper.
                  </p>
                </template>
              </div>
            </template>

            <template #actionButtonLeft>
              <button type="button" @click.prevent="closeDialog('demo', 'cancel')">Cancel</button>
            </template>
            <template #actionButtonRight>
              <button type="button" @click.prevent="closeDialog('demo', 'confirm')">{{ confirmLabel }}</button>
            </template>
          </DisplayDialog>
        </PageRow>

        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h2 class="page-heading-2">Nested dialog pattern</h2>
          <p class="text-normal">
            A dialog managing its own internal confirm sub-dialog via a local
            <code>useDialogControls</code> instance. Tick "Simulate unsaved changes" before
            clicking Cancel to trigger the nested confirm.
          </p>
          <p>
            <button type="button" @click.prevent="openNestedDialog('editProfile')">Open nested dialog demo</button>
          </p>

          <DisplayDialog
            v-if="nestedDialogsConfig['editProfile']"
            v-model="nestedDialogsConfig['editProfile']"
            variant="dialog"
            data-dialog-id="nested-edit"
          >
            <template #dialogTitle>
              <p class="text-normal wght-700 m-0">Edit profile</p>
            </template>
            <template #dialogContent>
              <div class="pt-12 pb-12 nested-demo-content">
                <p class="text-normal">Make some changes below, then click Cancel to trigger the nested confirm dialog.</p>
                <label class="nested-demo-label">
                  <input v-model="nestedHasChanges" type="checkbox" />
                  Simulate unsaved changes
                </label>
              </div>
            </template>
            <template #actionButtonLeft>
              <button type="button" @click="handleNestedCancel">Cancel</button>
            </template>
            <template #actionButtonRight>
              <button type="button" @click="closeNestedDialog('editProfile', 'confirm')">Save</button>
            </template>
          </DisplayDialog>

          <DisplayDialog
            v-if="nestedDialogsConfig['confirmDiscard']"
            v-model="nestedDialogsConfig['confirmDiscard']"
            variant="confirm"
            theme="warning"
            :lock-viewport="false"
            data-dialog-id="nested-confirm"
          >
            <template #dialogTitle>
              <p class="text-normal wght-700 m-0">Discard changes?</p>
            </template>
            <template #dialogContent>
              <div class="m-0">
                <p class="text-normal">Your unsaved changes will be lost.</p>
              </div>
            </template>
            <template #actionButtonLeft>
              <button type="button" @click="closeNestedDialog('confirmDiscard', 'cancel')">Keep editing</button>
            </template>
            <template #actionButtonRight>
              <button type="button" @click="closeNestedDialog('confirmDiscard', 'confirm')">Discard</button>
            </template>
          </DisplayDialog>
        </PageRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { SemanticTheme } from "~/types/components";

definePageMeta({ layout: false });

useHead({
  title: "UI Dialogs",
  meta: [{ name: "description", content: "Examples of Dialogs" }],
  bodyAttrs: { class: "displayDialog-page" },
});

const isDev = import.meta.dev;

const variants = ["dialog", "modal", "confirm", "alert", "fullscreen"] as const;
type DialogVariant = (typeof variants)[number];

const themes = [undefined, "info", "success", "warning", "error"] as const;

const qaVariant = ref<DialogVariant>("confirm");
const qaTheme = ref<SemanticTheme | undefined>(undefined);

const dialogTitle = computed(() => {
  if (qaTheme.value === "error") return "Delete account?";
  if (qaTheme.value === "warning") return "Confirm action";
  if (qaVariant.value === "dialog") return "Dialog with scrollable content";
  if (qaVariant.value === "confirm") return "Confirm logout?";
  if (qaVariant.value === "alert") return "Alert — action required";
  if (qaVariant.value === "fullscreen") return "Fullscreen dialog";
  return "Dialog";
});

const dialogBody = computed(() => {
  if (qaTheme.value === "error")
    return "This action is permanent and cannot be undone. All your data will be removed.";
  if (qaVariant.value === "alert")
    return "Cannot be dismissed by clicking outside or pressing Escape — an explicit action is required.";
  if (qaVariant.value === "fullscreen")
    return "This dialog fills the entire viewport. Useful for immersive flows such as onboarding, image editors, or multi-step wizards.";
  if (qaVariant.value === "dialog")
    return "Lorem ipsum odor amet, consectetuer adipiscing elit. Scelerisque tincidunt vestibulum litora torquent aliquam a. Sem litora tellus mattis nisi vehicula sodales arcu egestas.";
  return "Are you sure you want to continue? This will apply the selected action.";
});

const confirmLabel = computed(() => {
  if (qaTheme.value === "error") return "Delete account";
  if (qaVariant.value === "confirm") return "Log out";
  return "Confirm";
});

const { dialogsConfig, openDialog, closeDialog } = useDialogControls({
  demo: {
    onConfirm: () => {},
    onCancel: () => {},
  },
});

const nestedHasChanges = ref(false);

const { dialogsConfig: nestedDialogsConfig, openDialog: openNestedDialog, closeDialog: closeNestedDialog } = useDialogControls({
  editProfile: { onConfirm: () => {}, onCancel: () => {} },
  confirmDiscard: {
    onConfirm: () => { nestedDialogsConfig.editProfile = false; },
    onCancel: () => {},
  },
});

const handleNestedCancel = () => {
  if (nestedHasChanges.value) {
    openNestedDialog("confirmDiscard");
  } else {
    closeNestedDialog("editProfile", "cancel");
  }
};
</script>

<style lang="css">
.displayDialog-page {
  .qa-panel {
    background: oklch(15% 0 0);
    color: white;
    font-size: 1.3rem;
    margin-block: 1.2rem;
  }

  .qa-panel__details {
    padding: 1rem 2rem;
  }

  .qa-panel__summary {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1.6rem;
    list-style: none;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  .qa-panel__title {
    font-weight: 600;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .qa-panel__status {
    font-family: monospace;
    font-size: 1.2rem;
    background: oklch(0% 0 0 / 0.3);
    padding: 0.2rem 0.8rem;
    border-radius: 0.4rem;
    user-select: text;
    cursor: text;
  }

  .qa-panel__body {
    display: flex;
    flex-wrap: wrap;
    gap: 2.4rem;
    padding-block: 1.2rem 0.4rem;
  }

  .qa-panel__group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .qa-panel__label {
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.55;
  }

  .qa-panel__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .nested-demo-content {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }

  .nested-demo-label {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    cursor: pointer;
    font-size: 1.4rem;
  }

  .qa-panel__chip {
    font-family: monospace;
    font-size: 1.2rem;
    color: white;
    background: oklch(0% 0 0 / 0.25);
    border: 1px solid oklch(100% 0 0 / 0.18);
    padding: 0.3rem 1rem;
    border-radius: 0.4rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: oklch(0% 0 0 / 0.4);
    }

    &.is-active {
      background: oklch(55% 0.18 240);
      border-color: oklch(55% 0.18 240);
    }
  }
}
</style>
