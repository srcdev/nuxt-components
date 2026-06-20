<template>
  <dialog
    class="display-dialog"
    :class="[elementClasses]"
    :role="isAlert ? 'alertdialog' : undefined"
    :aria-modal="true"
    :aria-labelledby="hasTitle ? dialogTitleId : undefined"
    :align-dialog="resolved.alignDialog"
    :justify-dialog="resolved.justifyDialog"
    :open
    :data-dialog-id="dataDialogId"
  >
    <focus-trap
      v-model:active="open"
      :escape-deactivates="!isAlert"
      :click-outside-deactivates="!isAlert"
      @deactivate="closeDialog()"
    >
      <div class="inner" :class="[resolved.variant]">
        <div class="header" :data-theme="resolved.theme">
          <div v-if="hasTitle" :id="dialogTitleId" class="col-left">
            <slot name="dialogTitle"></slot>
          </div>

          <div class="col-right">
            <button
              data-test-id="display-dialog-header-close"
              class="display-dialog-close"
              @click.prevent="closeDialog()"
            >
              <Icon :name="resolved.closeIcon" class="icon" />
              <span class="sr-only">Close</span>
            </button>
          </div>
        </div>
        <div
          v-if="hasContent"
          class="dialog-content"
          :class="[{ 'allow-content-scroll': resolved.allowContentScroll }]"
          :tabindex="resolved.allowContentScroll ? 0 : undefined"
        >
          <slot name="dialogContent"></slot>
        </div>
        <div v-if="hasFooter" class="footer">
          <slot name="actionButtonLeft"></slot>
          <slot name="actionButtonRight"></slot>
        </div>
      </div>
    </focus-trap>
  </dialog>
</template>

<script setup lang="ts">
import { FocusTrap } from "focus-trap-vue";
import type { SemanticTheme } from "~/types/components";

interface Props {
  styleClassPassthrough?: string | string[];
  variant?: "dialog" | "modal" | "confirm" | "alert" | "fullscreen";
  justifyDialog?: "start" | "center" | "end";
  alignDialog?: "start" | "center" | "end";
  lockViewport?: boolean;
  allowContentScroll?: boolean;
  dataDialogId: string;
  theme?: SemanticTheme;
  closeIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  styleClassPassthrough: () => [],
  variant: undefined,
  justifyDialog: undefined,
  alignDialog: undefined,
  lockViewport: undefined,
  allowContentScroll: undefined,
  theme: undefined,
  closeIcon: undefined,
});

const appConfig = useAppConfig();

const resolved = computed(() => {
  const config = appConfig.srcdev?.displayDialog;
  return {
    variant: props.variant ?? config?.variant ?? "dialog",
    justifyDialog: props.justifyDialog ?? config?.justifyDialog ?? "center",
    alignDialog: props.alignDialog ?? config?.alignDialog ?? "center",
    lockViewport: props.lockViewport ?? config?.lockViewport ?? true,
    allowContentScroll: props.allowContentScroll ?? config?.allowContentScroll ?? false,
    theme: props.theme ?? config?.theme,
    closeIcon: props.closeIcon ?? config?.closeIcon ?? "bitcoin-icons:cross-filled",
  } as const;
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const isAlert = computed(() => resolved.value.variant === "alert");
const dialogTitleId = useId();

const open = defineModel<boolean>();

const closeDialog = () => {
  open.value = false;
};

const slots = useSlots();
const hasTitle = computed(() => !!slots.dialogTitle);
const hasContent = computed(() => !!slots.dialogContent);
const hasFooter = computed(() => !!(slots.actionButtonLeft || slots.actionButtonRight));

const { lock, unlock } = useBodyLock();
let hasLocked = false;

onMounted(() => {
  if (resolved.value.lockViewport) {
    lock();
    hasLocked = true;
  }
});

onUnmounted(() => {
  if (hasLocked) {
    unlock();
    hasLocked = false;
  }
});
</script>

<style lang="css">
@layer components {
  .display-dialog {
    --_backdrop-blur: var(--display-dialog-backdrop-blur, blur(0.5rem));
    --_backdrop-background: var(--display-dialog-backdrop-background, rgba(0, 0, 0, 0.5));
    --_z-index: var(--display-dialog-z-index, 999999);
    --_transition-duration: var(--display-dialog-transition-duration, 200ms);

    --_inner-border-radius: var(--display-dialog-inner-border-radius, 0.8rem);
    --_inner-border: var(--display-dialog-inner-border, 0.1rem solid light-dark(var(--slate-10), var(--slate-02)));
    --_inner-outline: var(--display-dialog-inner-outline, 0.1rem solid light-dark(var(--slate-10), var(--slate-00)));
    --_inner-background: var(--display-dialog-inner-background, light-dark(var(--slate-00), var(--slate-10)));

    --_header-padding: var(--display-dialog-header-padding, 1.2rem);
    --_header-button-margin: var(--display-dialog-header-button-margin, 0);
    --_header-button-padding: var(--display-dialog-header-button-padding, 0.4rem);
    --_header-button-border: var(--display-dialog-header-button-border, 0.1rem solid transparent);
    --_header-button-border-radius: var(--display-dialog-header-button-border-radius, 0.4rem);
    --_header-button-outline: var(--display-dialog-header-button-outline, 0.1rem solid transparent);
    --_header-button-border-hover: var(
      --display-dialog-header-button-border-hover,
      0.1rem solid light-dark(var(--slate-08), var(--slate-04))
    );
    --_header-button-outline-hover: var(
      --display-dialog-header-button-outline-hover,
      0.1rem solid light-dark(var(--slate-08), var(--slate-04))
    );
    --_header-button-icon-color: var(
      --display-dialog-header-button-icon-color,
      light-dark(var(--slate-09), var(--slate-02))
    );
    --_header-button-icon-size: var(--display-dialog-header-button-icon-size, 2.4rem);

    --_content-padding: var(--display-dialog-content-padding, 1.2rem);
    --_footer-gap: var(--display-dialog-footer-gap, 1.2rem);
    --_footer-padding: var(--display-dialog-footer-padding, 1.2rem);

    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: var(--_backdrop-blur);
    background-color: var(--_backdrop-background);
    z-index: var(--_z-index);
    opacity: 0;
    border: none;
    padding: 0;

    display: none;
    transition:
      opacity var(--_transition-duration),
      display var(--_transition-duration),
      overlay var(--_transition-duration);
    transition-behavior: allow-discrete;

    &[open] {
      display: flex;
      opacity: 1;

      @starting-style {
        display: flex;
        opacity: 0;
      }
    }

    &[justify-dialog="start"] {
      justify-content: flex-start;
    }

    &[justify-dialog="center"] {
      justify-content: center;
    }

    &[justify-dialog="end"] {
      justify-content: flex-end;
    }

    &[align-dialog="start"] {
      align-items: flex-start;
    }

    &[align-dialog="center"] {
      align-items: center;
    }

    &[align-dialog="end"] {
      align-items: flex-end;
    }

    .inner {
      display: grid;
      grid-template-rows: auto 1fr auto;
      border-radius: var(--_inner-border-radius);
      border: var(--_inner-border);
      outline: var(--_inner-outline);
      background-color: var(--_inner-background);
      height: initial;
      width: 100vw;
      overflow: hidden;

      &.alert {
        width: min(90%, 48rem);
      }

      &.confirm {
        width: initial;
      }

      &.dialog {
        height: 70dvh;
        width: min(75%, 72rem);
      }

      &.fullscreen {
        --_inner-border-radius: 0;
        --_inner-border: none;
        --_inner-outline: none;
        width: 100%;
        height: 100%;
      }

      &.modal {
        width: initial;
      }

      .header {
        display: flex;
        align-items: center;
        padding: var(--_header-padding);

        &[data-theme] {
          border-block-end: 0.2rem solid var(--theme-accent);

          .display-dialog-close .icon {
            color: var(--theme-accent);
          }
        }

        .col-left {
          flex: 1;
        }

        .col-right {
          margin-inline-start: auto;

          .display-dialog-close {
            background-color: transparent;
            display: block flex;
            align-items: center;
            justify-content: center;
            margin: var(--_header-button-margin);
            padding: var(--_header-button-padding);
            border: var(--_header-button-border);
            border-radius: var(--_header-button-border-radius);
            outline: var(--_header-button-outline);

            transition:
              border-color var(--_transition-duration),
              outline-color var(--_transition-duration);

            &:hover,
            &:focus-visible {
              cursor: pointer;
              border: var(--_header-button-border-hover);
              outline: var(--_header-button-outline-hover);
            }

            .icon {
              color: var(--_header-button-icon-color);
              display: block;
              font-size: var(--_header-button-icon-size);
            }
          }
        }
      }

      .dialog-content {
        overflow: hidden;
        padding: var(--_content-padding);

        &.allow-content-scroll {
          overflow-y: auto;
          &::-webkit-scrollbar {
            display: none;
          }
        }
      }

      .footer {
        display: flex;
        gap: var(--_footer-gap);
        justify-content: flex-end;
        padding: var(--_footer-padding);
      }
    }
  }
}
</style>
