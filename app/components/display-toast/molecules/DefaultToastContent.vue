<template>
  <div class="display-toast-inner">
    <div class="toast-icon" aria-hidden="true">
      <slot name="customToastIcon">
        <Icon :name="customIcon || defaultThemeIcons[theme] || 'akar-icons:info'" class="icon" />
      </slot>
    </div>
    <div :id="'toast-message-' + toastId" class="toast-message">
      <template v-if="slots.title || slots.description || toastTitle || toastDescription">
        <p v-if="slots.title || toastTitle" class="title" data-test-id="toast-title">
          <slot name="title">{{ toastTitle }}</slot>
        </p>
        <p v-if="slots.description || toastDescription" class="description" data-test-id="toast-description">
          <slot name="description">{{ toastDescription }}</slot>
        </p>
      </template>
      <template v-else>
        {{ toastDisplayText }}
      </template>
    </div>

    <div v-if="!autoDismiss" class="toast-action">
      <button @click.prevent="setDismissToast()">
        <Icon name="material-symbols:close" class="icon" />
        <span class="sr-only">Close</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DisplayToastTheme } from "../../../types/components";

interface Props {
  theme: DisplayToastTheme;
  customIcon?: string;
  toastId: string;
  toastDisplayText: string;
  toastTitle?: string;
  toastDescription?: string;
  autoDismiss: boolean;
  setDismissToast: () => void;
}

defineProps<Props>();

const defaultThemeIcons = {
  primary: "akar-icons:info",
  secondary: "akar-icons:info",
  tertiary: "akar-icons:info",
  ghost: "akar-icons:info",
  error: "akar-icons:circle-alert",
  info: "akar-icons:info",
  success: "akar-icons:info",
  warning: "akar-icons:circle-alert",
};

const slots = useSlots();
</script>

<style lang="css">
.display-toast-inner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  background-color: oklch(from var(--colour-theme-6) calc(l + 0.2) c h);
  border-start-start-radius: 8px;
  border-end-start-radius: 8px;
  padding: 12px 14px;
  overflow: hidden;

  .toast-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;

    .icon {
      color: var(--colour-theme-0);
      display: inline-block;
      font-size: 2.5rem;
      font-style: normal;
      font-weight: normal;
      overflow: hidden;
    }
  }

  .toast-message {
    display: flex;
    align-items: center;
    gap: var(--step-1);
    font-size: var(--step-4);
    font-weight: normal;
    line-height: 1.3;
    color: var(--colour-theme-0);
    margin: 0;
    padding: 0;

    .title {
      margin: 0;
      font-weight: 600;
      font-size: var(--step-4);
      line-height: 1.2;
    }

    .description {
      margin: 0;
      font-size: var(--step-3);
      line-height: 1.4;
      opacity: 0.9;
    }

    /* When using slots, change flex direction to column */
    &:has(.title, .text) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .toast-action {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--colour-theme-10);
      border: 0.1rem solid var(--colour-theme-8);
      outline: 0.1rem solid transparent;
      border-radius: 50%;
      box-shadow: none;
      color: var(--colour-theme-1);
      cursor: pointer;
      font-size: var(--step-4);
      font-weight: bold;
      padding: 0.5rem;
      text-decoration: underline;

      transition: all 0.3s ease;

      .icon {
        font-size: 1.5rem;
        vertical-align: middle;
      }

      &:hover,
      &:focus-visible {
        box-shadow: none;
        background-color: var(--colour-theme-8);
        color: var(--colour-theme-0);
        outline: 0.1rem solid var(--colour-theme-3);
        outline-offset: 0.2rem;
      }
    }
  }
}
</style>
