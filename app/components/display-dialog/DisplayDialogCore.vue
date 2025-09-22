<template>
  <dialog
    class="display-dialog-core"
    :class="[elementClasses]"
    role="dialog"
    :align-dialog
    :justify-dialog
    :open
    :data-dialog-id="dataDialogId"
    ref="dialogRef"
  >
    <focus-trap v-model:active="open" :clickOutsideDeactivates="true" @deactivate="closeDialog()">
      <div class="inner" :class="[variant]">
        <div class="header">
          <div v-if="slots.dialogTitle" class="col-left">
            <slot name="dialogTitle"></slot>
          </div>

          <div class="col-center">
            <p class="text-normal wght-700">Center col</p>
          </div>
          <div class="col-right">
            <button
              @click.prevent="closeDialog()"
              data-test-id="display-dialog-header-close"
              class="display-prompt-action"
            >
              <Icon name="bitcoin-icons:cross-filled" class="icon" />
              <span class="sr-only">Really Close</span>
            </button>
          </div>
        </div>
        <div
          v-if="slots.dialogContent"
          class="dialog-content"
          :class="[{ 'allow-content-scroll': allowContentScroll }]"
        >
          <slot name="dialogContent"></slot>
        </div>
        <div v-if="slots.actionButtons" class="footer">
          <slot name="actionButtons"></slot>
        </div>
      </div>
    </focus-trap>
  </dialog>
</template>

<script setup lang="ts">
import { FocusTrap } from "focus-trap-vue"
const props = defineProps({
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  variant: {
    type: String,
    default: "dialog",
    validator: (val) => ["dialog", "modal", "confirm"].includes(val as string),
  },
  justifyDialog: {
    type: String,
    default: "center",
    validator: (val) => ["start", "center", "end"].includes(val as string),
  },
  alignDialog: {
    type: String,
    default: "center",
    validator: (val) => ["start", "center", "end"].includes(val as string),
  },
  lockViewport: {
    type: Boolean,
    default: true,
  },
  allowContentScroll: {
    type: Boolean,
    default: false,
  },
  dataDialogId: {
    type: String,
    required: true,
  },
})

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const open = defineModel<boolean>()
const bodyTag = ref<HTMLBodyElement | null>(null)
const lockViewport = toRef<boolean>(props.lockViewport)

const closeDialog = () => {
  open.value = false

  if (lockViewport.value && bodyTag.value !== null) {
    bodyTag.value.classList.remove("lock")
  }
}

const slots = useSlots()

onMounted(() => {
  bodyTag.value = document.querySelector("body")
  if (lockViewport.value && bodyTag.value !== null) {
    bodyTag.value.classList.add("lock")
  }
})
</script>

<style lang="css">
.display-dialog-core {
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999999;
  opacity: 0;
  border: none;
  padding: 0;

  display: none;
  transition: opacity 200ms, display 200ms, overlay 200ms;
  transition-behavior: allow-discrete;

  &[open] {
    display: flex;
    opacity: 1;

    @starting-style {
      display: flex;
      opacity: 0;
    }
  }

  /* * Positioning the dialog */
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

    border-radius: 8px;
    border: 1px solid light-dark(var(--gray-10), var(--gray-2));
    outline: 1px solid light-dark(var(--gray-12), var(--gray-0));

    background-color: var(--dialog-inner-background);
    height: initial;
    width: 100vw;
    overflow: hidden;

    &.confirm {
      width: initial;
    }

    &.dialog {
      height: 70dvh;
      width: min(75%, 720px);
    }

    &.form {
      width: initial;
    }

    &.fullscreen {
      width: initial;
    }

    &.modal {
      width: initial;
    }

    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;

      padding: 12px;

      .col-left {
        /* grid-column: 1; */
        /* display: none; */
      }

      .col-center {
        /* grid-column: 2; */
        text-align: center;

        color: var(--color-red-1);
        display: none;
      }

      .col-right {
        grid-column: 3;

        .display-prompt-action {
          background-color: transparent;
          display: block flex;
          align-items: center;
          justify-content: center;
          margin: var(--dialog-header-button-margin);
          padding: var(--dialog-header-button-padding);
          border: var(--dialog-header-button-border);
          border-radius: var(--dialog-header-button-border-radius);
          outline: var(--dialog-header-button-outline);

          transition: border-color 0.2s, outline-color 0.2s;

          &:hover,
          &:focus-visible {
            cursor: pointer;
            border: var(--dialog-header-button-border-hover);
            outline: var(--dialog-header-button-outline-hover);
          }

          .icon {
            color: var(--dialog-header-button-icon-color);
            display: block;
            font-size: var(--dialog-header-button-icon-font-size);
            border: 1px solid green;
            padding: 1rem;
          }
        }
      }
    }

    .dialog-content {
      overflow: hidden;
      padding: 12px;

      &.allow-content-scroll {
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    .footer {
      display: flex;
      gap: 1.2rem;
      justify-content: flex-end;
      padding: 12px;
    }
  }
}
</style>
