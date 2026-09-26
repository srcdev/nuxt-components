<template>
  <div
    :id
    class="input-error-message"
    data-theme="error"
    :class="elementClasses"
    :data-testid
    :data-input-variant="inputVariant"
    :data-visible="showError ? '' : undefined"
    :data-detached="isDetached ? '' : undefined"
    :aria-hidden="showError ? undefined : 'true'"
  >
    <div class="input-error-message-inner">
      <div class="input-error-message-content">
        <div class="input-error-message-icon-wrapper">
          <Icon :name="icon" class="input-error-message-icon" aria-hidden="true" />
        </div>
        <div class="input-error-message-text">
          <ul v-if="isArray" class="input-error-message-list">
            <li v-for="(message, index) in errorMessage" :key="index" class="input-error-message-list-item">
              {{ message }}
            </li>
          </ul>
          <span v-else class="input-error-message-single">
            {{ errorMessage }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  errorMessage: string | string[] | object;
  showError: boolean;
  id: string;
  styleClassPassthrough?: string | string[];
  isDetached: boolean;
  inputVariant?: InputUiVariant;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "inputError",
  styleClassPassthrough: () => [],
  inputVariant: "normal",
  icon: "radix-icons:circle-backslash",
});

const isArray = computed(() => Array.isArray(props.errorMessage));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .input-error-message {
    --_text-color: var(--input-error-text-color, var(--input-error-color));
    --_border-radius: var(--input-error-border-radius, var(--form-input-border-radius));
    --_padding-inline: var(--input-error-padding-inline, 1.2rem);
    --_padding-block-start: 1rem;
    --_transition-duration: var(--input-error-transition-duration, var(--theme-form-transition-duration));

    grid-row: 2;
    grid-column: 1;
    display: grid;
    grid-template-rows: 0fr;

    color: var(--_text-color);
    background-color: var(--input-error-background-color, var(--theme-error-surface));
    opacity: 0;

    transition:
      grid-template-rows var(--_transition-duration) linear,
      opacity var(--_transition-duration) linear,
      margin-block-start var(--_transition-duration) linear;

    transition-behavior: allow-discrete;

    border-radius: 0;
    border: var(--form-element-border-width) solid transparent;
    outline: var(--form-element-outline-width) solid transparent;

    background-clip: padding-box;

    translate: 0 calc(-1 * (var(--form-element-border-width) + var(--form-input-border-radius)));

    margin-block-start: var(--input-error-margin-block-start);

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    &[data-input-variant="normal"] {
      --_padding-block-start: 1.2rem;
    }

    &[data-detached] {
      margin-block-start: 0rem;
      border-radius: var(--_border-radius);

      &[data-input-variant="underlined"] {
        border-radius: 0;
      }
    }

    &[data-visible] {
      grid-template-rows: 1fr;
      opacity: 1;

      border: var(--form-element-border-width) solid var(--input-error-border-color, var(--theme-error-border));
      outline: var(--form-element-outline-width) solid var(--input-error-outline-color, var(--theme-error-outline));

      &:not([data-input-variant="underlined"]) {
        border-bottom-left-radius: var(--_border-radius);
        border-bottom-right-radius: var(--_border-radius);
      }

      &[data-detached] {
        margin-block-start: var(--input-error-detached-offset, 2rem);
      }
    }

    &:not([data-detached]) {
      &[data-input-variant="normal"] .input-error-message-inner {
        padding-block-start: var(--form-input-border-radius);
      }

      &[data-input-variant="underlined"] {
        outline-color: transparent;
      }
    }
  }

  .input-error-message-inner {
    align-items: center;
    overflow: hidden;
  }

  .input-error-message-content {
    display: flex;
    align-items: center;
  }

  .input-error-message-icon-wrapper {
    display: inline-block;
    padding-inline-start: var(--_padding-inline);
  }

  .input-error-message-icon {
    color: var(--input-error-icon-color, var(--_text-color));
    font-size: var(--input-error-icon-size, 1em);
    transform: translateY(3px);
  }

  .input-error-message-text {
    display: inline-block;
    flex-grow: 1;
    font-family: var(--input-error-font-family, var(--font-family));
    font-size: var(--input-error-font-size, 1.6rem);
    font-weight: var(--input-error-font-weight, 500);
    padding-block: var(--input-error-padding-block-start, var(--_padding-block-start))
      var(--input-error-padding-block-end, 1rem);
    padding-inline: var(--_padding-inline);
  }

  .input-error-message-list {
    list-style-type: none;
    padding-inline-start: 0;
    margin-block: 0;
  }

  .input-error-message-list-item + .input-error-message-list-item {
    margin-block-start: var(--input-error-list-gap, 0.6rem);
  }
}
</style>
