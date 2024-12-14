<template>
  <dialog class="display-dialog wrapper" :class="[elementClasses]" :align-dialog :open ref="dialogRef">
    <focus-trap v-model:active="open" :clickOutsideDeactivates="true" @deactivate="closeDialog()">
      <div class="inner">
        <div class="top-bar">
          <template v-if="hasDialogTitle">
            <div class="col-left">
              <slot name="dialogTitle"></slot>
            </div>
          </template>

          <div class="col-center">
            <p class="text-normal wght-700">Center col</p>
          </div>
          <div class="col-right">
            <button @click.prevent="closeDialog()">x</button>
          </div>
        </div>
        <slot v-if="hasDialogContent" name="dialogContent"></slot>
        <template v-if="hasActionButtons">
          <div class="button-row">
            <slot name="actionButtons"></slot>
          </div>
        </template>
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
    validator: (val) => ['dialog', 'modal'].includes(val as string),
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
.display-dialog {
  display: flex;

  &[align-dialog$='center'] {
    justify-content: center;
  }
  &[align-dialog^='center'] {
    align-items: center;
  }

  &.wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--color-grey-1);
    z-index: 13;
    opacity: 0;

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
  }

  .inner {
    background-color: var(--page-bg);
    width: 100vw;
    margin: 12px;
    padding: 12px;

    @media only screen and (min-width: 768px) {
      width: 720px;
    }

    /* @media only screen and (min-width: 1024px) {
       height: 100dvh;
       width: 100vw;
     } */
  }

  .top-bar {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;

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
    }
  }

  /* .button-row {
     display: flex;
     gap: 12px;
     justify-content: flex-end;
   } */
}
</style>
