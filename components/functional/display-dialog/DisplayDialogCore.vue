<template>
  <dialog class="display-dialog-core" :class="[variant, elementClasses]" :align-dialog :open ref="dialogRef">
    <focus-trap v-model:active="open" :clickOutsideDeactivates="true" @deactivate="closeDialog()">
      <div class="inner">
        <div class="header">
          <div v-if="hasDialogTitle" class="col-left">
            <slot name="dialogTitle"></slot>
          </div>

          <div class="col-center">
            <p class="text-normal wght-700">Center col</p>
          </div>
          <div class="col-right">
            <button @click.prevent="closeDialog()" data-test-id="display-dialog-header-close" class="display-prompt-action">
              <Icon name="bitcoin-icons:cross-filled" class="icon" />
              <span class="sr-only">Really Close</span>
            </button>
          </div>
        </div>
        <div v-if="hasDialogContent" class="dialog-content" :class="[{ 'allow-content-scroll': allowContentScroll }]">
          <slot name="dialogContent"></slot>
        </div>
        <div v-if="hasActionButtons" class="footer">
          <slot name="actionButtons"></slot>
        </div>
      </div>
    </focus-trap>
  </dialog>
</template>

<script setup lang="ts">
import { FocusTrap } from 'focus-trap-vue';
const props = defineProps({
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  variant: {
    type: String,
    default: 'dialog',
    validator: (val) => ['dialog', 'modal', 'confirm'].includes(val as string),
  },
  positionX: {
    type: String,
    default: 'center',
    validator: (val) => ['left', 'center', 'right'].includes(val as string),
  },
  positionY: {
    type: String,
    default: 'center',
    validator: (val) => ['top', 'center', 'bottom'].includes(val as string),
  },
  lockViewport: {
    type: Boolean,
    default: true,
  },
  allowContentScroll: {
    type: Boolean,
    default: false,
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const open = defineModel<boolean>();
const bodyTag = ref<HTMLBodyElement | null>(null);
const lockViewport = toRef<boolean>(props.lockViewport);

const closeDialog = () => {
  open.value = false;

  if (lockViewport.value && bodyTag.value !== null) {
    bodyTag.value.classList.remove('lock');
  }
};

const slots = useSlots();
const hasDialogTitle = computed(() => slots.dialogTitle !== undefined);
const hasDialogContent = computed(() => slots.dialogContent !== undefined);
const hasActionButtons = computed(() => slots.actionButtons !== undefined);

const alignDialog = computed(() => `${props.positionY}-${props.positionX}`);

onMounted(() => {
  bodyTag.value = document.querySelector('body');
  if (lockViewport.value && bodyTag.value !== null) {
    bodyTag.value.classList.add('lock');
  }
});
</script>

<style lang="css">
.display-dialog-core {
  --_dialog-inner-height: initial;
  --_dialog-inner-width: 100vw;

  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 13;
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

  &[align-dialog$='center'] {
    justify-content: center;
  }
  &[align-dialog^='center'] {
    align-items: center;
  }

  &.confirm {
    --_dialog-inner-width: initial;
  }

  &.dialog {
    --_dialog-inner-height: 70dvh;
    --_dialog-inner-width: min(75%, 720px);
  }

  &.form {
    --_dialog-inner-width: initial;
  }

  &.fullscreen {
    --_dialog-inner-width: initial;
  }

  &.modal {
    --_dialog-inner-width: initial;
  }

  .inner {
    display: grid;
    grid-template-rows: auto 1fr auto;

    border-radius: var(--dialog-border-radius);
    border: var(--dialog-border);
    outline: var(--dialog-outline);

    background-color: var(--dialog-inner-background);
    height: var(--_dialog-inner-height);
    width: var(--_dialog-inner-width);

    overflow: hidden;

    .header {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;

      padding: var(--dialog-header-padding);

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
      padding: var(--dialog-content-padding);

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
      padding: var(--dialog-footer-padding);
    }
  }
}
</style>
